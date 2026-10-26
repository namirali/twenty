import {
  isArray,
  isBoolean,
  isNonEmptyString,
  isNumber,
  isObject,
  isString,
} from '@sniptt/guards';

import { NEVER_AVAILABLE_CONDITIONAL_DISPLAY } from '@/constants/NeverAvailableConditionalDisplay';
import { type ConditionalDisplay } from '@/types/conditional-display/ConditionalDisplay';
import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';
import { type ConditionalDisplayContextKey } from '@/types/conditional-display/ConditionalDisplayContextKey';
import { type ConditionalDisplaySelectedRecordsMatch } from '@/types/conditional-display/ConditionalDisplaySelectedRecordsMatch';
import { type ConditionalDisplayVirtualField } from '@/types/conditional-display/ConditionalDisplayVirtualField';
import { FieldMetadataType } from '@/types/FieldMetadataType';
import { RecordFilterGroupLogicalOperator } from '@/types/RecordFilterGroupLogicalOperator';
import { ViewFilterOperand } from '@/types/ViewFilterOperand';
import { conditionalAvailabilityParser } from '@/utils/command-menu-items/conditionalAvailabilityParser';
import { buildConditionalDisplayFromConditionNode } from '@/utils/conditional-display/buildConditionalDisplayFromConditionNode';
import { getConditionalDisplayContextVirtualField } from '@/utils/conditional-display/getConditionalDisplayContextVirtualField';
import { groupConditionalDisplayConditionNodes } from '@/utils/conditional-display/groupConditionalDisplayConditionNodes';
import { isConditionalDisplayAdminContextKey } from '@/utils/conditional-display/isConditionalDisplayAdminContextKey';
import { isConditionalDisplayContextKey } from '@/utils/conditional-display/isConditionalDisplayContextKey';
import { negateConditionalDisplayConditionNode } from '@/utils/conditional-display/negateConditionalDisplayConditionNode';
import { getFilterOperandsForFilterableFieldType } from '@/utils/filter/utils/getFilterOperandsForFilterableFieldType';
import { getFilterTypeFromFieldType } from '@/utils/filter/utils/getFilterTypeFromFieldType';
import { isDefined } from '@/utils/validation/isDefined';

type ExpressionToken = {
  type: string;
  value: unknown;
};

type ExpressionLiteral = string | number | boolean;

type CompilationStackItem =
  | { kind: 'variable'; name: string }
  | {
      kind: 'mapEntry';
      contextKey: ConditionalDisplayContextKey;
      entryName: string;
    }
  | { kind: 'literal'; value: unknown }
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

const BOOLEAN_RECORD_PATHS = ['canChangeVisibility', 'inboxStatus.isUnread'];

const IDENTIFIER_RECORD_PATHS = ['lastPublishedVersionId'];

const LENGTH_PATH_SUFFIX = '.length';

const buildCompilationError = ({
  expression,
  offendingToken,
}: {
  expression: string;
  offendingToken: string;
}) =>
  new Error(
    `Cannot compile conditional availability expression "${expression}": unsupported ${offendingToken}`,
  );

const isExpressionToken = (value: unknown): value is ExpressionToken =>
  isObject(value) &&
  'type' in value &&
  isString(value.type) &&
  'value' in value;

const isExpressionLiteral = (value: unknown): value is ExpressionLiteral =>
  isString(value) || isNumber(value) || isBoolean(value);

const describeStackItem = (stackItem: CompilationStackItem): string => {
  switch (stackItem.kind) {
    case 'variable':
      return `variable "${stackItem.name}"`;
    case 'mapEntry':
      return `member "${stackItem.contextKey}.${stackItem.entryName}"`;
    case 'literal':
      return `literal ${JSON.stringify(stackItem.value)}`;
    case 'favoriteRecordCount':
      return 'arrayLength(favoriteRecordIds)';
    case 'condition':
      return 'condition';
  }
};

