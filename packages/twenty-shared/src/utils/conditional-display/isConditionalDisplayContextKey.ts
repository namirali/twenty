import { CONDITIONAL_DISPLAY_CONTEXT_KEYS } from '@/constants/ConditionalDisplayContextKeys';
import { type ConditionalDisplayContextKey } from '@/types/conditional-display/ConditionalDisplayContextKey';

export const isConditionalDisplayContextKey = (
  contextKey: string,
): contextKey is ConditionalDisplayContextKey =>
  Object.keys(CONDITIONAL_DISPLAY_CONTEXT_KEYS).includes(contextKey);
