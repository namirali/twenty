import {
  type ConditionalDisplayProperty,
  type ConditionalDisplaySurface,
  FieldMetadataType,
  ViewFilterOperand,
} from 'twenty-shared/types';

import { validateConditionalDisplay } from 'src/engine/metadata-modules/flat-conditional-display/utils/validate-conditional-display.util';
import { type MetadataUniversalFlatEntityMaps } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/types/metadata-universal-flat-entity-maps.type';

const OBJECT_UNIVERSAL_IDENTIFIER = '20202020-0000-4000-8000-000000000000';
const OTHER_OBJECT_UNIVERSAL_IDENTIFIER =
  '20202020-0000-4000-8000-000000000001';
const TEXT_FIELD_UNIVERSAL_IDENTIFIER = '20202020-1111-4111-8111-000000000001';
const OTHER_OBJECT_FIELD_UNIVERSAL_IDENTIFIER =
  '20202020-2222-4222-8222-000000000002';
const ROLE_UNIVERSAL_IDENTIFIER = '20202020-3333-4333-8333-000000000003';
const UNKNOWN_ROLE_UNIVERSAL_IDENTIFIER =
  '20202020-9999-4999-8999-000000000009';
const INVALID_DATA_CODE = 'INVALID_DATA';

const flatFieldMetadataMaps = {
  byUniversalIdentifier: {
    [TEXT_FIELD_UNIVERSAL_IDENTIFIER]: {
      universalIdentifier: TEXT_FIELD_UNIVERSAL_IDENTIFIER,
      objectMetadataUniversalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
      type: FieldMetadataType.TEXT,
    },
    [OTHER_OBJECT_FIELD_UNIVERSAL_IDENTIFIER]: {
      universalIdentifier: OTHER_OBJECT_FIELD_UNIVERSAL_IDENTIFIER,
      objectMetadataUniversalIdentifier: OTHER_OBJECT_UNIVERSAL_IDENTIFIER,
      type: FieldMetadataType.TEXT,
    },
  },
} as unknown as MetadataUniversalFlatEntityMaps<'fieldMetadata'>;

const flatRoleMaps = {
  byUniversalIdentifier: {
    [ROLE_UNIVERSAL_IDENTIFIER]: {
      universalIdentifier: ROLE_UNIVERSAL_IDENTIFIER,
    },
  },
} as unknown as MetadataUniversalFlatEntityMaps<'role'>;

const validate = ({
  conditionalDisplay,
  property = 'conditionalDisplay',
  surface = 'pageLayoutWidget',
  objectMetadataUniversalIdentifier = OBJECT_UNIVERSAL_IDENTIFIER,
}: {
  conditionalDisplay: unknown;
  property?: ConditionalDisplayProperty;
  surface?: ConditionalDisplaySurface;
  objectMetadataUniversalIdentifier?: string | null;
}) =>
  validateConditionalDisplay({
    conditionalDisplay,
    property,
    surface,
    objectMetadataUniversalIdentifier,
    invalidDataCode: INVALID_DATA_CODE,
    flatFieldMetadataMaps,
    flatRoleMaps,
  });

const DEVICE_LEAF = {
  id: '0',
  contextKey: 'device',
  operand: ViewFilterOperand.IS,
  value: '["MOBILE"]',
};

const IS_SELECT_ALL_LEAF = {
  id: '0',
  contextKey: 'isSelectAll',
  operand: ViewFilterOperand.IS,
  value: 'true',
};

const NUMBER_OF_SELECTED_RECORDS_LEAF = {
  id: '0',
  contextKey: 'numberOfSelectedRecords',
  operand: ViewFilterOperand.IS,
  value: '1',
};

const PAGE_TYPE_LEAF = {
  id: '0',
  contextKey: 'pageType',
  operand: ViewFilterOperand.IS,
  value: '["RECORD_PAGE"]',
};

