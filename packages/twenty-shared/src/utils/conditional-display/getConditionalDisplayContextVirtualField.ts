import { isNonEmptyString } from '@sniptt/guards';

import { CONDITIONAL_DISPLAY_CONTEXT_KEYS } from '@/constants/ConditionalDisplayContextKeys';
import { type ConditionalDisplayContextKey } from '@/types/conditional-display/ConditionalDisplayContextKey';
import { type ConditionalDisplayVirtualField } from '@/types/conditional-display/ConditionalDisplayVirtualField';
import { isDefined } from '@/utils/validation/isDefined';

export const getConditionalDisplayContextVirtualField = ({
  contextKey,
  subFieldName,
}: {
  contextKey: ConditionalDisplayContextKey;
  subFieldName?: string | null;
}): ConditionalDisplayVirtualField | undefined => {
  const { subject } = CONDITIONAL_DISPLAY_CONTEXT_KEYS[contextKey];

  switch (subject.kind) {
    case 'VALUE':
      return isDefined(subFieldName) ? undefined : subject.field;
    case 'MAP_ENTRY':
      return isNonEmptyString(subFieldName) ? subject.entryField : undefined;
    case 'PROPERTY':
      return Object.entries(subject.propertyFields).find(
        ([propertyName]) => propertyName === subFieldName,
      )?.[1];
    case 'SELECTED_RECORD_PATH':
      return undefined;
  }
};
