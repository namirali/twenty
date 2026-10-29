import { Logger } from '@nestjs/common';

import {
  type ConditionalDisplay,
  type UniversalConditionalDisplay,
} from 'twenty-shared/types';
import {
  compileLegacyWidgetJsonLogic,
  isDefined,
  isLegacyJsonLogicConditionalDisplay,
} from 'twenty-shared/utils';

import { type FindObjectFieldByName } from 'src/engine/core-modules/application/application-manifest/types/find-object-field-by-name.type';
import { type LegacyPageLayoutWidgetManifest } from 'src/engine/core-modules/application/application-manifest/types/legacy-page-layout-widget-manifest.type';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/engine/core-modules/application/application.exception';
import { fromConditionalDisplayToUniversalConditionalDisplay } from 'src/engine/metadata-modules/flat-conditional-display/utils/from-conditional-display-to-universal-conditional-display.util';

const logger = new Logger('PageLayoutWidgetManifestConverter');

export const resolveLegacyJsonLogicOrThrow = ({
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
