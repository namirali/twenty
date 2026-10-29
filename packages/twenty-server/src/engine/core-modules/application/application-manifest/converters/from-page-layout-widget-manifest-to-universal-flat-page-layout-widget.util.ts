import { type FindObjectFieldByName } from 'src/engine/core-modules/application/application-manifest/types/find-object-field-by-name.type';
import { type LegacyPageLayoutWidgetManifest } from 'src/engine/core-modules/application/application-manifest/types/legacy-page-layout-widget-manifest.type';
import { resolveLegacyJsonLogicOrThrow } from 'src/engine/core-modules/application/application-manifest/utils/resolve-legacy-json-logic-or-throw.util';
import { normalizeConditionalDisplay } from 'src/engine/metadata-modules/flat-conditional-display/utils/normalize-conditional-display.util';
import { type UniversalFlatPageLayoutWidget } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/types/universal-flat-page-layout-widget.type';

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
    universalOverrides: null,
  };
};
