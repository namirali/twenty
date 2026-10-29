import { type ConditionalDisplay } from '@/types/conditional-display/ConditionalDisplay';
import { ViewFilterOperand } from '@/types/ViewFilterOperand';
import { buildConditionalDisplayFromConditionNode } from '@/utils/conditional-display/buildConditionalDisplayFromConditionNode';

export const NEVER_AVAILABLE_CONDITIONAL_DISPLAY: ConditionalDisplay =
  buildConditionalDisplayFromConditionNode({
    conditionNode: {
      kind: 'recordFilter',
      recordFilter: {
        contextKey: 'selectedRecords',
        subFieldName: 'id',
        operand: ViewFilterOperand.IS_EMPTY,
      },
    },
    source: 'false',
  });
