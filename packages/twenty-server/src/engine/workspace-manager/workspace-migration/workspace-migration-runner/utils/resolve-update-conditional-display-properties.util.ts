import {
  type ConditionalDisplaySurface,
  type UniversalConditionalDisplay,
} from 'twenty-shared/types';

import { CONDITIONAL_DISPLAY_PROPERTIES } from 'src/engine/metadata-modules/flat-conditional-display/constants/conditional-display-properties.constant';
import { type ConditionalDisplayProperty } from 'src/engine/metadata-modules/flat-conditional-display/types/conditional-display-property.type';
import { getConditionalDisplayPropertySurfaces } from 'src/engine/metadata-modules/flat-conditional-display/utils/get-conditional-display-property-surfaces.util';
import { type MetadataFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/metadata-flat-entity-maps.type';
import { resolveUpdateConditionalDisplay } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-runner/utils/resolve-update-conditional-display.util';

export const resolveUpdateConditionalDisplayProperties = <
  TUpdate extends Partial<
    Record<
      `universal${Capitalize<ConditionalDisplayProperty>}`,
      UniversalConditionalDisplay | null
    >
  >,
>({
  update,
  metadataName,
  flatFieldMetadataMaps,
  flatRoleMaps,
}: {
  update: TUpdate;
  metadataName: ConditionalDisplaySurface;
  flatFieldMetadataMaps: MetadataFlatEntityMaps<'fieldMetadata'>;
  flatRoleMaps: MetadataFlatEntityMaps<'role'>;
}): TUpdate =>
  CONDITIONAL_DISPLAY_PROPERTIES.filter((property) =>
    getConditionalDisplayPropertySurfaces(property).includes(metadataName),
  ).reduce(
    (resolvedUpdate, property) =>
      resolveUpdateConditionalDisplay({
        update: resolvedUpdate,
        metadataName,
        property,
        flatFieldMetadataMaps,
        flatRoleMaps,
      }),
    update,
  );
