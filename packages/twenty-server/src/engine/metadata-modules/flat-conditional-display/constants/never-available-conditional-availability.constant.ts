import {
  type ConditionalDisplay,
  ViewFilterOperand,
} from 'twenty-shared/types';

export const NEVER_AVAILABLE_CONDITIONAL_AVAILABILITY: ConditionalDisplay = {
  recordFilters: [
    {
      id: '0',
      contextKey: 'numberOfSelectedRecords',
      operand: ViewFilterOperand.GREATER_THAN_OR_EQUAL,
      value: JSON.stringify(1),
    },
    {
      id: '1',
      contextKey: 'numberOfSelectedRecords',
      operand: ViewFilterOperand.LESS_THAN_OR_EQUAL,
      value: JSON.stringify(0),
    },
  ],
};
