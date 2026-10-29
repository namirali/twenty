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
  type ConditionalDisplayVirtualField,
  FieldMetadataType,
  type ViewFilterOperand,
} from 'twenty-shared/types';
import {
  getConditionalDisplayContextVirtualField,
  isDefined,
  isEmptinessOperand,
  isNonEmptyArray,
  isRecordFilterOperandExpectingValue,
  parseJson,
} from 'twenty-shared/utils';

import { CONDITIONAL_DISPLAY_SELECTED_RECORD_PATH_OPERANDS } from 'src/engine/metadata-modules/flat-conditional-display/constants/conditional-display-selected-record-path-operands.constant';
import { parseSelectFilterValues } from 'src/engine/metadata-modules/flat-field-metadata/utils/get-invalid-select-filter-option-values.util';
import { validateRecordFilterFieldLeaf } from 'src/engine/metadata-modules/flat-field-metadata/utils/validate-record-filter-field-leaf.util';
import { type FlatEntityValidationError } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-builder/builders/types/failed-flat-entity-validation.type';

type ContextLeafRecordFilter = {
  operand: ViewFilterOperand;
  subFieldName?: string | null;
  value?: string | null;
};

const SUB_FIELD_NAME_IDENTIFIER_PATTERN = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

const SUB_FIELD_NAME_PATH_PATTERN =
  /^[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)*$/;

const validateContextLeafSubFieldName = ({
  subFieldName,
  contextKey,
  invalidDataCode,
}: {
  subFieldName: string | null | undefined;
  contextKey: ConditionalDisplayContextKey;
  invalidDataCode: string;
}): FlatEntityValidationError[] => {
  const { subject } = CONDITIONAL_DISPLAY_CONTEXT_KEYS[contextKey];

  if (subject.kind === 'value') {
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

  if (!isDefined(subFieldName)) {
    return [
      {
        code: invalidDataCode,
        message: t`Conditional display context key "${contextKey}" requires a sub field name`,
        userFriendlyMessage: msg`Conditional display rule is missing a sub field`,
        value: contextKey,
      },
    ];
  }

  switch (subject.kind) {
    case 'mapEntry': {
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
    case 'property': {
      if (
        isDefined(
          getConditionalDisplayContextVirtualField({
            contextKey,
            subFieldName,
          }),
        )
      ) {
        return [];
      }

      return [
        {
          code: invalidDataCode,
          message: t`Sub field name "${subFieldName}" is not a known property of conditional display context key "${contextKey}"`,
          userFriendlyMessage: msg`Conditional display rule sub field is not valid`,
          value: subFieldName,
        },
      ];
    }
    case 'selectedRecordPath': {
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
  }
};

const validateSelectedRecordPathLeaf = ({
  recordFilter: { operand, value: rawValue },
  contextKey,
  invalidDataCode,
}: {
  recordFilter: ContextLeafRecordFilter;
  contextKey: ConditionalDisplayContextKey;
  invalidDataCode: string;
}): FlatEntityValidationError[] => {
  const allowedOperand = CONDITIONAL_DISPLAY_SELECTED_RECORD_PATH_OPERANDS.find(
    (selectedRecordPathOperand) => selectedRecordPathOperand === operand,
  );

  if (!isDefined(allowedOperand)) {
    return [
      {
        code: invalidDataCode,
        message: t`Operand "${operand}" is not supported on conditional display context key "${contextKey}"`,
        userFriendlyMessage: msg`Conditional display rule operand is not supported`,
        value: operand,
      },
    ];
  }

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
    isString(literalValue) ||
    isNumber(literalValue) ||
    isBoolean(literalValue)
  ) {
    return [];
  }

  return [
    {
      code: invalidDataCode,
      message: t`Value "${value}" of conditional display context key "${contextKey}" must be a JSON string, number or boolean`,
      userFriendlyMessage: msg`Conditional display rule value is not valid`,
      value,
    },
  ];
};

const validateContextLeafSelectOptions = ({
  recordFilter: { operand, value },
  virtualField,
  contextKey,
  invalidDataCode,
}: {
  recordFilter: ContextLeafRecordFilter;
  virtualField: ConditionalDisplayVirtualField;
  contextKey: ConditionalDisplayContextKey;
  invalidDataCode: string;
}): FlatEntityValidationError[] => {
  const { options } = virtualField;

  if (
    virtualField.type !== FieldMetadataType.SELECT ||
    !isDefined(options) ||
    !isRecordFilterOperandExpectingValue(operand)
  ) {
    return [];
  }

  const invalidValues = (parseSelectFilterValues(value ?? null) ?? []).filter(
    (selectedValue) => !options.includes(selectedValue),
  );

  if (!isNonEmptyArray(invalidValues)) {
    return [];
  }

  const invalidValuesText = invalidValues.join(', ');
  const allowedValuesText = options.join(', ');

  return [
    {
      code: invalidDataCode,
      message: t`Conditional display context key "${contextKey}" uses option(s) ${invalidValuesText} that do not exist. Allowed values: ${allowedValuesText}.`,
      userFriendlyMessage: msg`Conditional display rule uses an option that does not exist`,
      value,
    },
  ];
};

export const validateConditionalDisplayContextLeaf = ({
  recordFilter,
  contextKey,
  invalidDataCode,
}: {
  recordFilter: ContextLeafRecordFilter;
  contextKey: ConditionalDisplayContextKey;
  invalidDataCode: string;
}): FlatEntityValidationError[] => {
  const subFieldNameErrors = validateContextLeafSubFieldName({
    subFieldName: recordFilter.subFieldName,
    contextKey,
    invalidDataCode,
  });

  if (isNonEmptyArray(subFieldNameErrors)) {
    return subFieldNameErrors;
  }

  if (contextKey === 'selectedRecords') {
    return validateSelectedRecordPathLeaf({
      recordFilter,
      contextKey,
      invalidDataCode,
    });
  }

  const virtualField = getConditionalDisplayContextVirtualField({
    contextKey,
    subFieldName: recordFilter.subFieldName,
  });

  if (!isDefined(virtualField)) {
    return [];
  }

  const fieldLeafErrors =
    validateRecordFilterFieldLeaf<FlatEntityValidationError>({
      recordFilter: {
        operand: recordFilter.operand,
        value: recordFilter.value,
      },
      filterField: virtualField,
      relationTargetField: undefined,
      buildUnsupportedOperandError: ({
        rawOperand,
        effectiveFieldType,
        allowedOperandsText,
      }) => ({
        code: invalidDataCode,
        message: t`Operand "${rawOperand}" is not supported on conditional display context key "${contextKey}" of type "${effectiveFieldType}". Supported operands: ${allowedOperandsText}.`,
        userFriendlyMessage: msg`Conditional display rule operand is not supported`,
        value: rawOperand,
      }),
      buildInvalidValueError: ({
        stringifiedValue,
        operand,
        filterType,
        hint,
      }) => ({
        code: invalidDataCode,
        message: isNonEmptyString(hint)
          ? t`Value "${stringifiedValue}" of conditional display context key "${contextKey}" is not valid for operand "${operand}" on type "${filterType}". ${hint}`
          : t`Value "${stringifiedValue}" of conditional display context key "${contextKey}" is not valid for operand "${operand}" on type "${filterType}".`,
        userFriendlyMessage: msg`Conditional display rule value is not valid for this operand`,
        value: recordFilter.value,
      }),
    });

  if (isNonEmptyArray(fieldLeafErrors)) {
    return fieldLeafErrors;
  }

  return validateContextLeafSelectOptions({
    recordFilter,
    virtualField,
    contextKey,
    invalidDataCode,
  });
};
