import { type ConditionalDisplayAdminContextKey } from '@/conditional-display/types/ConditionalDisplayAdminContextKey';
import { assertUnreachable } from 'twenty-shared/utils';
import {
  type IconComponent,
  IconDeviceDesktop,
  IconLock,
  IconUsers,
} from 'twenty-ui/icon';

export const getConditionalDisplayContextKeyIcon = (
  contextKey: ConditionalDisplayAdminContextKey,
): IconComponent => {
  switch (contextKey) {
    case 'currentRoleId':
      return IconLock;
    case 'currentWorkspaceMemberId':
      return IconUsers;
    case 'device':
      return IconDeviceDesktop;
    default:
      return assertUnreachable(contextKey);
  }
};
