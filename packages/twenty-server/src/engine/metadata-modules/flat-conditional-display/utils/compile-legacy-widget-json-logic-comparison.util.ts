import { isArray } from '@sniptt/guards';
import { type ConditionalDisplayConditionNode } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { type LegacyWidgetJsonLogicField } from 'src/engine/metadata-modules/flat-conditional-display/types/legacy-widget-json-logic-field.type';
import { compileLegacyWidgetJsonLogicDeviceEquality } from 'src/engine/metadata-modules/flat-conditional-display/utils/compile-legacy-widget-json-logic-device-equality.util';
import { compileLegacyWidgetJsonLogicFieldEquality } from 'src/engine/metadata-modules/flat-conditional-display/utils/compile-legacy-widget-json-logic-field-equality.util';
import { compileLegacyWidgetJsonLogicFieldInclusion } from 'src/engine/metadata-modules/flat-conditional-display/utils/compile-legacy-widget-json-logic-field-inclusion.util';
import { getLegacyWidgetJsonLogicEqualityOperand } from 'src/engine/metadata-modules/flat-conditional-display/utils/get-legacy-widget-json-logic-equality-operand.util';
import { getLegacyWidgetJsonLogicVariableName } from 'src/engine/metadata-modules/flat-conditional-display/utils/get-legacy-widget-json-logic-variable-name.util';
import { isLegacyWidgetJsonLogicLiteral } from 'src/engine/metadata-modules/flat-conditional-display/utils/is-legacy-widget-json-logic-literal.util';
import { resolveLegacyWidgetJsonLogicSelectedRecordField } from 'src/engine/metadata-modules/flat-conditional-display/utils/resolve-legacy-widget-json-logic-selected-record-field.util';

export const compileLegacyWidgetJsonLogicComparison = ({
  operator,
  operands,
  jsonLogic,
  resolveField,
}: {
  operator: string;
  operands: unknown;
  jsonLogic: unknown;
  resolveField: (fieldName: string) => LegacyWidgetJsonLogicField | undefined;
}): ConditionalDisplayConditionNode | undefined => {
  if (!isArray(operands) || operands.length !== 2) {
    return undefined;
  }

  const [firstOperand, secondOperand] = operands;

  if (operator === 'in') {
    const variableName = getLegacyWidgetJsonLogicVariableName(secondOperand);
    const field = isDefined(variableName)
      ? resolveLegacyWidgetJsonLogicSelectedRecordField({
          variableName,
          jsonLogic,
          resolveField,
        })
      : undefined;

    return isDefined(field) && isLegacyWidgetJsonLogicLiteral(firstOperand)
      ? compileLegacyWidgetJsonLogicFieldInclusion({
          field,
          literal: firstOperand,
        })
      : undefined;
  }

  const operand = getLegacyWidgetJsonLogicEqualityOperand(operator);
  const variableName = getLegacyWidgetJsonLogicVariableName(firstOperand);

  if (
    !isDefined(operand) ||
    !isDefined(variableName) ||
    !isLegacyWidgetJsonLogicLiteral(secondOperand)
  ) {
    return undefined;
  }

  if (variableName === 'device') {
    return compileLegacyWidgetJsonLogicDeviceEquality({
      operand,
      literal: secondOperand,
    });
  }

  const field = resolveLegacyWidgetJsonLogicSelectedRecordField({
    variableName,
    jsonLogic,
    resolveField,
  });

  return isDefined(field)
    ? compileLegacyWidgetJsonLogicFieldEquality({
        field,
        operand,
        literal: secondOperand,
      })
    : undefined;
};
