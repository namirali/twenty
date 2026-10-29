import { type LegacyWidgetJsonLogicField } from 'twenty-shared/types';
import {
  compileLegacyWidgetJsonLogic,
  fastDeepEqual,
  isConditionalDisplay,
  isDefined,
  isLegacyJsonLogicConditionalDisplay,
} from 'twenty-shared/utils';

import { compileLegacyConditionalExpression } from 'src/database/commands/upgrade-version-command/2-54/utils/compile-legacy-conditional-expression.util';
import { findLegacyDeviceConditionalExpression } from 'src/database/commands/upgrade-version-command/2-54/utils/find-legacy-device-conditional-expression.util';
import { type FlatPageLayoutWidget } from 'src/engine/metadata-modules/flat-page-layout-widget/types/flat-page-layout-widget.type';

export const migratePageLayoutWidgetConditionalDisplay = ({
  conditionalAvailabilityExpression,
  conditionalAvailability,
  conditionalDisplay,
  resolveField,
}: {
  conditionalAvailabilityExpression: string | null;
  conditionalAvailability: FlatPageLayoutWidget['conditionalAvailability'];
  conditionalDisplay: FlatPageLayoutWidget['conditionalDisplay'];
  resolveField: (fieldName: string) => LegacyWidgetJsonLogicField | undefined;
}): {
  conditionalAvailability: FlatPageLayoutWidget['conditionalAvailability'];
  conditionalDisplay: FlatPageLayoutWidget['conditionalDisplay'];
  isConditionalDisplayConvertedFromJsonLogic: boolean;
} => {
  const legacyDeviceConditionalExpression =
    findLegacyDeviceConditionalExpression(conditionalAvailabilityExpression);

  if (isDefined(legacyDeviceConditionalExpression)) {
    if (isConditionalDisplay(conditionalDisplay)) {
      return {
        conditionalAvailability,
        conditionalDisplay,
        isConditionalDisplayConvertedFromJsonLogic: false,
      };
    }

    if (
      isDefined(conditionalDisplay) &&
      !fastDeepEqual(
        conditionalDisplay,
        legacyDeviceConditionalExpression.legacyConditionalDisplay,
      )
    ) {
      throw new Error(
        `device expression "${conditionalAvailabilityExpression}" cannot replace the conditional display ${JSON.stringify(conditionalDisplay)}`,
      );
    }

    return {
      conditionalAvailability,
      conditionalDisplay: legacyDeviceConditionalExpression.conditionalDisplay,
      isConditionalDisplayConvertedFromJsonLogic: false,
    };
  }

  const migratedConditionalAvailability =
    conditionalAvailability ??
    compileLegacyConditionalExpression(conditionalAvailabilityExpression);

  if (!isLegacyJsonLogicConditionalDisplay(conditionalDisplay)) {
    return {
      conditionalAvailability: migratedConditionalAvailability,
      conditionalDisplay,
      isConditionalDisplayConvertedFromJsonLogic: false,
    };
  }

  return {
    conditionalAvailability: migratedConditionalAvailability,
    conditionalDisplay: compileLegacyWidgetJsonLogic({
      jsonLogic: conditionalDisplay,
      resolveField,
    }),
    isConditionalDisplayConvertedFromJsonLogic: true,
  };
};
