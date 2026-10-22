import { type ConditionalDisplayContextKey } from 'twenty-shared/types';

export type ConditionalDisplayAdminContextKey = Extract<
  ConditionalDisplayContextKey,
  'currentRoleId' | 'currentWorkspaceMemberId' | 'device'
>;
