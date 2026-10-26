import { NEVER_AVAILABLE_CONDITIONAL_DISPLAY } from 'twenty-shared/constants';
import { FieldMetadataType, ViewFilterOperand } from 'twenty-shared/types';
import { compileConditionalAvailabilityExpression } from 'twenty-shared/utils';

import { compileLegacyWidgetJsonLogic } from 'src/database/commands/upgrade-version-command/2-52/utils/compile-legacy-widget-json-logic.util';
import { migrateEngineGatesToConditionalDisplayTrees } from 'src/database/commands/upgrade-version-command/2-52/utils/migrate-engine-gates-to-conditional-display-trees.util';

const WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER =
  '11111111-1111-4111-8111-111111111111';
const OWNER_APPLICATION_UNIVERSAL_IDENTIFIER =
  '22222222-2222-4222-8222-222222222222';
const SELECT_FIELD_ID = '20202020-1111-4111-8111-000000000002';

const authorContext = {
  workspaceCustomApplicationUniversalIdentifier:
    WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER,
  ownerApplicationUniversalIdentifier: OWNER_APPLICATION_UNIVERSAL_IDENTIFIER,
};

const resolveField = (fieldName: string) =>
  fieldName === 'selectField'
    ? { fieldMetadataId: SELECT_FIELD_ID, type: FieldMetadataType.SELECT }
    : undefined;

const MOBILE_CONDITIONAL_DISPLAY = {
  recordFilters: [
    {
      id: '0',
      contextKey: 'device',
      operand: ViewFilterOperand.IS,
      value: '["MOBILE"]',
    },
  ],
};

const DESKTOP_CONDITIONAL_DISPLAY = {
  recordFilters: [
    {
      id: '0',
      contextKey: 'device',
      operand: ViewFilterOperand.IS,
      value: '["DESKTOP"]',
    },
  ],
};

const AVAILABILITY_EXPRESSION =
  'targetObjectReadPermissions.person and numberOfSelectedRecords >= 1';
const PINNED_EXPRESSION = 'numberOfSelectedRecords == 1';
const SELECT_FIELD_JSON_LOGIC = {
  '==': [{ var: 'selectedRecords.0.selectField' }, 'VALUE_15'],
};

