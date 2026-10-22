import { msg, t } from '@lingui/core/macro';
import {
  isBoolean,
  isNonEmptyString,
  isNumber,
  isString,
} from '@sniptt/guards';
import { CONDITIONAL_DISPLAY_CONTEXT_KEYS } from 'twenty-shared/constants';
import {
  type ConditionalDisplayContextKey,
  ViewFilterOperand,
} from 'twenty-shared/types';
import {
  isDefined,
  isEmptinessOperand,
  isNonEmptyArray,
  parseJson,
} from 'twenty-shared/utils';

import { type FlatEntityValidationError } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-builder/builders/types/failed-flat-entity-validation.type';

type ConditionalDisplayContextValueKind =
  (typeof CONDITIONAL_DISPLAY_CONTEXT_KEYS)[ConditionalDisplayContextKey]['valueKind'];

type EngineConditionalDisplayContextValueKind = Exclude<
  ConditionalDisplayContextValueKind,
  'ROLE_IDS' | 'WORKSPACE_MEMBER' | 'DEVICE'
>;

const SUB_FIELD_NAME_IDENTIFIER_PATTERN = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

const SUB_FIELD_NAME_PATH_PATTERN =
  /^[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)*$/;

const getContextLeafOperands = (
  valueKind: ConditionalDisplayContextValueKind,
): ViewFilterOperand[] => {
  switch (valueKind) {
    case 'ROLE_IDS':
    case 'WORKSPACE_MEMBER':
    case 'DEVICE':
      return [ViewFilterOperand.IS];
    case 'BOOLEAN':
    case 'PAGE_TYPE':
      return [ViewFilterOperand.IS, ViewFilterOperand.IS_NOT];
    case 'NUMBER':
      return [
        ViewFilterOperand.IS,
        ViewFilterOperand.IS_NOT,
        ViewFilterOperand.GREATER_THAN_OR_EQUAL,
        ViewFilterOperand.LESS_THAN_OR_EQUAL,
      ];
    case 'MAP_ENTRY':
    case 'RECORD_PATH':
      return [
        ViewFilterOperand.IS,
        ViewFilterOperand.IS_NOT,
        ViewFilterOperand.IS_EMPTY,
        ViewFilterOperand.IS_NOT_EMPTY,
        ViewFilterOperand.CONTAINS,
        ViewFilterOperand.DOES_NOT_CONTAIN,
        ViewFilterOperand.GREATER_THAN_OR_EQUAL,
        ViewFilterOperand.LESS_THAN_OR_EQUAL,
      ];
  }
};

const validateContextLeafSubFieldName = ({
  subFieldName,
  contextKey,
  valueKind,
  invalidDataCode,
}: {
  subFieldName: string | null | undefined;
  contextKey: ConditionalDisplayContextKey;
  valueKind: ConditionalDisplayContextValueKind;
  invalidDataCode: string;
}): FlatEntityValidationError[] => {
  const missingSubFieldNameError: FlatEntityValidationError = {
    code: invalidDataCode,
    message: t`Conditional display context key "${contextKey}" requires a sub field name`,
    userFriendlyMessage: msg`Conditional display rule is missing a sub field`,
    value: contextKey,
  };

  switch (valueKind) {
    case 'MAP_ENTRY': {
      if (!isDefined(subFieldName)) {
        return [missingSubFieldNameError];
      }

      if (SUB_FIELD_NAME_IDENTIFIER_PATTERN.test(subFieldName)) {
        return [];
      }

      return [
        {
          code: invalidDataCode,
          message: t`Sub field name "${subFieldName}" of conditional display context key "${contextKey}" must be an identifier`,
          userFriendlyMessage: msg`Conditional display rule sub field is not valid`,
          value: subFieldName,
        },
      ];
    }
    case 'RECORD_PATH': {
      if (!isDefined(subFieldName)) {
        return [missingSubFieldNameError];
      }

      if (SUB_FIELD_NAME_PATH_PATTERN.test(subFieldName)) {
        return [];
      }

      return [
        {
          code: invalidDataCode,
          message: t`Sub field name "${subFieldName}" of conditional display context key "${contextKey}" must be a dotted path of identifiers`,
          userFriendlyMessage: msg`Conditional display rule sub field is not valid`,
          value: subFieldName,
        },
      ];
    }
    case 'ROLE_IDS':
    case 'WORKSPACE_MEMBER':
    case 'DEVICE':
    case 'BOOLEAN':
    case 'NUMBER':
    case 'PAGE_TYPE': {
      if (!isDefined(subFieldName)) {
        return [];
      }

      return [
        {
          code: invalidDataCode,
          message: t`Conditional display context key "${contextKey}" does not accept a sub field name`,
          userFriendlyMessage: msg`Conditional display rule sub field is not supported`,
          value: subFieldName,
        },
      ];
    }
  }
};

