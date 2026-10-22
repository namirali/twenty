import { type ConditionalDisplayAdminContextKey } from '@/conditional-display/types/ConditionalDisplayAdminContextKey';
import { t } from '@lingui/core/macro';
import { assertUnreachable } from 'twenty-shared/utils';

export const getConditionalDisplayContextKeyOperandLabel = (
  contextKey: ConditionalDisplayAdminContextKey,
): string => {
  switch (contextKey) {
    case 'currentRoleId':
      return t`Is any of`;
    case 'currentWorkspaceMemberId':
    case 'device':
      return t`Is`;
    default:
      return assertUnreachable(contextKey);
  }
};
