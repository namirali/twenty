import { isNonEmptyString } from '@sniptt/guards';

import { getLegacyWidgetJsonLogicSingleEntry } from 'src/engine/metadata-modules/flat-conditional-display/utils/get-legacy-widget-json-logic-single-entry.util';

export const getLegacyWidgetJsonLogicVariableName = (
  operand: unknown,
): string | undefined => {
  const entry = getLegacyWidgetJsonLogicSingleEntry(operand);

  return entry?.[0] === 'var' && isNonEmptyString(entry[1])
    ? entry[1]
    : undefined;
};
