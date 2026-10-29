import { CONDITIONAL_AVAILABILITY_SUPPORTED_FUNCTION_NAMES } from '@/constants/ConditionalAvailabilitySupportedFunctionNames';
import { type ConditionalAvailabilityCompiledItem } from '@/types/conditional-display/ConditionalAvailabilityCompiledItem';
import { type ConditionalAvailabilityExpressionNode } from '@/types/conditional-display/ConditionalAvailabilityExpressionNode';
import { compileConditionalAvailabilityComparison } from '@/utils/conditional-display/internal/compileConditionalAvailabilityComparison';
import { compileConditionalAvailabilityFunctionCall } from '@/utils/conditional-display/internal/compileConditionalAvailabilityFunctionCall';
import { compileConditionalAvailabilityLogicalOperation } from '@/utils/conditional-display/internal/compileConditionalAvailabilityLogicalOperation';
import { compileConditionalAvailabilityMember } from '@/utils/conditional-display/internal/compileConditionalAvailabilityMember';
import { compileConditionalAvailabilityNegation } from '@/utils/conditional-display/internal/compileConditionalAvailabilityNegation';
import { compileConditionalAvailabilityVariable } from '@/utils/conditional-display/internal/compileConditionalAvailabilityVariable';

export const compileConditionalAvailabilityCompiledItem = ({
  expressionNode,
  expression,
}: {
  expressionNode: ConditionalAvailabilityExpressionNode;
  expression: string;
}): ConditionalAvailabilityCompiledItem => {
  const compileOperand = (operand: ConditionalAvailabilityExpressionNode) =>
    compileConditionalAvailabilityCompiledItem({
      expressionNode: operand,
      expression,
    });

  switch (expressionNode.kind) {
    case 'literal':
      return { kind: 'literal', value: expressionNode.value };
    case 'list':
      return {
        kind: 'list',
        values: expressionNode.elements.map((element) => {
          if (element.kind !== 'literal') {
            throw new Error(
              `Cannot compile conditional availability expression "${expression}": unsupported list element: lists only accept literals`,
            );
          }

          return element.value;
        }),
      };
    case 'variable':
      return compileConditionalAvailabilityVariable({
        name: expressionNode.name,
        expression,
      });
    case 'member':
      return compileConditionalAvailabilityMember({
        object: compileOperand(expressionNode.object),
        memberName: expressionNode.memberName,
        expression,
      });
    case 'not':
      return {
        kind: 'condition',
        conditionNode: compileConditionalAvailabilityNegation({
          operand: compileOperand(expressionNode.operand),
          expression,
        }),
      };
    case 'logicalOperation':
      return {
        kind: 'condition',
        conditionNode: compileConditionalAvailabilityLogicalOperation({
          operator: expressionNode.operator,
          left: compileOperand(expressionNode.left),
          right: compileOperand(expressionNode.right),
          expression,
        }),
      };
    case 'comparison':
      return {
        kind: 'condition',
        conditionNode: compileConditionalAvailabilityComparison({
          operator: expressionNode.operator,
          left: compileOperand(expressionNode.left),
          right: compileOperand(expressionNode.right),
          expression,
        }),
      };
    case 'functionCall':
      if (
        !CONDITIONAL_AVAILABILITY_SUPPORTED_FUNCTION_NAMES.includes(
          expressionNode.functionName,
        )
      ) {
        throw new Error(
          `Cannot compile conditional availability expression "${expression}": unsupported function "${expressionNode.functionName}"`,
        );
      }

      return compileConditionalAvailabilityFunctionCall({
        functionName: expressionNode.functionName,
        functionArguments: expressionNode.functionArguments.map(compileOperand),
        expression,
      });
  }
};
