import {
  isBoolean,
  isNonEmptyString,
  isNumber,
  isString,
} from '@sniptt/guards';

import { NEVER_AVAILABLE_CONDITIONAL_DISPLAY } from '@/constants/NeverAvailableConditionalDisplay';
import { type ConditionalAvailabilityExpressionNode } from '@/types/conditional-display/ConditionalAvailabilityExpressionNode';
import { type ConditionalDisplay } from '@/types/conditional-display/ConditionalDisplay';
import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';
import { type ConditionalDisplayContextKey } from '@/types/conditional-display/ConditionalDisplayContextKey';
import { type ConditionalDisplaySelectedRecordsMatch } from '@/types/conditional-display/ConditionalDisplaySelectedRecordsMatch';
import { type ConditionalDisplayVirtualField } from '@/types/conditional-display/ConditionalDisplayVirtualField';
import { FieldMetadataType } from '@/types/FieldMetadataType';
import { RecordFilterGroupLogicalOperator } from '@/types/RecordFilterGroupLogicalOperator';
import { ViewFilterOperand } from '@/types/ViewFilterOperand';
import { buildConditionalAvailabilityCompilationError } from '@/utils/conditional-display/buildConditionalAvailabilityCompilationError';
import { buildConditionalDisplayFromConditionNode } from '@/utils/conditional-display/buildConditionalDisplayFromConditionNode';
import { getConditionalDisplayContextVirtualField } from '@/utils/conditional-display/getConditionalDisplayContextVirtualField';
import { groupConditionalDisplayConditionNodes } from '@/utils/conditional-display/groupConditionalDisplayConditionNodes';
import { isConditionalDisplayAdminContextKey } from '@/utils/conditional-display/isConditionalDisplayAdminContextKey';
import { isConditionalDisplayContextKey } from '@/utils/conditional-display/isConditionalDisplayContextKey';
import { negateConditionalDisplayConditionNode } from '@/utils/conditional-display/negateConditionalDisplayConditionNode';
import { getFilterOperandsForFilterableFieldType } from '@/utils/filter/utils/getFilterOperandsForFilterableFieldType';
import { getFilterTypeFromFieldType } from '@/utils/filter/utils/getFilterTypeFromFieldType';
import { isDefined } from '@/utils/validation/isDefined';

type ExpressionLiteral = string | number | boolean;

type ComparisonOperator = Extract<
  ConditionalAvailabilityExpressionNode,
  { kind: 'comparison' }
>['operator'];

type LogicalOperator = Extract<
  ConditionalAvailabilityExpressionNode,
  { kind: 'logicalOperation' }
>['operator'];

type CompiledExpressionItem =
  | { kind: 'variable'; name: string }
  | {
      kind: 'mapEntry';
      contextKey: ConditionalDisplayContextKey;
      entryName: string;
    }
  | { kind: 'literal'; value: ExpressionLiteral }
  | { kind: 'list'; values: ExpressionLiteral[] }
  | { kind: 'favoriteRecordCount' }
  | { kind: 'condition'; conditionNode: ConditionalDisplayConditionNode };

type RecordFilterConditionNode = Extract<
  ConditionalDisplayConditionNode,
  { kind: 'recordFilter' }
>;

type ContextSubject = {
  contextKey: ConditionalDisplayContextKey;
  subFieldName?: string;
  virtualField: ConditionalDisplayVirtualField;
};

const FAVORITE_RECORD_IDS_VARIABLE_NAME = 'favoriteRecordIds';

const OBJECT_METADATA_LABEL_VARIABLE_NAME = 'objectMetadataLabel';

const SELECTED_RECORDS_FUNCTION_NAMES = [
  'every',
  'everyDefined',
  'everyEquals',
  'some',
  'someDefined',
  'someEquals',
  'someNonEmptyString',
  'none',
  'noneDefined',
  'noneEquals',
  'includesEvery',
  'includesSome',
  'includesNone',
];

const SUPPORTED_FUNCTION_NAMES = [
  'isDefined',
  'isNonEmptyString',
  'includes',
  'arrayLength',
  ...SELECTED_RECORDS_FUNCTION_NAMES,
];

const BOOLEAN_RECORD_PATHS = ['canChangeVisibility', 'inboxStatus.isUnread'];

const IDENTIFIER_RECORD_PATHS = ['lastPublishedVersionId'];

const LENGTH_PATH_SUFFIX = '.length';

