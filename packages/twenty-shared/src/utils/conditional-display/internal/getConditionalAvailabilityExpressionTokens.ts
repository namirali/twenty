import { isArray } from '@sniptt/guards';

import { type ConditionalAvailabilityExpressionToken } from '@/types/conditional-display/internal/ConditionalAvailabilityExpressionToken';
import { buildConditionalAvailabilityCompilationError } from '@/utils/conditional-display/internal/buildConditionalAvailabilityCompilationError';
import { isConditionalAvailabilityExpressionToken } from '@/utils/conditional-display/internal/isConditionalAvailabilityExpressionToken';

export const getConditionalAvailabilityExpressionTokens = ({
  tokens,
  expression,
}: {
  tokens: unknown;
  expression: string;
}): ConditionalAvailabilityExpressionToken[] => {
  if (
    !isArray(tokens) ||
    !tokens.every(isConditionalAvailabilityExpressionToken)
  ) {
    throw buildConditionalAvailabilityCompilationError({
      expression,
      reason: 'unsupported parsed token list',
    });
  }

  return tokens;
};
