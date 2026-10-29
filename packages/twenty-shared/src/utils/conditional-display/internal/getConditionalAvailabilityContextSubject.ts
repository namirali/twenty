import { type ConditionalAvailabilityCompiledItem } from '@/types/conditional-display/ConditionalAvailabilityCompiledItem';
import { type ConditionalAvailabilityContextSubject } from '@/types/conditional-display/ConditionalAvailabilityContextSubject';
import { getConditionalDisplayContextVirtualField } from '@/utils/conditional-display/getConditionalDisplayContextVirtualField';
import { isConditionalDisplayContextKey } from '@/utils/conditional-display/isConditionalDisplayContextKey';
import { isDefined } from '@/utils/validation/isDefined';

export const getConditionalAvailabilityContextSubject = (
  compiledItem: ConditionalAvailabilityCompiledItem,
): ConditionalAvailabilityContextSubject | undefined => {
  if (compiledItem.kind !== 'mapEntry' && compiledItem.kind !== 'variable') {
    return undefined;
  }

  const contextKey =
    compiledItem.kind === 'mapEntry'
      ? compiledItem.contextKey
      : compiledItem.name;
  const subFieldName =
    compiledItem.kind === 'mapEntry' ? compiledItem.entryName : undefined;

  if (!isConditionalDisplayContextKey(contextKey)) {
    return undefined;
  }

  const virtualField = getConditionalDisplayContextVirtualField({
    contextKey,
    subFieldName,
  });

  return isDefined(virtualField)
    ? { contextKey, subFieldName, virtualField }
    : undefined;
};
