import { type FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { type RecordFilterGroup } from '@/object-record/record-filter-group/types/RecordFilterGroup';
import { type PersistedRecordFilter } from '@/object-record/record-filter/types/PersistedRecordFilter';
import { sanitizeRecordFilters } from '@/object-record/record-filter/utils/sanitizeRecordFilters';
import {
  type ConditionalDisplay,
  type ConditionalDisplayAdminContextKey,
  type ConditionalDisplayRecordFilter,
  type ConditionalDisplaySelectedRecordsMatch,
} from 'twenty-shared/types';
import {
  isDefined,
  isNonEmptyArray,
  isRecordFilterValueValid,
} from 'twenty-shared/utils';

type SanitizeConditionalDisplayParams = {
  recordFilters: PersistedRecordFilter[];
  recordFilterGroups: RecordFilterGroup[];
  selectedRecordsMatch?: ConditionalDisplaySelectedRecordsMatch;
  availableContextKeys: ConditionalDisplayAdminContextKey[];
  fieldMetadataItems: (Pick<FieldMetadataItem, 'id' | 'isActive'> & {
    morphRelations?: { sourceFieldMetadata: { id: string } }[] | null;
  })[];
};

export const sanitizeConditionalDisplay = ({
  recordFilters,
  recordFilterGroups,
  selectedRecordsMatch,
  availableContextKeys,
  fieldMetadataItems,
}: SanitizeConditionalDisplayParams): ConditionalDisplay | null => {
  const recordFiltersToSanitize = {
    recordFilters: recordFilters.filter(
      (recordFilter) =>
        !isDefined(recordFilter.contextKey) ||
        (availableContextKeys.includes(recordFilter.contextKey) &&
          isRecordFilterValueValid({
            operand: recordFilter.operand,
            value: recordFilter.value ?? '',
          })),
    ),
    recordFilterGroups,
  };

  const {
    recordFilters: validRecordFilters = [],
    recordFilterGroups: remainingRecordFilterGroups = [],
  } = sanitizeRecordFilters({
    recordFiltersWithGroups: recordFiltersToSanitize,
    fieldMetadataItems,
  });

  const conditionalDisplayRecordFilters: ConditionalDisplayRecordFilter[] =
    validRecordFilters.map((recordFilter) =>
      isDefined(recordFilter.contextKey)
        ? {
            id: recordFilter.id ?? '',
            contextKey: recordFilter.contextKey,
            operand: recordFilter.operand,
            value: recordFilter.value,
            recordFilterGroupId: recordFilter.recordFilterGroupId,
            positionInRecordFilterGroup:
              recordFilter.positionInRecordFilterGroup,
          }
        : {
            id: recordFilter.id ?? '',
            fieldMetadataId: recordFilter.fieldMetadataId,
            subFieldName: recordFilter.subFieldName,
            relationTargetFieldMetadataId:
              recordFilter.relationTargetFieldMetadataId,
            operand: recordFilter.operand,
            value: recordFilter.value,
            recordFilterGroupId: recordFilter.recordFilterGroupId,
            positionInRecordFilterGroup:
              recordFilter.positionInRecordFilterGroup,
          },
    );

  if (!isNonEmptyArray(conditionalDisplayRecordFilters)) {
    return null;
  }

  const conditionalDisplay: ConditionalDisplay = {
    recordFilters: conditionalDisplayRecordFilters,
    recordFilterGroups: remainingRecordFilterGroups,
  };

  if (isDefined(selectedRecordsMatch)) {
    conditionalDisplay.selectedRecordsMatch = selectedRecordsMatch;
  }

  return conditionalDisplay;
};
