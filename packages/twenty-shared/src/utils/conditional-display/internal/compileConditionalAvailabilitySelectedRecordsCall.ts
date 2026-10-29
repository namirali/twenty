import { isNonEmptyString } from '@sniptt/guards';

import { type ConditionalAvailabilityCompiledItem } from '@/types/conditional-display/ConditionalAvailabilityCompiledItem';
import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';
import { compileConditionalAvailabilitySelectedRecordsFunction } from '@/utils/conditional-display/internal/compileConditionalAvailabilitySelectedRecordsFunction';
import { describeConditionalAvailabilityCompiledItem } from '@/utils/conditional-display/internal/describeConditionalAvailabilityCompiledItem';
import { isDefined } from '@/utils/validation/isDefined';

export const compileConditionalAvailabilitySelectedRecordsCall = ({
  functionName,
  functionArguments,
  expression,
}: {
  functionName: string;
  functionArguments: ConditionalAvailabilityCompiledItem[];
  expression: string;
}): ConditionalDisplayConditionNode | undefined => {
  const [firstArgument, secondArgument, thirdArgument] = functionArguments;

  if (
    firstArgument?.kind !== 'variable' ||
    firstArgument.name !== 'selectedRecords'
  ) {
    throw new Error(
      `Cannot compile conditional availability expression "${expression}": ${functionName} over ${isDefined(firstArgument) ? describeConditionalAvailabilityCompiledItem(firstArgument) : 'nothing'}: ${functionName} only accepts selectedRecords as its first argument`,
    );
  }

  if (
    secondArgument?.kind !== 'literal' ||
    !isNonEmptyString(secondArgument.value)
  ) {
    throw new Error(
      `Cannot compile conditional availability expression "${expression}": ${functionName} needs a record field path string as its second argument`,
    );
  }

  return compileConditionalAvailabilitySelectedRecordsFunction({
    functionName,
    path: secondArgument.value,
    literal:
      thirdArgument?.kind === 'literal' ? thirdArgument.value : undefined,
    argumentCount: functionArguments.length,
  });
};
