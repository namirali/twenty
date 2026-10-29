import { Logger } from '@nestjs/common';

import { type UniversalConditionalDisplay } from 'twenty-shared/types';
import {
  compileConditionalAvailabilityExpression,
  isDefined,
} from 'twenty-shared/utils';

import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/engine/core-modules/application/application.exception';

const logger = new Logger('CommandMenuItemManifestConverter');

export const resolveLegacyExpressionOrThrow = ({
  label,
  expressionPropertyName,
  expression,
  conditionalDisplay,
}: {
  label: string;
  expressionPropertyName:
    | 'conditionalAvailabilityExpression'
    | 'conditionalPinnedExpression';
  expression: string | undefined;
  conditionalDisplay: UniversalConditionalDisplay | undefined;
}): UniversalConditionalDisplay | undefined => {
  if (isDefined(conditionalDisplay) || !isDefined(expression)) {
    return conditionalDisplay;
  }

  let convertedConditionalDisplay: UniversalConditionalDisplay | undefined;

  try {
    convertedConditionalDisplay =
      compileConditionalAvailabilityExpression(expression) ?? undefined;
  } catch (error) {
    throw new ApplicationException(
      `Command menu item "${label}" carries a ${expressionPropertyName} that cannot be converted: ${error instanceof Error ? error.message : String(error)}. Rebuild the app with the current SDK.`,
      ApplicationExceptionCode.INVALID_INPUT,
    );
  }

  logger.warn(
    `Command menu item "${label}" carries a ${expressionPropertyName}: Built with an older SDK. Rebuild to remove this warning.`,
  );

  return convertedConditionalDisplay;
};
