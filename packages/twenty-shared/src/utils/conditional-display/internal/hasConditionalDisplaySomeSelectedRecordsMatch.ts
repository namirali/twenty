import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';
import { isConditionalDisplayRecordFilterConditionNode } from '@/utils/conditional-display/internal/isConditionalDisplayRecordFilterConditionNode';

export const hasConditionalDisplaySomeSelectedRecordsMatch = (
  conditionNode: ConditionalDisplayConditionNode,
): boolean =>
  isConditionalDisplayRecordFilterConditionNode(conditionNode)
    ? conditionNode.selectedRecordsMatch === 'SOME'
    : conditionNode.children.some(
        hasConditionalDisplaySomeSelectedRecordsMatch,
      );