const describeCompiledItem = (compiledItem: CompiledExpressionItem): string => {
  switch (compiledItem.kind) {
    case 'variable':
      return `variable "${compiledItem.name}"`;
    case 'mapEntry':
      return `member "${compiledItem.contextKey}.${compiledItem.entryName}"`;
    case 'literal':
      return `literal ${JSON.stringify(compiledItem.value)}`;
    case 'list':
      return `list ${JSON.stringify(compiledItem.values)}`;
    case 'favoriteRecordCount':
      return `${FAVORITE_RECORD_IDS_VARIABLE_NAME}.length`;
    case 'condition':
      return 'condition';
  }
};

const buildContextConditionNode = ({
  contextKey,
  subFieldName,
  operand,
  value,
  selectedRecordsMatch,
}: {
  contextKey: ConditionalDisplayContextKey;
  subFieldName?: string;
  operand: ViewFilterOperand;
  value?: string;
  selectedRecordsMatch?: ConditionalDisplaySelectedRecordsMatch;
}): ConditionalDisplayConditionNode => {
  const conditionNode: RecordFilterConditionNode = {
    kind: 'recordFilter',
    recordFilter: { contextKey, operand },
  };

  if (isDefined(subFieldName)) {
    conditionNode.recordFilter.subFieldName = subFieldName;
  }

  if (isDefined(value)) {
    conditionNode.recordFilter.value = value;
  }

  if (isDefined(selectedRecordsMatch)) {
    conditionNode.selectedRecordsMatch = selectedRecordsMatch;
  }

  return conditionNode;
};

const getContextSubject = (
  compiledItem: CompiledExpressionItem,
): ContextSubject | undefined => {
  if (compiledItem.kind !== 'mapEntry' && compiledItem.kind !== 'variable') {
    return undefined;
  }

  const contextKey =
    compiledItem.kind === 'mapEntry'
      ? compiledItem.contextKey
      : compiledItem.name;
  const subFieldName =
    compiledItem.kind === 'mapEntry' ? compiledItem.entryName : undefined;

  if (!isConditionalDisplayContextKey(contextKey)) {
    return undefined;
  }

  const virtualField = getConditionalDisplayContextVirtualField({
    contextKey,
    subFieldName,
  });

  return isDefined(virtualField)
    ? { contextKey, subFieldName, virtualField }
    : undefined;
};

const toConditionNode = ({
  compiledItem,
  expression,
}: {
  compiledItem: CompiledExpressionItem;
  expression: string;
}): ConditionalDisplayConditionNode => {
  if (compiledItem.kind === 'condition') {
    return compiledItem.conditionNode;
  }

  const contextSubject = getContextSubject(compiledItem);

  if (contextSubject?.virtualField.type === FieldMetadataType.BOOLEAN) {
    return buildContextConditionNode({
      contextKey: contextSubject.contextKey,
      subFieldName: contextSubject.subFieldName,
      operand: ViewFilterOperand.IS,
      value: JSON.stringify(true),
    });
  }

  throw buildConditionalAvailabilityCompilationError({
    expression,
    reason: `unsupported ${describeCompiledItem(compiledItem)}`,
  });
};

const compileVariable = ({
  name,
  expression,
}: {
  name: string;
  expression: string;
}): CompiledExpressionItem => {
  if (
    isConditionalDisplayContextKey(name) &&
    isConditionalDisplayAdminContextKey(name)
  ) {
    throw buildConditionalAvailabilityCompilationError({
      expression,
      reason: `unsupported admin subject "${name}": engine conditions cannot carry admin subjects`,
    });
  }

  if (name === OBJECT_METADATA_LABEL_VARIABLE_NAME) {
    throw buildConditionalAvailabilityCompilationError({
      expression,
      reason: `unsupported use of "${name}": it is a display label that changes with the selection count and the workspace language; use isNonEmptyString(${name}) to require an object, or compare objectMetadataItem.nameSingular instead (e.g. objectMetadataItem.nameSingular == "company")`,
    });
  }

  if (
    !isConditionalDisplayContextKey(name) &&
    name !== FAVORITE_RECORD_IDS_VARIABLE_NAME
  ) {
    throw buildConditionalAvailabilityCompilationError({
      expression,
      reason: `unknown variable "${name}"`,
    });
  }

  return { kind: 'variable', name };
};

