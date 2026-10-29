import { NEVER_AVAILABLE_CONDITIONAL_DISPLAY } from '@/constants/NeverAvailableConditionalDisplay';
import { ViewFilterOperand } from '@/types/ViewFilterOperand';
import { buildConditionalDisplayFromConditionNode } from '@/utils/conditional-display/buildConditionalDisplayFromConditionNode';

describe('NEVER_AVAILABLE_CONDITIONAL_DISPLAY', () => {
  it('equals the tree the compiler builds for the literal false', () => {
    expect(NEVER_AVAILABLE_CONDITIONAL_DISPLAY).toEqual(
      buildConditionalDisplayFromConditionNode({
        conditionNode: {
          kind: 'recordFilter',
          recordFilter: {
            contextKey: 'selectedRecords',
            subFieldName: 'id',
            operand: ViewFilterOperand.IS_EMPTY,
          },
        },
        source: 'false',
      }),
    );
  });
});
