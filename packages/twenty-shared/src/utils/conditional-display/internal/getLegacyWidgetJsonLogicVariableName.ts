import { isNonEmptyString } from '@sniptt/guards';

import { getLegacyWidgetJsonLogicSingleEntry } from '@/utils/conditional-display/internal/getLegacyWidgetJsonLogicSingleEntry';

export const getLegacyWidgetJsonLogicVariableName = (
  operand: unknown,
): string | undefined => {
  const entry = getLegacyWidgetJsonLogicSingleEntry(operand);

  return entry?.[0] === 'var' && isNonEmptyString(entry[1])
    ? entry[1]
    : undefined;
};
