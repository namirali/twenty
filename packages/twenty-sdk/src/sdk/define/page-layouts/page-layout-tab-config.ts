import { type PageLayoutTabManifest } from 'twenty-shared/application';

import { type PageLayoutWidgetConfig } from '@/sdk/define/page-layouts/page-layout-widget-config';

export type PageLayoutTabConfig = Omit<
  PageLayoutTabManifest,
  'pageLayoutUniversalIdentifier' | 'widgets'
> & {
  pageLayoutUniversalIdentifier: string;
  widgets?: PageLayoutWidgetConfig[];
};
