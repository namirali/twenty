import { type ConditionalAvailabilityExpressionNode } from '@/types/conditional-display/ConditionalAvailabilityExpressionNode';
import { buildConditionalAvailabilityCompilationError } from '@/utils/conditional-display/internal/buildConditionalAvailabilityCompilationError';
import { isConditionalAvailabilityComparisonOperator } from '@/utils/conditional-display/internal/isConditionalAvailabilityComparisonOperator';

export const toConditionalAvailabilityBinaryExpressionNode = ({
  operator,
  left,
  right,
  expression,
}: {
  operator: unknown;
  left: ConditionalAvailabilityExpressionNode;
  right: ConditionalAvailabilityExpressionNode;
  expression: string;
}): ConditionalAvailabilityExpressionNode => {
  if (operator === 'and' || operator === 'or') {
    return { kind: 'logicalOperation', operator, left, right };
  }

  if (isConditionalAvailabilityComparisonOperator(operator)) {
    return { kind: 'comparison', operator, left, right };
  }

  throw buildConditionalAvailabilityCompilationError({
    expression,
    reason: `unsupported operator "${String(operator)}"`,
  });
};
