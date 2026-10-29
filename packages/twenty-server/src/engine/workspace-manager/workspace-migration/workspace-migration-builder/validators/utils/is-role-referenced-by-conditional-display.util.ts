import { isDefined } from 'twenty-shared/utils';

import { getConditionalDisplayRoleUniversalIdentifiers } from 'src/engine/metadata-modules/flat-conditional-display/utils/get-conditional-display-role-universal-identifiers.util';
import { getUniversalFlatEntityConditionalDisplays } from 'src/engine/metadata-modules/flat-conditional-display/utils/get-universal-flat-entity-conditional-displays.util';
import { type AllUniversalFlatEntityMaps } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/types/all-universal-flat-entity-maps.type';

export const isRoleReferencedByConditionalDisplay = ({
  roleUniversalIdentifier,
  flatPageLayoutWidgetMaps,
  flatPageLayoutTabMaps,
  flatViewFieldMaps,
  flatCommandMenuItemMaps,
  flatNavigationMenuItemMaps,
}: {
  roleUniversalIdentifier: string;
} & Pick<
  AllUniversalFlatEntityMaps,
  | 'flatPageLayoutWidgetMaps'
  | 'flatPageLayoutTabMaps'
  | 'flatViewFieldMaps'
  | 'flatCommandMenuItemMaps'
  | 'flatNavigationMenuItemMaps'
>): boolean =>
  (
    [
      {
        metadataName: 'pageLayoutWidget',
        flatEntityMaps: flatPageLayoutWidgetMaps,
      },
      { metadataName: 'pageLayoutTab', flatEntityMaps: flatPageLayoutTabMaps },
      { metadataName: 'viewField', flatEntityMaps: flatViewFieldMaps },
      {
        metadataName: 'commandMenuItem',
        flatEntityMaps: flatCommandMenuItemMaps,
      },
      {
        metadataName: 'navigationMenuItem',
        flatEntityMaps: flatNavigationMenuItemMaps,
      },
    ] as const
  ).some(({ metadataName, flatEntityMaps }) =>
    Object.values<
      | {
          universalConditionalDisplay: unknown;
          universalOverrides?: unknown;
        }
      | undefined
    >(flatEntityMaps.byUniversalIdentifier)
      .filter(isDefined)
      .some(({ universalConditionalDisplay, universalOverrides }) =>
        getUniversalFlatEntityConditionalDisplays({
          metadataName,
          property: 'conditionalDisplay',
          universalConditionalDisplay,
          universalOverrides,
        }).some((conditionalDisplay) =>
          getConditionalDisplayRoleUniversalIdentifiers(
            conditionalDisplay,
          ).includes(roleUniversalIdentifier),
        ),
      ),
  );
