import { type ConditionalDisplay } from 'twenty-shared/types';
import { compileConditionalAvailabilityExpression } from 'twenty-shared/utils';

import { buildNavigationConditionalAvailabilityExpression } from 'src/engine/metadata-modules/flat-command-menu-item/utils/build-navigation-conditional-availability-expression.util';

export const buildNavigationConditionalAvailability = ({
  universalIdentifier,
  nameSingular,
}: {
  universalIdentifier: string;
  nameSingular: string;
}): ConditionalDisplay | null =>
  compileConditionalAvailabilityExpression(
    buildNavigationConditionalAvailabilityExpression({
      universalIdentifier,
      nameSingular,
    }),
  );
