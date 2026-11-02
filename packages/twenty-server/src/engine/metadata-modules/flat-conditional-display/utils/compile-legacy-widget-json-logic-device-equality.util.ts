import { CONDITIONAL_DISPLAY_DEVICES } from 'twenty-shared/constants';
import {
  type ConditionalDisplayConditionNode,
  type ViewFilterOperand,
} from 'twenty-shared/types';
import {
  buildDeviceConditionalDisplayConditionNode,
  isDefined,
} from 'twenty-shared/utils';

import { type LegacyWidgetJsonLogicLiteral } from 'src/engine/metadata-modules/flat-conditional-display/types/legacy-widget-json-logic-literal.type';

export const compileLegacyWidgetJsonLogicDeviceEquality = ({
  operand,
  literal,
}: {
  operand: ViewFilterOperand;
  literal: LegacyWidgetJsonLogicLiteral;
}): ConditionalDisplayConditionNode | undefined => {
  const device = CONDITIONAL_DISPLAY_DEVICES.find(
    (conditionalDisplayDevice) => conditionalDisplayDevice === literal,
  );

  return isDefined(device)
    ? buildDeviceConditionalDisplayConditionNode({ device, operand })
    : undefined;
};
