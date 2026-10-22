import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import {
  type ConditionalDisplayDevice,
  type ObjectRecord,
} from 'twenty-shared/types';

export type WidgetVisibilityContext = {
  device: ConditionalDisplayDevice;
  selectedRecords: ObjectRecord[];
  featureFlags: Record<string, boolean>;
  currentRoleId: string | null;
  currentWorkspaceMemberId: string | null;
  objectMetadataItem?: EnrichedObjectMetadataItem;
  objectMetadataItems: EnrichedObjectMetadataItem[];
  // TODO: remove with the workspace workflow and workflowVersion objects once the core migration owns them.
  hiddenFieldMetadataIdsOrNames?: string[];
};
