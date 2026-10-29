import { type ConditionalAvailabilityComparisonOperator } from '@/types/conditional-display/internal/ConditionalAvailabilityComparisonOperator';
import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';
import { type ConditionalDisplayContextKey } from '@/types/conditional-display/ConditionalDisplayContextKey';
import { ViewFilterOperand } from '@/types/ViewFilterOperand';
import { buildConditionalDisplayContextConditionNode } from '@/utils/conditional-display/internal/buildConditionalDisplayContextConditionNode';

export const compileConditionalAvailabilityCountComparison = ({
  contextKey,
  operator,
  count,
}: {
  contextKey: ConditionalDisplayContextKey;
  operator: ConditionalAvailabilityComparisonOperator;
  count: number;
}): ConditionalDisplayConditionNode | undefined => {
  const buildCountConditionNode = (
    operand: ViewFilterOperand,
    boundary: number,
  ) =>
    boundary < 0
      ? undefined
      : buildConditionalDisplayContextConditionNode({
          contextKey,
          operand,
          value: JSON.stringify(boundary),
        });

  switch (operator) {
    case '==':
      return buildCountConditionNode(ViewFilterOperand.IS, count);
    case '!=':
      return buildCountConditionNode(ViewFilterOperand.IS_NOT, count);
    case '>=':
      return buildCountConditionNode(
        ViewFilterOperand.GREATER_THAN_OR_EQUAL,
        count,
      );
    case '>':
      return buildCountConditionNode(
        ViewFilterOperand.GREATER_THAN_OR_EQUAL,
        count + 1,
      );
    case '<=':
      return buildCountConditionNode(
        ViewFilterOperand.LESS_THAN_OR_EQUAL,
        count,
      );
    case '<':
      return buildCountConditionNode(
        ViewFilterOperand.LESS_THAN_OR_EQUAL,
        count - 1,
      );
  }
};
