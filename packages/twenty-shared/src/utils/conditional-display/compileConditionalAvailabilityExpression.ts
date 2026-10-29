import { type ConditionalDisplay } from '@/types/conditional-display/ConditionalDisplay';
import { compileConditionalAvailabilityExpressionNode } from '@/utils/conditional-display/compileConditionalAvailabilityExpressionNode';
import { buildConditionalAvailabilityExpressionNodeFromTokens } from '@/utils/conditional-display/internal/buildConditionalAvailabilityExpressionNodeFromTokens';
import { getConditionalAvailabilityExpressionTokens } from '@/utils/conditional-display/internal/getConditionalAvailabilityExpressionTokens';
import { parseConditionalAvailabilityExpressionTokens } from '@/utils/conditional-display/internal/parseConditionalAvailabilityExpressionTokens';

export const compileConditionalAvailabilityExpression = (
  expression: string,
): ConditionalDisplay | null =>
  compileConditionalAvailabilityExpressionNode({
    expressionNode: buildConditionalAvailabilityExpressionNodeFromTokens({
      tokens: getConditionalAvailabilityExpressionTokens({
        tokens: parseConditionalAvailabilityExpressionTokens(expression),
        expression,
      }),
      expression,
    }),
    expression,
    source: expression,
  });