const compileMember = ({
  object,
  memberName,
  expression,
}: {
  object: CompiledExpressionItem;
  memberName: string;
  expression: string;
}): CompiledExpressionItem => {
  if (
    object.kind === 'variable' &&
    object.name === FAVORITE_RECORD_IDS_VARIABLE_NAME &&
    memberName === 'length'
  ) {
    return { kind: 'favoriteRecordCount' };
  }

  if (
    object.kind !== 'variable' ||
    !isConditionalDisplayContextKey(object.name) ||
    !isDefined(
      getConditionalDisplayContextVirtualField({
        contextKey: object.name,
        subFieldName: memberName,
      }),
    )
  ) {
    throw buildConditionalAvailabilityCompilationError({
      expression,
      reason: `unsupported member "${memberName}" of ${describeCompiledItem(object)}`,
    });
  }

  return { kind: 'mapEntry', contextKey: object.name, entryName: memberName };
};

const getEqualityOperand = (
  operator: ComparisonOperator,
): ViewFilterOperand | undefined => {
  switch (operator) {
    case '==':
      return ViewFilterOperand.IS;
    case '!=':
      return ViewFilterOperand.IS_NOT;
    default:
      return undefined;
  }
};

const compileCountComparison = ({
  contextKey,
  operator,
  count,
}: {
  contextKey: ConditionalDisplayContextKey;
  operator: ComparisonOperator;
  count: number;
}): ConditionalDisplayConditionNode | undefined => {
  const buildCountConditionNode = (
    operand: ViewFilterOperand,
    boundary: number,
  ) =>
    boundary < 0
      ? undefined
      : buildContextConditionNode({
          contextKey,
          operand,
          value: JSON.stringify(boundary),
        });

  switch (operator) {
    case '==':
      return buildCountConditionNode(ViewFilterOperand.IS, count);
    case '!=':
      return buildCountConditionNode(ViewFilterOperand.IS_NOT, count);
    case '>=':
      return buildCountConditionNode(
        ViewFilterOperand.GREATER_THAN_OR_EQUAL,
        count,
      );
    case '>':
      return buildCountConditionNode(
        ViewFilterOperand.GREATER_THAN_OR_EQUAL,
        count + 1,
      );
    case '<=':
      return buildCountConditionNode(
        ViewFilterOperand.LESS_THAN_OR_EQUAL,
        count,
      );
    case '<':
      return buildCountConditionNode(
        ViewFilterOperand.LESS_THAN_OR_EQUAL,
        count - 1,
      );
  }
};

const compileContextComparison = ({
  operator,
  left,
  literal,
}: {
  operator: ComparisonOperator;
  left: CompiledExpressionItem;
  literal: ExpressionLiteral;
}): ConditionalDisplayConditionNode | undefined => {
  const contextSubject = getContextSubject(left);

  if (!isDefined(contextSubject)) {
    return undefined;
  }

  const { contextKey, subFieldName, virtualField } = contextSubject;
  const equalityOperand = getEqualityOperand(operator);

  switch (virtualField.type) {
    case FieldMetadataType.BOOLEAN:
      return isDefined(equalityOperand) && isBoolean(literal)
        ? buildContextConditionNode({
            contextKey,
            subFieldName,
            operand: ViewFilterOperand.IS,
            value: JSON.stringify(
              equalityOperand === ViewFilterOperand.IS ? literal : !literal,
            ),
          })
        : undefined;
    case FieldMetadataType.SELECT:
      return isDefined(equalityOperand) &&
        isString(literal) &&
        (!isDefined(virtualField.options) ||
          virtualField.options.includes(literal))
        ? buildContextConditionNode({
            contextKey,
            subFieldName,
            operand: equalityOperand,
            value: JSON.stringify([literal]),
          })
        : undefined;
    case FieldMetadataType.NUMBER:
      return isNumber(literal) && Number.isInteger(literal)
        ? compileCountComparison({ contextKey, operator, count: literal })
        : undefined;
    default:
      return undefined;
  }
};