const parseExpressionTokens = (expression: string): unknown => {
  try {
    const parsedExpression = conditionalAvailabilityParser.parse(expression);

    return 'tokens' in parsedExpression ? parsedExpression.tokens : undefined;
  } catch (error) {
    throw buildCompilationError({
      expression,
      offendingToken: `syntax (${error instanceof Error ? error.message : String(error)})`,
    });
  }
};

const getExpressionTokens = ({
  tokens,
  expression,
}: {
  tokens: unknown;
  expression: string;
}): ExpressionToken[] => {
  if (!isArray(tokens) || !tokens.every(isExpressionToken)) {
    throw buildCompilationError({
      expression,
      offendingToken: 'parsed token list',
    });
  }

  return tokens;
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
  stackItem: CompilationStackItem,
): ContextSubject | undefined => {
  if (stackItem.kind !== 'mapEntry' && stackItem.kind !== 'variable') {
    return undefined;
  }

  const contextKey =
    stackItem.kind === 'mapEntry' ? stackItem.contextKey : stackItem.name;
  const subFieldName =
    stackItem.kind === 'mapEntry' ? stackItem.entryName : undefined;

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
  stackItem,
  expression,
}: {
  stackItem: CompilationStackItem;
  expression: string;
}): ConditionalDisplayConditionNode => {
  switch (stackItem.kind) {
    case 'condition':
      return stackItem.conditionNode;
    case 'mapEntry':
    case 'variable': {
      const contextSubject = getContextSubject(stackItem);

      if (contextSubject?.virtualField.type === FieldMetadataType.BOOLEAN) {
        return buildContextConditionNode({
          contextKey: contextSubject.contextKey,
          subFieldName: contextSubject.subFieldName,
          operand: ViewFilterOperand.IS,
          value: JSON.stringify(true),
        });
      }

      throw buildCompilationError({
        expression,
        offendingToken: describeStackItem(stackItem),
      });
    }
    case 'literal':
    case 'favoriteRecordCount':
      throw buildCompilationError({
        expression,
        offendingToken: describeStackItem(stackItem),
      });
  }
};

const compileMember = ({
  object,
  memberName,
  expression,
}: {
  object: CompilationStackItem;
  memberName: unknown;
  expression: string;
}): CompilationStackItem => {
  if (
    object.kind !== 'variable' ||
    !isNonEmptyString(memberName) ||
    !isConditionalDisplayContextKey(object.name) ||
    !isDefined(
      getConditionalDisplayContextVirtualField({
        contextKey: object.name,
        subFieldName: memberName,
      }),
    )
  ) {
    throw buildCompilationError({
      expression,
      offendingToken: `member "${String(memberName)}" of ${describeStackItem(object)}`,
    });
  }

  return { kind: 'mapEntry', contextKey: object.name, entryName: memberName };
};

const getEqualityOperand = (
  operator: string,
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
  operator: string;
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
    default:
      return undefined;
  }
};

const compileContextComparison = ({
  operator,
  left,
  literal,
}: {
  operator: string;
  left: CompilationStackItem;
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
}: {
  operator: string;
  left: CompilationStackItem;
  right: CompilationStackItem;
}): ConditionalDisplayConditionNode | undefined => {
  if (left.kind === 'favoriteRecordCount') {
    if (right.kind !== 'variable' || right.name !== 'numberOfSelectedRecords') {
      return undefined;
    }

    switch (operator) {
      case '<':
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
      default:
        return undefined;
    }
  }

  if (right.kind !== 'literal' || !isExpressionLiteral(right.value)) {
    return undefined;
  }

  return compileContextComparison({ operator, left, literal: right.value });
};

