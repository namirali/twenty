import { isBoolean } from '@sniptt/guards';

import { NEVER_AVAILABLE_CONDITIONAL_DISPLAY } from '@/constants/NeverAvailableConditionalDisplay';
import { type ConditionalAvailabilityExpressionNode } from '@/types/conditional-display/ConditionalAvailabilityExpressionNode';
import { type ConditionalDisplay } from '@/types/conditional-display/ConditionalDisplay';
import { buildConditionalAvailabilityCompilationError } from '@/utils/conditional-display/internal/buildConditionalAvailabilityCompilationError';
import { buildConditionalDisplayFromConditionNode } from '@/utils/conditional-display/buildConditionalDisplayFromConditionNode';
import { collectConditionalDisplaySelectedRecordsMatches } from '@/utils/conditional-display/internal/collectConditionalDisplaySelectedRecordsMatches';
import { compileConditionalAvailabilityCompiledItem } from '@/utils/conditional-display/internal/compileConditionalAvailabilityCompiledItem';
import { findConditionalDisplayGroupNotDistributingOverRecords } from '@/utils/conditional-display/internal/findConditionalDisplayGroupNotDistributingOverRecords';
import { isConditionalDisplaySingleRecordSelectionRequired } from '@/utils/conditional-display/internal/isConditionalDisplaySingleRecordSelectionRequired';
import { toConditionalAvailabilityConditionNode } from '@/utils/conditional-display/internal/toConditionalAvailabilityConditionNode';
import { isDefined } from '@/utils/validation/isDefined';

export const compileConditionalAvailabilityExpressionNode = ({
  expressionNode,
  expression,
  source,
}: {
  expressionNode: ConditionalAvailabilityExpressionNode;
  expression: string;
  source: string;
}): ConditionalDisplay | null => {
  const compiledItem = compileConditionalAvailabilityCompiledItem({
    expressionNode,
    expression,
  });

  if (compiledItem.kind === 'literal' && isBoolean(compiledItem.value)) {
    return compiledItem.value ? null : NEVER_AVAILABLE_CONDITIONAL_DISPLAY;
  }

  const conditionNode = toConditionalAvailabilityConditionNode({
    compiledItem,
    expression,
  });

  const selectedRecordsMatches = new Set(
    collectConditionalDisplaySelectedRecordsMatches(conditionNode),
  );

  if (selectedRecordsMatches.size > 1) {
    throw buildConditionalAvailabilityCompilationError({
      expression,
      reason: 'unsupported mix of every and some record functions',
    });
  }

  const nonDistributingLogicalOperator =
    isConditionalDisplaySingleRecordSelectionRequired(conditionNode)
      ? undefined
      : findConditionalDisplayGroupNotDistributingOverRecords({
          conditionNode,
          selectedRecordsMatch: selectedRecordsMatches.has('SOME')
            ? 'SOME'
            : 'EVERY',
        });

  if (isDefined(nonDistributingLogicalOperator)) {
    throw buildConditionalAvailabilityCompilationError({
      expression,
      reason: `unsupported "${nonDistributingLogicalOperator.toLowerCase()}" between record functions over several selected records; guard the formula with \`numberOfSelectedRecords == 1\` at the top level, or express it as a single every/some over one path`,
    });
  }

  return buildConditionalDisplayFromConditionNode({ conditionNode, source });
};
