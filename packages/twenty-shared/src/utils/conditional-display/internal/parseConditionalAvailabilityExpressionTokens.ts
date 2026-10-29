import { conditionalAvailabilityParser } from '@/utils/command-menu-items/conditionalAvailabilityParser';

export const parseConditionalAvailabilityExpressionTokens = (
  expression: string,
): unknown => {
  try {
    const parsedExpression = conditionalAvailabilityParser.parse(expression);

    return 'tokens' in parsedExpression ? parsedExpression.tokens : undefined;
  } catch (error) {
    throw new Error(
      `Cannot compile conditional availability expression "${expression}": unsupported syntax (${error instanceof Error ? error.message : String(error)})`,
    );
  }
};
