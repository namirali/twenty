import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';
import { type ConditionalDisplaySelectedRecordsMatch } from '@/types/conditional-display/ConditionalDisplaySelectedRecordsMatch';
import { RecordFilterGroupLogicalOperator } from '@/types/RecordFilterGroupLogicalOperator';
import { doesConditionalDisplayConditionNodeReferenceSelectedRecords } from '@/utils/conditional-display/internal/doesConditionalDisplayConditionNodeReferenceSelectedRecords';
import { isDefined } from '@/utils/validation/isDefined';

export const findConditionalDisplayGroupNotDistributingOverRecords = ({
  conditionNode,
  selectedRecordsMatch,
}: {
  conditionNode: ConditionalDisplayConditionNode;
  selectedRecordsMatch: ConditionalDisplaySelectedRecordsMatch;
}): RecordFilterGroupLogicalOperator | undefined => {
  if (conditionNode.kind === 'recordFilter') {
    return undefined;
  }

  const nonDistributingLogicalOperator =
    selectedRecordsMatch === 'SOME'
      ? RecordFilterGroupLogicalOperator.AND
      : RecordFilterGroupLogicalOperator.OR;

  if (
    conditionNode.logicalOperator === nonDistributingLogicalOperator &&
    conditionNode.children.filter(
      doesConditionalDisplayConditionNodeReferenceSelectedRecords,
    ).length > 1
  ) {
    return nonDistributingLogicalOperator;
  }

  return conditionNode.children
    .map((child) =>
      findConditionalDisplayGroupNotDistributingOverRecords({
        conditionNode: child,
        selectedRecordsMatch,
      }),
    )
    .find(isDefined);
};
