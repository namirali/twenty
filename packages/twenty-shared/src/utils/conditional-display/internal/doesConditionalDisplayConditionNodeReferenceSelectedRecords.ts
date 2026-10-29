import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';

export const doesConditionalDisplayConditionNodeReferenceSelectedRecords = (
  conditionNode: ConditionalDisplayConditionNode,
): boolean =>
  conditionNode.kind === 'recordFilter'
    ? conditionNode.recordFilter.contextKey === 'selectedRecords'
    : conditionNode.children.some(
        doesConditionalDisplayConditionNodeReferenceSelectedRecords,
      );
