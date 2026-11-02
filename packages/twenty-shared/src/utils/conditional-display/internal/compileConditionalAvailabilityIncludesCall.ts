import { isString } from '@sniptt/guards';

import { type ConditionalAvailabilityCompiledItem } from '@/types/conditional-display/internal/ConditionalAvailabilityCompiledItem';
import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';
import { FieldMetadataType } from '@/types/FieldMetadataType';
import { ViewFilterOperand } from '@/types/ViewFilterOperand';
import { buildConditionalAvailabilityCompilationError } from '@/utils/conditional-display/internal/buildConditionalAvailabilityCompilationError';
import { buildConditionalDisplayContextConditionNode } from '@/utils/conditional-display/internal/buildConditionalDisplayContextConditionNode';
import { describeConditionalAvailabilityCompiledItem } from '@/utils/conditional-display/internal/describeConditionalAvailabilityCompiledItem';
import { getConditionalAvailabilityContextSubject } from '@/utils/conditional-display/internal/getConditionalAvailabilityContextSubject';
import { isDefined } from '@/utils/validation/isDefined';

export const compileConditionalAvailabilityIncludesCall = ({
  functionArguments,
  expression,
}: {
  functionArguments: ConditionalAvailabilityCompiledItem[];
  expression: string;
}): ConditionalDisplayConditionNode => {
  const [firstArgument, secondArgument] = functionArguments;
  const contextSubject =
    functionArguments.length === 2 && isDefined(secondArgument)
      ? getConditionalAvailabilityContextSubject(secondArgument)
      : undefined;
  const values =
    firstArgument?.kind === 'list' && firstArgument.values.every(isString)
      ? firstArgument.values.filter(isString)
      : [];
  const options = contextSubject?.virtualField.options;

  if (
    !isDefined(contextSubject) ||
    contextSubject.virtualField.type !== FieldMetadataType.SELECT ||
    values.length === 0 ||
    (isDefined(options) && !values.every((value) => options.includes(value)))
  ) {
    throw buildConditionalAvailabilityCompilationError({
      expression,
      reason: `unsupported call of includes(${functionArguments.map(describeConditionalAvailabilityCompiledItem).join(', ')}): includes accepts a list of values followed by a text context value, e.g. includes(["INDEX_PAGE", "RECORD_PAGE"], pageType); use someEquals or includesSome(selectedRecords, "path", value) for record fields`,
    });
  }

  return buildConditionalDisplayContextConditionNode({
    contextKey: contextSubject.contextKey,
    subFieldName: contextSubject.subFieldName,
    operand: ViewFilterOperand.IS,
    value: JSON.stringify(values),
  });
};
