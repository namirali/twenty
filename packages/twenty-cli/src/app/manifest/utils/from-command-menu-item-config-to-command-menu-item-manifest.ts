import { type CommandMenuItemConfig } from '@/app/manifest/types/command-menu-item-config.type';
import { type CompiledConditionExpression } from '@/app/source/types/compiled-condition-expression.type';
import { isString } from '@sniptt/guards';
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
  label,
  relativePath,
}: {
  expression: string | CompiledConditionExpression | undefined;
  configKey:
    | 'conditionalAvailabilityExpression'
    | 'conditionalPinnedExpression';
  manifestKey: 'conditionalAvailability' | 'conditionalPinned';
  label: string;
  relativePath: string;
}): {
  conditionalDisplay: UniversalConditionalDisplay | undefined;
  errors: string[];
  warnings: string[];
} => {
  if (!isDefined(expression)) {
    return { conditionalDisplay: undefined, errors: [], warnings: [] };
  }

  const describedExpression = `${relativePath} - ${configKey} of command menu item "${label}"`;

  if (!isString(expression)) {
    return 'errorMessage' in expression
      ? {
          conditionalDisplay: undefined,
          errors: [
            `${describedExpression} cannot be compiled into a ${manifestKey} tree: ${expression.errorMessage}`,
          ],
          warnings: [],
        }
      : {
          conditionalDisplay: expression.conditionalDisplay ?? undefined,
          errors: [],
          warnings: [],
        };
  }

  const warnings = [
    `${describedExpression} is a formula string; write it as code (for example numberOfSelectedRecords === 1) so the build can check it.`,
  ];

  try {
    return {
      conditionalDisplay:
        compileConditionalAvailabilityExpression(expression) ?? undefined,
      errors: [],
      warnings,
    };
  } catch (error) {
    return {
      conditionalDisplay: undefined,
      errors: [
        `${describedExpression} cannot be compiled into a ${manifestKey} tree: ${error instanceof Error ? error.message : String(error)}`,
      ],
      warnings,
    };
  }
};

export const fromCommandMenuItemConfigToCommandMenuItemManifest = ({
  commandMenuItemConfig,
  relativePath,
}: {
  commandMenuItemConfig: CommandMenuItemConfig;
  relativePath: string;
}): {
  commandMenuItemManifest: CommandMenuItemManifest;
  errors: string[];
  warnings: string[];
} => {
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
    label: commandMenuItemConfig.label,
    relativePath,
  });

  const conditionalPinned = compileExpressionConfig({
    expression: conditionalPinnedExpression,
    configKey: 'conditionalPinnedExpression',
    manifestKey: 'conditionalPinned',
    label: commandMenuItemConfig.label,
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
    warnings: [
      ...conditionalAvailability.warnings,
      ...conditionalPinned.warnings,
    ],
  };
};