const compileBinaryOperation = ({
  operator,
  left,
  right,
  expression,
}: {
  operator: unknown;
  left: CompilationStackItem;
  right: CompilationStackItem;
  expression: string;
}): CompilationStackItem => {
  if (operator === 'and' || operator === 'or') {
    return {
      kind: 'condition',
      conditionNode: groupConditionalDisplayConditionNodes({
        logicalOperator:
          operator === 'and'
            ? RecordFilterGroupLogicalOperator.AND
            : RecordFilterGroupLogicalOperator.OR,
        conditionNodes: [
          toConditionNode({ stackItem: left, expression }),
          toConditionNode({ stackItem: right, expression }),
        ],
      }),
    };
  }

  const conditionNode = isString(operator)
    ? compileComparison({ operator, left, right })
    : undefined;

  if (!isDefined(conditionNode)) {
    throw buildCompilationError({
      expression,
      offendingToken: `operator "${String(operator)}" between ${describeStackItem(left)} and ${describeStackItem(right)}`,
    });
  }

  return { kind: 'condition', conditionNode };
};

const compileUnaryOperation = ({
  operator,
  operand,
  expression,
}: {
  operator: unknown;
  operand: CompilationStackItem;
  expression: string;
}): CompilationStackItem => {
  const conditionNode =
    operator === 'not'
      ? negateConditionalDisplayConditionNode(
          toConditionNode({ stackItem: operand, expression }),
        )
      : undefined;

  if (!isDefined(conditionNode)) {
    throw buildCompilationError({
      expression,
      offendingToken: `operator "${String(operator)}" on ${describeStackItem(operand)}`,
    });
  }

  return { kind: 'condition', conditionNode };
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

  throw buildCompilationError({
    expression,
    offendingToken: `truthiness of record path "${path}": every, some and none accept a path ending in "${LENGTH_PATH_SUFFIX}", a boolean path (${BOOLEAN_RECORD_PATHS.join(', ')}) or an identifier path (${IDENTIFIER_RECORD_PATHS.join(', ')})`,
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

const compileFunctionCall = ({
  functionItem,
  functionArguments,
  expression,
}: {
  functionItem: CompilationStackItem;
  functionArguments: CompilationStackItem[];
  expression: string;
}): CompilationStackItem | undefined => {
  if (functionItem.kind !== 'variable') {
    return undefined;
  }

  const [firstArgument, secondArgument, thirdArgument] = functionArguments;

  if (functionItem.name === 'isDefined') {
    const contextSubject =
      functionArguments.length === 1 && firstArgument?.kind === 'mapEntry'
        ? getContextSubject(firstArgument)
        : undefined;

    return isDefined(contextSubject) &&
      getFilterOperandsForFilterableFieldType({
        filterType: getFilterTypeFromFieldType(
          contextSubject.virtualField.type,
        ),
      }).includes(ViewFilterOperand.IS_NOT_EMPTY)
      ? {
          kind: 'condition',
          conditionNode: buildContextConditionNode({
            contextKey: contextSubject.contextKey,
            subFieldName: contextSubject.subFieldName,
            operand: ViewFilterOperand.IS_NOT_EMPTY,
          }),
        }
      : undefined;
  }

  if (functionItem.name === 'arrayLength') {
    return functionArguments.length === 1 &&
      firstArgument?.kind === 'variable' &&
      firstArgument.name === 'favoriteRecordIds'
      ? { kind: 'favoriteRecordCount' }
      : undefined;
  }

  if (
    firstArgument?.kind !== 'variable' ||
    firstArgument.name !== 'selectedRecords' ||
    secondArgument?.kind !== 'literal' ||
    !isNonEmptyString(secondArgument.value)
  ) {
    return undefined;
  }

  const literal =
    thirdArgument?.kind === 'literal' &&
    isExpressionLiteral(thirdArgument.value)
      ? thirdArgument.value
      : undefined;

  const conditionNode = compileRecordFunctionCall({
    functionName: functionItem.name,
    path: secondArgument.value,
    literal,
    argumentCount: functionArguments.length,
    expression,
  });

  return isDefined(conditionNode)
    ? { kind: 'condition', conditionNode }
    : undefined;
};

const compileTokens = ({
  tokens,
  expression,
}: {
  tokens: ExpressionToken[];
  expression: string;
}): CompilationStackItem => {
  const stack: CompilationStackItem[] = [];

  const popStackItem = (token: ExpressionToken): CompilationStackItem => {
    const stackItem = stack.pop();

    if (!isDefined(stackItem)) {
      throw buildCompilationError({
        expression,
        offendingToken: `token ${token.type} without operand`,
      });
    }

    return stackItem;
  };

  for (const token of tokens) {
    switch (token.type) {
      case 'INUMBER':
        stack.push({ kind: 'literal', value: token.value });
        break;
      case 'IVAR':
        if (!isNonEmptyString(token.value)) {
          throw buildCompilationError({
            expression,
            offendingToken: `variable ${JSON.stringify(token.value)}`,
          });
        }

        if (
          isConditionalDisplayContextKey(token.value) &&
          isConditionalDisplayAdminContextKey(token.value)
        ) {
          throw buildCompilationError({
            expression,
            offendingToken: `admin subject "${token.value}": engine conditions cannot carry admin subjects`,
          });
        }

        stack.push({ kind: 'variable', name: token.value });
        break;
      case 'IMEMBER':
        stack.push(
          compileMember({
            object: popStackItem(token),
            memberName: token.value,
            expression,
          }),
        );
        break;
      case 'IEXPR':
        stack.push(
          compileTokens({
            tokens: getExpressionTokens({ tokens: token.value, expression }),
            expression,
          }),
        );
        break;
      case 'IOP1':
        stack.push(
          compileUnaryOperation({
            operator: token.value,
            operand: popStackItem(token),
            expression,
          }),
        );
        break;
      case 'IOP2': {
        const right = popStackItem(token);
        const left = popStackItem(token);

        stack.push(
          compileBinaryOperation({
            operator: token.value,
            left,
            right,
            expression,
          }),
        );
        break;
      }
      case 'IFUNCALL': {
        const argumentCount = isNumber(token.value) ? token.value : 0;
        const functionArguments = Array.from({ length: argumentCount }, () =>
          popStackItem(token),
        ).reverse();
        const functionItem = popStackItem(token);
        const functionCallResult = compileFunctionCall({
          functionItem,
          functionArguments,
          expression,
        });

        if (!isDefined(functionCallResult)) {
          throw buildCompilationError({
            expression,
            offendingToken: `call of ${describeStackItem(functionItem)} with ${functionArguments.map(describeStackItem).join(', ')}`,
          });
        }

        stack.push(functionCallResult);
        break;
      }
      default:
        throw buildCompilationError({
          expression,
          offendingToken: `token ${token.type}`,
        });
    }
  }

  const [result, ...remainingStackItems] = stack;

  if (!isDefined(result) || remainingStackItems.length > 0) {
    throw buildCompilationError({
      expression,
      offendingToken: 'statement sequence',
    });
  }

  return result;
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

export const compileConditionalAvailabilityExpression = (
  expression: string,
): ConditionalDisplay | null => {
  const tokens = getExpressionTokens({
    tokens: parseExpressionTokens(expression),
    expression,
  });

  const stackItem = compileTokens({ tokens, expression });

  if (stackItem.kind === 'literal' && isBoolean(stackItem.value)) {
    return stackItem.value ? null : NEVER_AVAILABLE_CONDITIONAL_DISPLAY;
  }

  const conditionNode = toConditionNode({ stackItem, expression });

  const selectedRecordsMatches = new Set(
    collectSelectedRecordsMatches(conditionNode),
  );

  if (selectedRecordsMatches.size > 1) {
    throw buildCompilationError({
      expression,
      offendingToken: 'mix of every and some record functions',
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
    throw buildCompilationError({
      expression,
      offendingToken: `"${nonDistributingLogicalOperator.toLowerCase()}" between record functions over several selected records; guard the formula with \`numberOfSelectedRecords == 1\` at the top level, or express it as a single every/some over one path`,
    });
  }

  return buildConditionalDisplayFromConditionNode({
    conditionNode,
    source: expression,
  });
};
