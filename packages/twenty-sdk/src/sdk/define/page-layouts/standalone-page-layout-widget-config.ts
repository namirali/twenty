import { type StandalonePageLayoutWidgetManifest } from 'twenty-shared/application';

import { type PageLayoutWidgetConfig } from '@/sdk/define/page-layouts/page-layout-widget-config';

export type StandalonePageLayoutWidgetConfig = PageLayoutWidgetConfig &
  Pick<
    StandalonePageLayoutWidgetManifest,
    'pageLayoutTabUniversalIdentifier' | 'position'
  >;
