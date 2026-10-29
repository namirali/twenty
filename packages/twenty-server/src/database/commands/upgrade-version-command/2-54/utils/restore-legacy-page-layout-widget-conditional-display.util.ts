import { isDefined } from 'twenty-shared/utils';

import { findLegacyDeviceConditionalExpressionByConditionalDisplay } from 'src/database/commands/upgrade-version-command/2-54/utils/find-legacy-device-conditional-expression-by-conditional-display.util';

export const restoreLegacyPageLayoutWidgetConditionalDisplay = ({
  conditionalAvailabilityExpression,
  conditionalDisplay,
}: {
  conditionalAvailabilityExpression: string | null | undefined;
  conditionalDisplay: unknown;
}): unknown => {
  const legacyDeviceConditionalExpression =
    findLegacyDeviceConditionalExpressionByConditionalDisplay(
      conditionalDisplay,
    );

  if (!isDefined(legacyDeviceConditionalExpression)) {
    return conditionalDisplay;
  }

  return legacyDeviceConditionalExpression.conditionalAvailabilityExpression ===
    conditionalAvailabilityExpression
    ? null
    : legacyDeviceConditionalExpression.legacyConditionalDisplay;
};
