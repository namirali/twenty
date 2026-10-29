import {
  type ConditionalDisplaySurface,
  type UniversalConditionalDisplay,
} from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { type ConditionalDisplayProperty } from 'src/engine/metadata-modules/flat-conditional-display/types/conditional-display-property.type';
import { type UniversalConditionalDisplayPropertyName } from 'src/engine/metadata-modules/flat-conditional-display/types/universal-conditional-display-property-name.type';
import { ALL_ENTITY_PROPERTIES_CONFIGURATION_BY_METADATA_NAME } from 'src/engine/metadata-modules/flat-entity/constant/all-entity-properties-configuration-by-metadata-name.constant';
import {
  FlatEntityMapsException,
  FlatEntityMapsExceptionCode,
} from 'src/engine/metadata-modules/flat-entity/exceptions/flat-entity-maps.exception';
import { type MetadataFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/metadata-flat-entity-maps.type';
import { fromUniversalConditionalDisplayToConditionalDisplay } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-runner/utils/from-universal-conditional-display-to-conditional-display.util';

export const resolveUpdateConditionalDisplay = <
  TProperty extends ConditionalDisplayProperty,
  TUpdate extends Partial<
    Record<
      UniversalConditionalDisplayPropertyName<TProperty>,
      UniversalConditionalDisplay | null
    >
  >,
>({
  update,
  metadataName,
  property,
  flatFieldMetadataMaps,
  flatRoleMaps,
}: {
  update: TUpdate;
  metadataName: ConditionalDisplaySurface;
  property: TProperty;
  flatFieldMetadataMaps: MetadataFlatEntityMaps<'fieldMetadata'>;
  flatRoleMaps: MetadataFlatEntityMaps<'role'>;
}): TUpdate => {
  const propertiesConfiguration: Partial<{
    [TConditionalDisplayProperty in ConditionalDisplayProperty]: {
      universalProperty: UniversalConditionalDisplayPropertyName<TConditionalDisplayProperty>;
    };
  }> = ALL_ENTITY_PROPERTIES_CONFIGURATION_BY_METADATA_NAME[metadataName];

  const universalProperty =
    propertiesConfiguration[property]?.universalProperty;

  if (!isDefined(universalProperty)) {
    throw new FlatEntityMapsException(
      `${metadataName} has no universal property for ${property}`,
      FlatEntityMapsExceptionCode.INTERNAL_SERVER_ERROR,
    );
  }

  const { [universalProperty]: universalConditionalDisplay, ...otherUpdate } =
    update;

  if (universalConditionalDisplay === undefined) {
    return otherUpdate as TUpdate;
  }

  const conditionalDisplay =
    fromUniversalConditionalDisplayToConditionalDisplay({
      universalConditionalDisplay,
      flatFieldMetadataMaps,
      flatRoleMaps,
    });

  return {
    ...otherUpdate,
    [property]: conditionalDisplay,
  } as TUpdate;
};