const compileComparison = ({
  operator,
  left,
  right,
  expression,
}: {
  operator: ComparisonOperator;
  left: CompiledExpressionItem;
  right: CompiledExpressionItem;
  expression: string;
}): ConditionalDisplayConditionNode => {
  const throwUnsupportedComparison = () => {
    throw buildConditionalAvailabilityCompilationError({
      expression,
      reason: `unsupported operator "${operator}" between ${describeCompiledItem(left)} and ${describeCompiledItem(right)}`,
    });
  };

  if (
    left.kind === 'favoriteRecordCount' &&
    right.kind === 'variable' &&
    right.name === 'numberOfSelectedRecords'
  ) {
    switch (operator) {
      case '<':
      case '!=':
        return buildContextConditionNode({
          contextKey: 'areAllSelectedRecordsFavorites',
          operand: ViewFilterOperand.IS,
          value: JSON.stringify(false),
        });
      case '==':
        return buildContextConditionNode({
          contextKey: 'areAllSelectedRecordsFavorites',
          operand: ViewFilterOperand.IS,
          value: JSON.stringify(true),
        });
    }
  }

  if (
    left.kind === 'favoriteRecordCount' ||
    right.kind === 'favoriteRecordCount'
  ) {
    throw buildConditionalAvailabilityCompilationError({
      expression,
      reason: `unsupported comparison of ${FAVORITE_RECORD_IDS_VARIABLE_NAME}.length: write ${FAVORITE_RECORD_IDS_VARIABLE_NAME}.length == numberOfSelectedRecords when every selected record is a favorite, or ${FAVORITE_RECORD_IDS_VARIABLE_NAME}.length < numberOfSelectedRecords when at least one is not`,
    });
  }

  const conditionNode =
    right.kind === 'literal'
      ? compileContextComparison({ operator, left, literal: right.value })
      : undefined;

  return conditionNode ?? throwUnsupportedComparison();
};

const compileLogicalOperation = ({
  operator,
  left,
  right,
  expression,
}: {
  operator: LogicalOperator;
  left: CompiledExpressionItem;
  right: CompiledExpressionItem;
  expression: string;
}): ConditionalDisplayConditionNode =>
  groupConditionalDisplayConditionNodes({
    logicalOperator:
      operator === 'and'
        ? RecordFilterGroupLogicalOperator.AND
        : RecordFilterGroupLogicalOperator.OR,
    conditionNodes: [
      toConditionNode({ compiledItem: left, expression }),
      toConditionNode({ compiledItem: right, expression }),
    ],
  });

const compileNegation = ({
  operand,
  expression,
}: {
  operand: CompiledExpressionItem;
  expression: string;
}): ConditionalDisplayConditionNode => {
  const conditionNode = negateConditionalDisplayConditionNode(
    toConditionNode({ compiledItem: operand, expression }),
  );

  if (!isDefined(conditionNode)) {
    throw buildConditionalAvailabilityCompilationError({
      expression,
      reason: `unsupported operator "not" on ${describeCompiledItem(operand)}`,
    });
  }

  return conditionNode;
};

const compileRecordTruthiness = ({
  path,
  selectedRecordsMatch,
  isNegated,
  expression,
}: {
  path: string;
  selectedRecordsMatch: ConditionalDisplaySelectedRecordsMatch;
  isNegated: boolean;
  expression: string;
}): ConditionalDisplayConditionNode => {
  if (path.endsWith(LENGTH_PATH_SUFFIX)) {
    return buildContextConditionNode({
      contextKey: 'selectedRecords',
      subFieldName: path.slice(0, -LENGTH_PATH_SUFFIX.length),
      operand: isNegated
        ? ViewFilterOperand.IS_EMPTY
        : ViewFilterOperand.IS_NOT_EMPTY,
      selectedRecordsMatch,
    });
  }

  if (BOOLEAN_RECORD_PATHS.includes(path)) {
    return buildContextConditionNode({
      contextKey: 'selectedRecords',
      subFieldName: path,
      operand: isNegated ? ViewFilterOperand.IS_NOT : ViewFilterOperand.IS,
      value: JSON.stringify(true),
      selectedRecordsMatch,
    });
  }

  if (IDENTIFIER_RECORD_PATHS.includes(path)) {
    return buildContextConditionNode({
      contextKey: 'selectedRecords',
      subFieldName: path,
      operand: isNegated
        ? ViewFilterOperand.IS_EMPTY
        : ViewFilterOperand.IS_NOT_EMPTY,
      selectedRecordsMatch,
    });
  }

  throw buildConditionalAvailabilityCompilationError({
    expression,
    reason: `unsupported truthiness of record path "${path}": every, some and none accept a path ending in "${LENGTH_PATH_SUFFIX}", a boolean path (${BOOLEAN_RECORD_PATHS.join(', ')}) or an identifier path (${IDENTIFIER_RECORD_PATHS.join(', ')})`,
  });
};

