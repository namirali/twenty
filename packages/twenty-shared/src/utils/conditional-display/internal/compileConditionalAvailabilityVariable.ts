import { CONDITIONAL_AVAILABILITY_FAVORITE_RECORD_IDS_VARIABLE_NAME } from '@/constants/ConditionalAvailabilityFavoriteRecordIdsVariableName';
import { type ConditionalAvailabilityCompiledItem } from '@/types/conditional-display/ConditionalAvailabilityCompiledItem';
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
    throw new Error(
      `Cannot compile conditional availability expression "${expression}": unsupported admin subject "${name}": engine conditions cannot carry admin subjects`,
    );
  }

  if (
    !isConditionalDisplayContextKey(name) &&
    name !== CONDITIONAL_AVAILABILITY_FAVORITE_RECORD_IDS_VARIABLE_NAME
  ) {
    throw new Error(
      `Cannot compile conditional availability expression "${expression}": unknown variable "${name}"`,
    );
  }

  return { kind: 'variable', name };
};
