import { FieldMetadataType } from 'twenty-shared/types';

import { type LegacyEngineGateExpressions } from 'src/database/commands/upgrade-version-command/2-52/types/legacy-engine-gate-expressions.type';
import { buildEngineGateOriginal } from 'src/database/commands/upgrade-version-command/2-52/utils/build-engine-gate-original.util';
import { migrateEngineGatesToConditionalDisplayTrees } from 'src/database/commands/upgrade-version-command/2-52/utils/migrate-engine-gates-to-conditional-display-trees.util';
import { restoreEngineGatesFromOriginals } from 'src/database/commands/upgrade-version-command/2-52/utils/restore-engine-gates-from-originals.util';

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

const persist = <TValue>(value: TValue): TValue =>
  JSON.parse(JSON.stringify(value));

const runUpThenDown = ({
  metadataName,
  legacyEngineGateExpressions,
  original,
}: {
  metadataName: 'commandMenuItem' | 'pageLayoutWidget';
  legacyEngineGateExpressions: LegacyEngineGateExpressions;
  original: {
    conditionalAvailability: null;
    conditionalPinned: null;
    conditionalDisplay: unknown;
    overrides: unknown;
  };
}) => {
  const migrated = persist(
    migrateEngineGatesToConditionalDisplayTrees({
      metadataName,
      legacyEngineGateExpressions,
      conditionalDisplay: original.conditionalDisplay,
      overrides: original.overrides,
      authorContext,
      resolveField,
    }),
  );
  const storedOriginal = buildEngineGateOriginal({ original, migrated });

  const restored = restoreEngineGatesFromOriginals({
    legacyEngineGateExpressions,
    conditionalAvailability: migrated.conditionalAvailability,
    conditionalPinned: migrated.conditionalPinned,
    conditionalDisplay: migrated.conditionalDisplay,
    overrides: migrated.overrides,
    engineGateOriginal: persist({ storedOriginal }).storedOriginal,
  });

  return { migrated, restored };
};

describe('restoreEngineGatesFromOriginals', () => {
  it('should restore a widget whose json-logic, device expression and override entries were converted', () => {
    const original = {
      conditionalAvailability: null,
      conditionalPinned: null,
      conditionalDisplay: {
        and: [{ '===': [{ var: 'device' }, 'MOBILE'] }],
      },
      overrides: {
        [WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER]: {
          conditionalAvailabilityExpression: 'device == "DESKTOP"',
          title: 'Renamed widget',
        },
        [OWNER_APPLICATION_UNIVERSAL_IDENTIFIER]: {
          conditionalDisplay: {
            '==': [{ var: 'selectedRecords.0.selectField' }, 'VALUE_15'],
          },
        },
      },
    };

    const { migrated, restored } = runUpThenDown({
      metadataName: 'pageLayoutWidget',
      legacyEngineGateExpressions: {
        conditionalAvailabilityExpression: 'device == "MOBILE"',
        conditionalPinnedExpression: null,
      },
      original,
    });

    expect(JSON.stringify(migrated.conditionalDisplay)).not.toBe(
      JSON.stringify(original.conditionalDisplay),
    );
    expect(JSON.stringify(migrated.overrides)).not.toBe(
      JSON.stringify(original.overrides),
    );
    expect(JSON.stringify(restored)).toBe(JSON.stringify(original));
  });

  it('should restore a widget whose json-logic field rule was converted next to a compiled availability', () => {
    const original = {
      conditionalAvailability: null,
      conditionalPinned: null,
      conditionalDisplay: {
        '==': [{ var: 'selectedRecords.0.selectField' }, 'VALUE_15'],
      },
      overrides: null,
    };

    const { migrated, restored } = runUpThenDown({
      metadataName: 'pageLayoutWidget',
      legacyEngineGateExpressions: {
        conditionalAvailabilityExpression: 'featureFlags.IS_AI_CHAT_INBOX_ENABLED',
        conditionalPinnedExpression: null,
      },
      original,
    });

    expect(migrated.conditionalAvailability).not.toBeNull();
    expect(JSON.stringify(restored)).toBe(JSON.stringify(original));
  });

  it('should restore a command whose availability and pinned expressions were compiled', () => {
    const original = {
      conditionalAvailability: null,
      conditionalPinned: null,
      conditionalDisplay: null,
      overrides: {
        [WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER]: {
          label: 'Escalate',
          position: 3,
        },
      },
    };

    const { migrated, restored } = runUpThenDown({
      metadataName: 'commandMenuItem',
      legacyEngineGateExpressions: {
        conditionalAvailabilityExpression:
          'targetObjectReadPermissions.person and numberOfSelectedRecords >= 1',
        conditionalPinnedExpression: 'numberOfSelectedRecords == 1',
      },
      original,
    });

    expect(migrated.conditionalAvailability).not.toBeNull();
    expect(migrated.conditionalPinned).not.toBeNull();
    expect(JSON.stringify(restored)).toBe(JSON.stringify(original));
  });
});
