import { isDefined } from 'twenty-shared/utils';

import { LEGACY_WIDGET_JSON_LOGIC_SELECTED_RECORD_FIELD_VARIABLE_PATTERN } from 'src/engine/metadata-modules/flat-conditional-display/constants/legacy-widget-json-logic-selected-record-field-variable-pattern.constant';
import { type LegacyWidgetJsonLogicField } from 'src/engine/metadata-modules/flat-conditional-display/types/legacy-widget-json-logic-field.type';
import { buildLegacyWidgetJsonLogicConversionError } from 'src/engine/metadata-modules/flat-conditional-display/utils/build-legacy-widget-json-logic-conversion-error.util';

export const resolveLegacyWidgetJsonLogicSelectedRecordField = ({
  variableName,
  jsonLogic,
  resolveField,
}: {
  variableName: string;
  jsonLogic: unknown;
  resolveField: (fieldName: string) => LegacyWidgetJsonLogicField | undefined;
}): LegacyWidgetJsonLogicField | undefined => {
  const fieldName =
    LEGACY_WIDGET_JSON_LOGIC_SELECTED_RECORD_FIELD_VARIABLE_PATTERN.exec(
      variableName,
    )?.[1];

  if (!isDefined(fieldName)) {
    return undefined;
  }

  const field = resolveField(fieldName);

  if (!isDefined(field)) {
    throw buildLegacyWidgetJsonLogicConversionError({
      jsonLogic,
      reason: `unknown field "${fieldName}"`,
    });
  }

  return field;
};
