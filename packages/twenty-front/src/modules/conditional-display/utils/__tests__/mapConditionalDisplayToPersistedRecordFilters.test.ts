import { mapConditionalDisplayToPersistedRecordFilters } from '@/conditional-display/utils/mapConditionalDisplayToPersistedRecordFilters';
import { ViewFilterOperand } from 'twenty-shared/types';

describe('mapConditionalDisplayToPersistedRecordFilters', () => {
  it('maps admin context rows and field rows for the editor', () => {
    expect(
      mapConditionalDisplayToPersistedRecordFilters({
        recordFilters: [
          {
            id: 'role-filter',
            contextKey: 'currentRoleId',
            operand: ViewFilterOperand.IS,
            value: JSON.stringify(['admin-role-id']),
          },
          {
            id: 'name-filter',
            fieldMetadataId: 'name-field-id',
            operand: ViewFilterOperand.CONTAINS,
            value: 'Air',
            recordFilterGroupId: 'root',
          },
        ],
      }),
    ).toEqual([
      {
        id: 'role-filter',
        fieldMetadataId: '',
        contextKey: 'currentRoleId',
        operand: ViewFilterOperand.IS,
        value: JSON.stringify(['admin-role-id']),
        recordFilterGroupId: undefined,
        positionInRecordFilterGroup: undefined,
        subFieldName: null,
        relationTargetFieldMetadataId: undefined,
      },
      {
        id: 'name-filter',
        fieldMetadataId: 'name-field-id',
        contextKey: undefined,
        operand: ViewFilterOperand.CONTAINS,
        value: 'Air',
        recordFilterGroupId: 'root',
        positionInRecordFilterGroup: undefined,
        subFieldName: null,
        relationTargetFieldMetadataId: undefined,
      },
    ]);
  });

  it('throws on an engine context row instead of dropping it', () => {
    expect(() =>
      mapConditionalDisplayToPersistedRecordFilters({
        recordFilters: [
          {
            id: 'selection-filter',
            contextKey: 'numberOfSelectedRecords',
            operand: ViewFilterOperand.GREATER_THAN_OR_EQUAL,
            value: JSON.stringify(1),
          },
        ],
      }),
    ).toThrow('numberOfSelectedRecords');
  });
});
