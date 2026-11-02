import { CommandMenuItemAvailabilityType } from 'twenty-shared/types';

import { type LegacyCommandMenuItemManifest } from 'src/engine/core-modules/application/application-manifest/types/legacy-command-menu-item-manifest.type';
import { resolveLegacyExpressionOrThrow } from 'src/engine/core-modules/application/application-manifest/utils/resolve-legacy-expression-or-throw.util';
import { EngineComponentKey } from 'src/engine/metadata-modules/command-menu-item/enums/engine-component-key.enum';
import { normalizeConditionalDisplay } from 'src/engine/metadata-modules/flat-conditional-display/utils/normalize-conditional-display.util';
import { type UniversalFlatCommandMenuItem } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/types/universal-flat-command-menu-item.type';

export const fromCommandMenuItemManifestToUniversalFlatCommandMenuItem = ({
  commandMenuItemManifest,
  applicationUniversalIdentifier,
  now,
}: {
  commandMenuItemManifest: LegacyCommandMenuItemManifest;
  applicationUniversalIdentifier: string;
  now: string;
}): UniversalFlatCommandMenuItem => {
  const conditionalAvailability = resolveLegacyExpressionOrThrow({
    label: commandMenuItemManifest.label,
    expressionPropertyName: 'conditionalAvailabilityExpression',
    expression: commandMenuItemManifest.conditionalAvailabilityExpression,
    conditionalDisplay: commandMenuItemManifest.conditionalAvailability,
  });
  const conditionalPinned = resolveLegacyExpressionOrThrow({
    label: commandMenuItemManifest.label,
    expressionPropertyName: 'conditionalPinnedExpression',
    expression: commandMenuItemManifest.conditionalPinnedExpression,
    conditionalDisplay: commandMenuItemManifest.conditionalPinned,
  });

  return {
    universalIdentifier: commandMenuItemManifest.universalIdentifier,
    applicationUniversalIdentifier,
    label: commandMenuItemManifest.label,
    shortLabel: commandMenuItemManifest.shortLabel ?? null,
    position: 0,
    icon: commandMenuItemManifest.icon ?? null,
    isPinned: commandMenuItemManifest.isPinned ?? false,
    availabilityType:
      commandMenuItemManifest.availabilityType ??
      CommandMenuItemAvailabilityType.GLOBAL,
    universalConditionalDisplay: normalizeConditionalDisplay(
      commandMenuItemManifest.conditionalDisplay,
    ),
    universalConditionalAvailability: normalizeConditionalDisplay(
      conditionalAvailability,
    ),
    universalConditionalPinned: normalizeConditionalDisplay(conditionalPinned),
    frontComponentUniversalIdentifier:
      commandMenuItemManifest.frontComponentUniversalIdentifier,
    availabilityObjectMetadataUniversalIdentifier:
      commandMenuItemManifest.availabilityObjectUniversalIdentifier ?? null,
    navigationTargetObjectMetadataUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.FRONT_COMPONENT_RENDERER,
    payload: null,
    hotKeys: null,
    workflowVersionId: null,
    coreWorkflowVersionId: null,
    pageLayoutUniversalIdentifier: null,
    isActive: true,
    isSystemSideEffect: false,
    universalOverrides: null,
    createdAt: now,
    updatedAt: now,
  };
};