const compileRecordFunctionCall = ({
  functionName,
  path,
  literal,
  argumentCount,
  expression,
}: {
  functionName: string;
  path: string;
  literal: ExpressionLiteral | undefined;
  argumentCount: number;
  expression: string;
}): ConditionalDisplayConditionNode | undefined => {
  const buildRecordPathConditionNode = ({
    selectedRecordsMatch,
    operand,
  }: {
    selectedRecordsMatch: ConditionalDisplaySelectedRecordsMatch;
    operand: ViewFilterOperand;
  }) =>
    argumentCount === 2
      ? buildContextConditionNode({
          contextKey: 'selectedRecords',
          subFieldName: path,
          operand,
          selectedRecordsMatch,
        })
      : undefined;

  const buildRecordPathValueConditionNode = ({
    selectedRecordsMatch,
    operand,
  }: {
    selectedRecordsMatch: ConditionalDisplaySelectedRecordsMatch;
    operand: ViewFilterOperand;
  }) =>
    argumentCount === 3 && isDefined(literal)
      ? buildContextConditionNode({
          contextKey: 'selectedRecords',
          subFieldName: path,
          operand,
          value: JSON.stringify(literal),
          selectedRecordsMatch,
        })
      : undefined;

  const buildRecordTruthinessConditionNode = ({
    selectedRecordsMatch,
    isNegated,
  }: {
    selectedRecordsMatch: ConditionalDisplaySelectedRecordsMatch;
    isNegated: boolean;
  }) =>
    argumentCount === 2
      ? compileRecordTruthiness({
          path,
          selectedRecordsMatch,
          isNegated,
          expression,
        })
      : undefined;

  switch (functionName) {
    case 'everyDefined':
      return buildRecordPathConditionNode({
        selectedRecordsMatch: 'EVERY',
        operand: ViewFilterOperand.IS_NOT_EMPTY,
      });
    case 'noneDefined':
      return buildRecordPathConditionNode({
        selectedRecordsMatch: 'EVERY',
        operand: ViewFilterOperand.IS_EMPTY,
      });
    case 'someDefined':
    case 'someNonEmptyString':
      return buildRecordPathConditionNode({
        selectedRecordsMatch: 'SOME',
        operand: ViewFilterOperand.IS_NOT_EMPTY,
      });
    case 'everyEquals':
      return buildRecordPathValueConditionNode({
        selectedRecordsMatch: 'EVERY',
        operand: ViewFilterOperand.IS,
      });
    case 'noneEquals':
      return buildRecordPathValueConditionNode({
        selectedRecordsMatch: 'EVERY',
        operand: ViewFilterOperand.IS_NOT,
      });
    case 'someEquals':
      return buildRecordPathValueConditionNode({
        selectedRecordsMatch: 'SOME',
        operand: ViewFilterOperand.IS,
      });
    case 'includesEvery':
      return buildRecordPathValueConditionNode({
        selectedRecordsMatch: 'EVERY',
        operand: ViewFilterOperand.CONTAINS,
      });
    case 'includesNone':
      return buildRecordPathValueConditionNode({
        selectedRecordsMatch: 'EVERY',
        operand: ViewFilterOperand.DOES_NOT_CONTAIN,
      });
    case 'includesSome':
      return buildRecordPathValueConditionNode({
        selectedRecordsMatch: 'SOME',
        operand: ViewFilterOperand.CONTAINS,
      });
    case 'every':
      return buildRecordTruthinessConditionNode({
        selectedRecordsMatch: 'EVERY',
        isNegated: false,
      });
    case 'some':
      return buildRecordTruthinessConditionNode({
        selectedRecordsMatch: 'SOME',
        isNegated: false,
      });
    case 'none':
      return buildRecordTruthinessConditionNode({
        selectedRecordsMatch: 'EVERY',
        isNegated: true,
      });
    default:
      return undefined;
  }
};

