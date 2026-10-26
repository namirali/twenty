import { type ConditionalDisplayVirtualField } from './ConditionalDisplayVirtualField';

export type ConditionalDisplayContextKeySubject =
  | { kind: 'VALUE'; field: ConditionalDisplayVirtualField }
  | { kind: 'MAP_ENTRY'; entryField: ConditionalDisplayVirtualField }
  | {
      kind: 'PROPERTY';
      propertyFields: Record<string, ConditionalDisplayVirtualField>;
    }
  | { kind: 'SELECTED_RECORD_PATH' };
