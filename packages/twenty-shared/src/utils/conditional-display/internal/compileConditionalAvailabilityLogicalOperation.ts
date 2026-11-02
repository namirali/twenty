import { type ConditionalAvailabilityCompiledItem } from '@/types/conditional-display/internal/ConditionalAvailabilityCompiledItem';
import { type ConditionalAvailabilityExpressionNode } from '@/types/conditional-display/ConditionalAvailabilityExpressionNode';
import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';
import { RecordFilterGroupLogicalOperator } from '@/types/RecordFilterGroupLogicalOperator';
import { groupConditionalDisplayConditionNodes } from '@/utils/conditional-display/groupConditionalDisplayConditionNodes';
import { toConditionalAvailabilityConditionNode } from '@/utils/conditional-display/internal/toConditionalAvailabilityConditionNode';

export const compileConditionalAvailabilityLogicalOperation = ({
  operator,
  left,
  right,
  expression,
}: {
  operator: Extract<
    ConditionalAvailabilityExpressionNode,
    { kind: 'logicalOperation' }
  >['operator'];
  left: ConditionalAvailabilityCompiledItem;
  right: ConditionalAvailabilityCompiledItem;
  expression: string;
}): ConditionalDisplayConditionNode =>
  groupConditionalDisplayConditionNodes({
    logicalOperator:
      operator === 'and'
        ? RecordFilterGroupLogicalOperator.AND
        : RecordFilterGroupLogicalOperator.OR,
    conditionNodes: [
      toConditionalAvailabilityConditionNode({
        compiledItem: left,
        expression,
      }),
      toConditionalAvailabilityConditionNode({
        compiledItem: right,
        expression,
      }),
    ],
  });
