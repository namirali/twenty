import { type ConditionalDisplayAdminContextKey } from '@/types/conditional-display/ConditionalDisplayAdminContextKey';
import { type ConditionalDisplayEngineContextKey } from '@/types/conditional-display/ConditionalDisplayEngineContextKey';

export type ConditionalDisplayContextKey =
  | ConditionalDisplayAdminContextKey
  | ConditionalDisplayEngineContextKey;
