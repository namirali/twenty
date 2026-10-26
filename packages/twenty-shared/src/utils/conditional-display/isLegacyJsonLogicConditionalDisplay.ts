import { isArray } from '@sniptt/guards';

import { isPlainObject } from '@/utils/typeguard/isPlainObject';
import { isDefined } from '@/utils/validation/isDefined';

export const isLegacyJsonLogicConditionalDisplay = (
  conditionalDisplay: unknown,
): boolean =>
  isDefined(conditionalDisplay) &&
  !(
    isPlainObject(conditionalDisplay) &&
    isArray(conditionalDisplay.recordFilters)
  );
