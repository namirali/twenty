import {
  type PageLayoutManifest,
  type PageLayoutTabManifest,
} from 'twenty-shared/application';

import { type PageLayoutWidgetConfig } from '@/sdk/define/page-layouts/page-layout-widget-config';

export type PageLayoutConfig = Omit<PageLayoutManifest, 'tabs'> & {
  tabs?: (Omit<PageLayoutTabManifest, 'widgets'> & {
    widgets?: PageLayoutWidgetConfig[];
  })[];
};
