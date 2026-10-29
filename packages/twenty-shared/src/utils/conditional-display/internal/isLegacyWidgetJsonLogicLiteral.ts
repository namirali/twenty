import { isBoolean, isNumber, isString } from '@sniptt/guards';

import { type LegacyWidgetJsonLogicLiteral } from '@/types/conditional-display/LegacyWidgetJsonLogicLiteral';

export const isLegacyWidgetJsonLogicLiteral = (
  value: unknown,
): value is LegacyWidgetJsonLogicLiteral =>
  isString(value) || isNumber(value) || isBoolean(value);
