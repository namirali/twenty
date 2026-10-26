import { type ConditionalDisplay } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { type EngineGateOriginal } from 'src/database/commands/upgrade-version-command/2-52/types/engine-gate-original.type';
import { type LegacyEngineGateExpressions } from 'src/database/commands/upgrade-version-command/2-52/types/legacy-engine-gate-expressions.type';

export const restoreEngineGatesFromOriginals = ({
  legacyEngineGateExpressions: {
    conditionalAvailabilityExpression,
    conditionalPinnedExpression,
  },
  conditionalAvailability,
  conditionalPinned,
  conditionalDisplay,
  overrides,
  engineGateOriginal,
}: {
  legacyEngineGateExpressions: LegacyEngineGateExpressions;
  conditionalAvailability: ConditionalDisplay | null;
  conditionalPinned: ConditionalDisplay | null;
  conditionalDisplay: unknown;
  overrides: unknown;
  engineGateOriginal: EngineGateOriginal | undefined;
}) => ({
  conditionalAvailability: isDefined(conditionalAvailabilityExpression)
    ? null
    : conditionalAvailability,
  conditionalPinned: isDefined(conditionalPinnedExpression)
    ? null
    : conditionalPinned,
  conditionalDisplay: isDefined(engineGateOriginal)
    ? engineGateOriginal.conditionalDisplay
    : conditionalDisplay,
  overrides: isDefined(engineGateOriginal)
    ? engineGateOriginal.overrides
    : overrides,
});
