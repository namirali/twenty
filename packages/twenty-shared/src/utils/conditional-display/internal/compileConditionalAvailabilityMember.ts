import { CONDITIONAL_AVAILABILITY_FAVORITE_RECORD_IDS_VARIABLE_NAME } from '@/constants/internal/ConditionalAvailabilityFavoriteRecordIdsVariableName';
import { type ConditionalAvailabilityCompiledItem } from '@/types/conditional-display/internal/ConditionalAvailabilityCompiledItem';
import { buildConditionalAvailabilityCompilationError } from '@/utils/conditional-display/internal/buildConditionalAvailabilityCompilationError';
import { getConditionalDisplayContextVirtualField } from '@/utils/conditional-display/getConditionalDisplayContextVirtualField';
import { describeConditionalAvailabilityCompiledItem } from '@/utils/conditional-display/internal/describeConditionalAvailabilityCompiledItem';
import { isConditionalDisplayContextKey } from '@/utils/conditional-display/isConditionalDisplayContextKey';
import { isDefined } from '@/utils/validation/isDefined';

export const compileConditionalAvailabilityMember = ({
  object,
  memberName,
  expression,
}: {
  object: ConditionalAvailabilityCompiledItem;
  memberName: string;
  expression: string;
}): ConditionalAvailabilityCompiledItem => {
  if (
    object.kind === 'variable' &&
    object.name ===
      CONDITIONAL_AVAILABILITY_FAVORITE_RECORD_IDS_VARIABLE_NAME &&
    memberName === 'length'
  ) {
    return { kind: 'favoriteRecordCount' };
  }

  if (
    object.kind !== 'variable' ||
    !isConditionalDisplayContextKey(object.name) ||
    !isDefined(
      getConditionalDisplayContextVirtualField({
        contextKey: object.name,
        subFieldName: memberName,
      }),
    )
  ) {
    throw buildConditionalAvailabilityCompilationError({
      expression,
      reason: `unsupported member "${memberName}" of ${describeConditionalAvailabilityCompiledItem(object)}`,
    });
  }

  return { kind: 'mapEntry', contextKey: object.name, entryName: memberName };
};
