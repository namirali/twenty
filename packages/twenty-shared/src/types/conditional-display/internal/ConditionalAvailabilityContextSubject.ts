import { type ConditionalDisplayContextKey } from '../ConditionalDisplayContextKey';
import { type ConditionalDisplayVirtualField } from '../ConditionalDisplayVirtualField';

export type ConditionalAvailabilityContextSubject = {
  contextKey: ConditionalDisplayContextKey;
  subFieldName?: string;
  virtualField: ConditionalDisplayVirtualField;
};
