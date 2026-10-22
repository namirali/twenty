import { type ConditionalDisplay } from 'twenty-shared/types';
import { compileConditionalAvailabilityExpression } from 'twenty-shared/utils';

import { HIDDEN_NAVIGATION_OBJECT_UNIVERSAL_IDENTIFIERS } from 'src/engine/metadata-modules/flat-command-menu-item/constants/hidden-navigation-object-universal-identifiers.constant';
import { buildNavigationConditionalAvailabilityExpression } from 'src/engine/metadata-modules/flat-command-menu-item/utils/build-navigation-conditional-availability-expression.util';
import { NEVER_AVAILABLE_CONDITIONAL_AVAILABILITY } from 'src/engine/metadata-modules/flat-conditional-display/constants/never-available-conditional-availability.constant';

export const buildNavigationConditionalAvailability = ({
  universalIdentifier,
  nameSingular,
}: {
  universalIdentifier: string;
  nameSingular: string;
}): ConditionalDisplay => {
  if (HIDDEN_NAVIGATION_OBJECT_UNIVERSAL_IDENTIFIERS.has(universalIdentifier)) {
    return NEVER_AVAILABLE_CONDITIONAL_AVAILABILITY;
  }

  return compileConditionalAvailabilityExpression(
    buildNavigationConditionalAvailabilityExpression({
      universalIdentifier,
      nameSingular,
    }),
  );
};
