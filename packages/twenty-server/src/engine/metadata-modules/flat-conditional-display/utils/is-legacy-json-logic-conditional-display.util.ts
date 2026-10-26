import { isArray } from '@sniptt/guards';
import { isDefined, isPlainObject } from 'twenty-shared/utils';

export const isLegacyJsonLogicConditionalDisplay = (
  conditionalDisplay: unknown,
): boolean =>
  isDefined(conditionalDisplay) &&
  !(
    isPlainObject(conditionalDisplay) &&
    isArray(conditionalDisplay.recordFilters)
  );
