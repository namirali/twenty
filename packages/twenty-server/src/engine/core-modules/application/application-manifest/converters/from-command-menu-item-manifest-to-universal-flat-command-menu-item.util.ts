import { type CommandMenuItemManifest } from 'twenty-shared/application';

import { CommandMenuItemAvailabilityType } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/engine/core-modules/application/application.exception';
import { EngineComponentKey } from 'src/engine/metadata-modules/command-menu-item/enums/engine-component-key.enum';
import { normalizeConditionalDisplay } from 'src/engine/metadata-modules/flat-conditional-display/utils/normalize-conditional-display.util';
import { type UniversalFlatCommandMenuItem } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/types/universal-flat-command-menu-item.type';

const throwIfCommandMenuItemManifestHasExpressions = (
  commandMenuItemManifest: CommandMenuItemManifest,
): void => {
  const rawCommandMenuItemManifest: Record<string, unknown> =
    commandMenuItemManifest;

  if (isDefined(rawCommandMenuItemManifest.conditionalAvailabilityExpression)) {
    throw new ApplicationException(
      `Command menu item "${commandMenuItemManifest.label}" declares the unsupported conditionalAvailabilityExpression, declare a conditionalAvailability tree instead`,
      ApplicationExceptionCode.INVALID_INPUT,
    );
  }

  if (isDefined(rawCommandMenuItemManifest.conditionalPinnedExpression)) {
    throw new ApplicationException(
      `Command menu item "${commandMenuItemManifest.label}" declares the unsupported conditionalPinnedExpression, declare a conditionalPinned tree instead`,
      ApplicationExceptionCode.INVALID_INPUT,
    );
  }
};

export const fromCommandMenuItemManifestToUniversalFlatCommandMenuItem = ({
  commandMenuItemManifest,
  applicationUniversalIdentifier,
  now,
}: {
  commandMenuItemManifest: CommandMenuItemManifest;
  applicationUniversalIdentifier: string;
  now: string;
}): UniversalFlatCommandMenuItem => {
  throwIfCommandMenuItemManifestHasExpressions(commandMenuItemManifest);

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
      commandMenuItemManifest.conditionalAvailability,
    ),
    universalConditionalPinned: normalizeConditionalDisplay(
      commandMenuItemManifest.conditionalPinned,
    ),
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
