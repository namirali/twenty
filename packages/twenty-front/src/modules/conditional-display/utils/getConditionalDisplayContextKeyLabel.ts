import { type ConditionalDisplayAdminContextKey } from '@/conditional-display/types/ConditionalDisplayAdminContextKey';
import { t } from '@lingui/core/macro';
import { assertUnreachable } from 'twenty-shared/utils';

export const getConditionalDisplayContextKeyLabel = (
  contextKey: ConditionalDisplayAdminContextKey,
): string => {
  switch (contextKey) {
    case 'currentRoleId':
      return t`Role`;
    case 'currentWorkspaceMemberId':
      return t`Workspace member`;
    case 'device':
      return t`Device`;
    default:
      return assertUnreachable(contextKey);
  }
};
