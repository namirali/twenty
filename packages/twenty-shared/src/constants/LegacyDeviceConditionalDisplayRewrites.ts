import { type ConditionalDisplay } from '@/types/conditional-display/ConditionalDisplay';
import { type ConditionalDisplayDevice } from '@/types/conditional-display/ConditionalDisplayDevice';
import { ViewFilterOperand } from '@/types/ViewFilterOperand';

export const LEGACY_DEVICE_CONDITIONAL_DISPLAY_REWRITES: {
  legacyConditionalDisplay: Record<string, unknown>;
  conditionalDisplay: ConditionalDisplay;
}[] = (['MOBILE', 'DESKTOP'] satisfies ConditionalDisplayDevice[]).map(
  (device) => ({
    legacyConditionalDisplay: {
      and: [{ '===': [{ var: 'device' }, device] }],
    },
    conditionalDisplay: {
      recordFilters: [
        {
          id: '0',
          contextKey: 'device',
          operand: ViewFilterOperand.IS,
          value: JSON.stringify([device]),
        },
      ],
    },
  }),
);
