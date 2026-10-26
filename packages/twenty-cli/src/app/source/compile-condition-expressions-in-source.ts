import { compileConditionalAvailabilityExpressionNode } from 'twenty-shared/utils';
import ts from 'typescript';

import { printConditionalAvailabilityIdSeed } from '@/app/source/print-conditional-availability-id-seed';
import { toConditionalAvailabilityExpressionNode } from '@/app/source/to-conditional-availability-expression-node';
import { type CompiledConditionExpression } from '@/app/source/types/compiled-condition-expression.type';

const CONDITION_EXPRESSION_PROPERTY_NAMES = [
  'conditionalAvailabilityExpression',
  'conditionalPinnedExpression',
];

const compileConditionExpression = ({
  node,
  sourceFile,
}: {
  node: ts.Expression;
  sourceFile: ts.SourceFile;
}): CompiledConditionExpression => {
  const expression = node.getText(sourceFile);

  try {
    return {
      expression,
      conditionalDisplay: compileConditionalAvailabilityExpressionNode({
        expressionNode: toConditionalAvailabilityExpressionNode({
          node,
          sourceFile,
        }),
        expression,
        source: printConditionalAvailabilityIdSeed(expression),
      }),
    };
  } catch (error) {
    return {
      expression,
      errorMessage: error instanceof Error ? error.message : String(error),
    };
  }
};

const collectConditionExpressionNodes = (
  sourceFile: ts.SourceFile,
): ts.Expression[] => {
  const expressionNodes: ts.Expression[] = [];

  const visit = (node: ts.Node) => {
    if (
      ts.isPropertyAssignment(node) &&
      (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) &&
      CONDITION_EXPRESSION_PROPERTY_NAMES.includes(node.name.text) &&
      !ts.isStringLiteralLike(node.initializer)
    ) {
      expressionNodes.push(node.initializer);

      return;
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  return expressionNodes;
};

export const compileConditionExpressionsInSource = ({
  source,
  filePath,
}: {
  source: string;
  filePath: string;
}): string => {
  if (
    !CONDITION_EXPRESSION_PROPERTY_NAMES.some((propertyName) =>
      source.includes(propertyName),
    )
  ) {
    return source;
  }

  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

  return collectConditionExpressionNodes(sourceFile)
    .reverse()
    .reduce(
      (compiledSource, node) =>
        compiledSource.slice(0, node.getStart(sourceFile)) +
        JSON.stringify(compileConditionExpression({ node, sourceFile })) +
        compiledSource.slice(node.getEnd()),
      source,
    );
};