const compileIsDefinedCall = (
  functionArguments: CompiledExpressionItem[],
): ConditionalDisplayConditionNode | undefined => {
  const [firstArgument] = functionArguments;
  const contextSubject =
    functionArguments.length === 1 && firstArgument?.kind === 'mapEntry'
      ? getContextSubject(firstArgument)
      : undefined;

  return isDefined(contextSubject) &&
    getFilterOperandsForFilterableFieldType({
      filterType: getFilterTypeFromFieldType(contextSubject.virtualField.type),
    }).includes(ViewFilterOperand.IS_NOT_EMPTY)
    ? buildContextConditionNode({
        contextKey: contextSubject.contextKey,
        subFieldName: contextSubject.subFieldName,
        operand: ViewFilterOperand.IS_NOT_EMPTY,
      })
    : undefined;
};

const getSelectContextSubject = (
  compiledItem: CompiledExpressionItem | undefined,
): ContextSubject | undefined => {
  const contextSubject = isDefined(compiledItem)
    ? getContextSubject(compiledItem)
    : undefined;

  return contextSubject?.virtualField.type === FieldMetadataType.SELECT
    ? contextSubject
    : undefined;
};

const compileIsNonEmptyStringCall = ({
  functionArguments,
  expression,
}: {
  functionArguments: CompiledExpressionItem[];
  expression: string;
}): ConditionalDisplayConditionNode => {
  const [firstArgument] = functionArguments;
  const contextSubject =
    functionArguments.length === 1
      ? getSelectContextSubject(firstArgument)
      : undefined;

  if (!isDefined(contextSubject)) {
    throw buildConditionalAvailabilityCompilationError({
      expression,
      reason: `unsupported call of isNonEmptyString(${functionArguments.map(describeCompiledItem).join(', ')}): isNonEmptyString accepts a text context value (pageType, objectMetadataItem.nameSingular, objectMetadataItem.readability or ${OBJECT_METADATA_LABEL_VARIABLE_NAME}); use isDefined(...) for other context values and someNonEmptyString(selectedRecords, "path") for record fields`,
    });
  }

  return buildContextConditionNode({
    contextKey: contextSubject.contextKey,
    subFieldName: contextSubject.subFieldName,
    operand: ViewFilterOperand.IS_NOT_EMPTY,
  });
};

const compileIncludesCall = ({
  functionArguments,
  expression,
}: {
  functionArguments: CompiledExpressionItem[];
  expression: string;
}): ConditionalDisplayConditionNode => {
  const [firstArgument, secondArgument] = functionArguments;
  const contextSubject =
    functionArguments.length === 2
      ? getSelectContextSubject(secondArgument)
      : undefined;
  const values =
    firstArgument?.kind === 'list' && firstArgument.values.every(isString)
      ? firstArgument.values.filter(isString)
      : [];
  const options = contextSubject?.virtualField.options;

  if (
    !isDefined(contextSubject) ||
    values.length === 0 ||
    (isDefined(options) && !values.every((value) => options.includes(value)))
  ) {
    throw buildConditionalAvailabilityCompilationError({
      expression,
      reason: `unsupported call of includes(${functionArguments.map(describeCompiledItem).join(', ')}): includes accepts a list of values followed by a text context value, e.g. includes(["INDEX_PAGE", "RECORD_PAGE"], pageType); use someEquals or includesSome(selectedRecords, "path", value) for record fields`,
    });
  }

  return buildContextConditionNode({
    contextKey: contextSubject.contextKey,
    subFieldName: contextSubject.subFieldName,
    operand: ViewFilterOperand.IS,
    value: JSON.stringify(values),
  });
};

const compileSelectedRecordsCall = ({
  functionName,
  functionArguments,
  expression,
}: {
  functionName: string;
  functionArguments: CompiledExpressionItem[];
  expression: string;
}): ConditionalDisplayConditionNode | undefined => {
  const [firstArgument, secondArgument, thirdArgument] = functionArguments;

  if (
    firstArgument?.kind !== 'variable' ||
    firstArgument.name !== 'selectedRecords'
  ) {
    throw buildConditionalAvailabilityCompilationError({
      expression,
      reason: `${functionName} over ${isDefined(firstArgument) ? describeCompiledItem(firstArgument) : 'nothing'}: ${functionName} only accepts selectedRecords as its first argument`,
    });
  }

  if (
    secondArgument?.kind !== 'literal' ||
    !isNonEmptyString(secondArgument.value)
  ) {
    throw buildConditionalAvailabilityCompilationError({
      expression,
      reason: `${functionName} needs a record field path string as its second argument`,
    });
  }

  return compileRecordFunctionCall({
    functionName,
    path: secondArgument.value,
    literal:
      thirdArgument?.kind === 'literal' ? thirdArgument.value : undefined,
    argumentCount: functionArguments.length,
    expression,
  });
};

