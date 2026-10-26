import { isDefined } from 'twenty-shared/utils';

import { HIDDEN_NAVIGATION_OBJECT_UNIVERSAL_IDENTIFIERS } from 'src/engine/metadata-modules/flat-command-menu-item/constants/hidden-navigation-object-universal-identifiers.constant';
import { NAVIGATION_FEATURE_FLAG_GATE_BY_OBJECT_UNIVERSAL_IDENTIFIER } from 'src/engine/metadata-modules/flat-command-menu-item/constants/navigation-feature-flag-gate-by-object-universal-identifier.constant';

export const buildNavigationConditionalAvailabilityExpression = ({
  universalIdentifier,
  nameSingular,
}: {
  universalIdentifier: string;
  nameSingular: string;
}): string => {
  if (HIDDEN_NAVIGATION_OBJECT_UNIVERSAL_IDENTIFIERS.has(universalIdentifier)) {
    return 'false';
  }

  const targetObjectReadPermissionExpression = `targetObjectReadPermissions.${nameSingular}`;
  const featureFlagGate =
    NAVIGATION_FEATURE_FLAG_GATE_BY_OBJECT_UNIVERSAL_IDENTIFIER[
      universalIdentifier
    ];

  return isDefined(featureFlagGate)
    ? `featureFlags.${featureFlagGate} and ${targetObjectReadPermissionExpression}`
    : targetObjectReadPermissionExpression;
};
