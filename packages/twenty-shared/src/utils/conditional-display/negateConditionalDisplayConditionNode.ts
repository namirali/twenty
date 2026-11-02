import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';
import { RecordFilterGroupLogicalOperator } from '@/types/RecordFilterGroupLogicalOperator';
import { negateConditionalDisplayRecordFilter } from '@/utils/conditional-display/internal/negateConditionalDisplayRecordFilter';
import { isDefined } from '@/utils/validation/isDefined';

export const negateConditionalDisplayConditionNode = (
  conditionNode: ConditionalDisplayConditionNode,
): ConditionalDisplayConditionNode | undefined => {
  if (conditionNode.kind === 'recordFilter') {
    const recordFilter = negateConditionalDisplayRecordFilter(
      conditionNode.recordFilter,
    );

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
