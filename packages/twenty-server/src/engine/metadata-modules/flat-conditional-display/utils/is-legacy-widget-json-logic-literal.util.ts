import { isBoolean, isNumber, isString } from '@sniptt/guards';

import { type LegacyWidgetJsonLogicLiteral } from 'src/engine/metadata-modules/flat-conditional-display/types/legacy-widget-json-logic-literal.type';

export const isLegacyWidgetJsonLogicLiteral = (
  value: unknown,
): value is LegacyWidgetJsonLogicLiteral =>
  isString(value) || isNumber(value) || isBoolean(value);
