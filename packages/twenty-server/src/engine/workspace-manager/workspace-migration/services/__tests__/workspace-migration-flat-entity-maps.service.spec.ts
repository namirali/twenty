import { ViewFilterOperand } from 'twenty-shared/types';

import { type CoreEntityCacheService } from 'src/engine/core-entity-cache/services/core-entity-cache.service';
import { validateUniversalFlatEntityConditionalDisplays } from 'src/engine/metadata-modules/flat-conditional-display/utils/validate-universal-flat-entity-conditional-displays.util';
import { createEmptyFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant';
import { type MetadataUniversalFlatEntity } from 'src/engine/metadata-modules/flat-entity/types/metadata-universal-flat-entity.type';
import { type MetadataSideEffectEngineService } from 'src/engine/metadata-modules/metadata-side-effect/services/metadata-side-effect-engine.service';
import { type WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';
import { TWENTY_STANDARD_APPLICATION } from 'src/engine/workspace-manager/twenty-standard-application/constants/twenty-standard-applications';
import { WorkspaceMigrationFlatEntityMapsService } from 'src/engine/workspace-manager/workspace-migration/services/workspace-migration-flat-entity-maps.service';

const WORKSPACE_ID = '20202020-0000-4000-8000-000000000000';
const TWENTY_STANDARD_APPLICATION_ID = '20202020-0000-4000-8000-000000000001';
const WORKSPACE_CUSTOM_APPLICATION_ID = '20202020-0000-4000-8000-000000000002';
const WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER =
  '20202020-0000-4000-8000-000000000003';
const CUSTOM_ROLE_ID = '20202020-0000-4000-8000-000000000004';
const CUSTOM_ROLE_UNIVERSAL_IDENTIFIER = '20202020-0000-4000-8000-000000000005';
const COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER =
  '20202020-0000-4000-8000-000000000006';

const flatApplicationMaps = {
  byId: {},
  idByUniversalIdentifier: {
    [TWENTY_STANDARD_APPLICATION.universalIdentifier]:
      TWENTY_STANDARD_APPLICATION_ID,
    [WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER]:
      WORKSPACE_CUSTOM_APPLICATION_ID,
  },
};

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

const standardFlatCommandMenuItem = {
  universalIdentifier: COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  applicationUniversalIdentifier:
    TWENTY_STANDARD_APPLICATION.universalIdentifier,
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
} as unknown as MetadataUniversalFlatEntity<'commandMenuItem'>;

const workspaceCacheService = {
  getOrRecompute: async (_workspaceId: string, cacheKeyNames: string[]) =>
    Object.fromEntries(
      cacheKeyNames.map((cacheKeyName) => [
        cacheKeyName,
        cacheKeyName === 'flatApplicationMaps'
          ? flatApplicationMaps
          : cacheKeyName === 'flatRoleMaps'
            ? flatRoleMaps
            : createEmptyFlatEntityMaps(),
      ]),
    ),
} as unknown as WorkspaceCacheService;

const coreEntityCacheService = {
  get: async () => ({
    workspaceCustomApplicationId: WORKSPACE_CUSTOM_APPLICATION_ID,
  }),
} as unknown as CoreEntityCacheService;

const metadataSideEffectEngineService = {
  getSideEffectRelatedMetadataNames: () => [],
} as unknown as MetadataSideEffectEngineService;

describe('WorkspaceMigrationFlatEntityMapsService', () => {
  it('a build under the standard app validates a custom-authored override referencing a custom role', async () => {
    const workspaceMigrationFlatEntityMapsService =
      new WorkspaceMigrationFlatEntityMapsService(
        workspaceCacheService,
        coreEntityCacheService,
        metadataSideEffectEngineService,
      );

    const flatEntityMapsBundle =
      await workspaceMigrationFlatEntityMapsService.getOrRecomputeAllRelatedFlatEntityMaps(
        {
          workspaceId: WORKSPACE_ID,
          callerMetadataNames: ['commandMenuItem'],
        },
      );

    const { dependencyAllFlatEntityMaps } =
      workspaceMigrationFlatEntityMapsService.computeFromToAllFlatEntityMapsAndBuildOptions(
        {
          ...flatEntityMapsBundle,
          applicationUniversalIdentifier:
            TWENTY_STANDARD_APPLICATION.universalIdentifier,
          allFlatEntityOperationRecordByMetadataName: {
            commandMenuItem: {
              flatEntityToCreate: {
                [COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER]:
                  standardFlatCommandMenuItem,
              },
              flatEntityToUpdate: {},
              flatEntityToDelete: {},
            },
          },
        },
      );

    expect(
      validateUniversalFlatEntityConditionalDisplays({
        flatEntity: standardFlatCommandMenuItem,
        surface: 'commandMenuItem',
        objectMetadataUniversalIdentifier: null,
        invalidDataCode: 'INVALID_DATA',
        flatFieldMetadataMaps: createEmptyFlatEntityMaps(),
        flatRoleMaps:
          dependencyAllFlatEntityMaps.flatRoleMaps ??
          createEmptyFlatEntityMaps(),
      }),
    ).toEqual([]);
  });
});