const compileFunctionCall = ({
  functionName,
  functionArguments,
  expression,
}: {
  functionName: string;
  functionArguments: CompiledExpressionItem[];
  expression: string;
}): CompiledExpressionItem => {
  const [firstArgument] = functionArguments;

  if (
    functionName === 'arrayLength' &&
    functionArguments.length === 1 &&
    firstArgument?.kind === 'variable' &&
    firstArgument.name === FAVORITE_RECORD_IDS_VARIABLE_NAME
  ) {
    return { kind: 'favoriteRecordCount' };
  }

  if (functionName === 'isNonEmptyString') {
    return {
      kind: 'condition',
      conditionNode: compileIsNonEmptyStringCall({
        functionArguments,
        expression,
      }),
    };
  }

  if (functionName === 'includes') {
    return {
      kind: 'condition',
      conditionNode: compileIncludesCall({ functionArguments, expression }),
    };
  }

  const conditionNode =
    functionName === 'isDefined'
      ? compileIsDefinedCall(functionArguments)
      : SELECTED_RECORDS_FUNCTION_NAMES.includes(functionName)
        ? compileSelectedRecordsCall({
            functionName,
            functionArguments,
            expression,
          })
        : undefined;

  if (!isDefined(conditionNode)) {
    throw buildConditionalAvailabilityCompilationError({
      expression,
      reason: `unsupported call of ${functionName}(${functionArguments.map(describeCompiledItem).join(', ')})`,
    });
  }

  return { kind: 'condition', conditionNode };
};

const isObjectMetadataLabelPresenceCheck = (
  expressionNode: Extract<
    ConditionalAvailabilityExpressionNode,
    { kind: 'functionCall' }
  >,
): boolean => {
  const [firstArgument] = expressionNode.functionArguments;

  return (
    expressionNode.functionName === 'isNonEmptyString' &&
    expressionNode.functionArguments.length === 1 &&
    firstArgument?.kind === 'variable' &&
    firstArgument.name === OBJECT_METADATA_LABEL_VARIABLE_NAME
  );
};

const compileExpressionNode = ({
  expressionNode,
  expression,
}: {
  expressionNode: ConditionalAvailabilityExpressionNode;
  expression: string;
}): CompiledExpressionItem => {
  const compileOperand = (operand: ConditionalAvailabilityExpressionNode) =>
    compileExpressionNode({ expressionNode: operand, expression });

  switch (expressionNode.kind) {
    case 'literal':
      return { kind: 'literal', value: expressionNode.value };
    case 'list':
      return {
        kind: 'list',
        values: expressionNode.elements.map((element) => {
          if (element.kind !== 'literal') {
            throw buildConditionalAvailabilityCompilationError({
              expression,
              reason: 'unsupported list element: lists only accept literals',
            });
          }

          return element.value;
        }),
      };
    case 'variable':
      return compileVariable({ name: expressionNode.name, expression });
    case 'member':
      return compileMember({
        object: compileOperand(expressionNode.object),
        memberName: expressionNode.memberName,
        expression,
      });
    case 'not':
      return {
        kind: 'condition',
        conditionNode: compileNegation({
          operand: compileOperand(expressionNode.operand),
          expression,
        }),
      };
    case 'logicalOperation':
      return {
        kind: 'condition',
        conditionNode: compileLogicalOperation({
          operator: expressionNode.operator,
          left: compileOperand(expressionNode.left),
          right: compileOperand(expressionNode.right),
          expression,
        }),
      };
    case 'comparison':
      return {
        kind: 'condition',
        conditionNode: compileComparison({
          operator: expressionNode.operator,
          left: compileOperand(expressionNode.left),
          right: compileOperand(expressionNode.right),
          expression,
        }),
      };
    case 'functionCall':
      if (!SUPPORTED_FUNCTION_NAMES.includes(expressionNode.functionName)) {
        throw buildConditionalAvailabilityCompilationError({
          expression,
          reason: `unsupported function "${expressionNode.functionName}"`,
        });
      }

      if (isObjectMetadataLabelPresenceCheck(expressionNode)) {
        return {
          kind: 'condition',
          conditionNode: buildContextConditionNode({
            contextKey: 'objectMetadataItem',
            subFieldName: 'nameSingular',
            operand: ViewFilterOperand.IS_NOT_EMPTY,
          }),
        };
      }

      return compileFunctionCall({
        functionName: expressionNode.functionName,
        functionArguments: expressionNode.functionArguments.map(compileOperand),
        expression,
      });
  }
};

