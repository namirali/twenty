import {
  isArray,
  isBoolean,
  isNonEmptyArray,
  isNonEmptyString,
  isNumber,
  isString,
} from '@sniptt/guards';
import {
  type ConditionalDisplay,
  type ConditionalDisplayConditionNode,
  FieldMetadataType,
  RecordFilterGroupLogicalOperator,
  ViewFilterOperand,
} from 'twenty-shared/types';
import {
  buildConditionalDisplayFromConditionNode,
  groupConditionalDisplayConditionNodes,
  isDefined,
  isPlainObject,
  negateConditionalDisplayConditionNode,
} from 'twenty-shared/utils';

import { rewriteLegacyDeviceConditionalDisplay } from 'src/engine/metadata-modules/flat-conditional-display/utils/rewrite-legacy-device-conditional-display.util';

type LegacyWidgetJsonLogicField = {
  fieldMetadataId: string;
  type: FieldMetadataType;
};

type JsonLogicLiteral = string | number | boolean;

const SELECTED_RECORD_FIELD_VARIABLE_PATTERN =
  /^selectedRecords\.0\.([a-zA-Z_][a-zA-Z0-9_]*)$/;

const getSingleEntry = (node: unknown): [string, unknown] | undefined => {
  if (!isPlainObject(node)) {
    return undefined;
  }

  const [entry, ...otherEntries] = Object.entries(node);

  return otherEntries.length === 0 ? entry : undefined;
};

const getVariableName = (operand: unknown): string | undefined => {
  const entry = getSingleEntry(operand);

  return entry?.[0] === 'var' && isNonEmptyString(entry[1])
    ? entry[1]
    : undefined;
};

const isJsonLogicLiteral = (value: unknown): value is JsonLogicLiteral =>
  isString(value) || isNumber(value) || isBoolean(value);

const getEqualityOperand = (
  operator: string,
): ViewFilterOperand | undefined => {
  switch (operator) {
    case '==':
    case '===':
      return ViewFilterOperand.IS;
    case '!=':
    case '!==':
      return ViewFilterOperand.IS_NOT;
    default:
      return undefined;
  }
};

const compileDeviceEquality = (
  device: JsonLogicLiteral,
): ConditionalDisplayConditionNode | undefined => {
  const rewrittenConditionalDisplay = rewriteLegacyDeviceConditionalDisplay({
    and: [{ '===': [{ var: 'device' }, device] }],
  });

  if (!('recordFilters' in rewrittenConditionalDisplay)) {
    return undefined;
  }

  const [deviceRecordFilter] = rewrittenConditionalDisplay.recordFilters ?? [];

  if (!isDefined(deviceRecordFilter)) {
    return undefined;
  }

  return {
    kind: 'recordFilter',
    recordFilter: {
      contextKey: deviceRecordFilter.contextKey,
      operand: deviceRecordFilter.operand,
      value: deviceRecordFilter.value,
    },
  };
};

const compileSelectedRecordFieldEquality = ({
  field,
  operand,
  literal,
}: {
  field: LegacyWidgetJsonLogicField;
  operand: ViewFilterOperand;
  literal: JsonLogicLiteral;
}): ConditionalDisplayConditionNode | undefined => {
  if (field.type !== FieldMetadataType.SELECT || !isString(literal)) {
    return undefined;
  }

  return {
    kind: 'recordFilter',
    recordFilter: {
      fieldMetadataId: field.fieldMetadataId,
      operand,
      value: JSON.stringify([literal]),
    },
  };
};

const compileSelectedRecordFieldInclusion = ({
  field,
  literal,
}: {
  field: LegacyWidgetJsonLogicField;
  literal: JsonLogicLiteral;
}): ConditionalDisplayConditionNode | undefined => {
  if (!isString(literal)) {
    return undefined;
  }

  switch (field.type) {
    case FieldMetadataType.MULTI_SELECT:
      return {
        kind: 'recordFilter',
        recordFilter: {
          fieldMetadataId: field.fieldMetadataId,
          operand: ViewFilterOperand.CONTAINS,
          value: JSON.stringify([literal]),
        },
      };
    case FieldMetadataType.SELECT:
      return {
        kind: 'recordFilter',
        recordFilter: {
          fieldMetadataId: field.fieldMetadataId,
          operand: ViewFilterOperand.IS,
          value: JSON.stringify([literal]),
        },
      };
    case FieldMetadataType.TEXT:
      return {
        kind: 'recordFilter',
        recordFilter: {
          fieldMetadataId: field.fieldMetadataId,
          operand: ViewFilterOperand.CONTAINS,
          value: literal,
        },
      };
    default:
      return undefined;
  }
};

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
      SELECTED_RECORD_FIELD_VARIABLE_PATTERN.exec(variableName)?.[1];

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
      const variableName = getVariableName(secondOperand);
      const field = isDefined(variableName)
        ? resolveSelectedRecordField(variableName)
        : undefined;

      return isDefined(field) && isJsonLogicLiteral(firstOperand)
        ? compileSelectedRecordFieldInclusion({ field, literal: firstOperand })
        : undefined;
    }

    const operand = getEqualityOperand(operator);
    const variableName = getVariableName(firstOperand);

    if (
      !isDefined(operand) ||
      !isDefined(variableName) ||
      !isJsonLogicLiteral(secondOperand)
    ) {
      return undefined;
    }

    if (variableName === 'device') {
      return operand === ViewFilterOperand.IS
        ? compileDeviceEquality(secondOperand)
        : undefined;
    }

    const field = resolveSelectedRecordField(variableName);

    return isDefined(field)
      ? compileSelectedRecordFieldEquality({
          field,
          operand,
          literal: secondOperand,
        })
      : undefined;
  };

  const compileNode = (node: unknown): ConditionalDisplayConditionNode => {
    const entry = getSingleEntry(node);

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
