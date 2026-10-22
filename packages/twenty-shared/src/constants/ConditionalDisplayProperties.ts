import { type ConditionalDisplayOwner } from '@/types/conditional-display/ConditionalDisplayOwner';
import { type ConditionalDisplayProperty } from '@/types/conditional-display/ConditionalDisplayProperty';
import { type ConditionalDisplaySurface } from '@/types/conditional-display/ConditionalDisplaySurface';

export const CONDITIONAL_DISPLAY_PROPERTIES: Record<
  ConditionalDisplayProperty,
  {
    owner: ConditionalDisplayOwner;
    surfaces: ConditionalDisplaySurface[];
  }
> = {
  conditionalAvailability: {
    owner: 'engine',
    surfaces: ['commandMenuItem', 'pageLayoutWidget'],
  },
  conditionalPinned: {
    owner: 'engine',
    surfaces: ['commandMenuItem'],
  },
  conditionalDisplay: {
    owner: 'admin',
    surfaces: [
      'pageLayoutWidget',
      'pageLayoutTab',
      'viewField',
      'commandMenuItem',
      'navigationMenuItem',
    ],
  },
};
