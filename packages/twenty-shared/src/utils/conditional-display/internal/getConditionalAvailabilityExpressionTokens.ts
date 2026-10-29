import { isArray } from '@sniptt/guards';

import { type ConditionalAvailabilityExpressionToken } from '@/types/conditional-display/ConditionalAvailabilityExpressionToken';
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
    throw new Error(
      `Cannot compile conditional availability expression "${expression}": unsupported parsed token list`,
    );
  }

  return tokens;
};
