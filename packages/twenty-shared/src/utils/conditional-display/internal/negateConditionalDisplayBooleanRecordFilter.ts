import { type ConditionalDisplayRecordFilterConditionNode } from '@/types/conditional-display/internal/ConditionalDisplayRecordFilterConditionNode';
import { ViewFilterOperand } from '@/types/ViewFilterOperand';
import { booleanFilterValueSchema } from '@/utils/filter/utils/validation-schemas/filterValueScalarSchemas';

export const negateConditionalDisplayBooleanRecordFilter = (
  recordFilter: ConditionalDisplayRecordFilterConditionNode['recordFilter'],
): ConditionalDisplayRecordFilterConditionNode['recordFilter'] | undefined => {
  const booleanValue = booleanFilterValueSchema.safeParse(recordFilter.value);

  if (recordFilter.operand !== ViewFilterOperand.IS || !booleanValue.success) {
    return undefined;
  }

  return { ...recordFilter, value: JSON.stringify(!booleanValue.data) };
};
