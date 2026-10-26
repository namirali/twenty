import { ConditionalDisplayContextValueInput } from '@/conditional-display/components/ConditionalDisplayContextValueInput';
import { buildConditionalDisplayContextRecordFilter } from '@/conditional-display/utils/buildConditionalDisplayContextRecordFilter';
import { findConditionalDisplayAdminContextKey } from '@/conditional-display/utils/findConditionalDisplayAdminContextKey';
import { getConditionalDisplayContextKeyIcon } from '@/conditional-display/utils/getConditionalDisplayContextKeyIcon';
import { getConditionalDisplayContextKeyLabel } from '@/conditional-display/utils/getConditionalDisplayContextKeyLabel';
import { getConditionalDisplayContextRecordFilterType } from '@/conditional-display/utils/getConditionalDisplayContextRecordFilterType';
import { type ContextKeyRecordFilterConfig } from '@/object-record/record-filter/types/ContextKeyRecordFilterConfig';
import { type ConditionalDisplayAdminContextKey } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

export const buildConditionalDisplayContextKeyRecordFilterConfig = (
  availableContextKeys: ConditionalDisplayAdminContextKey[],
): ContextKeyRecordFilterConfig => ({
  getField: (contextKey) => {
    const adminContextKey = findConditionalDisplayAdminContextKey(contextKey);

    return isDefined(adminContextKey)
      ? {
          type: getConditionalDisplayContextRecordFilterType(adminContextKey),
          label: getConditionalDisplayContextKeyLabel(adminContextKey),
          Icon: getConditionalDisplayContextKeyIcon(adminContextKey),
        }
      : undefined;
  },
  buildDefaultRecordFilter: ({
    id,
    recordFilterGroupId,
    positionInRecordFilterGroup,
  }) => {
    const [defaultContextKey] = availableContextKeys;

    return isDefined(defaultContextKey)
      ? buildConditionalDisplayContextRecordFilter({
          id,
          contextKey: defaultContextKey,
          recordFilterGroupId,
          positionInRecordFilterGroup,
        })
      : undefined;
  },
  ValueInput: ConditionalDisplayContextValueInput,
});
