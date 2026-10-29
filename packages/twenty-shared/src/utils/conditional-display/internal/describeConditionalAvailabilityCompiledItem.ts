import { CONDITIONAL_AVAILABILITY_FAVORITE_RECORD_IDS_VARIABLE_NAME } from '@/constants/ConditionalAvailabilityFavoriteRecordIdsVariableName';
import { type ConditionalAvailabilityCompiledItem } from '@/types/conditional-display/ConditionalAvailabilityCompiledItem';

export const describeConditionalAvailabilityCompiledItem = (
  compiledItem: ConditionalAvailabilityCompiledItem,
): string => {
  switch (compiledItem.kind) {
    case 'variable':
      return `variable "${compiledItem.name}"`;
    case 'mapEntry':
      return `member "${compiledItem.contextKey}.${compiledItem.entryName}"`;
    case 'literal':
      return `literal ${JSON.stringify(compiledItem.value)}`;
    case 'list':
      return `list ${JSON.stringify(compiledItem.values)}`;
    case 'favoriteRecordCount':
      return `${CONDITIONAL_AVAILABILITY_FAVORITE_RECORD_IDS_VARIABLE_NAME}.length`;
    case 'condition':
      return 'condition';
  }
};
