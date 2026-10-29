import { msg, t } from '@lingui/core/macro';
import { isDefined } from 'twenty-shared/utils';

import { type ConditionalDisplayProperty } from 'src/engine/metadata-modules/flat-conditional-display/types/conditional-display-property.type';
import { type UniversalConditionalDisplayPropertyName } from 'src/engine/metadata-modules/flat-conditional-display/types/universal-conditional-display-property-name.type';
import { getUniversalFlatEntityConditionalDisplays } from 'src/engine/metadata-modules/flat-conditional-display/utils/get-universal-flat-entity-conditional-displays.util';
import { validateConditionalDisplay } from 'src/engine/metadata-modules/flat-conditional-display/utils/validate-conditional-display.util';
import { ALL_ENTITY_PROPERTIES_CONFIGURATION_BY_METADATA_NAME } from 'src/engine/metadata-modules/flat-entity/constant/all-entity-properties-configuration-by-metadata-name.constant';
import { type FlatEntityValidationError } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-builder/builders/types/failed-flat-entity-validation.type';

type ValidateConditionalDisplayArgs = Parameters<
  typeof validateConditionalDisplay
>[0];

export const validateUniversalFlatEntityConditionalDisplays = ({
  flatEntity,
  ...context
}: {
  flatEntity: Partial<
    Record<
      UniversalConditionalDisplayPropertyName<ConditionalDisplayProperty>,
      unknown
    >
  > & {
    universalOverrides?: unknown;
  };
} & Omit<
  ValidateConditionalDisplayArgs,
  'conditionalDisplay'
>): FlatEntityValidationError[] => {
  const { property, surface, invalidDataCode } = context;

  const propertiesConfiguration: Partial<{
    [TConditionalDisplayProperty in ConditionalDisplayProperty]: {
      universalProperty: UniversalConditionalDisplayPropertyName<TConditionalDisplayProperty>;
    };
  }> = ALL_ENTITY_PROPERTIES_CONFIGURATION_BY_METADATA_NAME[surface];

  const universalProperty =
    propertiesConfiguration[property]?.universalProperty;

  if (!isDefined(universalProperty)) {
    return [
      {
        code: invalidDataCode,
        message: t`${surface} has no universal property for ${property}`,
        userFriendlyMessage: msg`Conditional display is not available here`,
        value: property,
      },
    ];
  }

  return getUniversalFlatEntityConditionalDisplays({
    metadataName: surface,
    property,
    universalConditionalDisplay: flatEntity[universalProperty],
    universalOverrides: flatEntity.universalOverrides,
  }).flatMap((conditionalDisplay) =>
    validateConditionalDisplay({ conditionalDisplay, ...context }),
  );
};
