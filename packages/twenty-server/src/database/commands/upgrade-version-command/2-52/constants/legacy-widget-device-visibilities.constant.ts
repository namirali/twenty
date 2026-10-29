import { CONDITIONAL_DISPLAY_DEVICES } from 'twenty-shared/constants';
import { type ConditionalDisplay } from 'twenty-shared/types';
import { buildDeviceConditionalDisplay } from 'twenty-shared/utils';

export const LEGACY_WIDGET_DEVICE_VISIBILITIES: {
  conditionalAvailabilityExpression: string;
  conditionalDisplay: ConditionalDisplay;
}[] = CONDITIONAL_DISPLAY_DEVICES.map((device) => ({
  conditionalAvailabilityExpression: `device == "${device}"`,
  conditionalDisplay: buildDeviceConditionalDisplay(device),
}));
