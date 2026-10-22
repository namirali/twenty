import { type ConditionalDisplayContextKey } from '@/types/conditional-display/ConditionalDisplayContextKey';
import { ViewFilterOperand } from '@/types/ViewFilterOperand';
import { isConditionalDisplayContextRecordFilterMatching } from '@/utils/conditional-display/isConditionalDisplayContextRecordFilterMatching';

describe('isConditionalDisplayContextRecordFilterMatching', () => {
  it('does not match a row whose context key is unknown', () => {
    expect(
      isConditionalDisplayContextRecordFilterMatching({
        recordFilter: {
          id: 'unknown-key-filter',
          contextKey: 'unknownKey' as ConditionalDisplayContextKey,
          operand: ViewFilterOperand.IS_NOT,
          value: JSON.stringify(true),
        },
        context: {},
        record: undefined,
      }),
    ).toBe(false);
  });
});
