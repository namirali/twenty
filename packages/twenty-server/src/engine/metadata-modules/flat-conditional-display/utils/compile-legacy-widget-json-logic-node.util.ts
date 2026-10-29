import { isArray, isNonEmptyArray } from '@sniptt/guards';
import {
  type ConditionalDisplayConditionNode,
  RecordFilterGroupLogicalOperator,
} from 'twenty-shared/types';
import {
  groupConditionalDisplayConditionNodes,
  isDefined,
  negateConditionalDisplayConditionNode,
} from 'twenty-shared/utils';

import { type LegacyWidgetJsonLogicField } from 'src/engine/metadata-modules/flat-conditional-display/types/legacy-widget-json-logic-field.type';
import { buildLegacyWidgetJsonLogicConversionError } from 'src/engine/metadata-modules/flat-conditional-display/utils/build-legacy-widget-json-logic-conversion-error.util';
import { compileLegacyWidgetJsonLogicComparison } from 'src/engine/metadata-modules/flat-conditional-display/utils/compile-legacy-widget-json-logic-comparison.util';
import { getLegacyWidgetJsonLogicSingleEntry } from 'src/engine/metadata-modules/flat-conditional-display/utils/get-legacy-widget-json-logic-single-entry.util';

export const compileLegacyWidgetJsonLogicNode = ({
  node,
  jsonLogic,
  resolveField,
}: {
  node: unknown;
  jsonLogic: unknown;
  resolveField: (fieldName: string) => LegacyWidgetJsonLogicField | undefined;
}): ConditionalDisplayConditionNode => {
  const entry = getLegacyWidgetJsonLogicSingleEntry(node);

  if (!isDefined(entry)) {
    throw buildLegacyWidgetJsonLogicConversionError({
      jsonLogic,
      reason: `unsupported ${JSON.stringify(node)}`,
    });
  }

  const [operator, operands] = entry;

  if (operator === 'and' || operator === 'or') {
    if (!isNonEmptyArray(operands)) {
      throw buildLegacyWidgetJsonLogicConversionError({
        jsonLogic,
        reason: `unsupported ${JSON.stringify(node)}`,
      });
    }

    return groupConditionalDisplayConditionNodes({
      logicalOperator:
        operator === 'and'
          ? RecordFilterGroupLogicalOperator.AND
          : RecordFilterGroupLogicalOperator.OR,
      conditionNodes: operands.map((operand) =>
        compileLegacyWidgetJsonLogicNode({
          node: operand,
          jsonLogic,
          resolveField,
        }),
      ),
    });
  }

  if (operator === '!') {
    const negatedOperands = isArray(operands) ? operands : [operands];

    const negatedConditionNode =
      negatedOperands.length === 1
        ? negateConditionalDisplayConditionNode(
            compileLegacyWidgetJsonLogicNode({
              node: negatedOperands[0],
              jsonLogic,
              resolveField,
            }),
          )
        : undefined;

    if (!isDefined(negatedConditionNode)) {
      throw buildLegacyWidgetJsonLogicConversionError({
        jsonLogic,
        reason: `unsupported ${JSON.stringify(node)}`,
      });
    }

    return negatedConditionNode;
  }

  const conditionNode = compileLegacyWidgetJsonLogicComparison({
    operator,
    operands,
    jsonLogic,
    resolveField,
  });

  if (!isDefined(conditionNode)) {
    throw buildLegacyWidgetJsonLogicConversionError({
      jsonLogic,
      reason: `unsupported ${JSON.stringify(node)}`,
    });
  }

  return conditionNode;
};