const collectSelectedRecordsMatches = (
  conditionNode: ConditionalDisplayConditionNode,
): ConditionalDisplaySelectedRecordsMatch[] => {
  if (conditionNode.kind === 'recordFilterGroup') {
    return conditionNode.children.flatMap(collectSelectedRecordsMatches);
  }

  return isDefined(conditionNode.selectedRecordsMatch)
    ? [conditionNode.selectedRecordsMatch]
    : [];
};

const referencesSelectedRecords = (
  conditionNode: ConditionalDisplayConditionNode,
): boolean =>
  conditionNode.kind === 'recordFilter'
    ? conditionNode.recordFilter.contextKey === 'selectedRecords'
    : conditionNode.children.some(referencesSelectedRecords);

const isSingleRecordSelectionRequired = (
  conditionNode: ConditionalDisplayConditionNode,
): boolean => {
  const conjuncts =
    conditionNode.kind === 'recordFilterGroup' &&
    conditionNode.logicalOperator === RecordFilterGroupLogicalOperator.AND
      ? conditionNode.children
      : [conditionNode];

  return conjuncts.some(
    (conjunct) =>
      conjunct.kind === 'recordFilter' &&
      conjunct.recordFilter.contextKey === 'numberOfSelectedRecords' &&
      conjunct.recordFilter.operand === ViewFilterOperand.IS &&
      conjunct.recordFilter.value === JSON.stringify(1),
  );
};

const findGroupNotDistributingOverRecords = ({
  conditionNode,
  selectedRecordsMatch,
}: {
  conditionNode: ConditionalDisplayConditionNode;
  selectedRecordsMatch: ConditionalDisplaySelectedRecordsMatch;
}): RecordFilterGroupLogicalOperator | undefined => {
  if (conditionNode.kind === 'recordFilter') {
    return undefined;
  }

  const nonDistributingLogicalOperator =
    selectedRecordsMatch === 'SOME'
      ? RecordFilterGroupLogicalOperator.AND
      : RecordFilterGroupLogicalOperator.OR;

  if (
    conditionNode.logicalOperator === nonDistributingLogicalOperator &&
    conditionNode.children.filter(referencesSelectedRecords).length > 1
  ) {
    return nonDistributingLogicalOperator;
  }

  return conditionNode.children
    .map((child) =>
      findGroupNotDistributingOverRecords({
        conditionNode: child,
        selectedRecordsMatch,
      }),
    )
    .find(isDefined);
};

export const compileConditionalAvailabilityExpressionNode = ({
  expressionNode,
  expression,
  source,
}: {
  expressionNode: ConditionalAvailabilityExpressionNode;
  expression: string;
  source: string;
}): ConditionalDisplay | null => {
  const compiledItem = compileExpressionNode({ expressionNode, expression });

  if (compiledItem.kind === 'literal' && isBoolean(compiledItem.value)) {
    return compiledItem.value ? null : NEVER_AVAILABLE_CONDITIONAL_DISPLAY;
  }

  const conditionNode = toConditionNode({ compiledItem, expression });

  const selectedRecordsMatches = new Set(
    collectSelectedRecordsMatches(conditionNode),
  );

  if (selectedRecordsMatches.size > 1) {
    throw buildConditionalAvailabilityCompilationError({
      expression,
      reason: 'unsupported mix of every and some record functions',
    });
  }

  const nonDistributingLogicalOperator = isSingleRecordSelectionRequired(
    conditionNode,
  )
    ? undefined
    : findGroupNotDistributingOverRecords({
        conditionNode,
        selectedRecordsMatch: selectedRecordsMatches.has('SOME')
          ? 'SOME'
          : 'EVERY',
      });

  if (isDefined(nonDistributingLogicalOperator)) {
    throw buildConditionalAvailabilityCompilationError({
      expression,
      reason: `unsupported "${nonDistributingLogicalOperator.toLowerCase()}" between record functions over several selected records; guard the formula with \`numberOfSelectedRecords == 1\` at the top level, or express it as a single every/some over one path`,
    });
  }

  return buildConditionalDisplayFromConditionNode({ conditionNode, source });
};
