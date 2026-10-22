import { CONDITIONAL_DISPLAY_DEVICES } from '@/constants/ConditionalDisplayDevices';
import { type ConditionalDisplayAdminContextKey } from '@/types/conditional-display/ConditionalDisplayAdminContextKey';
import { type ConditionalDisplayEngineContextKey } from '@/types/conditional-display/ConditionalDisplayEngineContextKey';
import { type ConditionalDisplayOwner } from '@/types/conditional-display/ConditionalDisplayOwner';
import { type ConditionalDisplaySurface } from '@/types/conditional-display/ConditionalDisplaySurface';
import { ContextStorePageType } from '@/types/ContextStorePageType';

type ConditionalDisplayContextKeyDefinition<
  TOwner extends ConditionalDisplayOwner,
> = {
  owner: TOwner;
  valueKind:
    | 'ROLE_IDS'
    | 'WORKSPACE_MEMBER'
    | 'DEVICE'
    | 'BOOLEAN'
    | 'NUMBER'
    | 'PAGE_TYPE'
    | 'MAP_ENTRY'
    | 'RECORD_PATH';
  surfaces: ConditionalDisplaySurface[];
  allowedValues?: readonly string[];
};

export const CONDITIONAL_DISPLAY_CONTEXT_KEYS: Record<
  ConditionalDisplayAdminContextKey,
  ConditionalDisplayContextKeyDefinition<'admin'>
> &
  Record<
    ConditionalDisplayEngineContextKey,
    ConditionalDisplayContextKeyDefinition<'engine'>
  > = {
  currentRoleId: {
    owner: 'admin',
    valueKind: 'ROLE_IDS',
    surfaces: [
      'pageLayoutWidget',
      'pageLayoutTab',
      'viewField',
      'commandMenuItem',
      'navigationMenuItem',
    ],
  },
  currentWorkspaceMemberId: {
    owner: 'admin',
    valueKind: 'WORKSPACE_MEMBER',
    surfaces: [
      'pageLayoutWidget',
      'pageLayoutTab',
      'viewField',
      'commandMenuItem',
      'navigationMenuItem',
    ],
  },
  device: {
    owner: 'admin',
    valueKind: 'DEVICE',
    surfaces: ['pageLayoutWidget', 'pageLayoutTab', 'viewField'],
    allowedValues: CONDITIONAL_DISPLAY_DEVICES,
  },
  pageType: {
    owner: 'engine',
    valueKind: 'PAGE_TYPE',
    surfaces: ['commandMenuItem'],
    allowedValues: Object.values(ContextStorePageType),
  },
  isInSidePanel: {
    owner: 'engine',
    valueKind: 'BOOLEAN',
    surfaces: ['commandMenuItem'],
  },
  isDashboardPageLayoutInEditMode: {
    owner: 'engine',
    valueKind: 'BOOLEAN',
    surfaces: ['commandMenuItem'],
  },
  isLayoutCustomizationModeEnabled: {
    owner: 'engine',
    valueKind: 'BOOLEAN',
    surfaces: ['commandMenuItem'],
  },
  isSelectAll: {
    owner: 'engine',
    valueKind: 'BOOLEAN',
    surfaces: ['commandMenuItem'],
  },
  hasAnySoftDeleteFilterOnView: {
    owner: 'engine',
    valueKind: 'BOOLEAN',
    surfaces: ['commandMenuItem'],
  },
  numberOfSelectedRecords: {
    owner: 'engine',
    valueKind: 'NUMBER',
    surfaces: ['commandMenuItem'],
  },
  canImpersonate: {
    owner: 'engine',
    valueKind: 'BOOLEAN',
    surfaces: ['commandMenuItem'],
  },
  canAccessFullAdminPanel: {
    owner: 'engine',
    valueKind: 'BOOLEAN',
    surfaces: ['commandMenuItem'],
  },
  areAllSelectedRecordsFavorites: {
    owner: 'engine',
    valueKind: 'BOOLEAN',
    surfaces: ['commandMenuItem'],
  },
  featureFlags: {
    owner: 'engine',
    valueKind: 'MAP_ENTRY',
    surfaces: ['commandMenuItem', 'pageLayoutWidget'],
  },
  permissionFlags: {
    owner: 'engine',
    valueKind: 'MAP_ENTRY',
    surfaces: ['commandMenuItem'],
  },
  objectPermissions: {
    owner: 'engine',
    valueKind: 'MAP_ENTRY',
    surfaces: ['commandMenuItem'],
  },
  targetObjectReadPermissions: {
    owner: 'engine',
    valueKind: 'MAP_ENTRY',
    surfaces: ['commandMenuItem'],
  },
  targetObjectWritePermissions: {
    owner: 'engine',
    valueKind: 'MAP_ENTRY',
    surfaces: ['commandMenuItem'],
  },
  objectMetadataItem: {
    owner: 'engine',
    valueKind: 'MAP_ENTRY',
    surfaces: ['commandMenuItem'],
  },
  selectedRecords: {
    owner: 'engine',
    valueKind: 'RECORD_PATH',
    surfaces: ['commandMenuItem', 'pageLayoutWidget'],
  },
};
