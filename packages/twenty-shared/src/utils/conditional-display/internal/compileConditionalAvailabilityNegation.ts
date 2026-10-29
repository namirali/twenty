import { type ConditionalAvailabilityCompiledItem } from '@/types/conditional-display/ConditionalAvailabilityCompiledItem';
import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';
import { describeConditionalAvailabilityCompiledItem } from '@/utils/conditional-display/internal/describeConditionalAvailabilityCompiledItem';
import { toConditionalAvailabilityConditionNode } from '@/utils/conditional-display/internal/toConditionalAvailabilityConditionNode';
import { negateConditionalDisplayConditionNode } from '@/utils/conditional-display/negateConditionalDisplayConditionNode';
import { isDefined } from '@/utils/validation/isDefined';

export const compileConditionalAvailabilityNegation = ({
  operand,
  expression,
}: {
  operand: ConditionalAvailabilityCompiledItem;
  expression: string;
}): ConditionalDisplayConditionNode => {
  const conditionNode = negateConditionalDisplayConditionNode(
    toConditionalAvailabilityConditionNode({
      compiledItem: operand,
      expression,
    }),
  );

  if (!isDefined(conditionNode)) {
    throw new Error(
      `Cannot compile conditional availability expression "${expression}": unsupported operator "not" on ${describeConditionalAvailabilityCompiledItem(operand)}`,
    );
  }

  return conditionNode;
};
