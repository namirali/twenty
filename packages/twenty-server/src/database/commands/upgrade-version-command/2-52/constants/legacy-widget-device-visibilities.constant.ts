import { type ConditionalDisplay } from 'twenty-shared/types';

import { STANDARD_DEVICE_DESKTOP_CONDITIONAL_DISPLAY } from 'src/engine/workspace-manager/twenty-standard-application/constants/standard-device-desktop-conditional-display.constant';
import { STANDARD_DEVICE_MOBILE_CONDITIONAL_DISPLAY } from 'src/engine/workspace-manager/twenty-standard-application/constants/standard-device-mobile-conditional-display.constant';

export const LEGACY_WIDGET_DEVICE_VISIBILITIES: {
  conditionalAvailabilityExpression: string;
  conditionalDisplay: ConditionalDisplay;
}[] = [
  {
    conditionalAvailabilityExpression: 'device == "MOBILE"',
    conditionalDisplay: STANDARD_DEVICE_MOBILE_CONDITIONAL_DISPLAY,
  },
  {
    conditionalAvailabilityExpression: 'device == "DESKTOP"',
    conditionalDisplay: STANDARD_DEVICE_DESKTOP_CONDITIONAL_DISPLAY,
  },
];
