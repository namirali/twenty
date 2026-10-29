import { CONDITIONAL_DISPLAY_DEVICES } from '@/constants/ConditionalDisplayDevices';
import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';
import { type LegacyWidgetJsonLogicLiteral } from '@/types/conditional-display/LegacyWidgetJsonLogicLiteral';
import { type ViewFilterOperand } from '@/types/ViewFilterOperand';
import { buildConditionalDisplayContextConditionNode } from '@/utils/conditional-display/internal/buildConditionalDisplayContextConditionNode';

export const compileLegacyWidgetJsonLogicDeviceEquality = ({
  operand,
  literal,
}: {
  operand: ViewFilterOperand;
  literal: LegacyWidgetJsonLogicLiteral;
}): ConditionalDisplayConditionNode | undefined =>
  CONDITIONAL_DISPLAY_DEVICES.some((device) => device === literal)
    ? buildConditionalDisplayContextConditionNode({
        contextKey: 'device',
        operand,
        value: JSON.stringify([literal]),
      })
    : undefined;
