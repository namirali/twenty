import { type ConditionalDisplay } from '@/types/conditional-display/ConditionalDisplay';
import { type ConditionalDisplayDevice } from '@/types/conditional-display/ConditionalDisplayDevice';
import { ViewFilterOperand } from '@/types/ViewFilterOperand';
import { buildConditionalDisplayFromConditionNode } from '@/utils/conditional-display/buildConditionalDisplayFromConditionNode';

export const buildDeviceConditionalDisplay = (
  device: ConditionalDisplayDevice,
): ConditionalDisplay =>
  buildConditionalDisplayFromConditionNode({
    conditionNode: {
      kind: 'recordFilter',
      recordFilter: {
        contextKey: 'device',
        operand: ViewFilterOperand.IS,
        value: JSON.stringify([device]),
      },
    },
    source: `device:${device}`,
  });