describe('migrateEngineGatesToConditionalDisplayTrees', () => {
  it('should compile both expressions of a command menu item', () => {
    const result = migrateEngineGatesToConditionalDisplayTrees({
      metadataName: 'commandMenuItem',
      legacyEngineGateExpressions: {
        conditionalAvailabilityExpression: AVAILABILITY_EXPRESSION,
        conditionalPinnedExpression: PINNED_EXPRESSION,
      },
      conditionalDisplay: null,
      overrides: null,
      authorContext,
      resolveField,
    });

    expect(result).toEqual({
      conditionalAvailability: compileConditionalAvailabilityExpression(
        AVAILABILITY_EXPRESSION,
      ),
      conditionalPinned:
        compileConditionalAvailabilityExpression(PINNED_EXPRESSION),
      conditionalDisplay: null,
      overrides: null,
      isConditionalDisplayConvertedFromJsonLogic: false,
      convertedOverrideEntryCount: 0,
      unconvertibleOverrideEntries: [],
    });
    expect(result.conditionalAvailability?.recordFilters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          contextKey: 'targetObjectReadPermissions',
          subFieldName: 'person',
        }),
        expect.objectContaining({ contextKey: 'numberOfSelectedRecords' }),
      ]),
    );
  });

  it('should compile the availability expression and convert the json-logic of a widget', () => {
    const result = migrateEngineGatesToConditionalDisplayTrees({
      metadataName: 'pageLayoutWidget',
      legacyEngineGateExpressions: {
        conditionalAvailabilityExpression: AVAILABILITY_EXPRESSION,
        conditionalPinnedExpression: null,
      },
      conditionalDisplay: SELECT_FIELD_JSON_LOGIC,
      overrides: null,
      authorContext,
      resolveField,
    });

    expect(result.conditionalAvailability).toEqual(
      compileConditionalAvailabilityExpression(AVAILABILITY_EXPRESSION),
    );
    expect(result.conditionalPinned).toBeNull();
    expect(result.conditionalDisplay).toEqual(
      compileLegacyWidgetJsonLogic({
        jsonLogic: SELECT_FIELD_JSON_LOGIC,
        resolveField,
      }),
    );
    expect(result.conditionalDisplay).toEqual(
      expect.objectContaining({
        recordFilters: [
          expect.objectContaining({ fieldMetadataId: SELECT_FIELD_ID }),
        ],
      }),
    );
    expect(result.isConditionalDisplayConvertedFromJsonLogic).toBe(true);
  });

  it('should map the never available expression to the never available tree', () => {
    const result = migrateEngineGatesToConditionalDisplayTrees({
      metadataName: 'commandMenuItem',
      legacyEngineGateExpressions: {
        conditionalAvailabilityExpression: 'false',
        conditionalPinnedExpression: null,
      },
      conditionalDisplay: null,
      overrides: null,
      authorContext,
      resolveField,
    });

    expect(result.conditionalAvailability).toEqual(
      NEVER_AVAILABLE_CONDITIONAL_DISPLAY,
    );
  });

  it('should throw on a widget whose availability expression is never available', () => {
    expect(() =>
      migrateEngineGatesToConditionalDisplayTrees({
        metadataName: 'pageLayoutWidget',
        legacyEngineGateExpressions: {
          conditionalAvailabilityExpression: 'false',
          conditionalPinnedExpression: null,
        },
        conditionalDisplay: null,
        overrides: null,
        authorContext,
        resolveField,
      }),
    ).toThrow('widget expression "false" is never available');
  });

  it('should move device expressions on the widget and its override entry to device rules', () => {
    const result = migrateEngineGatesToConditionalDisplayTrees({
      metadataName: 'pageLayoutWidget',
      legacyEngineGateExpressions: {
        conditionalAvailabilityExpression: 'device == "MOBILE"',
        conditionalPinnedExpression: null,
      },
      conditionalDisplay: { and: [{ '===': [{ var: 'device' }, 'MOBILE'] }] },
      overrides: {
        [WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER]: {
          conditionalAvailabilityExpression: 'device == "DESKTOP"',
          position: { layoutMode: 'VERTICAL_LIST', index: 2 },
        },
      },
      authorContext,
      resolveField,
    });

    expect(result).toEqual({
      conditionalAvailability: null,
      conditionalPinned: null,
      conditionalDisplay: MOBILE_CONDITIONAL_DISPLAY,
      overrides: {
        [WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER]: {
          conditionalDisplay: DESKTOP_CONDITIONAL_DISPLAY,
          position: { layoutMode: 'VERTICAL_LIST', index: 2 },
        },
      },
      isConditionalDisplayConvertedFromJsonLogic: false,
      convertedOverrideEntryCount: 1,
      unconvertibleOverrideEntries: [],
    });
  });

  it('should report an override entry carrying a non-device expression and leave it untouched', () => {
    const overrides = {
      [WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER]: {
        conditionalAvailabilityExpression: 'numberOfSelectedRecords == 1',
      },
    };

    const result = migrateEngineGatesToConditionalDisplayTrees({
      metadataName: 'pageLayoutWidget',
      legacyEngineGateExpressions: {
        conditionalAvailabilityExpression: null,
        conditionalPinnedExpression: null,
      },
      conditionalDisplay: null,
      overrides,
      authorContext,
      resolveField,
    });

    expect(result.overrides).toEqual(overrides);
    expect(result.convertedOverrideEntryCount).toBe(0);
    expect(result.unconvertibleOverrideEntries).toEqual([
      `override entry of author ${WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER} carries the expression "numberOfSelectedRecords == 1", only device expressions convert to a conditional display`,
    ]);
  });

  it('should leave an already converted entity unchanged', () => {
    const migrated = migrateEngineGatesToConditionalDisplayTrees({
      metadataName: 'pageLayoutWidget',
      legacyEngineGateExpressions: {
        conditionalAvailabilityExpression: AVAILABILITY_EXPRESSION,
        conditionalPinnedExpression: null,
      },
      conditionalDisplay: SELECT_FIELD_JSON_LOGIC,
      overrides: {
        [WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER]: {
          conditionalAvailabilityExpression: 'device == "DESKTOP"',
        },
      },
      authorContext,
      resolveField,
    });
    const persisted = JSON.parse(JSON.stringify(migrated));

    const rerun = migrateEngineGatesToConditionalDisplayTrees({
      metadataName: 'pageLayoutWidget',
      legacyEngineGateExpressions: {
        conditionalAvailabilityExpression: AVAILABILITY_EXPRESSION,
        conditionalPinnedExpression: null,
      },
      conditionalDisplay: persisted.conditionalDisplay,
      overrides: persisted.overrides,
      authorContext,
      resolveField,
    });

    expect(rerun).toEqual({
      conditionalAvailability: persisted.conditionalAvailability,
      conditionalPinned: null,
      conditionalDisplay: persisted.conditionalDisplay,
      overrides: persisted.overrides,
      isConditionalDisplayConvertedFromJsonLogic: false,
      convertedOverrideEntryCount: 0,
      unconvertibleOverrideEntries: [],
    });
  });

  it('should throw on constant json-logic', () => {
    expect(() =>
      migrateEngineGatesToConditionalDisplayTrees({
        metadataName: 'pageLayoutWidget',
        legacyEngineGateExpressions: {
          conditionalAvailabilityExpression: null,
          conditionalPinnedExpression: null,
        },
        conditionalDisplay: { '==': [1, 0] },
        overrides: null,
        authorContext,
        resolveField,
      }),
    ).toThrow('Cannot convert legacy widget json-logic');
  });
});
