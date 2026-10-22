import { isArray } from '@sniptt/guards';
import { NEVER_AVAILABLE_CONDITIONAL_DISPLAY } from 'twenty-shared/constants';
import { type ConditionalDisplay } from 'twenty-shared/types';
import {
  compileConditionalAvailabilityExpression,
  fastDeepEqual,
  isDefined,
  isPlainObject,
} from 'twenty-shared/utils';

import { LEGACY_WIDGET_DEVICE_VISIBILITIES } from 'src/database/commands/upgrade-version-command/2-51/constants/legacy-widget-device-visibilities.constant';
import { type LegacyEngineGateExpressions } from 'src/database/commands/upgrade-version-command/2-51/types/legacy-engine-gate-expressions.type';
import { compileLegacyWidgetJsonLogic } from 'src/database/commands/upgrade-version-command/2-51/utils/compile-legacy-widget-json-logic.util';
import { rewriteLegacyDeviceConditionalDisplay } from 'src/engine/metadata-modules/flat-conditional-display/utils/rewrite-legacy-device-conditional-display.util';
import { type OverrideAuthorContext } from 'src/engine/metadata-modules/overrides/types/override-author-context.type';
import { computeOverrideAuthorOrder } from 'src/engine/metadata-modules/overrides/utils/compute-override-author-order.util';
import { dispatchUpdateToAuthoredOverride } from 'src/engine/metadata-modules/overrides/utils/dispatch-update-to-authored-override.util';
import { normalizeAuthoredOverrides } from 'src/engine/metadata-modules/overrides/utils/normalize-authored-overrides.util';

type EngineGateMetadataName = 'commandMenuItem' | 'pageLayoutWidget';

type ResolveLegacyWidgetJsonLogicField = Parameters<
  typeof compileLegacyWidgetJsonLogic
>[0]['resolveField'];

const LEGACY_EXPRESSION_OVERRIDE_PROPERTY = 'conditionalAvailabilityExpression';

const compileLegacyExpression = ({
  metadataName,
  expression,
}: {
  metadataName: EngineGateMetadataName;
  expression: string | null;
}): ConditionalDisplay | null => {
  if (!isDefined(expression)) {
    return null;
  }

  const conditionalAvailability =
    compileConditionalAvailabilityExpression(expression);

  if (
    metadataName === 'pageLayoutWidget' &&
    fastDeepEqual(conditionalAvailability, NEVER_AVAILABLE_CONDITIONAL_DISPLAY)
  ) {
    throw new Error(
      `widget expression "${expression}" is never available, which no condition valid on widgets can express`,
    );
  }

  return conditionalAvailability;
};

const findDeviceConditionalDisplay = (expression: unknown) =>
  LEGACY_WIDGET_DEVICE_VISIBILITIES.find(
    (deviceVisibility) =>
      deviceVisibility.conditionalAvailabilityExpression === expression,
  )?.conditionalDisplay;

const isLegacyJsonLogicConditionalDisplay = (conditionalDisplay: unknown) =>
  isDefined(conditionalDisplay) &&
  !(
    isPlainObject(conditionalDisplay) &&
    isArray(conditionalDisplay.recordFilters)
  );

const migrateBase = ({
  metadataName,
  conditionalAvailabilityExpression,
  conditionalDisplay,
  resolveField,
}: {
  metadataName: EngineGateMetadataName;
  conditionalAvailabilityExpression: string | null;
  conditionalDisplay: unknown;
  resolveField: ResolveLegacyWidgetJsonLogicField;
}): {
  conditionalAvailability: ConditionalDisplay | null;
  conditionalDisplay: unknown;
  isConditionalDisplayConvertedFromJsonLogic: boolean;
} => {
  const deviceConditionalDisplay = findDeviceConditionalDisplay(
    conditionalAvailabilityExpression,
  );

  if (isDefined(deviceConditionalDisplay)) {
    if (
      isDefined(conditionalDisplay) &&
      !fastDeepEqual(
        rewriteLegacyDeviceConditionalDisplay(conditionalDisplay),
        deviceConditionalDisplay,
      )
    ) {
      throw new Error(
        `device expression "${conditionalAvailabilityExpression}" cannot replace the conditional display ${JSON.stringify(conditionalDisplay)}`,
      );
    }

    return {
      conditionalAvailability: null,
      conditionalDisplay: deviceConditionalDisplay,
      isConditionalDisplayConvertedFromJsonLogic: false,
    };
  }

  const conditionalAvailability = compileLegacyExpression({
    metadataName,
    expression: conditionalAvailabilityExpression,
  });

  if (!isLegacyJsonLogicConditionalDisplay(conditionalDisplay)) {
    return {
      conditionalAvailability,
      conditionalDisplay,
      isConditionalDisplayConvertedFromJsonLogic: false,
    };
  }

  return {
    conditionalAvailability,
    conditionalDisplay: compileLegacyWidgetJsonLogic({
      jsonLogic: conditionalDisplay,
      resolveField,
    }),
    isConditionalDisplayConvertedFromJsonLogic: true,
  };
};

const normalizeLegacyAuthoredOverrides = ({
  metadataName,
  overrides,
  authorContext,
}: {
  metadataName: EngineGateMetadataName;
  overrides: unknown;
  authorContext: OverrideAuthorContext;
}): Record<string, unknown> | null => {
  if (
    isPlainObject(overrides) &&
    LEGACY_EXPRESSION_OVERRIDE_PROPERTY in overrides
  ) {
    return {
      [authorContext.workspaceCustomApplicationUniversalIdentifier]: overrides,
    };
  }

  return normalizeAuthoredOverrides<unknown>({
    metadataName,
    overrides,
    workspaceCustomApplicationUniversalIdentifier:
      authorContext.workspaceCustomApplicationUniversalIdentifier,
  });
};

