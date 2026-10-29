import { isString } from '@sniptt/guards';

import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';
import { type LegacyWidgetJsonLogicField } from '@/types/conditional-display/LegacyWidgetJsonLogicField';
import { type LegacyWidgetJsonLogicLiteral } from '@/types/conditional-display/LegacyWidgetJsonLogicLiteral';
import { FieldMetadataType } from '@/types/FieldMetadataType';
import { type ViewFilterOperand } from '@/types/ViewFilterOperand';

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
