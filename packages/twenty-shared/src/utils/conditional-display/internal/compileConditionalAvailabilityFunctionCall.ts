import { CONDITIONAL_AVAILABILITY_FAVORITE_RECORD_IDS_VARIABLE_NAME } from '@/constants/internal/ConditionalAvailabilityFavoriteRecordIdsVariableName';
import { CONDITIONAL_AVAILABILITY_SELECTED_RECORDS_FUNCTION_NAMES } from '@/constants/internal/ConditionalAvailabilitySelectedRecordsFunctionNames';
import { type ConditionalAvailabilityCompiledItem } from '@/types/conditional-display/internal/ConditionalAvailabilityCompiledItem';
import { buildConditionalAvailabilityCompilationError } from '@/utils/conditional-display/internal/buildConditionalAvailabilityCompilationError';
import { compileConditionalAvailabilityIncludesCall } from '@/utils/conditional-display/internal/compileConditionalAvailabilityIncludesCall';
import { compileConditionalAvailabilityIsDefinedCall } from '@/utils/conditional-display/internal/compileConditionalAvailabilityIsDefinedCall';
import { compileConditionalAvailabilityIsNonEmptyStringCall } from '@/utils/conditional-display/internal/compileConditionalAvailabilityIsNonEmptyStringCall';
import { compileConditionalAvailabilitySelectedRecordsCall } from '@/utils/conditional-display/internal/compileConditionalAvailabilitySelectedRecordsCall';
import { describeConditionalAvailabilityCompiledItem } from '@/utils/conditional-display/internal/describeConditionalAvailabilityCompiledItem';
import { isDefined } from '@/utils/validation/isDefined';

export const compileConditionalAvailabilityFunctionCall = ({
  functionName,
  functionArguments,
  expression,
}: {
  functionName: string;
  functionArguments: ConditionalAvailabilityCompiledItem[];
  expression: string;
}): ConditionalAvailabilityCompiledItem => {
  const [firstArgument] = functionArguments;

  if (
    functionName === 'arrayLength' &&
    functionArguments.length === 1 &&
    firstArgument?.kind === 'variable' &&
    firstArgument.name ===
      CONDITIONAL_AVAILABILITY_FAVORITE_RECORD_IDS_VARIABLE_NAME
  ) {
    return { kind: 'favoriteRecordCount' };
  }

  if (functionName === 'isNonEmptyString') {
    return {
      kind: 'condition',
      conditionNode: compileConditionalAvailabilityIsNonEmptyStringCall({
        functionArguments,
        expression,
      }),
    };
  }

  if (functionName === 'includes') {
    return {
      kind: 'condition',
      conditionNode: compileConditionalAvailabilityIncludesCall({
        functionArguments,
        expression,
      }),
    };
  }

  const conditionNode =
    functionName === 'isDefined'
      ? compileConditionalAvailabilityIsDefinedCall(functionArguments)
      : CONDITIONAL_AVAILABILITY_SELECTED_RECORDS_FUNCTION_NAMES.includes(
            functionName,
          )
        ? compileConditionalAvailabilitySelectedRecordsCall({
            functionName,
            functionArguments,
            expression,
          })
        : undefined;

  if (!isDefined(conditionNode)) {
    throw buildConditionalAvailabilityCompilationError({
      expression,
      reason: `unsupported call of ${functionName}(${functionArguments.map(describeConditionalAvailabilityCompiledItem).join(', ')})`,
    });
  }

  return { kind: 'condition', conditionNode };
};
