import { isNumber } from '@sniptt/guards';

import { CONDITIONAL_DISPLAY_CONTEXT_KEYS } from '@/constants/ConditionalDisplayContextKeys';
import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';
import { RecordFilterGroupLogicalOperator } from '@/types/RecordFilterGroupLogicalOperator';
import { ViewFilterOperand } from '@/types/ViewFilterOperand';
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
  if (
    !isDefined(recordFilter.contextKey) ||
    CONDITIONAL_DISPLAY_CONTEXT_KEYS[recordFilter.contextKey].valueKind !==
      'NUMBER'
  ) {
    return undefined;
  }

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

const negateRecordFilter = (
  recordFilter: ConditionalDisplayConditionNodeRecordFilter,
): ConditionalDisplayConditionNodeRecordFilter | undefined => {
  if (
    isDefined(recordFilter.contextKey) &&
    (recordFilter.contextKey === 'selectedRecords' ||
      CONDITIONAL_DISPLAY_CONTEXT_KEYS[recordFilter.contextKey].owner ===
        'admin')
  ) {
    return undefined;
  }

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

      if (!isDefined(value)) {
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

      if (!isDefined(value)) {
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
