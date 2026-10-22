import { type ConditionalDisplayEvaluationContext } from 'twenty-shared/types';

import { evaluateConditionalDisplay } from '@/conditional-display/utils/evaluateConditionalDisplay';
import { type CommandMenuItemFieldsFragment } from '~/generated-metadata/graphql';

type PinnableCommandMenuItem = Pick<
  CommandMenuItemFieldsFragment,
  'isPinned' | 'conditionalPinned'
>;

// Resolved once where availability is evaluated, so every consumer keeps
// reading isPinned as a plain boolean.
export const resolveCommandMenuItemPinning = <
  TCommandMenuItem extends PinnableCommandMenuItem,
>(
  commandMenuItem: TCommandMenuItem,
  conditionalDisplayContext: ConditionalDisplayEvaluationContext,
): TCommandMenuItem => ({
  ...commandMenuItem,
  isPinned:
    commandMenuItem.isPinned &&
    evaluateConditionalDisplay({
      conditionalDisplay: commandMenuItem.conditionalPinned,
      context: conditionalDisplayContext,
      records: conditionalDisplayContext.selectedRecords ?? [],
      objectMetadataItems: [],
    }),
});
