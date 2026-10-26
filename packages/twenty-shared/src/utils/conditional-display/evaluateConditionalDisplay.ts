import { type ConditionalDisplay } from '@/types/conditional-display/ConditionalDisplay';
import { type ConditionalDisplayRecordFilter } from '@/types/conditional-display/ConditionalDisplayRecordFilter';
import { type ConditionalDisplayRecordFilterGroup } from '@/types/conditional-display/ConditionalDisplayRecordFilterGroup';
import { RecordFilterGroupLogicalOperator } from '@/types/RecordFilterGroupLogicalOperator';
import { isNonEmptyArray } from '@/utils/array/isNonEmptyArray';
import { isDefined } from '@/utils/validation/isDefined';

export const evaluateConditionalDisplay = <TRecord>({
  conditionalDisplay,
  records,
  isRecordFilterMatching,
}: {
  conditionalDisplay: ConditionalDisplay | null | undefined;
  records: TRecord[] | null | undefined;
  isRecordFilterMatching: (params: {
    recordFilter: ConditionalDisplayRecordFilter;
    record: TRecord | undefined;
  }) => boolean;
}): boolean => {
  const recordFilters = conditionalDisplay?.recordFilters ?? [];

  if (!isNonEmptyArray(recordFilters)) {
    return true;
  }

  const recordFilterGroups = conditionalDisplay?.recordFilterGroups ?? [];

  const evaluateForRecord = (record: TRecord | undefined) => {
    const isRecordFilterMatchingForRecord = (
      recordFilter: ConditionalDisplayRecordFilter,
    ) => isRecordFilterMatching({ recordFilter, record });

    const isRecordFilterGroupMatching = (
      recordFilterGroup: ConditionalDisplayRecordFilterGroup,
    ): boolean => {
      const childMatches = [
        ...recordFilters
          .filter(
            (recordFilter) =>
              recordFilter.recordFilterGroupId === recordFilterGroup.id,
          )
          .map(isRecordFilterMatchingForRecord),
        ...recordFilterGroups
          .filter(
            (childRecordFilterGroup) =>
              childRecordFilterGroup.parentRecordFilterGroupId ===
              recordFilterGroup.id,
          )
          .map(isRecordFilterGroupMatching),
      ];

      return recordFilterGroup.logicalOperator ===
        RecordFilterGroupLogicalOperator.OR
        ? childMatches.some((childMatch) => childMatch)
        : childMatches.every((childMatch) => childMatch);
    };

    const ungroupedRecordFiltersMatch = recordFilters
      .filter((recordFilter) => !isDefined(recordFilter.recordFilterGroupId))
      .every(isRecordFilterMatchingForRecord);

    const rootRecordFilterGroupsMatch = recordFilterGroups
      .filter(
        (recordFilterGroup) =>
          !isDefined(recordFilterGroup.parentRecordFilterGroupId),
      )
      .every(isRecordFilterGroupMatching);

    return ungroupedRecordFiltersMatch && rootRecordFilterGroupsMatch;
  };

  if (!isNonEmptyArray(records)) {
    return evaluateForRecord(undefined);
  }

  return conditionalDisplay?.selectedRecordsMatch === 'SOME'
    ? records.some(evaluateForRecord)
    : records.every(evaluateForRecord);
};