const FEATURE_FLAG_LEAF = {
  id: '0',
  contextKey: 'featureFlags',
  subFieldName: 'IS_AI_ENABLED',
  operand: ViewFilterOperand.IS,
  value: 'true',
};

const SELECTED_RECORDS_LEAF = {
  id: '0',
  contextKey: 'selectedRecords',
  subFieldName: 'inboxStatus.isUnread',
  operand: ViewFilterOperand.IS,
  value: 'true',
};

const validateCommandAvailability = (recordFilter: object) =>
  validate({
    conditionalDisplay: { recordFilters: [recordFilter] },
    property: 'conditionalAvailability',
    surface: 'commandMenuItem',
  });

describe('validateConditionalDisplay', () => {
  it('should accept a device rule on a widget', () => {
    expect(
      validate({ conditionalDisplay: { recordFilters: [DEVICE_LEAF] } }),
    ).toEqual([]);
  });

  it('should accept a device rule on a command menu item', () => {
    expect(
      validate({
        conditionalDisplay: { recordFilters: [DEVICE_LEAF] },
        surface: 'commandMenuItem',
      }),
    ).toEqual([]);
  });

  it('should accept a device rule on a navigation menu item', () => {
    expect(
      validate({
        conditionalDisplay: { recordFilters: [DEVICE_LEAF] },
        surface: 'navigationMenuItem',
      }),
    ).toEqual([]);
  });

  it('should reject a device value outside the allowed devices', () => {
    expect(
      validate({
        conditionalDisplay: {
          recordFilters: [{ ...DEVICE_LEAF, value: '["TABLET"]' }],
        },
      }),
    ).toEqual([expect.objectContaining({ value: '["TABLET"]' })]);
  });

  it('should accept a device rule matching any of several devices', () => {
    expect(
      validate({
        conditionalDisplay: {
          recordFilters: [{ ...DEVICE_LEAF, value: '["MOBILE","DESKTOP"]' }],
        },
      }),
    ).toEqual([]);
  });

  it('should reject a context rule with an operand its field type does not support', () => {
    expect(
      validate({
        conditionalDisplay: {
          recordFilters: [
            { ...DEVICE_LEAF, operand: ViewFilterOperand.CONTAINS },
          ],
        },
      }),
    ).toEqual([expect.objectContaining({ value: ViewFilterOperand.CONTAINS })]);
  });

  it('should reject an unknown context key', () => {
    expect(
      validate({
        conditionalDisplay: {
          recordFilters: [{ ...DEVICE_LEAF, contextKey: 'currentLocale' }],
        },
      }),
    ).toEqual([expect.objectContaining({ value: 'currentLocale' })]);
  });

  it('should accept a workspace member rule selecting the current member', () => {
    expect(
      validate({
        conditionalDisplay: {
          recordFilters: [
            {
              id: '0',
              contextKey: 'currentWorkspaceMemberId',
              operand: ViewFilterOperand.IS,
              value: JSON.stringify({
                isCurrentWorkspaceMemberSelected: true,
                selectedRecordIds: [],
              }),
            },
          ],
        },
      }),
    ).toEqual([]);
  });

  it('should reject a workspace member rule whose value is not a member selection', () => {
    expect(
      validate({
        conditionalDisplay: {
          recordFilters: [
            {
              id: '0',
              contextKey: 'currentWorkspaceMemberId',
              operand: ViewFilterOperand.IS,
              value: '"me"',
            },
          ],
        },
      }),
    ).toEqual([expect.objectContaining({ value: '"me"' })]);
  });

  it('should accept a field rule on a field of the surface object', () => {
    expect(
      validate({
        conditionalDisplay: {
          recordFilters: [
            {
              id: '0',
              fieldMetadataUniversalIdentifier: TEXT_FIELD_UNIVERSAL_IDENTIFIER,
              operand: ViewFilterOperand.IS_NOT_EMPTY,
              value: '',
            },
          ],
        },
      }),
    ).toEqual([]);
  });

  it('should reject a field rule on a field of another object', () => {
    expect(
      validate({
        conditionalDisplay: {
          recordFilters: [
            {
              id: '0',
              fieldMetadataUniversalIdentifier:
                OTHER_OBJECT_FIELD_UNIVERSAL_IDENTIFIER,
              operand: ViewFilterOperand.IS_NOT_EMPTY,
              value: '',
            },
          ],
        },
      }),
    ).toEqual([
      expect.objectContaining({
        value: OTHER_OBJECT_FIELD_UNIVERSAL_IDENTIFIER,
      }),
    ]);
  });

  it('should reject a field rule on a surface without an object', () => {
    expect(
      validate({
        conditionalDisplay: {
          recordFilters: [
            {
              id: '0',
              fieldMetadataUniversalIdentifier: TEXT_FIELD_UNIVERSAL_IDENTIFIER,
              operand: ViewFilterOperand.IS_NOT_EMPTY,
              value: '',
            },
          ],
        },
        surface: 'navigationMenuItem',
        objectMetadataUniversalIdentifier: null,
      }),
    ).toEqual([
      expect.objectContaining({ value: TEXT_FIELD_UNIVERSAL_IDENTIFIER }),
    ]);
  });

  it('should reject a role rule referencing a role that does not exist', () => {
    expect(
      validate({
        conditionalDisplay: {
          recordFilters: [
            {
              id: '0',
              contextKey: 'currentRoleId',
              operand: ViewFilterOperand.IS,
              value: JSON.stringify([
                ROLE_UNIVERSAL_IDENTIFIER,
                UNKNOWN_ROLE_UNIVERSAL_IDENTIFIER,
              ]),
            },
          ],
        },
        surface: 'navigationMenuItem',
        objectMetadataUniversalIdentifier: null,
      }),
    ).toEqual([
      expect.objectContaining({ value: UNKNOWN_ROLE_UNIVERSAL_IDENTIFIER }),
    ]);
  });

  it('should reject selectedRecordsMatch in the display of a widget', () => {
    expect(
      validate({
        conditionalDisplay: {
          recordFilters: [DEVICE_LEAF],
          selectedRecordsMatch: 'SOME',
        },
        property: 'conditionalDisplay',
      }),
    ).toEqual([expect.objectContaining({ value: 'SOME' })]);
  });

  it('should accept a selected records rule with selectedRecordsMatch in the availability of a widget', () => {
    expect(
      validate({
        conditionalDisplay: {
          recordFilters: [
            {
              ...SELECTED_RECORDS_LEAF,
              subFieldName: 'status',
              operand: ViewFilterOperand.IS_NOT,
              value: '"DRAFT"',
            },
          ],
          selectedRecordsMatch: 'EVERY',
        },
        property: 'conditionalAvailability',
      }),
    ).toEqual([]);
  });

  it('should accept a selected records rule with selectedRecordsMatch in the pinned condition of a command menu item', () => {
    expect(
      validate({
        conditionalDisplay: {
          recordFilters: [SELECTED_RECORDS_LEAF],
          selectedRecordsMatch: 'EVERY',
        },
        property: 'conditionalPinned',
        surface: 'commandMenuItem',
      }),
    ).toEqual([]);
  });

  it('should accept selectedRecordsMatch on a command menu item', () => {
    expect(
      validate({
        conditionalDisplay: {
          recordFilters: [
            {
              id: '0',
              fieldMetadataUniversalIdentifier: TEXT_FIELD_UNIVERSAL_IDENTIFIER,
              operand: ViewFilterOperand.IS_NOT_EMPTY,
              value: '',
            },
          ],
          selectedRecordsMatch: 'SOME',
        },
        surface: 'commandMenuItem',
      }),
    ).toEqual([]);
  });

  it('should reject a rule with both a field and a context key', () => {
    expect(
      validate({
        conditionalDisplay: {
          recordFilters: [
            {
              ...DEVICE_LEAF,
              fieldMetadataUniversalIdentifier: TEXT_FIELD_UNIVERSAL_IDENTIFIER,
            },
          ],
        },
      }),
    ).toEqual([expect.objectContaining({ value: '0' })]);
  });

  it('should reject groups forming a cycle', () => {
    expect(
      validate({
        conditionalDisplay: {
          recordFilters: [{ ...DEVICE_LEAF, recordFilterGroupId: 'a' }],
          recordFilterGroups: [
            { id: 'a', logicalOperator: 'AND', parentRecordFilterGroupId: 'b' },
            { id: 'b', logicalOperator: 'OR', parentRecordFilterGroupId: 'a' },
          ],
        },
      }),
    ).toEqual([
      expect.objectContaining({ value: 'a' }),
      expect.objectContaining({ value: 'b' }),
    ]);
  });

  it('should reject a group whose parent group does not exist', () => {
    expect(
      validate({
        conditionalDisplay: {
          recordFilters: [{ ...DEVICE_LEAF, recordFilterGroupId: 'a' }],
          recordFilterGroups: [
            {
              id: 'a',
              logicalOperator: 'AND',
              parentRecordFilterGroupId: 'missing',
            },
          ],
        },
      }),
    ).toEqual([expect.objectContaining({ value: 'missing' })]);
  });

  it('should reject a group with a logical operator other than AND or OR', () => {
    expect(
      validate({
        conditionalDisplay: {
          recordFilters: [{ ...DEVICE_LEAF, recordFilterGroupId: 'a' }],
          recordFilterGroups: [{ id: 'a', logicalOperator: 'XOR' }],
        },
      }),
    ).toEqual([expect.objectContaining({ value: 'XOR' })]);
  });

  it('should reject record filter groups that are not an array', () => {
    const conditionalDisplay = {
      recordFilters: [DEVICE_LEAF],
      recordFilterGroups: { id: 'a', logicalOperator: 'AND' },
    };

    expect(validate({ conditionalDisplay })).toEqual([
      expect.objectContaining({ value: conditionalDisplay }),
    ]);
  });

  it('should reject a json-logic rule', () => {
    const jsonLogicConditionalDisplay = {
      and: [{ '===': [{ var: 'device' }, 'MOBILE'] }],
    };

    expect(
      validate({ conditionalDisplay: jsonLogicConditionalDisplay }),
    ).toEqual([
      expect.objectContaining({ value: jsonLogicConditionalDisplay }),
    ]);
  });

  it('should accept an engine key in the availability of a command menu item', () => {
    expect(validateCommandAvailability(IS_SELECT_ALL_LEAF)).toEqual([]);
  });

  it('should reject an engine key in the display of a command menu item', () => {
    expect(
      validate({
        conditionalDisplay: { recordFilters: [IS_SELECT_ALL_LEAF] },
        surface: 'commandMenuItem',
      }),
    ).toEqual([
      expect.objectContaining({
        code: INVALID_DATA_CODE,
        message:
          'Conditional display context key "isSelectAll" is not allowed in conditionalDisplay',
      }),
    ]);
  });

  it('should reject an admin key in the pinned condition of a command menu item', () => {
    expect(
      validate({
        conditionalDisplay: {
          recordFilters: [
            {
              id: '0',
              contextKey: 'currentRoleId',
              operand: ViewFilterOperand.IS,
              value: JSON.stringify([ROLE_UNIVERSAL_IDENTIFIER]),
            },
          ],
        },
        property: 'conditionalPinned',
        surface: 'commandMenuItem',
      }),
    ).toEqual([
      expect.objectContaining({
        message:
          'Conditional display context key "currentRoleId" is not allowed in conditionalPinned',
      }),
    ]);
  });

  it('should accept a feature flag rule in the availability of a widget', () => {
    expect(
      validate({
        conditionalDisplay: { recordFilters: [FEATURE_FLAG_LEAF] },
        property: 'conditionalAvailability',
      }),
    ).toEqual([]);
  });

  it('should reject an engine key not available on widgets in the availability of a widget', () => {
    expect(
      validate({
        conditionalDisplay: { recordFilters: [PAGE_TYPE_LEAF] },
        property: 'conditionalAvailability',
      }),
    ).toEqual([
      expect.objectContaining({
        message:
          'Conditional display context key "pageType" is not allowed on pageLayoutWidget',
      }),
    ]);
  });

  it('should reject a field rule in the availability of a widget', () => {
    expect(
      validate({
        conditionalDisplay: {
          recordFilters: [
            {
              id: '0',
              fieldMetadataUniversalIdentifier: TEXT_FIELD_UNIVERSAL_IDENTIFIER,
              operand: ViewFilterOperand.IS_NOT_EMPTY,
              value: '',
            },
          ],
        },
        property: 'conditionalAvailability',
      }),
    ).toEqual([
      expect.objectContaining({
        message:
          'Conditional display rules in conditionalAvailability cannot reference a record field',
        value: TEXT_FIELD_UNIVERSAL_IDENTIFIER,
      }),
    ]);
  });

  it('should reject a map key rule without a sub field name', () => {
    expect(
      validateCommandAvailability({
        ...FEATURE_FLAG_LEAF,
        subFieldName: undefined,
      }),
    ).toEqual([
      expect.objectContaining({
        message:
          'Conditional display context key "featureFlags" requires a sub field name',
      }),
    ]);
  });

  it('should reject a map key rule whose sub field name is a path', () => {
    expect(
      validateCommandAvailability({
        ...FEATURE_FLAG_LEAF,
        subFieldName: 'IS_AI_ENABLED.value',
      }),
    ).toEqual([expect.objectContaining({ value: 'IS_AI_ENABLED.value' })]);
  });

  it('should accept a selected records rule on a dotted path', () => {
    expect(validateCommandAvailability(SELECTED_RECORDS_LEAF)).toEqual([]);
  });

  it('should reject a selected records rule on a path with an empty segment', () => {
    expect(
      validateCommandAvailability({
        ...SELECTED_RECORDS_LEAF,
        subFieldName: 'inboxStatus..isUnread',
      }),
    ).toEqual([expect.objectContaining({ value: 'inboxStatus..isUnread' })]);
  });

  it('should reject a scalar key rule with a sub field name', () => {
    expect(
      validateCommandAvailability({
        ...IS_SELECT_ALL_LEAF,
        subFieldName: 'value',
      }),
    ).toEqual([
      expect.objectContaining({
        message:
          'Conditional display context key "isSelectAll" does not accept a sub field name',
      }),
    ]);
  });

  it('should reject a map key rule with an operand its boolean entries do not support', () => {
    expect(
      validateCommandAvailability({
        ...FEATURE_FLAG_LEAF,
        operand: ViewFilterOperand.DOES_NOT_CONTAIN,
      }),
    ).toEqual([
      expect.objectContaining({ value: ViewFilterOperand.DOES_NOT_CONTAIN }),
    ]);
  });

  it('should reject a boolean key rule with operand GREATER_THAN_OR_EQUAL', () => {
    expect(
      validateCommandAvailability({
        ...IS_SELECT_ALL_LEAF,
        operand: ViewFilterOperand.GREATER_THAN_OR_EQUAL,
      }),
    ).toEqual([
      expect.objectContaining({
        value: ViewFilterOperand.GREATER_THAN_OR_EQUAL,
      }),
    ]);
  });

  it('should accept a selection count rule with operand GREATER_THAN_OR_EQUAL', () => {
    expect(
      validateCommandAvailability({
        ...NUMBER_OF_SELECTED_RECORDS_LEAF,
        operand: ViewFilterOperand.GREATER_THAN_OR_EQUAL,
      }),
    ).toEqual([]);
  });

  it('should reject a selection count rule with operand CONTAINS', () => {
    expect(
      validateCommandAvailability({
        ...NUMBER_OF_SELECTED_RECORDS_LEAF,
        operand: ViewFilterOperand.CONTAINS,
      }),
    ).toEqual([
      expect.objectContaining({
        message:
          'Operand "CONTAINS" is not supported on conditional display context key "numberOfSelectedRecords" of type "NUMBER". Supported operands: IS, IS_NOT, GREATER_THAN_OR_EQUAL, LESS_THAN_OR_EQUAL, IS_EMPTY, IS_NOT_EMPTY.',
      }),
    ]);
  });

  it('should reject a boolean property rule with operand IS_EMPTY', () => {
    expect(
      validateCommandAvailability({
        id: '0',
        contextKey: 'objectMetadataItem',
        subFieldName: 'isRemote',
        operand: ViewFilterOperand.IS_EMPTY,
        value: null,
      }),
    ).toEqual([expect.objectContaining({ value: ViewFilterOperand.IS_EMPTY })]);
  });

  it('should accept a json property rule with operand IS_EMPTY and an empty value', () => {
    expect(
      validateCommandAvailability({
        id: '0',
        contextKey: 'objectMetadataItem',
        subFieldName: 'duplicateCriteria',
        operand: ViewFilterOperand.IS_EMPTY,
        value: '',
      }),
    ).toEqual([]);
  });

  it('should reject an unknown object property', () => {
    expect(
      validateCommandAvailability({
        ...IS_SELECT_ALL_LEAF,
        contextKey: 'objectMetadataItem',
        subFieldName: 'labelSingular',
      }),
    ).toEqual([expect.objectContaining({ value: 'labelSingular' })]);
  });

  it('should reject a selected records rule with operand IS_NOT_EMPTY and a value', () => {
    expect(
      validateCommandAvailability({
        ...SELECTED_RECORDS_LEAF,
        operand: ViewFilterOperand.IS_NOT_EMPTY,
      }),
    ).toEqual([
      expect.objectContaining({
        message:
          'Value "true" of conditional display context key "selectedRecords" must be empty for operand "IS_NOT_EMPTY"',
      }),
    ]);
  });

  it('should reject an engine rule whose value is not a JSON literal', () => {
    expect(
      validateCommandAvailability({
        ...SELECTED_RECORDS_LEAF,
        value: '[true]',
      }),
    ).toEqual([
      expect.objectContaining({
        message:
          'Value "[true]" of conditional display context key "selectedRecords" must be a JSON string, number or boolean',
      }),
    ]);
  });

  it('should reject a boolean key rule whose value is a string', () => {
    expect(
      validateCommandAvailability({ ...IS_SELECT_ALL_LEAF, value: '"true"' }),
    ).toEqual([expect.objectContaining({ value: '"true"' })]);
  });

  it.each(['0', '-1'])(
    'should accept a selection count rule on the integer %s',
    (value) => {
      expect(
        validateCommandAvailability({
          ...NUMBER_OF_SELECTED_RECORDS_LEAF,
          value,
        }),
      ).toEqual([]);
    },
  );

  it('should reject a selection count rule on a value that is not a number', () => {
    expect(
      validateCommandAvailability({
        ...NUMBER_OF_SELECTED_RECORDS_LEAF,
        value: 'many',
      }),
    ).toEqual([expect.objectContaining({ value: 'many' })]);
  });

  it('should accept a page type rule on a known page type', () => {
    expect(
      validateCommandAvailability({
        ...PAGE_TYPE_LEAF,
        operand: ViewFilterOperand.IS_NOT,
      }),
    ).toEqual([]);
  });

  it('should reject a page type rule on an unknown page type', () => {
    expect(
      validateCommandAvailability({
        ...PAGE_TYPE_LEAF,
        value: '["UNKNOWN_PAGE"]',
      }),
    ).toEqual([
      expect.objectContaining({
        message:
          'Conditional display context key "pageType" uses option(s) UNKNOWN_PAGE that do not exist. Allowed values: INDEX_PAGE, RECORD_PAGE, STANDALONE_PAGE, SETTINGS_PAGE.',
      }),
    ]);
  });
});
