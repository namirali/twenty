import { isConditionalDisplayContextRecordFilterMatching } from '@/conditional-display/utils/isConditionalDisplayContextRecordFilterMatching';
import { isConditionalDisplayFieldRecordFilterMatching } from '@/conditional-display/utils/isConditionalDisplayFieldRecordFilterMatching';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import {
  type ConditionalDisplay,
  type ConditionalDisplayEvaluationContext,
} from 'twenty-shared/types';
import {
  evaluateConditionalDisplay as evaluateConditionalDisplayTree,
  isConditionalDisplaySelectedRecordPathMatching,
  isDefined,
} from 'twenty-shared/utils';

type EvaluateConditionalDisplayParams = {
  conditionalDisplay: ConditionalDisplay | null | undefined;
  context: ConditionalDisplayEvaluationContext;
  records: Record<string, unknown>[];
  objectMetadataItem?: EnrichedObjectMetadataItem;
  objectMetadataItems: EnrichedObjectMetadataItem[];
};

export const evaluateConditionalDisplay = ({
  conditionalDisplay,
  context,
  records,
  objectMetadataItem,
  objectMetadataItems,
}: EvaluateConditionalDisplayParams): boolean => {
  const hasFieldRecordFilter = (conditionalDisplay?.recordFilters ?? []).some(
    (recordFilter) => !isDefined(recordFilter.contextKey),
  );

  if (hasFieldRecordFilter && !isDefined(objectMetadataItem)) {
    return false;
  }

  return evaluateConditionalDisplayTree({
    conditionalDisplay,
    records,
    isRecordFilterMatching: ({ recordFilter, record }) => {
      if (!isDefined(recordFilter.contextKey)) {
        return isConditionalDisplayFieldRecordFilterMatching({
          recordFilter,
          record,
          objectMetadataItem,
          objectMetadataItems,
          currentWorkspaceMemberId: context.currentWorkspaceMemberId,
        });
      }

      if (recordFilter.contextKey === 'selectedRecords') {
        return isConditionalDisplaySelectedRecordPathMatching({
          recordFilter,
          record,
        });
      }

      return isConditionalDisplayContextRecordFilterMatching({
        recordFilter,
        context,
        objectMetadataItems,
      });
    },
  });
};
