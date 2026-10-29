import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';
import { type ConditionalDisplaySelectedRecordsMatch } from '@/types/conditional-display/ConditionalDisplaySelectedRecordsMatch';
import { isDefined } from '@/utils/validation/isDefined';

export const collectConditionalDisplaySelectedRecordsMatches = (
  conditionNode: ConditionalDisplayConditionNode,
): ConditionalDisplaySelectedRecordsMatch[] => {
  if (conditionNode.kind === 'recordFilterGroup') {
    return conditionNode.children.flatMap(
      collectConditionalDisplaySelectedRecordsMatches,
    );
  }

  return isDefined(conditionNode.selectedRecordsMatch)
    ? [conditionNode.selectedRecordsMatch]
    : [];
};
