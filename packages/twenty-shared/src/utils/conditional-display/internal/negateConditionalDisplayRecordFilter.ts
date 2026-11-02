import { type ConditionalDisplayRecordFilterConditionNode } from '@/types/conditional-display/internal/ConditionalDisplayRecordFilterConditionNode';
import { FieldMetadataType } from '@/types/FieldMetadataType';
import { ViewFilterOperand } from '@/types/ViewFilterOperand';
import { getConditionalDisplayContextVirtualField } from '@/utils/conditional-display/getConditionalDisplayContextVirtualField';
import { negateConditionalDisplayBooleanRecordFilter } from '@/utils/conditional-display/internal/negateConditionalDisplayBooleanRecordFilter';
import { shiftConditionalDisplayCountBoundary } from '@/utils/conditional-display/internal/shiftConditionalDisplayCountBoundary';
import { isConditionalDisplayAdminContextKey } from '@/utils/conditional-display/isConditionalDisplayAdminContextKey';
import { isDefined } from '@/utils/validation/isDefined';

export const negateConditionalDisplayRecordFilter = (
  recordFilter: ConditionalDisplayRecordFilterConditionNode['recordFilter'],
): ConditionalDisplayRecordFilterConditionNode['recordFilter'] | undefined => {
  const { contextKey, subFieldName } = recordFilter;

  if (
    isDefined(contextKey) &&
    (contextKey === 'selectedRecords' ||
      isConditionalDisplayAdminContextKey(contextKey))
  ) {
    return undefined;
  }

  const virtualFieldType = isDefined(contextKey)
    ? getConditionalDisplayContextVirtualField({ contextKey, subFieldName })
        ?.type
    : undefined;

  if (virtualFieldType === FieldMetadataType.BOOLEAN) {
    return negateConditionalDisplayBooleanRecordFilter(recordFilter);
  }

  const isCountRecordFilter = virtualFieldType === FieldMetadataType.NUMBER;

  switch (recordFilter.operand) {
    case ViewFilterOperand.IS:
      return { ...recordFilter, operand: ViewFilterOperand.IS_NOT };
    case ViewFilterOperand.IS_NOT:
      return { ...recordFilter, operand: ViewFilterOperand.IS };
    case ViewFilterOperand.IS_EMPTY:
      return { ...recordFilter, operand: ViewFilterOperand.IS_NOT_EMPTY };
    case ViewFilterOperand.IS_NOT_EMPTY:
      return { ...recordFilter, operand: ViewFilterOperand.IS_EMPTY };
    case ViewFilterOperand.CONTAINS:
      return { ...recordFilter, operand: ViewFilterOperand.DOES_NOT_CONTAIN };
    case ViewFilterOperand.DOES_NOT_CONTAIN:
      return { ...recordFilter, operand: ViewFilterOperand.CONTAINS };
    case ViewFilterOperand.GREATER_THAN_OR_EQUAL: {
      const value = shiftConditionalDisplayCountBoundary({
        recordFilter,
        offset: -1,
      });

      if (!isCountRecordFilter || !isDefined(value)) {
        return undefined;
      }

      return {
        ...recordFilter,
        operand: ViewFilterOperand.LESS_THAN_OR_EQUAL,
        value,
      };
    }
    case ViewFilterOperand.LESS_THAN_OR_EQUAL: {
      const value = shiftConditionalDisplayCountBoundary({
        recordFilter,
        offset: 1,
      });

      if (!isCountRecordFilter || !isDefined(value)) {
        return undefined;
      }

      return {
        ...recordFilter,
        operand: ViewFilterOperand.GREATER_THAN_OR_EQUAL,
        value,
      };
    }
    default:
      return undefined;
  }
};
