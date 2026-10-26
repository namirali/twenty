import {
  type ConditionalDisplay,
  FieldMetadataType,
  RecordFilterGroupLogicalOperator,
  ViewFilterOperand,
} from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { LEGACY_WIDGET_JSON_LOGIC_CORPUS } from 'src/database/commands/upgrade-version-command/2-52/utils/__tests__/legacy-widget-json-logic-corpus.fixture';
import { compileLegacyWidgetJsonLogic } from 'src/database/commands/upgrade-version-command/2-52/utils/compile-legacy-widget-json-logic.util';
import { rewriteLegacyDeviceConditionalDisplay } from 'src/engine/metadata-modules/flat-conditional-display/utils/rewrite-legacy-device-conditional-display.util';
import { validateConditionalDisplay } from 'src/engine/metadata-modules/flat-conditional-display/utils/validate-conditional-display.util';
import { createEmptyFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant';
import { type MetadataUniversalFlatEntityMaps } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/types/metadata-universal-flat-entity-maps.type';

const OBJECT_UNIVERSAL_IDENTIFIER = '20202020-0000-4000-8000-000000000000';
const MULTI_SELECT_FIELD_ID = '20202020-1111-4111-8111-000000000001';
const SELECT_FIELD_ID = '20202020-1111-4111-8111-000000000002';
const TEXT_FIELD_ID = '20202020-1111-4111-8111-000000000003';

const FIELDS_BY_NAME: Record<
  string,
  { fieldMetadataId: string; type: FieldMetadataType }
> = {
  multiSelectField: {
    fieldMetadataId: MULTI_SELECT_FIELD_ID,
    type: FieldMetadataType.MULTI_SELECT,
  },
  selectField: {
    fieldMetadataId: SELECT_FIELD_ID,
    type: FieldMetadataType.SELECT,
  },
  textField: {
    fieldMetadataId: TEXT_FIELD_ID,
    type: FieldMetadataType.TEXT,
  },
};

const resolveField = (fieldName: string) => FIELDS_BY_NAME[fieldName];

const flatFieldMetadataMaps = {
  byUniversalIdentifier: Object.fromEntries(
    Object.values(FIELDS_BY_NAME).map(({ fieldMetadataId, type }) => [
      fieldMetadataId,
      {
        universalIdentifier: fieldMetadataId,
        objectMetadataUniversalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
        type,
      },
    ]),
  ),
} as unknown as MetadataUniversalFlatEntityMaps<'fieldMetadata'>;

const validateAsWidgetConditionalDisplay = ({
  recordFilters = [],
  ...conditionalDisplay
}: ConditionalDisplay) =>
  validateConditionalDisplay({
    conditionalDisplay: {
      ...conditionalDisplay,
      recordFilters: recordFilters.map(({ fieldMetadataId, ...recordFilter }) =>
        isDefined(fieldMetadataId)
          ? {
              ...recordFilter,
              fieldMetadataUniversalIdentifier: fieldMetadataId,
            }
          : recordFilter,
      ),
    },
    property: 'conditionalDisplay',
    surface: 'pageLayoutWidget',
    objectMetadataUniversalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
    invalidDataCode: 'INVALID_PAGE_LAYOUT_WIDGET_DATA',
    flatFieldMetadataMaps,
    flatRoleMaps: createEmptyFlatEntityMaps(),
  });

describe('compileLegacyWidgetJsonLogic', () => {
  it.each(LEGACY_WIDGET_JSON_LOGIC_CORPUS)(
    'should convert %j into a rule the validator accepts',
    (jsonLogic) => {
      const conditionalDisplay = compileLegacyWidgetJsonLogic({
        jsonLogic,
        resolveField,
      });

      expect(validateAsWidgetConditionalDisplay(conditionalDisplay)).toEqual(
        [],
      );
    },
  );

  it('should turn a negated or of multi-select inclusions into ungrouped does-not-contain rows', () => {
    const values = ['VALUE_1', 'VALUE_2', 'VALUE_3'];

    expect(
      compileLegacyWidgetJsonLogic({
        jsonLogic: {
          '!': {
            or: values.map((value) => ({
              in: [value, { var: 'selectedRecords.0.multiSelectField' }],
            })),
          },
        },
        resolveField,
      }),
    ).toEqual({
      recordFilters: values.map((value) => ({
        id: expect.any(String),
        fieldMetadataId: MULTI_SELECT_FIELD_ID,
        operand: ViewFilterOperand.DOES_NOT_CONTAIN,
        value: JSON.stringify([value]),
      })),
    });
  });

  it('should return the standard device rule for a device comparison', () => {
    const jsonLogic = { and: [{ '===': [{ var: 'device' }, 'MOBILE'] }] };

    const conditionalDisplay = compileLegacyWidgetJsonLogic({
      jsonLogic,
      resolveField,
    });

    expect(conditionalDisplay).toBe(
      rewriteLegacyDeviceConditionalDisplay(jsonLogic),
    );
    expect(conditionalDisplay).toEqual({
      recordFilters: [
        {
          id: '0',
          contextKey: 'device',
          operand: ViewFilterOperand.IS,
          value: '["MOBILE"]',
        },
      ],
    });
  });

  it('should throw on an inclusion in a text field', () => {
    expect(() =>
      compileLegacyWidgetJsonLogic({
        jsonLogic: { in: ['VALUE_1', { var: 'selectedRecords.0.textField' }] },
        resolveField,
      }),
    ).toThrow('Cannot convert legacy widget json-logic');
  });

  it('should turn select comparisons into select rows grouped by their operator', () => {
    const conditionalDisplay = compileLegacyWidgetJsonLogic({
      jsonLogic: {
        or: [
          { '==': [{ var: 'selectedRecords.0.selectField' }, 'VALUE_15'] },
          { '!==': [{ var: 'selectedRecords.0.selectField' }, 'VALUE_16'] },
        ],
      },
      resolveField,
    });

    const rootRecordFilterGroupId = conditionalDisplay.recordFilterGroups?.[0]?.id;

    expect(conditionalDisplay).toEqual({
      recordFilters: [
        {
          id: expect.any(String),
          fieldMetadataId: SELECT_FIELD_ID,
          operand: ViewFilterOperand.IS,
          value: '["VALUE_15"]',
          recordFilterGroupId: rootRecordFilterGroupId,
          positionInRecordFilterGroup: 0,
        },
        {
          id: expect.any(String),
          fieldMetadataId: SELECT_FIELD_ID,
          operand: ViewFilterOperand.IS_NOT,
          value: '["VALUE_16"]',
          recordFilterGroupId: rootRecordFilterGroupId,
          positionInRecordFilterGroup: 1,
        },
      ],
      recordFilterGroups: [
        {
          id: rootRecordFilterGroupId,
          logicalOperator: RecordFilterGroupLogicalOperator.OR,
        },
      ],
    });
  });

  it('should convert the same json-logic to the same rule', () => {
    LEGACY_WIDGET_JSON_LOGIC_CORPUS.forEach((jsonLogic) => {
      expect(compileLegacyWidgetJsonLogic({ jsonLogic, resolveField })).toEqual(
        compileLegacyWidgetJsonLogic({ jsonLogic, resolveField }),
      );
    });
  });

  it('should throw on the constant false json-logic', () => {
    expect(() =>
      compileLegacyWidgetJsonLogic({
        jsonLogic: { '==': [1, 0] },
        resolveField,
      }),
    ).toThrow('{"==":[1,0]}');
  });

  it('should throw on a field the object does not have', () => {
    expect(() =>
      compileLegacyWidgetJsonLogic({
        jsonLogic: {
          in: ['VALUE_1', { var: 'selectedRecords.0.missingField' }],
        },
        resolveField,
      }),
    ).toThrow('unknown field "missingField"');
  });

  it('should throw on a negated device comparison', () => {
    expect(() =>
      compileLegacyWidgetJsonLogic({
        jsonLogic: { '!': { '===': [{ var: 'device' }, 'MOBILE'] } },
        resolveField,
      }),
    ).toThrow('unsupported {"===":[{"var":"device"},"MOBILE"]}');
  });
});
