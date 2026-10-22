import { STANDARD_OBJECTS } from 'twenty-shared/metadata';
import { FeatureFlagKey } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { HIDDEN_NAVIGATION_OBJECT_UNIVERSAL_IDENTIFIERS } from 'src/engine/metadata-modules/flat-command-menu-item/constants/hidden-navigation-object-universal-identifiers.constant';

const NAVIGATION_FEATURE_FLAG_GATE_BY_OBJECT_UNIVERSAL_IDENTIFIER: Partial<
  Record<string, FeatureFlagKey>
> = {
  [STANDARD_OBJECTS.messageCampaign.universalIdentifier]:
    FeatureFlagKey.IS_MESSAGE_CAMPAIGN_ENABLED,
  [STANDARD_OBJECTS.messageList.universalIdentifier]:
    FeatureFlagKey.IS_MESSAGE_CAMPAIGN_ENABLED,
};

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