const validateEngineContextLeafValue = ({
  operand,
  rawValue,
  contextKey,
  valueKind,
  invalidDataCode,
}: {
  operand: ViewFilterOperand;
  rawValue: string | null | undefined;
  contextKey: ConditionalDisplayContextKey;
  valueKind: EngineConditionalDisplayContextValueKind;
  invalidDataCode: string;
}): FlatEntityValidationError[] => {
  if (isEmptinessOperand(operand)) {
    if (!isNonEmptyString(rawValue)) {
      return [];
    }

    return [
      {
        code: invalidDataCode,
        message: t`Value "${rawValue}" of conditional display context key "${contextKey}" must be empty for operand "${operand}"`,
        userFriendlyMessage: msg`Conditional display rule value must be empty for this operand`,
        value: rawValue,
      },
    ];
  }

  const value = rawValue ?? '';

  const literalValue = parseJson<unknown>(value);

  if (
    !isString(literalValue) &&
    !isNumber(literalValue) &&
    !isBoolean(literalValue)
  ) {
    return [
      {
        code: invalidDataCode,
        message: t`Value "${value}" of conditional display context key "${contextKey}" must be a JSON string, number or boolean`,
        userFriendlyMessage: msg`Conditional display rule value is not valid`,
        value,
      },
    ];
  }

  switch (valueKind) {
    case 'BOOLEAN': {
      if (isBoolean(literalValue)) {
        return [];
      }

      return [
        {
          code: invalidDataCode,
          message: t`Value "${value}" of conditional display context key "${contextKey}" must be true or false`,
          userFriendlyMessage: msg`Conditional display boolean value is not valid`,
          value,
        },
      ];
    }
    case 'NUMBER': {
      if (isNumber(literalValue) && Number.isInteger(literalValue)) {
        return [];
      }

      return [
        {
          code: invalidDataCode,
          message: t`Value "${value}" of conditional display context key "${contextKey}" must be an integer`,
          userFriendlyMessage: msg`Conditional display number value is not valid`,
          value,
        },
      ];
    }
    case 'PAGE_TYPE': {
      const allowedPageTypes =
        CONDITIONAL_DISPLAY_CONTEXT_KEYS[contextKey].allowedValues ?? [];

      if (isString(literalValue) && allowedPageTypes.includes(literalValue)) {
        return [];
      }

      const allowedPageTypesText = allowedPageTypes.join(', ');

      return [
        {
          code: invalidDataCode,
          message: t`Value "${value}" of conditional display context key "${contextKey}" must be a JSON string with one of: ${allowedPageTypesText}`,
          userFriendlyMessage: msg`Conditional display page type value is not valid`,
          value,
        },
      ];
    }
    case 'MAP_ENTRY':
    case 'RECORD_PATH':
      return [];
  }
};

export const validateConditionalDisplayContextLeaf = ({
  recordFilter: { operand, subFieldName, value },
  contextKey,
  invalidDataCode,
}: {
  recordFilter: {
    operand: ViewFilterOperand;
    subFieldName?: string | null;
    value?: string | null;
  };
  contextKey: ConditionalDisplayContextKey;
  invalidDataCode: string;
}): FlatEntityValidationError[] => {
  const { valueKind } = CONDITIONAL_DISPLAY_CONTEXT_KEYS[contextKey];

  const subFieldNameErrors = validateContextLeafSubFieldName({
    subFieldName,
    contextKey,
    valueKind,
    invalidDataCode,
  });

  if (isNonEmptyArray(subFieldNameErrors)) {
    return subFieldNameErrors;
  }

  if (!getContextLeafOperands(valueKind).includes(operand)) {
    return [
      {
        code: invalidDataCode,
        message: t`Operand "${operand}" is not supported on conditional display context key "${contextKey}"`,
        userFriendlyMessage: msg`Conditional display rule operand is not supported`,
        value: operand,
      },
    ];
  }

  switch (valueKind) {
    case 'ROLE_IDS':
    case 'WORKSPACE_MEMBER':
    case 'DEVICE':
      return [];
    case 'BOOLEAN':
    case 'NUMBER':
    case 'PAGE_TYPE':
    case 'MAP_ENTRY':
    case 'RECORD_PATH':
      return validateEngineContextLeafValue({
        operand,
        rawValue: value,
        contextKey,
        valueKind,
        invalidDataCode,
      });
  }
};
