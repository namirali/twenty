import { type Manifest } from 'twenty-shared/application';
import { ALL_METADATA_NAME } from 'twenty-shared/metadata';
import { ViewFilterOperand } from 'twenty-shared/types';

import { ApplicationManifestMigrationService } from 'src/engine/core-modules/application/application-manifest/application-manifest-migration.service';
import { type ComputeApplicationManifestAllUniversalFlatEntityMapsService } from 'src/engine/core-modules/application/application-manifest/services/compute-application-manifest-all-universal-flat-entity-maps.service';
import { type ApplicationService } from 'src/engine/core-modules/application/application.service';
import { type FlatApplication } from 'src/engine/core-modules/application/types/flat-application.type';
import { type LoggerService } from 'src/engine/core-modules/logger/logger.service';
import { type WorkflowVersionCoreSyncService } from 'src/engine/core-modules/workflow/services/workflow-version-core-sync.service';
import { validateUniversalFlatEntityConditionalDisplays } from 'src/engine/metadata-modules/flat-conditional-display/utils/validate-universal-flat-entity-conditional-displays.util';
import { createEmptyFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant';
import { type MetadataUniversalFlatEntity } from 'src/engine/metadata-modules/flat-entity/types/metadata-universal-flat-entity.type';
import { getMetadataFlatEntityMapsKey } from 'src/engine/metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util';
import { type WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';
import { type WorkspaceMigrationValidateBuildAndRunService } from 'src/engine/workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service';

const WORKSPACE_ID = '20202020-0000-4000-8000-000000000000';
const TWENTY_STANDARD_APPLICATION_ID = '20202020-0000-4000-8000-000000000001';
const WORKSPACE_CUSTOM_APPLICATION_ID = '20202020-0000-4000-8000-000000000002';
const WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER =
  '20202020-0000-4000-8000-000000000003';
const INSTALLED_APPLICATION_ID = '20202020-0000-4000-8000-000000000004';
const INSTALLED_APPLICATION_UNIVERSAL_IDENTIFIER =
  '20202020-0000-4000-8000-000000000005';
const CUSTOM_ROLE_ID = '20202020-0000-4000-8000-000000000006';
const CUSTOM_ROLE_UNIVERSAL_IDENTIFIER = '20202020-0000-4000-8000-000000000007';
const PRE_INSTALL_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER =
  '20202020-0000-4000-8000-000000000008';

const buildEmptyAllFlatEntityMaps = () =>
  Object.fromEntries(
    Object.values(ALL_METADATA_NAME).map((metadataName) => [
      getMetadataFlatEntityMapsKey(metadataName),
      createEmptyFlatEntityMaps(),
    ]),
  );

const flatRoleMaps = {
  byUniversalIdentifier: {
    [CUSTOM_ROLE_UNIVERSAL_IDENTIFIER]: {
      id: CUSTOM_ROLE_ID,
      universalIdentifier: CUSTOM_ROLE_UNIVERSAL_IDENTIFIER,
      applicationId: WORKSPACE_CUSTOM_APPLICATION_ID,
      applicationUniversalIdentifier:
        WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER,
    },
  },
  universalIdentifierById: {
    [CUSTOM_ROLE_ID]: CUSTOM_ROLE_UNIVERSAL_IDENTIFIER,
  },
  universalIdentifiersByApplicationId: {
    [WORKSPACE_CUSTOM_APPLICATION_ID]: [CUSTOM_ROLE_UNIVERSAL_IDENTIFIER],
  },
};

const installedFlatPageLayoutWidget = {
  applicationUniversalIdentifier: INSTALLED_APPLICATION_UNIVERSAL_IDENTIFIER,
  universalConditionalDisplay: null,
  universalOverrides: {
    [WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER]: {
      conditionalDisplay: {
        recordFilters: [
          {
            id: '0',
            contextKey: 'currentRoleId',
            operand: ViewFilterOperand.IS,
            value: JSON.stringify([CUSTOM_ROLE_UNIVERSAL_IDENTIFIER]),
          },
        ],
      },
    },
  },
} as unknown as MetadataUniversalFlatEntity<'pageLayoutWidget'>;

const workspaceCacheService = {
  getOrRecompute: async () => ({
    ...buildEmptyAllFlatEntityMaps(),
    flatRoleMaps,
    featureFlagsMap: {},
    billingEntitlements: {},
  }),
} as unknown as WorkspaceCacheService;

const applicationService = {
  findWorkspaceTwentyStandardAndCustomApplicationOrThrow: async () => ({
    twentyStandardFlatApplication: { id: TWENTY_STANDARD_APPLICATION_ID },
    workspaceCustomFlatApplication: {
      id: WORKSPACE_CUSTOM_APPLICATION_ID,
      universalIdentifier: WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER,
    },
  }),
} as unknown as ApplicationService;

const computeManifestFlatEntityMapsService = {
  compute: () => buildEmptyAllFlatEntityMaps(),
} as unknown as ComputeApplicationManifestAllUniversalFlatEntityMapsService;

const logger = { log: () => undefined } as unknown as LoggerService;

const manifest = {
  application: {
    preInstallLogicFunction: {
      universalIdentifier: PRE_INSTALL_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER,
    },
  },
  logicFunctions: [
    { universalIdentifier: PRE_INSTALL_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER },
  ],
} as unknown as Manifest;

describe('ApplicationManifestMigrationService', () => {
  it('an installed app sync validates a custom-authored override referencing a custom role', async () => {
    const validateBuildAndRunWorkspaceMigrationFromTo = jest
      .fn()
      .mockResolvedValue({ status: 'success' });

    const applicationManifestMigrationService =
      new ApplicationManifestMigrationService(
        workspaceCacheService,
        {
          validateBuildAndRunWorkspaceMigrationFromTo,
        } as unknown as WorkspaceMigrationValidateBuildAndRunService,
        applicationService,
        computeManifestFlatEntityMapsService,
        logger,
        {} as WorkflowVersionCoreSyncService,
      );

    await applicationManifestMigrationService.syncPreInstallLogicFunctionFromManifest(
      {
        manifest,
        workspaceId: WORKSPACE_ID,
        ownerFlatApplication: {
          id: INSTALLED_APPLICATION_ID,
          universalIdentifier: INSTALLED_APPLICATION_UNIVERSAL_IDENTIFIER,
        } as FlatApplication,
      },
    );

    const [{ dependencyAllFlatEntityMaps }] =
      validateBuildAndRunWorkspaceMigrationFromTo.mock.calls[0];

    expect(
      validateUniversalFlatEntityConditionalDisplays({
        flatEntity: installedFlatPageLayoutWidget,
        property: 'conditionalDisplay',
        surface: 'pageLayoutWidget',
        objectMetadataUniversalIdentifier: null,
        invalidDataCode: 'INVALID_DATA',
        flatFieldMetadataMaps: createEmptyFlatEntityMaps(),
        flatRoleMaps: dependencyAllFlatEntityMaps.flatRoleMaps,
      }),
    ).toEqual([]);
  });
});
