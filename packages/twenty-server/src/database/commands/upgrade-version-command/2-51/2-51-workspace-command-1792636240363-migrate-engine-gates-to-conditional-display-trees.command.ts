import { InjectDataSource } from '@nestjs/typeorm';

import { Command } from 'nest-commander';
import { TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER } from 'twenty-shared/application';
import { type ConditionalDisplay } from 'twenty-shared/types';
import { fastDeepEqual, isDefined, isNonEmptyArray } from 'twenty-shared/utils';
import { DataSource } from 'typeorm';

import { ProvisionedWorkspaceCommandRunner } from 'src/database/commands/command-runners/provisioned-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { type LegacyEngineGateExpressions } from 'src/database/commands/upgrade-version-command/2-51/types/legacy-engine-gate-expressions.type';
import { fetchLegacyEngineGateExpressions } from 'src/database/commands/upgrade-version-command/2-51/utils/fetch-legacy-engine-gate-expressions.util';
import { migrateEngineGatesToConditionalDisplayTrees } from 'src/database/commands/upgrade-version-command/2-51/utils/migrate-engine-gates-to-conditional-display-trees.util';
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

@RegisteredWorkspaceCommand('2.51.0', 1792636240363)
@Command({
  name: 'upgrade:2-51:migrate-engine-gates-to-conditional-display-trees',
  description:
    'Compile the conditionalAvailabilityExpression and conditionalPinnedExpression of command menu items and page layout widgets into conditionalAvailability and conditionalPinned trees, and convert legacy json-logic conditionalDisplay rules and device expression overrides into conditionalDisplay trees. Down clears the compiled conditionalAvailability and conditionalPinned trees and keeps the converted conditionalDisplay trees, since the legacy json-logic is gone and the trees are valid',
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
    };

    const now = new Date().toISOString();

    const commandMenuItemsToUpdate = Object.values(
      flatCommandMenuItemMaps.byUniversalIdentifier,
    )
      .filter(isDefined)
      .flatMap((flatCommandMenuItem): FlatCommandMenuItem[] => {
        const migratedEngineGates = this.migrateOrThrow({
          workspaceId,
          metadataName: 'commandMenuItem',
          universalIdentifier: flatCommandMenuItem.universalIdentifier,
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
      `${options.dryRun ? '[DRY RUN] ' : ''}Workspace ${workspaceId}: ${counts.commandsWithAvailability} command(s) with availability, ${counts.commandsWithPinned} command(s) with pinned, ${counts.widgetsWithAvailability} widget(s) with availability, ${counts.widgetsConvertedFromJsonLogic} widget(s) converted from json-logic, ${counts.overrideEntriesConverted} override entr(ies) converted, updating ${commandMenuItemsToUpdate.length} command menu item(s) and ${pageLayoutWidgetsToUpdate.length} page layout widget(s)`,
    );

    if (options.dryRun) {
      return;
    }

    await this.runMigrationPerApplication({
      workspaceId,
      workspaceCustomApplicationUniversalIdentifier:
        workspaceCustomFlatApplication.universalIdentifier,
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

    const { workspaceCustomFlatApplication } =
      await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow(
        { workspaceId },
      );

    const { commandMenuItemExpressionsById, pageLayoutWidgetExpressionsById } =
      await fetchLegacyEngineGateExpressions({
        coreDataSource: this.coreDataSource,
        workspaceId,
      });

    const now = new Date().toISOString();

    const commandMenuItemsToUpdate = Object.values(
      flatCommandMenuItemMaps.byUniversalIdentifier,
    )
      .filter(isDefined)
      .flatMap((flatCommandMenuItem): FlatCommandMenuItem[] => {
        const legacyEngineGateExpressions =
          commandMenuItemExpressionsById.get(flatCommandMenuItem.id) ??
          NO_LEGACY_ENGINE_GATE_EXPRESSIONS;
        const shouldClearAvailability =
          isDefined(
            legacyEngineGateExpressions.conditionalAvailabilityExpression,
          ) && isDefined(flatCommandMenuItem.conditionalAvailability);
        const shouldClearPinned =
          isDefined(legacyEngineGateExpressions.conditionalPinnedExpression) &&
          isDefined(flatCommandMenuItem.conditionalPinned);

        if (!shouldClearAvailability && !shouldClearPinned) {
          return [];
        }

        return [
          {
            ...flatCommandMenuItem,
            ...(shouldClearAvailability
              ? {
                  conditionalAvailability: null,
                  universalConditionalAvailability: null,
                }
              : {}),
            ...(shouldClearPinned
              ? { conditionalPinned: null, universalConditionalPinned: null }
              : {}),
            updatedAt: now,
          },
        ];
      });

    const pageLayoutWidgetsToUpdate = Object.values(
      flatPageLayoutWidgetMaps.byUniversalIdentifier,
    )
      .filter(isDefined)
      .flatMap((flatPageLayoutWidget): FlatPageLayoutWidget[] => {
        const legacyEngineGateExpressions =
          pageLayoutWidgetExpressionsById.get(flatPageLayoutWidget.id) ??
          NO_LEGACY_ENGINE_GATE_EXPRESSIONS;

        if (
          !isDefined(
            legacyEngineGateExpressions.conditionalAvailabilityExpression,
          ) ||
          !isDefined(flatPageLayoutWidget.conditionalAvailability)
        ) {
          return [];
        }

        return [
          {
            ...flatPageLayoutWidget,
            conditionalAvailability: null,
            universalConditionalAvailability: null,
            updatedAt: now,
          },
        ];
      });

    this.logger.log(
      `${options.dryRun ? '[DRY RUN] ' : ''}Workspace ${workspaceId}: clearing the compiled engine gates of ${commandMenuItemsToUpdate.length} command menu item(s) and ${pageLayoutWidgetsToUpdate.length} page layout widget(s)`,
    );

    if (options.dryRun) {
      return;
    }

    await this.runMigrationPerApplication({
      workspaceId,
      workspaceCustomApplicationUniversalIdentifier:
        workspaceCustomFlatApplication.universalIdentifier,
      commandMenuItemsToUpdate,
      pageLayoutWidgetsToUpdate,
    });
  }

  private migrateOrThrow<TMigratedEngineGates>({
    workspaceId,
    metadataName,
    universalIdentifier,
    migrate,
  }: {
    workspaceId: string;
    metadataName: 'commandMenuItem' | 'pageLayoutWidget';
    universalIdentifier: string;
    migrate: () => TMigratedEngineGates;
  }): TMigratedEngineGates {
    try {
      return migrate();
    } catch (error) {
      throw new Error(
        `Workspace ${workspaceId}: cannot migrate the engine gates of ${metadataName} ${universalIdentifier}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
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
    workspaceCustomApplicationUniversalIdentifier,
    commandMenuItemsToUpdate,
    pageLayoutWidgetsToUpdate,
  }: {
    workspaceId: string;
    workspaceCustomApplicationUniversalIdentifier: string;
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

      const args = {
        workspaceId,
        isSystemBuild: true,
        applicationUniversalIdentifier:
          workspaceCustomApplicationUniversalIdentifier,
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
              args,
            )
          : await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration(
              args,
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
