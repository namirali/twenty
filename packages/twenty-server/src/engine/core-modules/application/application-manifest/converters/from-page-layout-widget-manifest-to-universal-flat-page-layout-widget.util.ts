import { Logger } from '@nestjs/common';

import {
  type ConditionalDisplay,
  type FieldMetadataType,
  type UniversalConditionalDisplay,
} from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { type LegacyPageLayoutWidgetManifest } from 'src/engine/core-modules/application/application-manifest/types/legacy-page-layout-widget-manifest.type';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/engine/core-modules/application/application.exception';
import { compileLegacyWidgetJsonLogic } from 'src/engine/metadata-modules/flat-conditional-display/utils/compile-legacy-widget-json-logic.util';
import { fromConditionalDisplayToUniversalConditionalDisplay } from 'src/engine/metadata-modules/flat-conditional-display/utils/from-conditional-display-to-universal-conditional-display.util';
import { isLegacyJsonLogicConditionalDisplay } from 'src/engine/metadata-modules/flat-conditional-display/utils/is-legacy-json-logic-conditional-display.util';
import { normalizeConditionalDisplay } from 'src/engine/metadata-modules/flat-conditional-display/utils/normalize-conditional-display.util';
import { type UniversalFlatPageLayoutWidget } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/types/universal-flat-page-layout-widget.type';

type FindObjectFieldByName = (args: {
  objectUniversalIdentifier: string;
  fieldName: string;
}) => { universalIdentifier: string; type: FieldMetadataType } | undefined;

const logger = new Logger('PageLayoutWidgetManifestConverter');

const resolveLegacyJsonLogicOrThrow = ({
  pageLayoutWidgetManifest,
  findObjectFieldByName,
}: {
  pageLayoutWidgetManifest: LegacyPageLayoutWidgetManifest;
  findObjectFieldByName: FindObjectFieldByName;
}): UniversalConditionalDisplay | undefined => {
  const { title, objectUniversalIdentifier, conditionalDisplay } =
    pageLayoutWidgetManifest;

  if (!isLegacyJsonLogicConditionalDisplay(conditionalDisplay)) {
    return conditionalDisplay as UniversalConditionalDisplay | undefined;
  }

  const resolvedFieldUniversalIdentifiers: string[] = [];

  let compiledConditionalDisplay: ConditionalDisplay;

  try {
    compiledConditionalDisplay = compileLegacyWidgetJsonLogic({
      jsonLogic: conditionalDisplay,
      resolveField: (fieldName) => {
        const field = isDefined(objectUniversalIdentifier)
          ? findObjectFieldByName({ objectUniversalIdentifier, fieldName })
          : undefined;

        if (!isDefined(field)) {
          return undefined;
        }

        resolvedFieldUniversalIdentifiers.push(field.universalIdentifier);

        return { fieldMetadataId: field.universalIdentifier, type: field.type };
      },
    });
  } catch (error) {
    throw new ApplicationException(
      `Page layout widget "${title}" carries a json-logic conditionalDisplay that cannot be converted: ${error instanceof Error ? error.message : String(error)}. Rebuild the app with the current SDK.`,
      ApplicationExceptionCode.INVALID_INPUT,
    );
  }

  logger.warn(
    `Page layout widget "${title}" carries a json-logic conditionalDisplay: Built with an older SDK. Rebuild to remove this warning.`,
  );

  return (
    fromConditionalDisplayToUniversalConditionalDisplay({
      conditionalDisplay: compiledConditionalDisplay,
      fieldMetadataUniversalIdentifierById: Object.fromEntries(
        resolvedFieldUniversalIdentifiers.map((universalIdentifier) => [
          universalIdentifier,
          universalIdentifier,
        ]),
      ),
      roleUniversalIdentifierById: {},
    }) ?? undefined
  );
};

export const fromPageLayoutWidgetManifestToUniversalFlatPageLayoutWidget = ({
  pageLayoutWidgetManifest,
  pageLayoutTabUniversalIdentifier,
  applicationUniversalIdentifier,
  findObjectFieldByName,
  now,
}: {
  pageLayoutWidgetManifest: LegacyPageLayoutWidgetManifest;
  pageLayoutTabUniversalIdentifier: string;
  applicationUniversalIdentifier: string;
  findObjectFieldByName: FindObjectFieldByName;
  now: string;
}): UniversalFlatPageLayoutWidget => {
  return {
    universalIdentifier: pageLayoutWidgetManifest.universalIdentifier,
    applicationUniversalIdentifier,
    pageLayoutTabUniversalIdentifier,
    title: pageLayoutWidgetManifest.title,
    isActive: true,
    isSystemSideEffect: false,
    type: pageLayoutWidgetManifest.type,
    objectMetadataUniversalIdentifier:
      pageLayoutWidgetManifest.objectUniversalIdentifier ?? null,
    universalConditionalDisplay: normalizeConditionalDisplay(
      resolveLegacyJsonLogicOrThrow({
        pageLayoutWidgetManifest,
        findObjectFieldByName,
      }),
    ),
    position: pageLayoutWidgetManifest.position,
    universalConfiguration:
      pageLayoutWidgetManifest.configuration as UniversalFlatPageLayoutWidget['universalConfiguration'],
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    universalConditionalAvailability: null,
    conditionalAvailabilityExpression: null,
    universalOverrides: null,
  };
};
