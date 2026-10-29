import { type ConditionalDisplayRecordFilterGroupConditionNode } from '@/types/conditional-display/internal/ConditionalDisplayRecordFilterGroupConditionNode';
import { RecordFilterGroupLogicalOperator } from '@/types/RecordFilterGroupLogicalOperator';
import { isConditionalDisplayRecordFilterConditionNode } from '@/utils/conditional-display/internal/isConditionalDisplayRecordFilterConditionNode';

export const isConditionalDisplayConjunctionOfRecordFilters = (
  recordFilterGroupConditionNode: ConditionalDisplayRecordFilterGroupConditionNode,
): boolean =>
  recordFilterGroupConditionNode.logicalOperator ===
    RecordFilterGroupLogicalOperator.AND &&
  recordFilterGroupConditionNode.children.every(
    isConditionalDisplayRecordFilterConditionNode,
  );
