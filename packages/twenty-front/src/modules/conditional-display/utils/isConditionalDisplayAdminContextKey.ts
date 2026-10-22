import { type ConditionalDisplayAdminContextKey } from '@/conditional-display/types/ConditionalDisplayAdminContextKey';
import { CONDITIONAL_DISPLAY_CONTEXT_KEYS } from 'twenty-shared/constants';
import { type ConditionalDisplayContextKey } from 'twenty-shared/types';

export const isConditionalDisplayAdminContextKey = (
  contextKey: ConditionalDisplayContextKey,
): contextKey is ConditionalDisplayAdminContextKey =>
  CONDITIONAL_DISPLAY_CONTEXT_KEYS[contextKey]?.owner === 'admin';
