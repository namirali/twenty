import { type ConditionalDisplayConditionNode } from './ConditionalDisplayConditionNode';

export type ConditionalDisplayRecordFilterGroupConditionNode = Extract<
  ConditionalDisplayConditionNode,
  { kind: 'recordFilterGroup' }
>;
