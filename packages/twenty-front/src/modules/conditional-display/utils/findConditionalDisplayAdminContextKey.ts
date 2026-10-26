import { type ConditionalDisplayAdminContextKey } from 'twenty-shared/types';
import {
  isConditionalDisplayAdminContextKey,
  isConditionalDisplayContextKey,
  isDefined,
} from 'twenty-shared/utils';

export const findConditionalDisplayAdminContextKey = (
  contextKey: string | null | undefined,
): ConditionalDisplayAdminContextKey | undefined =>
  isDefined(contextKey) &&
  isConditionalDisplayContextKey(contextKey) &&
  isConditionalDisplayAdminContextKey(contextKey)
    ? contextKey
    : undefined;
