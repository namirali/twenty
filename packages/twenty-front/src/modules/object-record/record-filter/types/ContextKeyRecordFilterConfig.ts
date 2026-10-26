import { type RecordFilter } from '@/object-record/record-filter/types/RecordFilter';
import { type FC } from 'react';
import { type FilterableAndTSVectorFieldType } from 'twenty-shared/types';
import { type IconComponent } from 'twenty-ui/icon';
import { type JsonValue } from 'type-fest';

export type ContextKeyRecordFilterConfig = {
  getField: (contextKey: string) =>
    | {
        type: FilterableAndTSVectorFieldType;
        label: string;
        Icon: IconComponent;
      }
    | undefined;
  buildDefaultRecordFilter: (
    recordFilterPlacement: Pick<
      RecordFilter,
      'id' | 'recordFilterGroupId' | 'positionInRecordFilterGroup'
    >,
  ) => RecordFilter | undefined;
  ValueInput: FC<{
    recordFilter: RecordFilter;
    onChange: (value: JsonValue) => void;
    readonly?: boolean;
  }>;
};
