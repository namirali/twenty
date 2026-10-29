import { isConditionalDisplay } from '@/utils/conditional-display/isConditionalDisplay';
import { isPlainObject } from '@/utils/typeguard/isPlainObject';

export const isLegacyJsonLogicConditionalDisplay = (
  conditionalDisplay: unknown,
): conditionalDisplay is Record<string, unknown> =>
  isPlainObject(conditionalDisplay) &&
  !isConditionalDisplay(conditionalDisplay);
