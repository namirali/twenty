import { InjectDataSource } from '@nestjs/typeorm';

import { Command } from 'nest-commander';
import { TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER } from 'twenty-shared/application';
import { type ConditionalDisplay } from 'twenty-shared/types';
import { fastDeepEqual, isDefined, isNonEmptyArray } from 'twenty-shared/utils';
import { DataSource } from 'typeorm';

import { ProvisionedWorkspaceCommandRunner } from 'src/database/commands/command-runners/provisioned-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { ENGINE_GATE_ORIGINALS_KEY_VALUE_PAIR_KEY } from 'src/database/commands/upgrade-version-command/2-52/constants/engine-gate-originals-key-value-pair-key.constant';
import { type EngineGateOriginal } from 'src/database/commands/upgrade-version-command/2-52/types/engine-gate-original.type';
import { type LegacyEngineGateExpressions } from 'src/database/commands/upgrade-version-command/2-52/types/legacy-engine-gate-expressions.type';
import { buildEngineGateOriginal } from 'src/database/commands/upgrade-version-command/2-52/utils/build-engine-gate-original.util';
import { fetchLegacyEngineGateExpressions } from 'src/database/commands/upgrade-version-command/2-52/utils/fetch-legacy-engine-gate-expressions.util';
import { migrateEngineGatesToConditionalDisplayTrees } from 'src/database/commands/upgrade-version-command/2-52/utils/migrate-engine-gates-to-conditional-display-trees.util';
import { restoreEngineGatesFromOriginals } from 'src/database/commands/upgrade-version-command/2-52/utils/restore-engine-gates-from-originals.util';
import { ApplicationService } from 'src/engine/core-modules/application/application.service';
import { RegisteredWorkspaceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-workspace-command.decorator';
import { type FlatCommandMenuItem } from 'src/engine/metadata-modules/flat-command-menu-item/types/flat-command-menu-item.type';
import { fromCommandMenuItemOverridesToUniversalOverrides } from 'src/engine/metadata-modules/flat-command-menu-item/utils/from-command-menu-item-overrides-to-universal-overrides.util';
import { fromConditionalDisplayToUniversalConditionalDisplay } from 'src/engine/metadata-modules/flat-conditional-display/utils/from-conditional-display-to-universal-conditional-display.util';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type FlatPageLayoutWidget } from 'src/engine/metadata-modules/flat-page-layout-widget/types/flat-page-layout-widget.type';
import { fromPageLayoutWidgetOverridesToUniversalOverrides } from 'src/engine/metadata-modules/flat-page-layout-widget/utils/from-page-layout-widget-overrides-to-universal-overrides.util';
import { type OverrideAuthorContext } from 'src/engine/metadata-modules/overrides/types/override-author-context.type';
import { WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';
import { WorkspaceMigrationBuilderException } from 'src/engine/workspace-manager/workspace-migration/exceptions/workspace-migration-builder-exception';
import { WorkspaceMigrationValidateBuildAndRunService } from 'src/engine/workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service';

type EngineGateMigrationCounts = {
  commandsWithAvailability: number;
  commandsWithPinned: number;
  widgetsWithAvailability: number;
  widgetsConvertedFromJsonLogic: number;
  overrideEntriesConverted: number;
  overrideEntriesWithUnconvertibleExpression: number;
};

type UniversalIdentifierMaps = {
  fieldMetadataUniversalIdentifierById: Partial<Record<string, string>>;
  roleUniversalIdentifierById: Partial<Record<string, string>>;
  objectMetadataUniversalIdentifierById: Partial<Record<string, string>>;
  pageLayoutUniversalIdentifierById: Partial<Record<string, string>>;
  pageLayoutTabUniversalIdentifierById: Partial<Record<string, string>>;
};

const NO_LEGACY_ENGINE_GATE_EXPRESSIONS: LegacyEngineGateExpressions = {
  conditionalAvailabilityExpression: null,
  conditionalPinnedExpression: null,
};

@RegisteredWorkspaceCommand('2.52.0', 1793025082369)
@Command({
  name: 'upgrade:2-52:migrate-engine-gates-to-conditional-display-trees',
  description:
    'Compile the engine gate expressions and legacy json-logic of command menu items and page layout widgets into conditional display trees, where a non-zero dry run count of unconvertible override entries means those workspaces need a hand review before the real run',
})
export class MigrateEngineGatesToConditionalDisplayTreesCommand extends ProvisionedWorkspaceCommandRunner {
  constructor(
    protected readonly workspaceIteratorService: WorkspaceIteratorService,
    private readonly applicationService: ApplicationService,
    private readonly workspaceCacheService: WorkspaceCacheService,
    private readonly workspaceMigrationValidateBuildAndRunService: WorkspaceMigrationValidateBuildAndRunService,
    @InjectDataSource()
    private readonly coreDataSource: DataSource,
  ) {
    super(workspaceIteratorService);
  }

  override async runOnWorkspace(args: RunOnWorkspaceArgs): Promise<void> {
    await this.up(args);
  }

  async up({ workspaceId, options }: RunOnWorkspaceArgs): Promise<void> {
    const {
      flatCommandMenuItemMaps,
      flatPageLayoutWidgetMaps,
      flatFieldMetadataMaps,
      flatObjectMetadataMaps,
      flatPageLayoutMaps,
      flatPageLayoutTabMaps,
      flatRoleMaps,
    } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
      'flatCommandMenuItemMaps',
      'flatPageLayoutWidgetMaps',
      'flatFieldMetadataMaps',
      'flatObjectMetadataMaps',
      'flatPageLayoutMaps',
      'flatPageLayoutTabMaps',
      'flatRoleMaps',
    ]);

    const { workspaceCustomFlatApplication } =
      await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow(
        { workspaceId },
      );

    const { commandMenuItemExpressionsById, pageLayoutWidgetExpressionsById } =
      await fetchLegacyEngineGateExpressions({
        coreDataSource: this.coreDataSource,
        workspaceId,
      });

    const universalIdentifierMaps: UniversalIdentifierMaps = {
      fieldMetadataUniversalIdentifierById:
        flatFieldMetadataMaps.universalIdentifierById,
      roleUniversalIdentifierById: flatRoleMaps.universalIdentifierById,
      objectMetadataUniversalIdentifierById:
        flatObjectMetadataMaps.universalIdentifierById,
      pageLayoutUniversalIdentifierById:
        flatPageLayoutMaps.universalIdentifierById,
      pageLayoutTabUniversalIdentifierById:
        flatPageLayoutTabMaps.universalIdentifierById,
    };

    const flatFieldMetadatasByNameByObjectMetadataId =
      this.groupFlatFieldMetadatasByNameByObjectMetadataId(
        Object.values(flatFieldMetadataMaps.byUniversalIdentifier).filter(
          isDefined,
        ),
      );

    const resolveFieldOfObject =
      (objectMetadataId: string | null) => (fieldName: string) => {
        const flatFieldMetadata = isDefined(objectMetadataId)
          ? flatFieldMetadatasByNameByObjectMetadataId
              .get(objectMetadataId)
              ?.get(fieldName)
          : undefined;

        return isDefined(flatFieldMetadata)
          ? {
              fieldMetadataId: flatFieldMetadata.id,
              type: flatFieldMetadata.type,
            }
          : undefined;
      };

    const buildAuthorContext = (
      ownerApplicationUniversalIdentifier: string,
    ): OverrideAuthorContext => ({
      workspaceCustomApplicationUniversalIdentifier:
        workspaceCustomFlatApplication.universalIdentifier,
      ownerApplicationUniversalIdentifier,
    });

    const counts: EngineGateMigrationCounts = {
      commandsWithAvailability: 0,
      commandsWithPinned: 0,
      widgetsWithAvailability: 0,
      widgetsConvertedFromJsonLogic: 0,
      overrideEntriesConverted: 0,
      overrideEntriesWithUnconvertibleExpression: 0,
    };

    const now = new Date().toISOString();

    const engineGateOriginalsById: Record<string, EngineGateOriginal> = {};

    const commandMenuItemsToUpdate = Object.values(
      flatCommandMenuItemMaps.byUniversalIdentifier,
    )
      .filter(isDefined)
      .flatMap((flatCommandMenuItem): FlatCommandMenuItem[] => {
        const migratedEngineGates = this.migrateOrThrow({
          workspaceId,
          metadataName: 'commandMenuItem',
          universalIdentifier: flatCommandMenuItem.universalIdentifier,
          isDryRun: options.dryRun === true,
          migrate: () =>
            migrateEngineGatesToConditionalDisplayTrees({
              metadataName: 'commandMenuItem',
              legacyEngineGateExpressions:
                commandMenuItemExpressionsById.get(flatCommandMenuItem.id) ??
                NO_LEGACY_ENGINE_GATE_EXPRESSIONS,
              conditionalDisplay: flatCommandMenuItem.conditionalDisplay,
              overrides: flatCommandMenuItem.overrides,
              authorContext: buildAuthorContext(
                flatCommandMenuItem.applicationUniversalIdentifier,
              ),
              resolveField: resolveFieldOfObject(
                flatCommandMenuItem.availabilityObjectMetadataId,
              ),
            }),
        });

        counts.overrideEntriesWithUnconvertibleExpression +=
          migratedEngineGates.unconvertibleOverrideEntries.length;

        const isAvailabilityChanged = !fastDeepEqual(
          migratedEngineGates.conditionalAvailability,
          flatCommandMenuItem.conditionalAvailability,
        );
        const isPinnedChanged = !fastDeepEqual(
          migratedEngineGates.conditionalPinned,
          flatCommandMenuItem.conditionalPinned,
        );
        const isConditionalDisplayChanged = !fastDeepEqual(
          migratedEngineGates.conditionalDisplay,
          flatCommandMenuItem.conditionalDisplay,
        );
        const isOverridesChanged = !fastDeepEqual(
          migratedEngineGates.overrides,
          flatCommandMenuItem.overrides,
        );

        if (
          !isAvailabilityChanged &&
          !isPinnedChanged &&
          !isConditionalDisplayChanged &&
          !isOverridesChanged
        ) {
          return [];
        }

        if (
          isAvailabilityChanged &&
          isDefined(migratedEngineGates.conditionalAvailability)
        ) {
          counts.commandsWithAvailability += 1;
        }

        if (
          isPinnedChanged &&
          isDefined(migratedEngineGates.conditionalPinned)
        ) {
          counts.commandsWithPinned += 1;
        }

        counts.overrideEntriesConverted +=
          migratedEngineGates.convertedOverrideEntryCount;

        const engineGateOriginal = buildEngineGateOriginal({
          original: flatCommandMenuItem,
          migrated: migratedEngineGates,
        });

        if (isDefined(engineGateOriginal)) {
          engineGateOriginalsById[flatCommandMenuItem.id] = engineGateOriginal;
        }

        const conditionalDisplay =
          migratedEngineGates.conditionalDisplay as FlatCommandMenuItem['conditionalDisplay'];
        const overrides =
          migratedEngineGates.overrides as FlatCommandMenuItem['overrides'];

        return [
          {
            ...flatCommandMenuItem,
            conditionalAvailability:
              migratedEngineGates.conditionalAvailability,
            universalConditionalAvailability:
              this.toUniversalConditionalDisplay({
                conditionalDisplay: migratedEngineGates.conditionalAvailability,
                universalIdentifierMaps,
              }),
            conditionalPinned: migratedEngineGates.conditionalPinned,
            universalConditionalPinned: this.toUniversalConditionalDisplay({
              conditionalDisplay: migratedEngineGates.conditionalPinned,
              universalIdentifierMaps,
            }),
            conditionalDisplay,
            universalConditionalDisplay: isConditionalDisplayChanged
              ? this.toUniversalConditionalDisplay({
                  conditionalDisplay,
                  universalIdentifierMaps,
                })
              : flatCommandMenuItem.universalConditionalDisplay,
            overrides,
            universalOverrides: isOverridesChanged
              ? isDefined(overrides)
                ? fromCommandMenuItemOverridesToUniversalOverrides({
                    overrides,
                    ...universalIdentifierMaps,
                    shouldThrowOnMissingIdentifier: false,
                  })
                : null
              : flatCommandMenuItem.universalOverrides,
            updatedAt: now,
          },
        ];
      });

    const pageLayoutWidgetsToUpdate = Object.values(
      flatPageLayoutWidgetMaps.byUniversalIdentifier,
    )
      .filter(isDefined)
      .flatMap((flatPageLayoutWidget): FlatPageLayoutWidget[] => {
        const migratedEngineGates = this.migrateOrThrow({
          workspaceId,
          metadataName: 'pageLayoutWidget',
          universalIdentifier: flatPageLayoutWidget.universalIdentifier,
          isDryRun: options.dryRun === true,
          migrate: () =>
            migrateEngineGatesToConditionalDisplayTrees({
              metadataName: 'pageLayoutWidget',
              legacyEngineGateExpressions:
                pageLayoutWidgetExpressionsById.get(flatPageLayoutWidget.id) ??
                NO_LEGACY_ENGINE_GATE_EXPRESSIONS,
              conditionalDisplay: flatPageLayoutWidget.conditionalDisplay,
              overrides: flatPageLayoutWidget.overrides,
              authorContext: buildAuthorContext(
                flatPageLayoutWidget.applicationUniversalIdentifier,
              ),
              resolveField: resolveFieldOfObject(
                flatPageLayoutWidget.objectMetadataId,
              ),
            }),
        });

        counts.overrideEntriesWithUnconvertibleExpression +=
          migratedEngineGates.unconvertibleOverrideEntries.length;

        const isAvailabilityChanged = !fastDeepEqual(
          migratedEngineGates.conditionalAvailability,
          flatPageLayoutWidget.conditionalAvailability,
        );
        const isConditionalDisplayChanged = !fastDeepEqual(
          migratedEngineGates.conditionalDisplay,
          flatPageLayoutWidget.conditionalDisplay,
        );
        const isOverridesChanged = !fastDeepEqual(
          migratedEngineGates.overrides,
          flatPageLayoutWidget.overrides,
        );

        if (
          !isAvailabilityChanged &&
          !isConditionalDisplayChanged &&
          !isOverridesChanged
        ) {
          return [];
        }

        if (
          isAvailabilityChanged &&
          isDefined(migratedEngineGates.conditionalAvailability)
        ) {
          counts.widgetsWithAvailability += 1;
        }

        if (migratedEngineGates.isConditionalDisplayConvertedFromJsonLogic) {
          counts.widgetsConvertedFromJsonLogic += 1;
        }

        counts.overrideEntriesConverted +=
          migratedEngineGates.convertedOverrideEntryCount;

        const engineGateOriginal = buildEngineGateOriginal({
          original: flatPageLayoutWidget,
          migrated: migratedEngineGates,
        });

        if (isDefined(engineGateOriginal)) {
          engineGateOriginalsById[flatPageLayoutWidget.id] = engineGateOriginal;
        }

        const conditionalDisplay =
          migratedEngineGates.conditionalDisplay as FlatPageLayoutWidget['conditionalDisplay'];
        const overrides =
          migratedEngineGates.overrides as FlatPageLayoutWidget['overrides'];

        return [
          {
            ...flatPageLayoutWidget,
            conditionalAvailability:
              migratedEngineGates.conditionalAvailability,
            universalConditionalAvailability:
              this.toUniversalConditionalDisplay({
                conditionalDisplay: migratedEngineGates.conditionalAvailability,
                universalIdentifierMaps,
              }),
            conditionalDisplay,
            universalConditionalDisplay: isConditionalDisplayChanged
              ? this.toUniversalConditionalDisplay({
                  conditionalDisplay,
                  universalIdentifierMaps,
                })
              : flatPageLayoutWidget.universalConditionalDisplay,
            overrides,
            universalOverrides: isOverridesChanged
              ? isDefined(overrides)
                ? fromPageLayoutWidgetOverridesToUniversalOverrides({
                    overrides,
                    ...universalIdentifierMaps,
                    shouldThrowOnMissingIdentifier: false,
                  })
                : null
              : flatPageLayoutWidget.universalOverrides,
            updatedAt: now,
          },
        ];
      });

    this.logger.log(
      `${options.dryRun ? '[DRY RUN] ' : ''}Workspace ${workspaceId}: ${counts.commandsWithAvailability} command(s) with availability, ${counts.commandsWithPinned} command(s) with pinned, ${counts.widgetsWithAvailability} widget(s) with availability, ${counts.widgetsConvertedFromJsonLogic} widget(s) converted from json-logic, ${counts.overrideEntriesConverted} override entr(ies) converted, ${counts.overrideEntriesWithUnconvertibleExpression} override entr(ies) with an availability expression that cannot be converted, updating ${commandMenuItemsToUpdate.length} command menu item(s) and ${pageLayoutWidgetsToUpdate.length} page layout widget(s)`,
    );

    if (options.dryRun) {
      return;
    }

    if (Object.keys(engineGateOriginalsById).length > 0) {
      await this.coreDataSource.query(
        `INSERT INTO core."keyValuePair" ("key", "workspaceId", "type", "value") VALUES ($1, $2, 'CONFIG_VARIABLE', $3::jsonb)
         ON CONFLICT ("key", "workspaceId") WHERE "userId" IS NULL AND "applicationId" IS NULL
         DO UPDATE SET "value" = EXCLUDED."value" || "keyValuePair"."value", "updatedAt" = now()`,
        [
          ENGINE_GATE_ORIGINALS_KEY_VALUE_PAIR_KEY,
          workspaceId,
          JSON.stringify(engineGateOriginalsById),
        ],
      );
    }

    await this.runMigrationPerApplication({
      workspaceId,
      commandMenuItemsToUpdate,
      pageLayoutWidgetsToUpdate,
    });
  }

  async down({ workspaceId, options }: RunOnWorkspaceArgs): Promise<void> {
    const { flatCommandMenuItemMaps, flatPageLayoutWidgetMaps } =
      await this.workspaceCacheService.getOrRecompute(workspaceId, [
        'flatCommandMenuItemMaps',
        'flatPageLayoutWidgetMaps',
      ]);

    const { commandMenuItemExpressionsById, pageLayoutWidgetExpressionsById } =
      await fetchLegacyEngineGateExpressions({
        coreDataSource: this.coreDataSource,
        workspaceId,
      });

    const engineGateOriginalRows: { value: Record<string, EngineGateOriginal> }[] =
      await this.coreDataSource.query(
        `SELECT "value" FROM core."keyValuePair" WHERE "key" = $1 AND "workspaceId" = $2 AND "userId" IS NULL AND "applicationId" IS NULL`,
        [ENGINE_GATE_ORIGINALS_KEY_VALUE_PAIR_KEY, workspaceId],
      );
    const engineGateOriginalsById = engineGateOriginalRows[0]?.value ?? {};

    const commandMenuItemsToRestore = Object.values(
      flatCommandMenuItemMaps.byUniversalIdentifier,
    )
      .filter(isDefined)
      .flatMap((flatCommandMenuItem) => {
        const currentEngineGates = {
          conditionalAvailability: flatCommandMenuItem.conditionalAvailability,
          conditionalPinned: flatCommandMenuItem.conditionalPinned,
          conditionalDisplay: flatCommandMenuItem.conditionalDisplay,
          overrides: flatCommandMenuItem.overrides,
        };
        const restoredEngineGates = restoreEngineGatesFromOriginals({
          legacyEngineGateExpressions:
            commandMenuItemExpressionsById.get(flatCommandMenuItem.id) ??
            NO_LEGACY_ENGINE_GATE_EXPRESSIONS,
          ...currentEngineGates,
          engineGateOriginal: engineGateOriginalsById[flatCommandMenuItem.id],
        });

        return fastDeepEqual(restoredEngineGates, currentEngineGates)
          ? []
          : [{ id: flatCommandMenuItem.id, ...restoredEngineGates }];
      });

    const pageLayoutWidgetsToRestore = Object.values(
      flatPageLayoutWidgetMaps.byUniversalIdentifier,
    )
      .filter(isDefined)
      .flatMap((flatPageLayoutWidget) => {
        const currentEngineGates = {
          conditionalAvailability: flatPageLayoutWidget.conditionalAvailability,
          conditionalPinned: null,
          conditionalDisplay: flatPageLayoutWidget.conditionalDisplay,
          overrides: flatPageLayoutWidget.overrides,
        };
        const restoredEngineGates = restoreEngineGatesFromOriginals({
          legacyEngineGateExpressions:
            pageLayoutWidgetExpressionsById.get(flatPageLayoutWidget.id) ??
            NO_LEGACY_ENGINE_GATE_EXPRESSIONS,
          ...currentEngineGates,
          engineGateOriginal: engineGateOriginalsById[flatPageLayoutWidget.id],
        });

        return fastDeepEqual(restoredEngineGates, currentEngineGates)
          ? []
          : [{ id: flatPageLayoutWidget.id, ...restoredEngineGates }];
      });

    this.logger.log(
      `${options.dryRun ? '[DRY RUN] ' : ''}Workspace ${workspaceId}: restoring the engine gates of ${commandMenuItemsToRestore.length} command menu item(s) and ${pageLayoutWidgetsToRestore.length} page layout widget(s)`,
    );

    if (options.dryRun) {
      return;
    }

    await this.coreDataSource.transaction(async (entityManager) => {
      await entityManager.query(
        `UPDATE core."commandMenuItem" AS "commandMenuItem"
         SET "conditionalAvailability" = restored."conditionalAvailability",
             "conditionalPinned" = restored."conditionalPinned",
             "conditionalDisplay" = restored."conditionalDisplay",
             "overrides" = restored."overrides",
             "updatedAt" = now()
         FROM jsonb_to_recordset($1::jsonb) AS restored(id uuid, "conditionalAvailability" jsonb, "conditionalPinned" jsonb, "conditionalDisplay" jsonb, "overrides" jsonb)
         WHERE "commandMenuItem".id = restored.id AND "commandMenuItem"."workspaceId" = $2`,
        [JSON.stringify(commandMenuItemsToRestore), workspaceId],
      );
      await entityManager.query(
        `UPDATE core."pageLayoutWidget" AS "pageLayoutWidget"
         SET "conditionalAvailability" = restored."conditionalAvailability",
             "conditionalDisplay" = restored."conditionalDisplay",
             "overrides" = restored."overrides",
             "updatedAt" = now()
         FROM jsonb_to_recordset($1::jsonb) AS restored(id uuid, "conditionalAvailability" jsonb, "conditionalDisplay" jsonb, "overrides" jsonb)
         WHERE "pageLayoutWidget".id = restored.id AND "pageLayoutWidget"."workspaceId" = $2`,
        [JSON.stringify(pageLayoutWidgetsToRestore), workspaceId],
      );
      await entityManager.query(
        `DELETE FROM core."keyValuePair" WHERE "key" = $1 AND "workspaceId" = $2 AND "userId" IS NULL AND "applicationId" IS NULL`,
        [ENGINE_GATE_ORIGINALS_KEY_VALUE_PAIR_KEY, workspaceId],
      );
    });

    await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
      'flatCommandMenuItemMaps',
      'flatPageLayoutWidgetMaps',
    ]);
  }

  private migrateOrThrow<
    TMigratedEngineGates extends { unconvertibleOverrideEntries: string[] },
  >({
    workspaceId,
    metadataName,
    universalIdentifier,
    isDryRun,
    migrate,
  }: {
    workspaceId: string;
    metadataName: 'commandMenuItem' | 'pageLayoutWidget';
    universalIdentifier: string;
    isDryRun: boolean;
    migrate: () => TMigratedEngineGates;
  }): TMigratedEngineGates {
    const buildMigrationError = (reason: string) =>
      new Error(
        `Workspace ${workspaceId}: cannot migrate the engine gates of ${metadataName} ${universalIdentifier}: ${reason}`,
      );

    let migratedEngineGates: TMigratedEngineGates;

    try {
      migratedEngineGates = migrate();
    } catch (error) {
      throw buildMigrationError(
        error instanceof Error ? error.message : String(error),
      );
    }

    const { unconvertibleOverrideEntries } = migratedEngineGates;

    if (!isNonEmptyArray(unconvertibleOverrideEntries)) {
      return migratedEngineGates;
    }

    if (!isDryRun) {
      throw buildMigrationError(unconvertibleOverrideEntries.join('; '));
    }

    for (const unconvertibleOverrideEntry of unconvertibleOverrideEntries) {
      this.logger.warn(
        `[DRY RUN] Workspace ${workspaceId}: ${metadataName} ${universalIdentifier}: ${unconvertibleOverrideEntry}`,
      );
    }

    return migratedEngineGates;
  }

  private toUniversalConditionalDisplay({
    conditionalDisplay,
    universalIdentifierMaps,
  }: {
    conditionalDisplay: ConditionalDisplay | null;
    universalIdentifierMaps: UniversalIdentifierMaps;
  }) {
    return fromConditionalDisplayToUniversalConditionalDisplay({
      conditionalDisplay,
      fieldMetadataUniversalIdentifierById:
        universalIdentifierMaps.fieldMetadataUniversalIdentifierById,
      roleUniversalIdentifierById:
        universalIdentifierMaps.roleUniversalIdentifierById,
    });
  }

  private groupFlatFieldMetadatasByNameByObjectMetadataId(
    flatFieldMetadatas: FlatFieldMetadata[],
  ): Map<string, Map<string, FlatFieldMetadata>> {
    const flatFieldMetadatasByNameByObjectMetadataId = new Map<
      string,
      Map<string, FlatFieldMetadata>
    >();

    for (const flatFieldMetadata of flatFieldMetadatas) {
      const flatFieldMetadatasByName =
        flatFieldMetadatasByNameByObjectMetadataId.get(
          flatFieldMetadata.objectMetadataId,
        ) ?? new Map<string, FlatFieldMetadata>();

      flatFieldMetadatasByName.set(flatFieldMetadata.name, flatFieldMetadata);
      flatFieldMetadatasByNameByObjectMetadataId.set(
        flatFieldMetadata.objectMetadataId,
        flatFieldMetadatasByName,
      );
    }

    return flatFieldMetadatasByNameByObjectMetadataId;
  }

  private async runMigrationPerApplication({
    workspaceId,
    commandMenuItemsToUpdate,
    pageLayoutWidgetsToUpdate,
  }: {
    workspaceId: string;
    commandMenuItemsToUpdate: FlatCommandMenuItem[];
    pageLayoutWidgetsToUpdate: FlatPageLayoutWidget[];
  }): Promise<void> {
    const applicationUniversalIdentifiers = new Set([
      ...commandMenuItemsToUpdate.map(
        ({ applicationUniversalIdentifier }) => applicationUniversalIdentifier,
      ),
      ...pageLayoutWidgetsToUpdate.map(
        ({ applicationUniversalIdentifier }) => applicationUniversalIdentifier,
      ),
    ]);

    for (const applicationUniversalIdentifier of applicationUniversalIdentifiers) {
      const commandMenuItemsOfApplication = commandMenuItemsToUpdate.filter(
        (commandMenuItem) =>
          commandMenuItem.applicationUniversalIdentifier ===
          applicationUniversalIdentifier,
      );
      const pageLayoutWidgetsOfApplication = pageLayoutWidgetsToUpdate.filter(
        (pageLayoutWidget) =>
          pageLayoutWidget.applicationUniversalIdentifier ===
          applicationUniversalIdentifier,
      );

      const workspaceMigrationInput = {
        workspaceId,
        isSystemBuild: true,
        applicationUniversalIdentifier,
        allFlatEntityOperationByMetadataName: {
          ...(isNonEmptyArray(commandMenuItemsOfApplication)
            ? {
                commandMenuItem: {
                  flatEntityToCreate: [],
                  flatEntityToDelete: [],
                  flatEntityToUpdate: commandMenuItemsOfApplication,
                },
              }
            : {}),
          ...(isNonEmptyArray(pageLayoutWidgetsOfApplication)
            ? {
                pageLayoutWidget: {
                  flatEntityToCreate: [],
                  flatEntityToDelete: [],
                  flatEntityToUpdate: pageLayoutWidgetsOfApplication,
                },
              }
            : {}),
        },
      };

      const result =
        applicationUniversalIdentifier ===
        TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER
          ? await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration(
              workspaceMigrationInput,
            )
          : await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration(
              workspaceMigrationInput,
            );

      if (result.status === 'fail') {
        throw new WorkspaceMigrationBuilderException(
          result,
          `Failed to migrate the engine gates of application ${applicationUniversalIdentifier} in workspace ${workspaceId}`,
        );
      }
    }
  }
}
