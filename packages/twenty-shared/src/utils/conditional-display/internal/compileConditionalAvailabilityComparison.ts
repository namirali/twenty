import { CONDITIONAL_AVAILABILITY_FAVORITE_RECORD_IDS_VARIABLE_NAME } from '@/constants/ConditionalAvailabilityFavoriteRecordIdsVariableName';
import { type ConditionalAvailabilityComparisonOperator } from '@/types/conditional-display/ConditionalAvailabilityComparisonOperator';
import { type ConditionalAvailabilityCompiledItem } from '@/types/conditional-display/ConditionalAvailabilityCompiledItem';
import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';
import { ViewFilterOperand } from '@/types/ViewFilterOperand';
import { buildConditionalDisplayContextConditionNode } from '@/utils/conditional-display/internal/buildConditionalDisplayContextConditionNode';
import { compileConditionalAvailabilityContextComparison } from '@/utils/conditional-display/internal/compileConditionalAvailabilityContextComparison';
import { describeConditionalAvailabilityCompiledItem } from '@/utils/conditional-display/internal/describeConditionalAvailabilityCompiledItem';
import { isDefined } from '@/utils/validation/isDefined';

export const compileConditionalAvailabilityComparison = ({
  operator,
  left,
  right,
  expression,
}: {
  operator: ConditionalAvailabilityComparisonOperator;
  left: ConditionalAvailabilityCompiledItem;
  right: ConditionalAvailabilityCompiledItem;
  expression: string;
}): ConditionalDisplayConditionNode => {
  if (
    left.kind === 'favoriteRecordCount' &&
    right.kind === 'variable' &&
    right.name === 'numberOfSelectedRecords'
  ) {
    switch (operator) {
      case '<':
      case '!=':
        return buildConditionalDisplayContextConditionNode({
          contextKey: 'areAllSelectedRecordsFavorites',
          operand: ViewFilterOperand.IS,
          value: JSON.stringify(false),
        });
      case '==':
        return buildConditionalDisplayContextConditionNode({
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
    throw new Error(
      `Cannot compile conditional availability expression "${expression}": unsupported comparison of ${CONDITIONAL_AVAILABILITY_FAVORITE_RECORD_IDS_VARIABLE_NAME}.length: write ${CONDITIONAL_AVAILABILITY_FAVORITE_RECORD_IDS_VARIABLE_NAME}.length == numberOfSelectedRecords when every selected record is a favorite, or ${CONDITIONAL_AVAILABILITY_FAVORITE_RECORD_IDS_VARIABLE_NAME}.length < numberOfSelectedRecords when at least one is not`,
    );
  }

  const conditionNode =
    right.kind === 'literal'
      ? compileConditionalAvailabilityContextComparison({
          operator,
          left,
          literal: right.value,
        })
      : undefined;

  if (!isDefined(conditionNode)) {
    throw new Error(
      `Cannot compile conditional availability expression "${expression}": unsupported operator "${operator}" between ${describeConditionalAvailabilityCompiledItem(left)} and ${describeConditionalAvailabilityCompiledItem(right)}`,
    );
  }

  return conditionNode;
};
