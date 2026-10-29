import { CONDITIONAL_DISPLAY_DEVICES } from 'twenty-shared/constants';
import {
  type ConditionalDisplay,
  ViewFilterOperand,
} from 'twenty-shared/types';
import {
  buildConditionalDisplayFromConditionNode,
  buildDeviceConditionalDisplay,
  buildDeviceConditionalDisplayConditionNode,
  fastDeepEqual,
  isDefined,
} from 'twenty-shared/utils';

import { type LegacyWidgetJsonLogicField } from 'src/engine/metadata-modules/flat-conditional-display/types/legacy-widget-json-logic-field.type';
import { compileLegacyWidgetJsonLogicNode } from 'src/engine/metadata-modules/flat-conditional-display/utils/compile-legacy-widget-json-logic-node.util';

export const compileLegacyWidgetJsonLogic = ({
  jsonLogic,
  resolveField,
}: {
  jsonLogic: unknown;
  resolveField: (fieldName: string) => LegacyWidgetJsonLogicField | undefined;
}): ConditionalDisplay => {
  const conditionNode = compileLegacyWidgetJsonLogicNode({
    node: jsonLogic,
    jsonLogic,
    resolveField,
  });

  const device = CONDITIONAL_DISPLAY_DEVICES.find((conditionalDisplayDevice) =>
    fastDeepEqual(
      conditionNode,
      buildDeviceConditionalDisplayConditionNode({
        device: conditionalDisplayDevice,
        operand: ViewFilterOperand.IS,
      }),
    ),
  );

  return isDefined(device)
    ? buildDeviceConditionalDisplay(device)
    : buildConditionalDisplayFromConditionNode({
        conditionNode,
        source: JSON.stringify(jsonLogic),
      });
};
