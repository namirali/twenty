import { type ConditionalAvailabilityExpressionNode } from 'twenty-shared/types';
import {
  buildConditionalAvailabilityCompilationError,
  isDefined,
} from 'twenty-shared/utils';
import ts from 'typescript';

type ComparisonOperator = Extract<
  ConditionalAvailabilityExpressionNode,
  { kind: 'comparison' }
>['operator'];

const COMPARISON_OPERATOR_BY_TOKEN_KIND: Partial<
  Record<ts.SyntaxKind, ComparisonOperator>
> = {
  [ts.SyntaxKind.EqualsEqualsEqualsToken]: '==',
  [ts.SyntaxKind.EqualsEqualsToken]: '==',
  [ts.SyntaxKind.ExclamationEqualsEqualsToken]: '!=',
  [ts.SyntaxKind.ExclamationEqualsToken]: '!=',
  [ts.SyntaxKind.LessThanToken]: '<',
  [ts.SyntaxKind.LessThanEqualsToken]: '<=',
  [ts.SyntaxKind.GreaterThanToken]: '>',
  [ts.SyntaxKind.GreaterThanEqualsToken]: '>=',
};

export const toConditionalAvailabilityExpressionNode = ({
  node,
  sourceFile,
}: {
  node: ts.Expression;
  sourceFile: ts.SourceFile;
}): ConditionalAvailabilityExpressionNode => {
  const expression = node.getText(sourceFile);

  const convert = (
    childNode: ts.Expression,
  ): ConditionalAvailabilityExpressionNode => {
    const throwUnsupported = (reason: string): never => {
      throw buildConditionalAvailabilityCompilationError({
        expression,
        reason: `unsupported ${reason} \`${childNode.getText(sourceFile)}\``,
      });
    };

    if (ts.isParenthesizedExpression(childNode)) {
      return convert(childNode.expression);
    }

    if (ts.isStringLiteral(childNode)) {
      return { kind: 'literal', value: childNode.text };
    }

    if (ts.isNumericLiteral(childNode)) {
      return { kind: 'literal', value: Number(childNode.text) };
    }

    if (childNode.kind === ts.SyntaxKind.TrueKeyword) {
      return { kind: 'literal', value: true };
    }

    if (childNode.kind === ts.SyntaxKind.FalseKeyword) {
      return { kind: 'literal', value: false };
    }

    if (ts.isIdentifier(childNode)) {
      return { kind: 'variable', name: childNode.text };
    }

    if (ts.isPropertyAccessExpression(childNode)) {
      if (
        isDefined(childNode.questionDotToken) ||
        !ts.isIdentifier(childNode.name)
      ) {
        return throwUnsupported('optional or private member access');
      }

      return {
        kind: 'member',
        object: convert(childNode.expression),
        memberName: childNode.name.text,
      };
    }

    if (ts.isPrefixUnaryExpression(childNode)) {
      if (childNode.operator !== ts.SyntaxKind.ExclamationToken) {
        return throwUnsupported(
          `operator "${ts.tokenToString(childNode.operator)}"`,
        );
      }

      return { kind: 'not', operand: convert(childNode.operand) };
    }

    if (ts.isBinaryExpression(childNode)) {
      const operatorKind = childNode.operatorToken.kind;
      const left = convert(childNode.left);
      const right = convert(childNode.right);

      if (operatorKind === ts.SyntaxKind.AmpersandAmpersandToken) {
        return { kind: 'logicalOperation', operator: 'and', left, right };
      }

      if (operatorKind === ts.SyntaxKind.BarBarToken) {
        return { kind: 'logicalOperation', operator: 'or', left, right };
      }

      const comparisonOperator =
        COMPARISON_OPERATOR_BY_TOKEN_KIND[operatorKind];

      if (!isDefined(comparisonOperator)) {
        return throwUnsupported(
          `operator "${childNode.operatorToken.getText(sourceFile)}"`,
        );
      }

      return { kind: 'comparison', operator: comparisonOperator, left, right };
    }

    if (ts.isCallExpression(childNode)) {
      if (
        !ts.isIdentifier(childNode.expression) ||
        isDefined(childNode.questionDotToken)
      ) {
        return throwUnsupported('call');
      }

      return {
        kind: 'functionCall',
        functionName: childNode.expression.text,
        functionArguments: childNode.arguments.map((argument) =>
          ts.isSpreadElement(argument)
            ? throwUnsupported('spread argument')
            : convert(argument),
        ),
      };
    }

    return throwUnsupported(`syntax ${ts.SyntaxKind[childNode.kind]}`);
  };

  return convert(node);
};
