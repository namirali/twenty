import { Logger } from '@nestjs/common';

import {
  CommandMenuItemAvailabilityType,
  type UniversalConditionalDisplay,
} from 'twenty-shared/types';
import {
  compileConditionalAvailabilityExpression,
  isDefined,
} from 'twenty-shared/utils';

import { type LegacyCommandMenuItemManifest } from 'src/engine/core-modules/application/application-manifest/types/legacy-command-menu-item-manifest.type';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/engine/core-modules/application/application.exception';
import { EngineComponentKey } from 'src/engine/metadata-modules/command-menu-item/enums/engine-component-key.enum';
import { normalizeConditionalDisplay } from 'src/engine/metadata-modules/flat-conditional-display/utils/normalize-conditional-display.util';
import { type UniversalFlatCommandMenuItem } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/types/universal-flat-command-menu-item.type';

const logger = new Logger('CommandMenuItemManifestConverter');

const resolveLegacyExpressionOrThrow = ({
  label,
  expressionPropertyName,
  expression,
  conditionalDisplay,
}: {
  label: string;
  expressionPropertyName:
    | 'conditionalAvailabilityExpression'
    | 'conditionalPinnedExpression';
  expression: string | undefined;
  conditionalDisplay: UniversalConditionalDisplay | undefined;
}): UniversalConditionalDisplay | undefined => {
  if (isDefined(conditionalDisplay) || !isDefined(expression)) {
    return conditionalDisplay;
  }

  let convertedConditionalDisplay: UniversalConditionalDisplay | undefined;

  try {
    convertedConditionalDisplay =
      compileConditionalAvailabilityExpression(expression) ?? undefined;
  } catch (error) {
    throw new ApplicationException(
      `Command menu item "${label}" carries a ${expressionPropertyName} that cannot be converted: ${error instanceof Error ? error.message : String(error)}. Rebuild the app with the current SDK.`,
      ApplicationExceptionCode.INVALID_INPUT,
    );
  }

  logger.warn(
    `Command menu item "${label}" carries a ${expressionPropertyName}: Built with an older SDK. Rebuild to remove this warning.`,
  );

  return convertedConditionalDisplay;
};

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
    conditionalAvailabilityExpression: null,
    conditionalPinnedExpression: null,
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
