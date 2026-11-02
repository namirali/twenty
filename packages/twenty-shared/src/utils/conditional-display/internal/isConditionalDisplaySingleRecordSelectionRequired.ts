import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';
import { RecordFilterGroupLogicalOperator } from '@/types/RecordFilterGroupLogicalOperator';
import { ViewFilterOperand } from '@/types/ViewFilterOperand';

export const isConditionalDisplaySingleRecordSelectionRequired = (
  conditionNode: ConditionalDisplayConditionNode,
): boolean => {
  const conjuncts =
    conditionNode.kind === 'recordFilterGroup' &&
    conditionNode.logicalOperator === RecordFilterGroupLogicalOperator.AND
      ? conditionNode.children
      : [conditionNode];

  return conjuncts.some(
    (conjunct) =>
      conjunct.kind === 'recordFilter' &&
      conjunct.recordFilter.contextKey === 'numberOfSelectedRecords' &&
      conjunct.recordFilter.operand === ViewFilterOperand.IS &&
      conjunct.recordFilter.value === JSON.stringify(1),
  );
};
