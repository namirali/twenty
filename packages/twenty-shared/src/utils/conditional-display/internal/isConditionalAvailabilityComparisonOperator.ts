import { CONDITIONAL_AVAILABILITY_COMPARISON_OPERATORS } from '@/constants/ConditionalAvailabilityComparisonOperators';
import { type ConditionalAvailabilityComparisonOperator } from '@/types/conditional-display/ConditionalAvailabilityComparisonOperator';

export const isConditionalAvailabilityComparisonOperator = (
  value: unknown,
): value is ConditionalAvailabilityComparisonOperator =>
  CONDITIONAL_AVAILABILITY_COMPARISON_OPERATORS.some(
    (operator) => operator === value,
  );
