import { type ConditionalDisplay } from '@/types/conditional-display/ConditionalDisplay';
import { ViewFilterOperand } from '@/types/ViewFilterOperand';

export const NEVER_AVAILABLE_CONDITIONAL_DISPLAY: ConditionalDisplay = {
  recordFilters: [
    {
      id: '0',
      contextKey: 'numberOfSelectedRecords',
      operand: ViewFilterOperand.LESS_THAN_OR_EQUAL,
      value: JSON.stringify(-1),
    },
  ],
};
