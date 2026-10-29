import { CONDITIONAL_AVAILABILITY_FAVORITE_RECORD_IDS_VARIABLE_NAME } from '@/constants/internal/ConditionalAvailabilityFavoriteRecordIdsVariableName';
import { type ConditionalAvailabilityCompiledItem } from '@/types/conditional-display/internal/ConditionalAvailabilityCompiledItem';
import { buildConditionalAvailabilityCompilationError } from '@/utils/conditional-display/internal/buildConditionalAvailabilityCompilationError';
import { isConditionalDisplayAdminContextKey } from '@/utils/conditional-display/isConditionalDisplayAdminContextKey';
import { isConditionalDisplayContextKey } from '@/utils/conditional-display/isConditionalDisplayContextKey';

export const compileConditionalAvailabilityVariable = ({
  name,
  expression,
}: {
  name: string;
  expression: string;
}): ConditionalAvailabilityCompiledItem => {
  if (isConditionalDisplayAdminContextKey(name)) {
    throw buildConditionalAvailabilityCompilationError({
      expression,
      reason: `unsupported admin subject "${name}": engine conditions cannot carry admin subjects`,
    });
  }

  if (
    !isConditionalDisplayContextKey(name) &&
    name !== CONDITIONAL_AVAILABILITY_FAVORITE_RECORD_IDS_VARIABLE_NAME
  ) {
    throw buildConditionalAvailabilityCompilationError({
      expression,
      reason: `unknown variable "${name}"`,
    });
  }

  return { kind: 'variable', name };
};
