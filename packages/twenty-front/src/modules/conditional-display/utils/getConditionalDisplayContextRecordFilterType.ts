import { type ConditionalDisplayAdminContextKey } from '@/conditional-display/types/ConditionalDisplayAdminContextKey';
import { type FilterableAndTSVectorFieldType } from 'twenty-shared/types';
import { assertUnreachable } from 'twenty-shared/utils';

export const getConditionalDisplayContextRecordFilterType = (
  contextKey: ConditionalDisplayAdminContextKey,
): FilterableAndTSVectorFieldType => {
  switch (contextKey) {
    case 'currentRoleId':
    case 'device':
      return 'SELECT';
    case 'currentWorkspaceMemberId':
      return 'RELATION';
    default:
      return assertUnreachable(contextKey);
  }
};
