import { CONDITIONAL_AVAILABILITY_SELECTED_RECORDS_FUNCTION_NAMES } from '@/constants/internal/ConditionalAvailabilitySelectedRecordsFunctionNames';

export const CONDITIONAL_AVAILABILITY_SUPPORTED_FUNCTION_NAMES = [
  'isDefined',
  'isNonEmptyString',
  'includes',
  'arrayLength',
  ...CONDITIONAL_AVAILABILITY_SELECTED_RECORDS_FUNCTION_NAMES,
];
