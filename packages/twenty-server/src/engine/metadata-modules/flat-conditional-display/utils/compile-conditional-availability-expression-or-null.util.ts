import { type ConditionalDisplay } from 'twenty-shared/types';
import {
  compileConditionalAvailabilityExpression,
  isDefined,
} from 'twenty-shared/utils';

export const compileConditionalAvailabilityExpressionOrNull = (
  conditionalAvailabilityExpression: string | null | undefined,
): ConditionalDisplay | null => {
  if (!isDefined(conditionalAvailabilityExpression)) {
    return null;
  }

  return compileConditionalAvailabilityExpression(
    conditionalAvailabilityExpression,
  );
};