const migrateOverrides = ({
  metadataName,
  overrides,
  migratedConditionalDisplay,
  authorContext,
  resolveField,
}: {
  metadataName: EngineGateMetadataName;
  overrides: unknown;
  migratedConditionalDisplay: unknown;
  authorContext: OverrideAuthorContext;
  resolveField: ResolveLegacyWidgetJsonLogicField;
}): {
  overrides: unknown;
  convertedOverrideEntryCount: number;
  unconvertibleOverrideEntries: string[];
} => {
  const authoredOverrides = normalizeLegacyAuthoredOverrides({
    metadataName,
    overrides,
    authorContext,
  });

  if (!isDefined(authoredOverrides)) {
    return {
      overrides,
      convertedOverrideEntryCount: 0,
      unconvertibleOverrideEntries: [],
    };
  }

  const authorOrder = computeOverrideAuthorOrder(authorContext);
  const authorsFromLowestPriority = [
    ...Object.keys(authoredOverrides).filter(
      (author) => !authorOrder.includes(author),
    ),
    ...[...authorOrder].reverse(),
  ];

  let migratedOverrides: Record<string, unknown> | null = authoredOverrides;
  let convertedOverrideEntryCount = 0;
  const unconvertibleOverrideEntries: string[] = [];

  for (const author of authorsFromLowestPriority) {
    const entry = migratedOverrides?.[author];

    if (!isPlainObject(entry)) {
      continue;
    }

    const dispatchConditionalDisplayToAuthorEntry = ({
      conditionalDisplay,
      existingOverrides,
    }: {
      conditionalDisplay: unknown;
      existingOverrides: Record<string, unknown> | null;
    }) =>
      dispatchUpdateToAuthoredOverride<{ conditionalDisplay: unknown }>({
        metadataName,
        updatedProperties: { conditionalDisplay },
        existingEntity: { conditionalDisplay: migratedConditionalDisplay },
        existingOverrides,
        authorUniversalIdentifier: author,
        authorContext,
      }).overrides;

    if (LEGACY_EXPRESSION_OVERRIDE_PROPERTY in entry) {
      const {
        [LEGACY_EXPRESSION_OVERRIDE_PROPERTY]: entryExpression,
        ...entryWithoutExpression
      } = entry;
      const deviceConditionalDisplay =
        findDeviceConditionalDisplay(entryExpression);

      if (entryExpression !== null && !isDefined(deviceConditionalDisplay)) {
        unconvertibleOverrideEntries.push(
          `override entry of author ${author} carries the expression ${JSON.stringify(entryExpression)}, only device expressions convert to a conditional display`,
        );
        continue;
      }

      migratedOverrides = dispatchConditionalDisplayToAuthorEntry({
        conditionalDisplay: deviceConditionalDisplay ?? null,
        existingOverrides: {
          ...migratedOverrides,
          [author]: entryWithoutExpression,
        },
      });
      convertedOverrideEntryCount += 1;
      continue;
    }

    if (!isLegacyJsonLogicConditionalDisplay(entry.conditionalDisplay)) {
      continue;
    }

    migratedOverrides = dispatchConditionalDisplayToAuthorEntry({
      conditionalDisplay: compileLegacyWidgetJsonLogic({
        jsonLogic: entry.conditionalDisplay,
        resolveField,
      }),
      existingOverrides: migratedOverrides,
    });
    convertedOverrideEntryCount += 1;
  }

  return {
    overrides: convertedOverrideEntryCount === 0 ? overrides : migratedOverrides,
    convertedOverrideEntryCount,
    unconvertibleOverrideEntries,
  };
};

export const migrateEngineGatesToConditionalDisplayTrees = ({
  metadataName,
  legacyEngineGateExpressions: {
    conditionalAvailabilityExpression,
    conditionalPinnedExpression,
  },
  conditionalDisplay,
  overrides,
  authorContext,
  resolveField,
}: {
  metadataName: EngineGateMetadataName;
  legacyEngineGateExpressions: LegacyEngineGateExpressions;
  conditionalDisplay: unknown;
  overrides: unknown;
  authorContext: OverrideAuthorContext;
  resolveField: ResolveLegacyWidgetJsonLogicField;
}) => {
  const migratedBase = migrateBase({
    metadataName,
    conditionalAvailabilityExpression,
    conditionalDisplay,
    resolveField,
  });
  const migratedOverrides = migrateOverrides({
    metadataName,
    overrides,
    migratedConditionalDisplay: migratedBase.conditionalDisplay,
    authorContext,
    resolveField,
  });

  return {
    conditionalAvailability: migratedBase.conditionalAvailability,
    conditionalPinned: compileLegacyExpression({
      metadataName,
      expression: conditionalPinnedExpression,
    }),
    conditionalDisplay: migratedBase.conditionalDisplay,
    overrides: migratedOverrides.overrides,
    isConditionalDisplayConvertedFromJsonLogic:
      migratedBase.isConditionalDisplayConvertedFromJsonLogic,
    convertedOverrideEntryCount: migratedOverrides.convertedOverrideEntryCount,
    unconvertibleOverrideEntries: migratedOverrides.unconvertibleOverrideEntries,
  };
};
