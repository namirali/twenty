import { type ConditionalDisplayAdminContextKey } from '@/conditional-display/types/ConditionalDisplayAdminContextKey';
import { isNonEmptyString } from '@sniptt/guards';
import {
  assertUnreachable,
  isNonEmptyArray,
  parseJson,
} from 'twenty-shared/utils';

export const hasConditionalDisplayContextRecordFilterValue = ({
  contextKey,
  value,
}: {
  contextKey: ConditionalDisplayAdminContextKey;
  value: string | null | undefined;
}): boolean => {
  switch (contextKey) {
    case 'currentRoleId':
    case 'device':
      return isNonEmptyArray(parseJson<unknown[]>(value));
    case 'currentWorkspaceMemberId':
      return isNonEmptyString(value);
    default:
      return assertUnreachable(contextKey);
  }
};
