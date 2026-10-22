import { type PersistedRecordFilter } from '@/object-record/record-filter/types/PersistedRecordFilter';
import { isValidSubFieldName } from '@/settings/data-model/utils/isValidSubFieldName';
import { isNonEmptyString } from '@sniptt/guards';
import { doNotTranslate } from 'twenty-shared/i18n';
import { type ConditionalDisplay } from 'twenty-shared/types';
import {
  isConditionalDisplayAdminContextKey,
  isDefined,
} from 'twenty-shared/utils';

export const mapConditionalDisplayToPersistedRecordFilters = (
  conditionalDisplay: ConditionalDisplay | null | undefined,
): PersistedRecordFilter[] =>
  (conditionalDisplay?.recordFilters ?? []).map((recordFilter) => {
    const { contextKey } = recordFilter;

    if (
      isDefined(contextKey) &&
      !isConditionalDisplayAdminContextKey(contextKey)
    ) {
      throw new Error(
        doNotTranslate(
          `Context key "${contextKey}" is not an admin key and cannot be edited`,
        ),
      );
    }

    return {
      id: recordFilter.id,
      fieldMetadataId: recordFilter.fieldMetadataId ?? '',
      contextKey,
      operand: recordFilter.operand,
      value: recordFilter.value ?? '',
      recordFilterGroupId: recordFilter.recordFilterGroupId ?? undefined,
      positionInRecordFilterGroup: recordFilter.positionInRecordFilterGroup,
      subFieldName:
        isNonEmptyString(recordFilter.subFieldName) &&
        isValidSubFieldName(recordFilter.subFieldName)
          ? recordFilter.subFieldName
          : null,
      relationTargetFieldMetadataId: recordFilter.relationTargetFieldMetadataId,
    };
  });
