import { type ConditionalDisplay } from 'twenty-shared/types';

export type CompiledConditionExpression =
  | { expression: string; conditionalDisplay: ConditionalDisplay | null }
  | { expression: string; errorMessage: string };
