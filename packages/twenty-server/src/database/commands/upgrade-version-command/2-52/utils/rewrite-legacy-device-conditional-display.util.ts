import { type ConditionalDisplay } from 'twenty-shared/types';
import { fastDeepEqual } from 'twenty-shared/utils';

import { LEGACY_DEVICE_CONDITIONAL_DISPLAY_REWRITES } from 'src/database/commands/upgrade-version-command/2-52/constants/legacy-device-conditional-display-rewrites.constant';

export const rewriteLegacyDeviceConditionalDisplay = <TConditionalDisplay>(
  conditionalDisplay: TConditionalDisplay,
): TConditionalDisplay | ConditionalDisplay =>
  LEGACY_DEVICE_CONDITIONAL_DISPLAY_REWRITES.find(
    ({ legacyConditionalDisplay }) =>
      fastDeepEqual(legacyConditionalDisplay, conditionalDisplay),
  )?.conditionalDisplay ?? conditionalDisplay;
