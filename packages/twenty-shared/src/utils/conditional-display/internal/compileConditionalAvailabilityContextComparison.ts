import { isBoolean, isNumber, isString } from '@sniptt/guards';

import { type ConditionalAvailabilityComparisonOperator } from '@/types/conditional-display/internal/ConditionalAvailabilityComparisonOperator';
import { type ConditionalAvailabilityCompiledItem } from '@/types/conditional-display/internal/ConditionalAvailabilityCompiledItem';
import { type ConditionalAvailabilityExpressionLiteral } from '@/types/conditional-display/internal/ConditionalAvailabilityExpressionLiteral';
import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';
import { FieldMetadataType } from '@/types/FieldMetadataType';
import { ViewFilterOperand } from '@/types/ViewFilterOperand';
import { buildConditionalDisplayContextConditionNode } from '@/utils/conditional-display/internal/buildConditionalDisplayContextConditionNode';
import { compileConditionalAvailabilityCountComparison } from '@/utils/conditional-display/internal/compileConditionalAvailabilityCountComparison';
import { getConditionalAvailabilityContextSubject } from '@/utils/conditional-display/internal/getConditionalAvailabilityContextSubject';
import { getConditionalAvailabilityEqualityOperand } from '@/utils/conditional-display/internal/getConditionalAvailabilityEqualityOperand';
import { isDefined } from '@/utils/validation/isDefined';

export const compileConditionalAvailabilityContextComparison = ({
  operator,
  left,
  literal,
}: {
  operator: ConditionalAvailabilityComparisonOperator;
  left: ConditionalAvailabilityCompiledItem;
  literal: ConditionalAvailabilityExpressionLiteral;
}): ConditionalDisplayConditionNode | undefined => {
  const contextSubject = getConditionalAvailabilityContextSubject(left);

  if (!isDefined(contextSubject)) {
    return undefined;
  }

  const { contextKey, subFieldName, virtualField } = contextSubject;
  const equalityOperand = getConditionalAvailabilityEqualityOperand(operator);

  switch (virtualField.type) {
    case FieldMetadataType.BOOLEAN:
      return isDefined(equalityOperand) && isBoolean(literal)
        ? buildConditionalDisplayContextConditionNode({
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
        ? buildConditionalDisplayContextConditionNode({
            contextKey,
            subFieldName,
            operand: equalityOperand,
            value: JSON.stringify([literal]),
          })
        : undefined;
    case FieldMetadataType.NUMBER:
      return isNumber(literal) && Number.isInteger(literal)
        ? compileConditionalAvailabilityCountComparison({
            contextKey,
            operator,
            count: literal,
          })
        : undefined;
    default:
      return undefined;
  }
};
