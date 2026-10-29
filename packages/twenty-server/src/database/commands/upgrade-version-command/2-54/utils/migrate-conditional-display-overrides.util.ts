import { isNull } from '@sniptt/guards';
import { type LegacyWidgetJsonLogicField } from 'twenty-shared/types';
import {
  compileLegacyWidgetJsonLogic,
  isDefined,
  isLegacyJsonLogicConditionalDisplay,
  isPlainObject,
} from 'twenty-shared/utils';

import { LEGACY_CONDITIONAL_EXPRESSION_OVERRIDE_PROPERTY } from 'src/database/commands/upgrade-version-command/2-54/constants/legacy-conditional-expression-override-property.constant';
import { findLegacyDeviceConditionalExpression } from 'src/database/commands/upgrade-version-command/2-54/utils/find-legacy-device-conditional-expression.util';
import { normalizeLegacyAuthoredOverrides } from 'src/database/commands/upgrade-version-command/2-54/utils/normalize-legacy-authored-overrides.util';
import { type FlatPageLayoutWidget } from 'src/engine/metadata-modules/flat-page-layout-widget/types/flat-page-layout-widget.type';
import { type OverrideAuthorContext } from 'src/engine/metadata-modules/overrides/types/override-author-context.type';
import { computeOverrideAuthorOrder } from 'src/engine/metadata-modules/overrides/utils/compute-override-author-order.util';
import { dispatchUpdateToAuthoredOverride } from 'src/engine/metadata-modules/overrides/utils/dispatch-update-to-authored-override.util';

export const migrateConditionalDisplayOverrides = ({
  overrides,
  conditionalDisplay,
  authorContext,
  resolveField,
}: {
  overrides: FlatPageLayoutWidget['overrides'];
  conditionalDisplay: FlatPageLayoutWidget['conditionalDisplay'];
  authorContext: OverrideAuthorContext;
  resolveField: (fieldName: string) => LegacyWidgetJsonLogicField | undefined;
}): {
  overrides: FlatPageLayoutWidget['overrides'];
  convertedOverrideEntryCount: number;
  unconvertibleOverrideEntries: string[];
} => {
  const authoredOverrides = normalizeLegacyAuthoredOverrides({
    overrides,
    workspaceCustomApplicationUniversalIdentifier:
      authorContext.workspaceCustomApplicationUniversalIdentifier,
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
    const entry: unknown = migratedOverrides?.[author];

    if (!isPlainObject(entry)) {
      continue;
    }

    if (LEGACY_CONDITIONAL_EXPRESSION_OVERRIDE_PROPERTY in entry) {
      const {
        [LEGACY_CONDITIONAL_EXPRESSION_OVERRIDE_PROPERTY]: entryExpression,
        ...entryWithoutExpression
      } = entry;
      const legacyDeviceConditionalExpression =
        findLegacyDeviceConditionalExpression(entryExpression);

      if (
        !isNull(entryExpression) &&
        !isDefined(legacyDeviceConditionalExpression)
      ) {
        unconvertibleOverrideEntries.push(
          `override entry of author ${author} carries the expression ${JSON.stringify(entryExpression)}, only device expressions convert to a conditional display`,
        );
        continue;
      }

      migratedOverrides = dispatchUpdateToAuthoredOverride({
        metadataName: 'pageLayoutWidget',
        updatedProperties: {
          conditionalDisplay:
            legacyDeviceConditionalExpression?.conditionalDisplay ?? null,
        },
        existingEntity: { conditionalDisplay },
        existingOverrides: {
          ...migratedOverrides,
          [author]: entryWithoutExpression,
        },
        authorUniversalIdentifier: author,
        authorContext,
      }).overrides;
      convertedOverrideEntryCount += 1;
      continue;
    }

    if (!isLegacyJsonLogicConditionalDisplay(entry.conditionalDisplay)) {
      continue;
    }

    migratedOverrides = dispatchUpdateToAuthoredOverride({
      metadataName: 'pageLayoutWidget',
      updatedProperties: {
        conditionalDisplay: compileLegacyWidgetJsonLogic({
          jsonLogic: entry.conditionalDisplay,
          resolveField,
        }),
      },
      existingEntity: { conditionalDisplay },
      existingOverrides: migratedOverrides,
      authorUniversalIdentifier: author,
      authorContext,
    }).overrides;
    convertedOverrideEntryCount += 1;
  }

  return {
    overrides:
      convertedOverrideEntryCount === 0
        ? overrides
        : (migratedOverrides as FlatPageLayoutWidget['overrides']),
    convertedOverrideEntryCount,
    unconvertibleOverrideEntries,
  };
};
