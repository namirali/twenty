import { type PageLayoutWidgetManifest } from 'twenty-shared/application';
import { type UniversalConditionalDisplay } from 'twenty-shared/types';

import { type JsonLogicConditionalDisplay } from '@/sdk/define/common/types/json-logic-conditional-display.type';

export type PageLayoutWidgetConfig = Omit<
  PageLayoutWidgetManifest,
  'conditionalDisplay'
> & {
  conditionalDisplay?:
    | UniversalConditionalDisplay
    | JsonLogicConditionalDisplay;
};
