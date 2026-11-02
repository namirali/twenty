import { type ConditionalDisplayDevice } from '@/types/conditional-display/ConditionalDisplayDevice';
import { type ConditionalDisplayRecordFilterConditionNode } from '@/types/conditional-display/internal/ConditionalDisplayRecordFilterConditionNode';
import { type ViewFilterOperand } from '@/types/ViewFilterOperand';
import { buildConditionalDisplayContextConditionNode } from '@/utils/conditional-display/internal/buildConditionalDisplayContextConditionNode';

export const buildDeviceConditionalDisplayConditionNode = ({
  device,
  operand,
}: {
  device: ConditionalDisplayDevice;
  operand: ViewFilterOperand;
}): ConditionalDisplayRecordFilterConditionNode =>
  buildConditionalDisplayContextConditionNode({
    contextKey: 'device',
    operand,
    value: JSON.stringify([device]),
  });
