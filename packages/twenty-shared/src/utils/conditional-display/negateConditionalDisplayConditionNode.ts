import { isNumber } from '@sniptt/guards';

import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';
import { FieldMetadataType } from '@/types/FieldMetadataType';
import { RecordFilterGroupLogicalOperator } from '@/types/RecordFilterGroupLogicalOperator';
import { ViewFilterOperand } from '@/types/ViewFilterOperand';
import { getConditionalDisplayContextVirtualField } from '@/utils/conditional-display/getConditionalDisplayContextVirtualField';
import { isConditionalDisplayAdminContextKey } from '@/utils/conditional-display/isConditionalDisplayAdminContextKey';
import { booleanFilterValueSchema } from '@/utils/filter/utils/validation-schemas/filterValueScalarSchemas';
import { parseJson } from '@/utils/parseJson';
import { isDefined } from '@/utils/validation/isDefined';

type ConditionalDisplayConditionNodeRecordFilter = Extract<
  ConditionalDisplayConditionNode,
  { kind: 'recordFilter' }
>['recordFilter'];

const shiftCountBoundary = ({
  recordFilter,
  offset,
}: {
  recordFilter: ConditionalDisplayConditionNodeRecordFilter;
  offset: number;
}): string | undefined => {
  const boundary = parseJson<unknown>(recordFilter.value);

  if (
    !isNumber(boundary) ||
    !Number.isInteger(boundary) ||
    boundary + offset < 0
  ) {
    return undefined;
  }

  return JSON.stringify(boundary + offset);
};

const negateBooleanRecordFilter = (
  recordFilter: ConditionalDisplayConditionNodeRecordFilter,
): ConditionalDisplayConditionNodeRecordFilter | undefined => {
  const booleanValue = booleanFilterValueSchema.safeParse(recordFilter.value);

  if (recordFilter.operand !== ViewFilterOperand.IS || !booleanValue.success) {
    return undefined;
  }

  return { ...recordFilter, value: JSON.stringify(!booleanValue.data) };
};

const negateRecordFilter = (
  recordFilter: ConditionalDisplayConditionNodeRecordFilter,
): ConditionalDisplayConditionNodeRecordFilter | undefined => {
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
    return negateBooleanRecordFilter(recordFilter);
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
      const value = shiftCountBoundary({ recordFilter, offset: -1 });

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
      const value = shiftCountBoundary({ recordFilter, offset: 1 });

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

export const negateConditionalDisplayConditionNode = (
  conditionNode: ConditionalDisplayConditionNode,
): ConditionalDisplayConditionNode | undefined => {
  if (conditionNode.kind === 'recordFilter') {
    const recordFilter = negateRecordFilter(conditionNode.recordFilter);

    if (!isDefined(recordFilter)) {
      return undefined;
    }

    return { ...conditionNode, recordFilter };
  }

  const children = conditionNode.children.map(
    negateConditionalDisplayConditionNode,
  );

  if (!children.every(isDefined)) {
    return undefined;
  }

  return {
    kind: 'recordFilterGroup',
    logicalOperator:
      conditionNode.logicalOperator === RecordFilterGroupLogicalOperator.AND
        ? RecordFilterGroupLogicalOperator.OR
        : RecordFilterGroupLogicalOperator.AND,
    children,
  };
};
