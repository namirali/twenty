import { FieldMetadataType } from 'twenty-shared/types';
import {
  buildDeviceConditionalDisplay,
  compileLegacyWidgetJsonLogic,
} from 'twenty-shared/utils';

import { migrateConditionalDisplayOverrides } from 'src/database/commands/upgrade-version-command/2-54/utils/migrate-conditional-display-overrides.util';
import { type FlatPageLayoutWidget } from 'src/engine/metadata-modules/flat-page-layout-widget/types/flat-page-layout-widget.type';

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

const SELECT_FIELD_JSON_LOGIC = {
  '==': [{ var: 'selectedRecords.0.selectField' }, 'VALUE_15'],
};

const toOverrides = (overrides: Record<string, unknown>) =>
  overrides as FlatPageLayoutWidget['overrides'];

describe('migrateConditionalDisplayOverrides', () => {
  it('should move a device expression override entry to a device rule', () => {
    expect(
      migrateConditionalDisplayOverrides({
        overrides: toOverrides({
          [WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER]: {
            conditionalAvailabilityExpression: 'device == "DESKTOP"',
            position: { layoutMode: 'VERTICAL_LIST', index: 2 },
          },
        }),
        conditionalDisplay: buildDeviceConditionalDisplay('MOBILE'),
        authorContext,
        resolveField,
      }),
    ).toEqual({
      overrides: {
        [WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER]: {
          conditionalDisplay: buildDeviceConditionalDisplay('DESKTOP'),
          position: { layoutMode: 'VERTICAL_LIST', index: 2 },
        },
      },
      convertedOverrideEntryCount: 1,
      unconvertibleOverrideEntries: [],
    });
  });

  it('should convert the json-logic of an override entry', () => {
    const result = migrateConditionalDisplayOverrides({
      overrides: toOverrides({
        [OWNER_APPLICATION_UNIVERSAL_IDENTIFIER]: {
          conditionalDisplay: SELECT_FIELD_JSON_LOGIC,
        },
      }),
      conditionalDisplay: null,
      authorContext,
      resolveField,
    });

    expect(result.overrides).toEqual({
      [OWNER_APPLICATION_UNIVERSAL_IDENTIFIER]: {
        conditionalDisplay: compileLegacyWidgetJsonLogic({
          jsonLogic: SELECT_FIELD_JSON_LOGIC,
          resolveField,
        }),
      },
    });
    expect(result.convertedOverrideEntryCount).toBe(1);
  });

  it('should report an override entry carrying a non-device expression and leave it untouched', () => {
    const overrides = toOverrides({
      [WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER]: {
        conditionalAvailabilityExpression: 'numberOfSelectedRecords == 1',
      },
    });

    expect(
      migrateConditionalDisplayOverrides({
        overrides,
        conditionalDisplay: null,
        authorContext,
        resolveField,
      }),
    ).toEqual({
      overrides,
      convertedOverrideEntryCount: 0,
      unconvertibleOverrideEntries: [
        `override entry of author ${WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER} carries the expression "numberOfSelectedRecords == 1", only device expressions convert to a conditional display`,
      ],
    });
  });

  it('should leave already converted overrides unchanged', () => {
    const migrated = migrateConditionalDisplayOverrides({
      overrides: toOverrides({
        [WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER]: {
          conditionalAvailabilityExpression: 'device == "DESKTOP"',
        },
      }),
      conditionalDisplay: null,
      authorContext,
      resolveField,
    });
    const persistedOverrides = JSON.parse(JSON.stringify(migrated.overrides));

    expect(
      migrateConditionalDisplayOverrides({
        overrides: persistedOverrides,
        conditionalDisplay: null,
        authorContext,
        resolveField,
      }),
    ).toEqual({
      overrides: persistedOverrides,
      convertedOverrideEntryCount: 0,
      unconvertibleOverrideEntries: [],
    });
  });
});
