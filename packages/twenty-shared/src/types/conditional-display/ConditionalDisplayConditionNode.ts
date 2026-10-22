import { type RecordFilterGroupLogicalOperator } from '../RecordFilterGroupLogicalOperator';

import { type ConditionalDisplayQuantifier } from './ConditionalDisplayQuantifier';
import { type ConditionalDisplayRecordFilter } from './ConditionalDisplayRecordFilter';

export type ConditionalDisplayConditionNode =
  | {
      kind: 'recordFilter';
      recordFilter: Omit<
        ConditionalDisplayRecordFilter,
        'id' | 'recordFilterGroupId' | 'positionInRecordFilterGroup'
      >;
      quantifier?: ConditionalDisplayQuantifier;
    }
  | {
      kind: 'recordFilterGroup';
      logicalOperator: RecordFilterGroupLogicalOperator;
      children: ConditionalDisplayConditionNode[];
    };
