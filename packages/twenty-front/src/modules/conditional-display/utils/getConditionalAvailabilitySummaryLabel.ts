import { hasConditionalDisplayRule } from '@/conditional-display/utils/hasConditionalDisplayRule';
import { t } from '@lingui/core/macro';
import { type ConditionalDisplay } from 'twenty-shared/types';

export const getConditionalAvailabilitySummaryLabel = (
  conditionalAvailability: ConditionalDisplay | null | undefined,
): string =>
  hasConditionalDisplayRule(conditionalAvailability)
    ? t`Custom rule`
    : t`Always`;
