import { isObject, isString } from '@sniptt/guards';

import { type ConditionalAvailabilityExpressionToken } from '@/types/conditional-display/ConditionalAvailabilityExpressionToken';

export const isConditionalAvailabilityExpressionToken = (
  value: unknown,
): value is ConditionalAvailabilityExpressionToken =>
  isObject(value) &&
  'type' in value &&
  isString(value.type) &&
  'value' in value;
