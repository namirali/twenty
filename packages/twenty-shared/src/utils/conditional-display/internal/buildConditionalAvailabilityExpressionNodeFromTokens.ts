import {
  isBoolean,
  isNonEmptyString,
  isNumber,
  isString,
} from '@sniptt/guards';

import { type ConditionalAvailabilityExpressionNode } from '@/types/conditional-display/ConditionalAvailabilityExpressionNode';
import { type ConditionalAvailabilityExpressionToken } from '@/types/conditional-display/internal/ConditionalAvailabilityExpressionToken';
import { buildConditionalAvailabilityCompilationError } from '@/utils/conditional-display/internal/buildConditionalAvailabilityCompilationError';
import { getConditionalAvailabilityExpressionTokens } from '@/utils/conditional-display/internal/getConditionalAvailabilityExpressionTokens';
import { toConditionalAvailabilityBinaryExpressionNode } from '@/utils/conditional-display/internal/toConditionalAvailabilityBinaryExpressionNode';
import { isDefined } from '@/utils/validation/isDefined';

export const buildConditionalAvailabilityExpressionNodeFromTokens = ({
  tokens,
  expression,
}: {
  tokens: ConditionalAvailabilityExpressionToken[];
  expression: string;
}): ConditionalAvailabilityExpressionNode => {
  const stack: ConditionalAvailabilityExpressionNode[] = [];

  const popExpressionNode = (
    token: ConditionalAvailabilityExpressionToken,
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
          buildConditionalAvailabilityExpressionNodeFromTokens({
            tokens: getConditionalAvailabilityExpressionTokens({
              tokens: token.value,
              expression,
            }),
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
          toConditionalAvailabilityBinaryExpressionNode({
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
