import { type CommandMenuItemConfig } from '@/sdk/define/command-menu-items/command-menu-item-config';
import { type CommandMenuItemManifest } from 'twenty-shared/application';
import { type UniversalConditionalDisplay } from 'twenty-shared/types';
import {
  compileConditionalAvailabilityExpression,
  isDefined,
} from 'twenty-shared/utils';

const compileExpressionConfig = ({
  expression,
  configKey,
  relativePath,
  errors,
}: {
  expression: boolean | string | undefined;
  configKey:
    | 'conditionalAvailabilityExpression'
    | 'conditionalPinnedExpression';
  relativePath: string;
  errors: string[];
}): UniversalConditionalDisplay | undefined => {
  if (!isDefined(expression)) {
    return undefined;
  }

  try {
    return (
      compileConditionalAvailabilityExpression(String(expression)) ?? undefined
    );
  } catch (error) {
    errors.push(
      `${relativePath} - ${configKey}: ${error instanceof Error ? error.message : String(error)}`,
    );

    return undefined;
  }
};

export const fromCommandMenuItemConfigToCommandMenuItemManifest = ({
  commandMenuItemConfig,
  relativePath,
}: {
  commandMenuItemConfig: CommandMenuItemConfig;
  relativePath: string;
}): { commandMenuItemManifest: CommandMenuItemManifest; errors: string[] } => {
  const {
    conditionalAvailabilityExpression,
    conditionalPinnedExpression,
    ...commandMenuItemProperties
  } = commandMenuItemConfig;

  const errors: string[] = [];
  const commandMenuItemManifest: CommandMenuItemManifest =
    commandMenuItemProperties;

  const conditionalAvailability = compileExpressionConfig({
    expression: conditionalAvailabilityExpression,
    configKey: 'conditionalAvailabilityExpression',
    relativePath,
    errors,
  });

  const conditionalPinned = compileExpressionConfig({
    expression: conditionalPinnedExpression,
    configKey: 'conditionalPinnedExpression',
    relativePath,
    errors,
  });

  if (isDefined(conditionalAvailability)) {
    commandMenuItemManifest.conditionalAvailability = conditionalAvailability;
  }

  if (isDefined(conditionalPinned)) {
    commandMenuItemManifest.conditionalPinned = conditionalPinned;
  }

  return { commandMenuItemManifest, errors };
};
