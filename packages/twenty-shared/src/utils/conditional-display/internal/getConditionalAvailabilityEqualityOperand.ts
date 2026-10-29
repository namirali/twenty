import { type ConditionalAvailabilityComparisonOperator } from '@/types/conditional-display/ConditionalAvailabilityComparisonOperator';
import { ViewFilterOperand } from '@/types/ViewFilterOperand';

export const getConditionalAvailabilityEqualityOperand = (
  operator: ConditionalAvailabilityComparisonOperator,
): ViewFilterOperand | undefined => {
  switch (operator) {
    case '==':
      return ViewFilterOperand.IS;
    case '!=':
      return ViewFilterOperand.IS_NOT;
    default:
      return undefined;
  }
};
