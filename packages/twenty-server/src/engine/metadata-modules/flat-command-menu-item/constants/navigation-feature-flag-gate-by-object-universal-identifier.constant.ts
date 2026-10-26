import { STANDARD_OBJECTS } from 'twenty-shared/metadata';
import { FeatureFlagKey } from 'twenty-shared/types';

export const NAVIGATION_FEATURE_FLAG_GATE_BY_OBJECT_UNIVERSAL_IDENTIFIER: Partial<
  Record<string, FeatureFlagKey>
> = {
  [STANDARD_OBJECTS.messageCampaign.universalIdentifier]:
    FeatureFlagKey.IS_MESSAGE_CAMPAIGN_ENABLED,
  [STANDARD_OBJECTS.messageList.universalIdentifier]:
    FeatureFlagKey.IS_MESSAGE_CAMPAIGN_ENABLED,
};
