import { CONDITIONAL_DISPLAY_DEVICES } from '@/constants/ConditionalDisplayDevices';
import { type ConditionalDisplayAdminContextKey } from '@/types/conditional-display/ConditionalDisplayAdminContextKey';
import { type ConditionalDisplayContextKeySubject } from '@/types/conditional-display/ConditionalDisplayContextKeySubject';
import { type ConditionalDisplayEngineContextKey } from '@/types/conditional-display/ConditionalDisplayEngineContextKey';
import { type ConditionalDisplayOwner } from '@/types/conditional-display/ConditionalDisplayOwner';
import { type ConditionalDisplaySurface } from '@/types/conditional-display/ConditionalDisplaySurface';
import { ContextStorePageType } from '@/types/ContextStorePageType';
import { FieldMetadataType } from '@/types/FieldMetadataType';
import { MetadataReadability } from '@/types/MetadataReadability';

type ConditionalDisplayContextKeyDefinition<
  TOwner extends ConditionalDisplayOwner,
  TSubject extends ConditionalDisplayContextKeySubject,
> = {
  owner: TOwner;
  surfaces: ConditionalDisplaySurface[];
  subject: TSubject;
};

export const CONDITIONAL_DISPLAY_CONTEXT_KEYS: Record<
  ConditionalDisplayAdminContextKey,
  ConditionalDisplayContextKeyDefinition<
    'admin',
    Extract<ConditionalDisplayContextKeySubject, { kind: 'VALUE' }>
  >
> &
  Record<
    ConditionalDisplayEngineContextKey,
    ConditionalDisplayContextKeyDefinition<
      'engine',
      ConditionalDisplayContextKeySubject
    >
  > = {
  currentRoleId: {
    owner: 'admin',
    surfaces: [
      'pageLayoutWidget',
      'pageLayoutTab',
      'viewField',
      'commandMenuItem',
      'navigationMenuItem',
    ],
    subject: { kind: 'VALUE', field: { type: FieldMetadataType.UUID } },
  },
  currentWorkspaceMemberId: {
    owner: 'admin',
    surfaces: [
      'pageLayoutWidget',
      'pageLayoutTab',
      'viewField',
      'commandMenuItem',
      'navigationMenuItem',
    ],
    subject: { kind: 'VALUE', field: { type: FieldMetadataType.RELATION } },
  },
  device: {
    owner: 'admin',
    surfaces: [
      'pageLayoutWidget',
      'pageLayoutTab',
      'viewField',
      'commandMenuItem',
      'navigationMenuItem',
    ],
    subject: {
      kind: 'VALUE',
      field: {
        type: FieldMetadataType.SELECT,
        options: CONDITIONAL_DISPLAY_DEVICES,
      },
    },
  },
  pageType: {
    owner: 'engine',
    surfaces: ['commandMenuItem'],
    subject: {
      kind: 'VALUE',
      field: {
        type: FieldMetadataType.SELECT,
        options: Object.values(ContextStorePageType),
      },
    },
  },
  isInSidePanel: {
    owner: 'engine',
    surfaces: ['commandMenuItem'],
    subject: { kind: 'VALUE', field: { type: FieldMetadataType.BOOLEAN } },
  },
  isDashboardPageLayoutInEditMode: {
    owner: 'engine',
    surfaces: ['commandMenuItem'],
    subject: { kind: 'VALUE', field: { type: FieldMetadataType.BOOLEAN } },
  },
  isLayoutCustomizationModeEnabled: {
    owner: 'engine',
    surfaces: ['commandMenuItem'],
    subject: { kind: 'VALUE', field: { type: FieldMetadataType.BOOLEAN } },
  },
  isSelectAll: {
    owner: 'engine',
    surfaces: ['commandMenuItem'],
    subject: { kind: 'VALUE', field: { type: FieldMetadataType.BOOLEAN } },
  },
  hasAnySoftDeleteFilterOnView: {
    owner: 'engine',
    surfaces: ['commandMenuItem'],
    subject: { kind: 'VALUE', field: { type: FieldMetadataType.BOOLEAN } },
  },
  numberOfSelectedRecords: {
    owner: 'engine',
    surfaces: ['commandMenuItem'],
    subject: { kind: 'VALUE', field: { type: FieldMetadataType.NUMBER } },
  },
  canImpersonate: {
    owner: 'engine',
    surfaces: ['commandMenuItem'],
    subject: { kind: 'VALUE', field: { type: FieldMetadataType.BOOLEAN } },
  },
  canAccessFullAdminPanel: {
    owner: 'engine',
    surfaces: ['commandMenuItem'],
    subject: { kind: 'VALUE', field: { type: FieldMetadataType.BOOLEAN } },
  },
  areAllSelectedRecordsFavorites: {
    owner: 'engine',
    surfaces: ['commandMenuItem'],
    subject: { kind: 'VALUE', field: { type: FieldMetadataType.BOOLEAN } },
  },
  featureFlags: {
    owner: 'engine',
    surfaces: ['commandMenuItem', 'pageLayoutWidget'],
    subject: {
      kind: 'MAP_ENTRY',
      entryField: { type: FieldMetadataType.BOOLEAN },
    },
  },
  permissionFlags: {
    owner: 'engine',
    surfaces: ['commandMenuItem'],
    subject: {
      kind: 'MAP_ENTRY',
      entryField: { type: FieldMetadataType.BOOLEAN },
    },
  },
  objectPermissions: {
    owner: 'engine',
    surfaces: ['commandMenuItem'],
    subject: {
      kind: 'MAP_ENTRY',
      entryField: { type: FieldMetadataType.BOOLEAN },
    },
  },
  targetObjectReadPermissions: {
    owner: 'engine',
    surfaces: ['commandMenuItem'],
    subject: {
      kind: 'MAP_ENTRY',
      entryField: { type: FieldMetadataType.BOOLEAN },
    },
  },
  targetObjectWritePermissions: {
    owner: 'engine',
    surfaces: ['commandMenuItem'],
    subject: {
      kind: 'MAP_ENTRY',
      entryField: { type: FieldMetadataType.BOOLEAN },
    },
  },
  objectMetadataItem: {
    owner: 'engine',
    surfaces: ['commandMenuItem'],
    subject: {
      kind: 'PROPERTY',
      propertyFields: {
        nameSingular: { type: FieldMetadataType.SELECT },
        readability: {
          type: FieldMetadataType.SELECT,
          options: Object.values(MetadataReadability),
        },
        isRemote: { type: FieldMetadataType.BOOLEAN },
        isSystem: { type: FieldMetadataType.BOOLEAN },
        isUICreatable: { type: FieldMetadataType.BOOLEAN },
        isUIEditable: { type: FieldMetadataType.BOOLEAN },
        duplicateCriteria: { type: FieldMetadataType.RAW_JSON },
      },
    },
  },
  selectedRecords: {
    owner: 'engine',
    surfaces: ['commandMenuItem', 'pageLayoutWidget'],
    subject: { kind: 'SELECTED_RECORD_PATH' },
  },
};
