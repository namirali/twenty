import {
  isArray,
  isBoolean,
  isNonEmptyString,
  isNumber,
  isObject,
  isString,
} from '@sniptt/guards';

import { type ConditionalAvailabilityExpressionNode } from '@/types/conditional-display/ConditionalAvailabilityExpressionNode';
import { type ConditionalDisplay } from '@/types/conditional-display/ConditionalDisplay';
import { conditionalAvailabilityParser } from '@/utils/command-menu-items/conditionalAvailabilityParser';
import { buildConditionalAvailabilityCompilationError } from '@/utils/conditional-display/buildConditionalAvailabilityCompilationError';
import { compileConditionalAvailabilityExpressionNode } from '@/utils/conditional-display/compileConditionalAvailabilityExpressionNode';
import { isDefined } from '@/utils/validation/isDefined';

type ExpressionToken = {
  type: string;
  value: unknown;
};

type ComparisonOperator = Extract<
  ConditionalAvailabilityExpressionNode,
  { kind: 'comparison' }
>['operator'];

const COMPARISON_OPERATORS: ComparisonOperator[] = [
  '==',
  '!=',
  '<',
  '<=',
  '>',
  '>=',
];

const isExpressionToken = (value: unknown): value is ExpressionToken =>
  isObject(value) &&
  'type' in value &&
  isString(value.type) &&
  'value' in value;

const isComparisonOperator = (value: unknown): value is ComparisonOperator =>
  COMPARISON_OPERATORS.some((operator) => operator === value);

const parseExpressionTokens = (expression: string): unknown => {
  try {
    const parsedExpression = conditionalAvailabilityParser.parse(expression);

    return 'tokens' in parsedExpression ? parsedExpression.tokens : undefined;
  } catch (error) {
    throw buildConditionalAvailabilityCompilationError({
      expression,
      reason: `unsupported syntax (${error instanceof Error ? error.message : String(error)})`,
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
    throw buildConditionalAvailabilityCompilationError({
      expression,
      reason: 'unsupported parsed token list',
    });
  }

  return tokens;
};

const toBinaryExpressionNode = ({
  operator,
  left,
  right,
  expression,
}: {
  operator: unknown;
  left: ConditionalAvailabilityExpressionNode;
  right: ConditionalAvailabilityExpressionNode;
  expression: string;
}): ConditionalAvailabilityExpressionNode => {
  if (operator === 'and' || operator === 'or') {
    return { kind: 'logicalOperation', operator, left, right };
  }

  if (isComparisonOperator(operator)) {
    return { kind: 'comparison', operator, left, right };
  }

  throw buildConditionalAvailabilityCompilationError({
    expression,
    reason: `unsupported operator "${String(operator)}"`,
  });
};

const toExpressionNode = ({
  tokens,
  expression,
}: {
  tokens: ExpressionToken[];
  expression: string;
}): ConditionalAvailabilityExpressionNode => {
  const stack: ConditionalAvailabilityExpressionNode[] = [];

  const popExpressionNode = (
    token: ExpressionToken,
  ): ConditionalAvailabilityExpressionNode => {
    const expressionNode = stack.pop();

    if (!isDefined(expressionNode)) {
      throw buildConditionalAvailabilityCompilationError({
        expression,
        reason: `unsupported token ${token.type} without operand`,
      });
    }

    return expressionNode;
  };

  for (const token of tokens) {
    switch (token.type) {
      case 'INUMBER':
        if (
          !isString(token.value) &&
          !isNumber(token.value) &&
          !isBoolean(token.value)
        ) {
          throw buildConditionalAvailabilityCompilationError({
            expression,
            reason: `unsupported literal ${JSON.stringify(token.value)}`,
          });
        }

        stack.push({ kind: 'literal', value: token.value });
        break;
      case 'IVAR':
        if (!isNonEmptyString(token.value)) {
          throw buildConditionalAvailabilityCompilationError({
            expression,
            reason: `unsupported variable ${JSON.stringify(token.value)}`,
          });
        }

        stack.push({ kind: 'variable', name: token.value });
        break;
      case 'IMEMBER': {
        const object = popExpressionNode(token);

        if (!isNonEmptyString(token.value)) {
          throw buildConditionalAvailabilityCompilationError({
            expression,
            reason: `unsupported member ${JSON.stringify(token.value)}`,
          });
        }

        stack.push({ kind: 'member', object, memberName: token.value });
        break;
      }
      case 'IEXPR':
        stack.push(
          toExpressionNode({
            tokens: getExpressionTokens({ tokens: token.value, expression }),
            expression,
          }),
        );
        break;
      case 'IOP1': {
        const operand = popExpressionNode(token);

        if (token.value !== 'not') {
          throw buildConditionalAvailabilityCompilationError({
            expression,
            reason: `unsupported operator "${String(token.value)}"`,
          });
        }

        stack.push({ kind: 'not', operand });
        break;
      }
      case 'IOP2': {
        const right = popExpressionNode(token);
        const left = popExpressionNode(token);

        stack.push(
          toBinaryExpressionNode({
            operator: token.value,
            left,
            right,
            expression,
          }),
        );
        break;
      }
      case 'IARRAY': {
        const elementCount = isNumber(token.value) ? token.value : 0;
        const elements = Array.from({ length: elementCount }, () =>
          popExpressionNode(token),
        ).reverse();

        stack.push({ kind: 'list', elements });
        break;
      }
      case 'IFUNCALL': {
        const argumentCount = isNumber(token.value) ? token.value : 0;
        const functionArguments = Array.from({ length: argumentCount }, () =>
          popExpressionNode(token),
        ).reverse();
        const callee = popExpressionNode(token);

        if (callee.kind !== 'variable') {
          throw buildConditionalAvailabilityCompilationError({
            expression,
            reason: 'unsupported call of a non-function',
          });
        }

        stack.push({
          kind: 'functionCall',
          functionName: callee.name,
          functionArguments,
        });
        break;
      }
      default:
        throw buildConditionalAvailabilityCompilationError({
          expression,
          reason: `unsupported token ${token.type}`,
        });
    }
  }

  const [expressionNode, ...remainingExpressionNodes] = stack;

  if (!isDefined(expressionNode) || remainingExpressionNodes.length > 0) {
    throw buildConditionalAvailabilityCompilationError({
      expression,
      reason: 'unsupported statement sequence',
    });
  }

  return expressionNode;
};

export const compileConditionalAvailabilityExpression = (
  expression: string,
): ConditionalDisplay | null =>
  compileConditionalAvailabilityExpressionNode({
    expressionNode: toExpressionNode({
      tokens: getExpressionTokens({
        tokens: parseExpressionTokens(expression),
        expression,
      }),
      expression,
    }),
    expression,
    source: expression,
  });
