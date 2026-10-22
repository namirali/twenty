import { CONDITIONAL_DISPLAY_PROPERTIES } from 'twenty-shared/constants';
import {
  type ConditionalDisplayProperty,
  type ConditionalDisplaySurface,
  type UniversalConditionalDisplay,
} from 'twenty-shared/types';
import { typedObjectEntries } from 'twenty-shared/utils';

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
  typedObjectEntries(CONDITIONAL_DISPLAY_PROPERTIES)
    .filter(([, { surfaces }]) => surfaces.includes(metadataName))
    .reduce(
      (resolvedUpdate, [property]) =>
        resolveUpdateConditionalDisplay({
          update: resolvedUpdate,
          metadataName,
          property,
          flatFieldMetadataMaps,
          flatRoleMaps,
        }),
      update,
    );
