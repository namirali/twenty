import { CONDITIONAL_DISPLAY_CONTEXT_KEYS } from '@/constants/ConditionalDisplayContextKeys';
import { type ConditionalDisplayAdminContextKey } from '@/types/conditional-display/ConditionalDisplayAdminContextKey';
import { type ConditionalDisplayContextKey } from '@/types/conditional-display/ConditionalDisplayContextKey';

export const isConditionalDisplayAdminContextKey = (
  contextKey: ConditionalDisplayContextKey,
): contextKey is ConditionalDisplayAdminContextKey =>
  CONDITIONAL_DISPLAY_CONTEXT_KEYS[contextKey].owner === 'admin';
