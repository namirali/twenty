import { type ConditionalDisplay } from 'twenty-shared/types';

import { evaluateConditionalDisplay } from '@/conditional-display/utils/evaluateConditionalDisplay';
import { type WidgetVisibilityContext } from '@/page-layout/types/WidgetVisibilityContext';

type EvaluateWidgetVisibilityParams = {
  conditionalAvailability: ConditionalDisplay | null | undefined;
  conditionalDisplay: ConditionalDisplay | null | undefined;
  context: WidgetVisibilityContext;
};

export const evaluateWidgetVisibility = ({
  conditionalAvailability,
  conditionalDisplay,
  context,
}: EvaluateWidgetVisibilityParams): boolean => {
  const evaluateForWidget = (
    conditionalDisplayToEvaluate: ConditionalDisplay | null | undefined,
  ) =>
    evaluateConditionalDisplay({
      conditionalDisplay: conditionalDisplayToEvaluate,
      context,
      records: context.selectedRecords,
      objectMetadataItem: context.objectMetadataItem,
      objectMetadataItems: context.objectMetadataItems,
    });

  return (
    evaluateForWidget(conditionalAvailability) &&
    evaluateForWidget(conditionalDisplay)
  );
};
