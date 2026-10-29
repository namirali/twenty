import { type ConditionalAvailabilityCompiledItem } from '@/types/conditional-display/ConditionalAvailabilityCompiledItem';
import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';
import { FieldMetadataType } from '@/types/FieldMetadataType';
import { ViewFilterOperand } from '@/types/ViewFilterOperand';
import { buildConditionalDisplayContextConditionNode } from '@/utils/conditional-display/internal/buildConditionalDisplayContextConditionNode';
import { describeConditionalAvailabilityCompiledItem } from '@/utils/conditional-display/internal/describeConditionalAvailabilityCompiledItem';
import { getConditionalAvailabilityContextSubject } from '@/utils/conditional-display/internal/getConditionalAvailabilityContextSubject';

export const toConditionalAvailabilityConditionNode = ({
  compiledItem,
  expression,
}: {
  compiledItem: ConditionalAvailabilityCompiledItem;
  expression: string;
}): ConditionalDisplayConditionNode => {
  if (compiledItem.kind === 'condition') {
    return compiledItem.conditionNode;
  }

  const contextSubject = getConditionalAvailabilityContextSubject(compiledItem);

  if (contextSubject?.virtualField.type === FieldMetadataType.BOOLEAN) {
    return buildConditionalDisplayContextConditionNode({
      contextKey: contextSubject.contextKey,
      subFieldName: contextSubject.subFieldName,
      operand: ViewFilterOperand.IS,
      value: JSON.stringify(true),
    });
  }

  throw new Error(
    `Cannot compile conditional availability expression "${expression}": unsupported ${describeConditionalAvailabilityCompiledItem(compiledItem)}`,
  );
};
