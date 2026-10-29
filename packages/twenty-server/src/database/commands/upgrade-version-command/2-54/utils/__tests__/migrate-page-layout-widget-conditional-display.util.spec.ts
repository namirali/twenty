import { NEVER_AVAILABLE_CONDITIONAL_DISPLAY } from 'twenty-shared/constants';
import { FieldMetadataType } from 'twenty-shared/types';
import {
  buildDeviceConditionalDisplay,
  compileConditionalAvailabilityExpression,
  compileLegacyWidgetJsonLogic,
} from 'twenty-shared/utils';

import { migratePageLayoutWidgetConditionalDisplay } from 'src/database/commands/upgrade-version-command/2-54/utils/migrate-page-layout-widget-conditional-display.util';
import { type FlatPageLayoutWidget } from 'src/engine/metadata-modules/flat-page-layout-widget/types/flat-page-layout-widget.type';

const SELECT_FIELD_ID = '20202020-1111-4111-8111-000000000002';

const resolveField = (fieldName: string) =>
  fieldName === 'selectField'
    ? { fieldMetadataId: SELECT_FIELD_ID, type: FieldMetadataType.SELECT }
    : undefined;

const AVAILABILITY_EXPRESSION =
  'targetObjectReadPermissions.person and numberOfSelectedRecords >= 1';
const SELECT_FIELD_JSON_LOGIC = {
  '==': [{ var: 'selectedRecords.0.selectField' }, 'VALUE_15'],
};
const MOBILE_JSON_LOGIC = { and: [{ '===': [{ var: 'device' }, 'MOBILE'] }] };

const toConditionalDisplay = (conditionalDisplay: Record<string, unknown>) =>
  conditionalDisplay as FlatPageLayoutWidget['conditionalDisplay'];

describe('migratePageLayoutWidgetConditionalDisplay', () => {
  it('should compile the availability expression and convert the json-logic', () => {
    expect(
      migratePageLayoutWidgetConditionalDisplay({
        conditionalAvailabilityExpression: AVAILABILITY_EXPRESSION,
        conditionalAvailability: null,
        conditionalDisplay: toConditionalDisplay(SELECT_FIELD_JSON_LOGIC),
        resolveField,
      }),
    ).toEqual({
      conditionalAvailability: compileConditionalAvailabilityExpression(
        AVAILABILITY_EXPRESSION,
      ),
      conditionalDisplay: compileLegacyWidgetJsonLogic({
        jsonLogic: SELECT_FIELD_JSON_LOGIC,
        resolveField,
      }),
      isConditionalDisplayConvertedFromJsonLogic: true,
    });
  });

  it('should map the never available expression to the never available tree', () => {
    expect(
      migratePageLayoutWidgetConditionalDisplay({
        conditionalAvailabilityExpression: 'false',
        conditionalAvailability: null,
        conditionalDisplay: null,
        resolveField,
      }).conditionalAvailability,
    ).toEqual(NEVER_AVAILABLE_CONDITIONAL_DISPLAY);
  });

  it('should keep an availability tree that already exists', () => {
    const conditionalAvailability = compileConditionalAvailabilityExpression(
      'numberOfSelectedRecords == 1',
    );

    expect(
      migratePageLayoutWidgetConditionalDisplay({
        conditionalAvailabilityExpression: AVAILABILITY_EXPRESSION,
        conditionalAvailability,
        conditionalDisplay: null,
        resolveField,
      }).conditionalAvailability,
    ).toBe(conditionalAvailability);
  });

  it('should move a device expression and its json-logic to a device rule', () => {
    expect(
      migratePageLayoutWidgetConditionalDisplay({
        conditionalAvailabilityExpression: 'device == "MOBILE"',
        conditionalAvailability: null,
        conditionalDisplay: toConditionalDisplay(MOBILE_JSON_LOGIC),
        resolveField,
      }),
    ).toEqual({
      conditionalAvailability: null,
      conditionalDisplay: buildDeviceConditionalDisplay('MOBILE'),
      isConditionalDisplayConvertedFromJsonLogic: false,
    });
  });

  it('should keep the conditional display of an already migrated device widget', () => {
    const conditionalDisplay = buildDeviceConditionalDisplay('MOBILE');

    expect(
      migratePageLayoutWidgetConditionalDisplay({
        conditionalAvailabilityExpression: 'device == "MOBILE"',
        conditionalAvailability: null,
        conditionalDisplay,
        resolveField,
      }),
    ).toEqual({
      conditionalAvailability: null,
      conditionalDisplay,
      isConditionalDisplayConvertedFromJsonLogic: false,
    });
  });

  it('should throw when a device expression disagrees with the json-logic', () => {
    expect(() =>
      migratePageLayoutWidgetConditionalDisplay({
        conditionalAvailabilityExpression: 'device == "DESKTOP"',
        conditionalAvailability: null,
        conditionalDisplay: toConditionalDisplay(MOBILE_JSON_LOGIC),
        resolveField,
      }),
    ).toThrow('device expression "device == "DESKTOP"" cannot replace');
  });

  it('should throw on constant json-logic', () => {
    expect(() =>
      migratePageLayoutWidgetConditionalDisplay({
        conditionalAvailabilityExpression: null,
        conditionalAvailability: null,
        conditionalDisplay: toConditionalDisplay({ '==': [1, 0] }),
        resolveField,
      }),
    ).toThrow('Cannot convert legacy widget json-logic');
  });
});
