import { LEGACY_DEVICE_CONDITIONAL_DISPLAY_REWRITES } from '@/constants/LegacyDeviceConditionalDisplayRewrites';
import { type ConditionalDisplay } from '@/types/conditional-display/ConditionalDisplay';
import { fastDeepEqual } from '@/utils/json/fast-deep-equal';

export const rewriteLegacyDeviceConditionalDisplay = <TConditionalDisplay>(
  conditionalDisplay: TConditionalDisplay,
): TConditionalDisplay | ConditionalDisplay =>
  LEGACY_DEVICE_CONDITIONAL_DISPLAY_REWRITES.find(
    ({ legacyConditionalDisplay }) =>
      fastDeepEqual(legacyConditionalDisplay, conditionalDisplay),
  )?.conditionalDisplay ?? conditionalDisplay;
