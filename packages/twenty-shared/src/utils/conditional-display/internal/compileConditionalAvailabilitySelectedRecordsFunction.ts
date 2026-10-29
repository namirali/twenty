import { CONDITIONAL_AVAILABILITY_LENGTH_PATH_SUFFIX } from '@/constants/internal/ConditionalAvailabilityLengthPathSuffix';
import { type ConditionalAvailabilityExpressionLiteral } from '@/types/conditional-display/internal/ConditionalAvailabilityExpressionLiteral';
import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';
import { type ConditionalDisplaySelectedRecordsMatch } from '@/types/conditional-display/ConditionalDisplaySelectedRecordsMatch';
import { ViewFilterOperand } from '@/types/ViewFilterOperand';
import { buildConditionalDisplayContextConditionNode } from '@/utils/conditional-display/internal/buildConditionalDisplayContextConditionNode';
import { isDefined } from '@/utils/validation/isDefined';

export const compileConditionalAvailabilitySelectedRecordsFunction = ({
  functionName,
  path,
  literal,
  argumentCount,
}: {
  functionName: string;
  path: string;
  literal: ConditionalAvailabilityExpressionLiteral | undefined;
  argumentCount: number;
}): ConditionalDisplayConditionNode | undefined => {
  const buildRecordPathConditionNode = ({
    selectedRecordsMatch,
    operand,
  }: {
    selectedRecordsMatch: ConditionalDisplaySelectedRecordsMatch;
    operand: ViewFilterOperand;
  }) =>
    argumentCount === 2
      ? buildConditionalDisplayContextConditionNode({
          contextKey: 'selectedRecords',
          subFieldName: path,
          operand,
          selectedRecordsMatch,
        })
      : undefined;

  const buildRecordPathValueConditionNode = ({
    selectedRecordsMatch,
    operand,
  }: {
    selectedRecordsMatch: ConditionalDisplaySelectedRecordsMatch;
    operand: ViewFilterOperand;
  }) =>
    argumentCount === 3 && isDefined(literal)
      ? buildConditionalDisplayContextConditionNode({
          contextKey: 'selectedRecords',
          subFieldName: path,
          operand,
          value: JSON.stringify(literal),
          selectedRecordsMatch,
        })
      : undefined;

  const buildRecordPathTruthinessConditionNode = ({
    selectedRecordsMatch,
    operand,
  }: {
    selectedRecordsMatch: ConditionalDisplaySelectedRecordsMatch;
    operand: ViewFilterOperand;
  }) =>
    argumentCount === 2
      ? buildConditionalDisplayContextConditionNode({
          contextKey: 'selectedRecords',
          subFieldName: path.endsWith(
            CONDITIONAL_AVAILABILITY_LENGTH_PATH_SUFFIX,
          )
            ? path.slice(0, -CONDITIONAL_AVAILABILITY_LENGTH_PATH_SUFFIX.length)
            : path,
          operand,
          selectedRecordsMatch,
        })
      : undefined;

  switch (functionName) {
    case 'everyDefined':
      return buildRecordPathConditionNode({
        selectedRecordsMatch: 'EVERY',
        operand: ViewFilterOperand.IS_NOT_EMPTY,
      });
    case 'noneDefined':
      return buildRecordPathConditionNode({
        selectedRecordsMatch: 'EVERY',
        operand: ViewFilterOperand.IS_EMPTY,
      });
    case 'someDefined':
    case 'someNonEmptyString':
      return buildRecordPathConditionNode({
        selectedRecordsMatch: 'SOME',
        operand: ViewFilterOperand.IS_NOT_EMPTY,
      });
    case 'everyEquals':
      return buildRecordPathValueConditionNode({
        selectedRecordsMatch: 'EVERY',
        operand: ViewFilterOperand.IS,
      });
    case 'noneEquals':
      return buildRecordPathValueConditionNode({
        selectedRecordsMatch: 'EVERY',
        operand: ViewFilterOperand.IS_NOT,
      });
    case 'someEquals':
      return buildRecordPathValueConditionNode({
        selectedRecordsMatch: 'SOME',
        operand: ViewFilterOperand.IS,
      });
    case 'includesEvery':
      return buildRecordPathValueConditionNode({
        selectedRecordsMatch: 'EVERY',
        operand: ViewFilterOperand.CONTAINS,
      });
    case 'includesNone':
      return buildRecordPathValueConditionNode({
        selectedRecordsMatch: 'EVERY',
        operand: ViewFilterOperand.DOES_NOT_CONTAIN,
      });
    case 'includesSome':
      return buildRecordPathValueConditionNode({
        selectedRecordsMatch: 'SOME',
        operand: ViewFilterOperand.CONTAINS,
      });
    case 'every':
      return buildRecordPathTruthinessConditionNode({
        selectedRecordsMatch: 'EVERY',
        operand: ViewFilterOperand.IS_NOT_EMPTY,
      });
    case 'some':
      return buildRecordPathTruthinessConditionNode({
        selectedRecordsMatch: 'SOME',
        operand: ViewFilterOperand.IS_NOT_EMPTY,
      });
    case 'none':
      return buildRecordPathTruthinessConditionNode({
        selectedRecordsMatch: 'EVERY',
        operand: ViewFilterOperand.IS_EMPTY,
      });
    default:
      return undefined;
  }
};
