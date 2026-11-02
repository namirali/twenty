import { type ConditionalAvailabilityCompiledItem } from '@/types/conditional-display/internal/ConditionalAvailabilityCompiledItem';
import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';
import { FieldMetadataType } from '@/types/FieldMetadataType';
import { ViewFilterOperand } from '@/types/ViewFilterOperand';
import { buildConditionalAvailabilityCompilationError } from '@/utils/conditional-display/internal/buildConditionalAvailabilityCompilationError';
import { buildConditionalDisplayContextConditionNode } from '@/utils/conditional-display/internal/buildConditionalDisplayContextConditionNode';
import { describeConditionalAvailabilityCompiledItem } from '@/utils/conditional-display/internal/describeConditionalAvailabilityCompiledItem';
import { getConditionalAvailabilityContextSubject } from '@/utils/conditional-display/internal/getConditionalAvailabilityContextSubject';
import { isDefined } from '@/utils/validation/isDefined';

export const compileConditionalAvailabilityIsNonEmptyStringCall = ({
  functionArguments,
  expression,
}: {
  functionArguments: ConditionalAvailabilityCompiledItem[];
  expression: string;
}): ConditionalDisplayConditionNode => {
  const [firstArgument] = functionArguments;
  const contextSubject =
    functionArguments.length === 1 && isDefined(firstArgument)
      ? getConditionalAvailabilityContextSubject(firstArgument)
      : undefined;
  const virtualFieldType = contextSubject?.virtualField.type;

  if (
    !isDefined(contextSubject) ||
    (virtualFieldType !== FieldMetadataType.SELECT &&
      virtualFieldType !== FieldMetadataType.TEXT)
  ) {
    throw buildConditionalAvailabilityCompilationError({
      expression,
      reason: `unsupported call of isNonEmptyString(${functionArguments.map(describeConditionalAvailabilityCompiledItem).join(', ')}): isNonEmptyString accepts a text context value (pageType, objectMetadataItem.nameSingular or objectMetadataLabel); use isDefined(...) for other context values and someNonEmptyString(selectedRecords, "path") for record fields`,
    });
  }

  return buildConditionalDisplayContextConditionNode({
    contextKey: contextSubject.contextKey,
    subFieldName: contextSubject.subFieldName,
    operand: ViewFilterOperand.IS_NOT_EMPTY,
  });
};
