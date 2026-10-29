import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';
import { type ConditionalDisplayRecordFilterConditionNode } from '@/types/conditional-display/ConditionalDisplayRecordFilterConditionNode';

export const isConditionalDisplayRecordFilterConditionNode = (
  conditionNode: ConditionalDisplayConditionNode,
): conditionNode is ConditionalDisplayRecordFilterConditionNode =>
  conditionNode.kind === 'recordFilter';
