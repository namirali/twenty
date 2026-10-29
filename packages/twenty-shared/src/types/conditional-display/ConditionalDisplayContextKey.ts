import { type ConditionalDisplayAdminContextKey } from './ConditionalDisplayAdminContextKey';
import { type ConditionalDisplayEngineContextKey } from './ConditionalDisplayEngineContextKey';

export type ConditionalDisplayContextKey =
  | ConditionalDisplayAdminContextKey
  | ConditionalDisplayEngineContextKey;
