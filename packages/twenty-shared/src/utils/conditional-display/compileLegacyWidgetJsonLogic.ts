import { isArray, isNonEmptyArray } from '@sniptt/guards';

import { LEGACY_WIDGET_JSON_LOGIC_SELECTED_RECORD_FIELD_VARIABLE_PATTERN } from '@/constants/LegacyWidgetJsonLogicSelectedRecordFieldVariablePattern';
import { type ConditionalDisplay } from '@/types/conditional-display/ConditionalDisplay';
import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';
import { type LegacyWidgetJsonLogicField } from '@/types/conditional-display/LegacyWidgetJsonLogicField';
import { RecordFilterGroupLogicalOperator } from '@/types/RecordFilterGroupLogicalOperator';
import { buildConditionalDisplayFromConditionNode } from '@/utils/conditional-display/buildConditionalDisplayFromConditionNode';
import { groupConditionalDisplayConditionNodes } from '@/utils/conditional-display/groupConditionalDisplayConditionNodes';
import { compileLegacyWidgetJsonLogicDeviceEquality } from '@/utils/conditional-display/internal/compileLegacyWidgetJsonLogicDeviceEquality';
import { compileLegacyWidgetJsonLogicFieldEquality } from '@/utils/conditional-display/internal/compileLegacyWidgetJsonLogicFieldEquality';
import { compileLegacyWidgetJsonLogicFieldInclusion } from '@/utils/conditional-display/internal/compileLegacyWidgetJsonLogicFieldInclusion';
import { getLegacyWidgetJsonLogicEqualityOperand } from '@/utils/conditional-display/internal/getLegacyWidgetJsonLogicEqualityOperand';
import { getLegacyWidgetJsonLogicSingleEntry } from '@/utils/conditional-display/internal/getLegacyWidgetJsonLogicSingleEntry';
import { getLegacyWidgetJsonLogicVariableName } from '@/utils/conditional-display/internal/getLegacyWidgetJsonLogicVariableName';
import { isLegacyWidgetJsonLogicLiteral } from '@/utils/conditional-display/internal/isLegacyWidgetJsonLogicLiteral';
import { negateConditionalDisplayConditionNode } from '@/utils/conditional-display/negateConditionalDisplayConditionNode';
import { isDefined } from '@/utils/validation/isDefined';

export const compileLegacyWidgetJsonLogic = ({
  jsonLogic,
  resolveField,
}: {
  jsonLogic: unknown;
  resolveField: (fieldName: string) => LegacyWidgetJsonLogicField | undefined;
}): ConditionalDisplay => {
  const buildConversionError = (reason: string) =>
    new Error(
      `Cannot convert legacy widget json-logic ${JSON.stringify(jsonLogic)}: ${reason}`,
    );

  const resolveSelectedRecordField = (
    variableName: string,
  ): LegacyWidgetJsonLogicField | undefined => {
    const fieldName =
      LEGACY_WIDGET_JSON_LOGIC_SELECTED_RECORD_FIELD_VARIABLE_PATTERN.exec(
        variableName,
      )?.[1];

    if (!isDefined(fieldName)) {
      return undefined;
    }

    const field = resolveField(fieldName);

    if (!isDefined(field)) {
      throw buildConversionError(`unknown field "${fieldName}"`);
    }

    return field;
  };

  const compileComparison = ({
    operator,
    operands,
  }: {
    operator: string;
    operands: unknown;
  }): ConditionalDisplayConditionNode | undefined => {
    if (!isArray(operands) || operands.length !== 2) {
      return undefined;
    }

    const [firstOperand, secondOperand] = operands;

    if (operator === 'in') {
      const variableName = getLegacyWidgetJsonLogicVariableName(secondOperand);
      const field = isDefined(variableName)
        ? resolveSelectedRecordField(variableName)
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

    const field = resolveSelectedRecordField(variableName);

    return isDefined(field)
      ? compileLegacyWidgetJsonLogicFieldEquality({
          field,
          operand,
          literal: secondOperand,
        })
      : undefined;
  };

  const compileNode = (node: unknown): ConditionalDisplayConditionNode => {
    const entry = getLegacyWidgetJsonLogicSingleEntry(node);

    if (!isDefined(entry)) {
      throw buildConversionError(`unsupported ${JSON.stringify(node)}`);
    }

    const [operator, operands] = entry;

    if (operator === 'and' || operator === 'or') {
      if (!isNonEmptyArray(operands)) {
        throw buildConversionError(`unsupported ${JSON.stringify(node)}`);
      }

      return groupConditionalDisplayConditionNodes({
        logicalOperator:
          operator === 'and'
            ? RecordFilterGroupLogicalOperator.AND
            : RecordFilterGroupLogicalOperator.OR,
        conditionNodes: operands.map(compileNode),
      });
    }

    if (operator === '!') {
      const negatedOperands = isArray(operands) ? operands : [operands];

      const negatedConditionNode =
        negatedOperands.length === 1
          ? negateConditionalDisplayConditionNode(
              compileNode(negatedOperands[0]),
            )
          : undefined;

      if (!isDefined(negatedConditionNode)) {
        throw buildConversionError(`unsupported ${JSON.stringify(node)}`);
      }

      return negatedConditionNode;
    }

    const conditionNode = compileComparison({ operator, operands });

    if (!isDefined(conditionNode)) {
      throw buildConversionError(`unsupported ${JSON.stringify(node)}`);
    }

    return conditionNode;
  };

  return buildConditionalDisplayFromConditionNode({
    conditionNode: compileNode(jsonLogic),
    source: JSON.stringify(jsonLogic),
  });
};
