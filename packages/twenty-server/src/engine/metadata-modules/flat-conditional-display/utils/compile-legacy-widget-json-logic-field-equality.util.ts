import { isString } from '@sniptt/guards';
import {
  type ConditionalDisplayConditionNode,
  FieldMetadataType,
  type ViewFilterOperand,
} from 'twenty-shared/types';

import { type LegacyWidgetJsonLogicField } from 'src/engine/metadata-modules/flat-conditional-display/types/legacy-widget-json-logic-field.type';
import { type LegacyWidgetJsonLogicLiteral } from 'src/engine/metadata-modules/flat-conditional-display/types/legacy-widget-json-logic-literal.type';

export const compileLegacyWidgetJsonLogicFieldEquality = ({
  field,
  operand,
  literal,
}: {
  field: LegacyWidgetJsonLogicField;
  operand: ViewFilterOperand;
  literal: LegacyWidgetJsonLogicLiteral;
}): ConditionalDisplayConditionNode | undefined => {
  if (field.type !== FieldMetadataType.SELECT || !isString(literal)) {
    return undefined;
  }

  return {
    kind: 'recordFilter',
    recordFilter: {
      fieldMetadataId: field.fieldMetadataId,
      operand,
      value: JSON.stringify([literal]),
    },
  };
};
