import { type ConditionalAvailabilityCompiledItem } from '@/types/conditional-display/internal/ConditionalAvailabilityCompiledItem';
import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';
import { ViewFilterOperand } from '@/types/ViewFilterOperand';
import { buildConditionalDisplayContextConditionNode } from '@/utils/conditional-display/internal/buildConditionalDisplayContextConditionNode';
import { getConditionalAvailabilityContextSubject } from '@/utils/conditional-display/internal/getConditionalAvailabilityContextSubject';
import { getFilterOperandsForFilterableFieldType } from '@/utils/filter/utils/getFilterOperandsForFilterableFieldType';
import { getFilterTypeFromFieldType } from '@/utils/filter/utils/getFilterTypeFromFieldType';
import { isDefined } from '@/utils/validation/isDefined';

export const compileConditionalAvailabilityIsDefinedCall = (
  functionArguments: ConditionalAvailabilityCompiledItem[],
): ConditionalDisplayConditionNode | undefined => {
  const [firstArgument] = functionArguments;
  const contextSubject =
    functionArguments.length === 1 && firstArgument?.kind === 'mapEntry'
      ? getConditionalAvailabilityContextSubject(firstArgument)
      : undefined;

  return isDefined(contextSubject) &&
    getFilterOperandsForFilterableFieldType({
      filterType: getFilterTypeFromFieldType(contextSubject.virtualField.type),
    }).includes(ViewFilterOperand.IS_NOT_EMPTY)
    ? buildConditionalDisplayContextConditionNode({
        contextKey: contextSubject.contextKey,
        subFieldName: contextSubject.subFieldName,
        operand: ViewFilterOperand.IS_NOT_EMPTY,
      })
    : undefined;
};
