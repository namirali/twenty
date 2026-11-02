import { isString } from '@sniptt/guards';
import {
  type ConditionalDisplayConditionNode,
  FieldMetadataType,
  ViewFilterOperand,
} from 'twenty-shared/types';

import { type LegacyWidgetJsonLogicField } from 'src/engine/metadata-modules/flat-conditional-display/types/legacy-widget-json-logic-field.type';
import { type LegacyWidgetJsonLogicLiteral } from 'src/engine/metadata-modules/flat-conditional-display/types/legacy-widget-json-logic-literal.type';

export const compileLegacyWidgetJsonLogicFieldInclusion = ({
  field,
  literal,
}: {
  field: LegacyWidgetJsonLogicField;
  literal: LegacyWidgetJsonLogicLiteral;
}): ConditionalDisplayConditionNode | undefined => {
  if (!isString(literal)) {
    return undefined;
  }

  switch (field.type) {
    case FieldMetadataType.MULTI_SELECT:
      return {
        kind: 'recordFilter',
        recordFilter: {
          fieldMetadataId: field.fieldMetadataId,
          operand: ViewFilterOperand.CONTAINS,
          value: JSON.stringify([literal]),
        },
      };
    case FieldMetadataType.SELECT:
      return {
        kind: 'recordFilter',
        recordFilter: {
          fieldMetadataId: field.fieldMetadataId,
          operand: ViewFilterOperand.IS,
          value: JSON.stringify([literal]),
        },
      };
    default:
      return undefined;
  }
};
