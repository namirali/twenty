import { type ConditionalAvailabilityExpressionLiteral } from './ConditionalAvailabilityExpressionLiteral';
import { type ConditionalDisplayConditionNode } from './ConditionalDisplayConditionNode';
import { type ConditionalDisplayContextKey } from './ConditionalDisplayContextKey';

export type ConditionalAvailabilityCompiledItem =
  | { kind: 'variable'; name: string }
  | {
      kind: 'mapEntry';
      contextKey: ConditionalDisplayContextKey;
      entryName: string;
    }
  | { kind: 'literal'; value: ConditionalAvailabilityExpressionLiteral }
  | { kind: 'list'; values: ConditionalAvailabilityExpressionLiteral[] }
  | { kind: 'favoriteRecordCount' }
  | { kind: 'condition'; conditionNode: ConditionalDisplayConditionNode };
