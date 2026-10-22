import {
  type ConditionalDisplay,
  ViewFilterOperand,
} from 'twenty-shared/types';

import { type WidgetVisibilityContext } from '@/page-layout/types/WidgetVisibilityContext';
import { evaluateWidgetVisibility } from '@/page-layout/utils/evaluateWidgetVisibility';

const buildContext = (
  device: WidgetVisibilityContext['device'],
  featureFlags: WidgetVisibilityContext['featureFlags'] = {},
): WidgetVisibilityContext => ({
  device,
  selectedRecords: [],
  featureFlags,
  currentRoleId: null,
  currentWorkspaceMemberId: null,
  objectMetadataItems: [],
});

const buildDeviceConditionalDisplay = (
  device: WidgetVisibilityContext['device'],
): ConditionalDisplay => ({
  recordFilters: [
    {
      id: 'device-filter',
      contextKey: 'device',
      operand: ViewFilterOperand.IS,
      value: JSON.stringify([device]),
    },
  ],
});

const FEATURE_ENABLED_AVAILABILITY: ConditionalDisplay = {
  recordFilters: [
    {
      id: 'feature-flag-filter',
      contextKey: 'featureFlags',
      subFieldName: 'IS_FEATURE_ENABLED',
      operand: ViewFilterOperand.IS,
      value: JSON.stringify(true),
    },
  ],
};

describe('evaluateWidgetVisibility', () => {
  it('should return true (visible) when no conditionalDisplay is provided', () => {
    const result = evaluateWidgetVisibility({
      conditionalAvailability: undefined,
      conditionalDisplay: undefined,
      context: buildContext('DESKTOP'),
    });

    expect(result).toBe(true);
  });

  it('should return true (visible) when the device rule matches MOBILE', () => {
    const result = evaluateWidgetVisibility({
      conditionalAvailability: undefined,
      conditionalDisplay: buildDeviceConditionalDisplay('MOBILE'),
      context: buildContext('MOBILE'),
    });

    expect(result).toBe(true);
  });

  it('should return false (hidden) when the device rule does not match DESKTOP', () => {
    const result = evaluateWidgetVisibility({
      conditionalAvailability: undefined,
      conditionalDisplay: buildDeviceConditionalDisplay('MOBILE'),
      context: buildContext('DESKTOP'),
    });

    expect(result).toBe(false);
  });

  it('should return true (visible) when the device rule allows both devices', () => {
    const conditionalDisplay: ConditionalDisplay = {
      recordFilters: [
        {
          id: 'device-filter',
          contextKey: 'device',
          operand: ViewFilterOperand.IS,
          value: JSON.stringify(['MOBILE', 'DESKTOP']),
        },
      ],
    };

    const resultMobile = evaluateWidgetVisibility({
      conditionalAvailability: undefined,
      conditionalDisplay,
      context: buildContext('MOBILE'),
    });

    const resultDesktop = evaluateWidgetVisibility({
      conditionalAvailability: undefined,
      conditionalDisplay,
      context: buildContext('DESKTOP'),
    });

    expect(resultMobile).toBe(true);
    expect(resultDesktop).toBe(true);
  });

  describe('conditionalAvailability', () => {
    it('should return true when the feature flag of the availability is on', () => {
      const result = evaluateWidgetVisibility({
        conditionalAvailability: FEATURE_ENABLED_AVAILABILITY,
        conditionalDisplay: undefined,
        context: buildContext('DESKTOP', { IS_FEATURE_ENABLED: true }),
      });

      expect(result).toBe(true);
    });

    it('should return false when the feature flag of the availability is off', () => {
      const result = evaluateWidgetVisibility({
        conditionalAvailability: FEATURE_ENABLED_AVAILABILITY,
        conditionalDisplay: undefined,
        context: buildContext('DESKTOP', { IS_FEATURE_ENABLED: false }),
      });

      expect(result).toBe(false);
    });

    it('should hide the widget when the availability fails even if conditionalDisplay matches', () => {
      const result = evaluateWidgetVisibility({
        conditionalAvailability: FEATURE_ENABLED_AVAILABILITY,
        conditionalDisplay: buildDeviceConditionalDisplay('DESKTOP'),
        context: buildContext('DESKTOP'),
      });

      expect(result).toBe(false);
    });

    it('should fall through to conditionalDisplay when the availability is null', () => {
      const result = evaluateWidgetVisibility({
        conditionalAvailability: null,
        conditionalDisplay: buildDeviceConditionalDisplay('MOBILE'),
        context: buildContext('DESKTOP'),
      });

      expect(result).toBe(false);
    });
  });
});
