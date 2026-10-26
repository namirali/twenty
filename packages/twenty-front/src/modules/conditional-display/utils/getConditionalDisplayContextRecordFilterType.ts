import { CONDITIONAL_DISPLAY_CONTEXT_KEYS } from 'twenty-shared/constants';
import {
  type ConditionalDisplayAdminContextKey,
  type FilterableAndTSVectorFieldType,
} from 'twenty-shared/types';
import { getFilterTypeFromFieldType } from 'twenty-shared/utils';

export const getConditionalDisplayContextRecordFilterType = (
  contextKey: ConditionalDisplayAdminContextKey,
): FilterableAndTSVectorFieldType =>
  getFilterTypeFromFieldType(
    CONDITIONAL_DISPLAY_CONTEXT_KEYS[contextKey].subject.field.type,
  );
