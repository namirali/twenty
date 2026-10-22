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
  manifestKey,
  relativePath,
}: {
  expression: boolean | string | undefined;
  configKey:
    | 'conditionalAvailabilityExpression'
    | 'conditionalPinnedExpression';
  manifestKey: 'conditionalAvailability' | 'conditionalPinned';
  relativePath: string;
}): {
  conditionalDisplay: UniversalConditionalDisplay | undefined;
  errors: string[];
} => {
  if (!isDefined(expression)) {
    return { conditionalDisplay: undefined, errors: [] };
  }

  try {
    return {
      conditionalDisplay:
        compileConditionalAvailabilityExpression(String(expression)) ??
        undefined,
      errors: [],
    };
  } catch (error) {
    return {
      conditionalDisplay: undefined,
      errors: [
        `${relativePath} - ${configKey} cannot be compiled into a ${manifestKey} tree: ${error instanceof Error ? error.message : String(error)}`,
      ],
    };
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

  const commandMenuItemManifest: CommandMenuItemManifest =
    commandMenuItemProperties;

  const conditionalAvailability = compileExpressionConfig({
    expression: conditionalAvailabilityExpression,
    configKey: 'conditionalAvailabilityExpression',
    manifestKey: 'conditionalAvailability',
    relativePath,
  });

  const conditionalPinned = compileExpressionConfig({
    expression: conditionalPinnedExpression,
    configKey: 'conditionalPinnedExpression',
    manifestKey: 'conditionalPinned',
    relativePath,
  });

  if (isDefined(conditionalAvailability.conditionalDisplay)) {
    commandMenuItemManifest.conditionalAvailability =
      conditionalAvailability.conditionalDisplay;
  }

  if (isDefined(conditionalPinned.conditionalDisplay)) {
    commandMenuItemManifest.conditionalPinned =
      conditionalPinned.conditionalDisplay;
  }

  return {
    commandMenuItemManifest,
    errors: [...conditionalAvailability.errors, ...conditionalPinned.errors],
  };
};
