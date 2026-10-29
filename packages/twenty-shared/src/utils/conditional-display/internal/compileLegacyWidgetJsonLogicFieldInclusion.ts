import { isString } from '@sniptt/guards';

import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';
import { type LegacyWidgetJsonLogicField } from '@/types/conditional-display/LegacyWidgetJsonLogicField';
import { type LegacyWidgetJsonLogicLiteral } from '@/types/conditional-display/LegacyWidgetJsonLogicLiteral';
import { FieldMetadataType } from '@/types/FieldMetadataType';
import { ViewFilterOperand } from '@/types/ViewFilterOperand';

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
