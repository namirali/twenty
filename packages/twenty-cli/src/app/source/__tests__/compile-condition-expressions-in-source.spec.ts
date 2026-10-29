import { describe, expect, it } from 'vitest';
import { compileConditionalAvailabilityExpression } from 'twenty-shared/utils';

import { compileConditionExpressionsInSource } from '@/app/source/compile-condition-expressions-in-source';
import { type CompiledConditionExpression } from '@/app/source/types/compiled-condition-expression.type';

const SOURCE_PREFIX =
  'export default defineCommandMenuItem({ label: "X", conditionalAvailabilityExpression: ';
const SOURCE_SUFFIX = ' });';

const compile = (expression: string): CompiledConditionExpression => {
  const compiledSource = compileConditionExpressionsInSource({
    source: `${SOURCE_PREFIX}${expression}${SOURCE_SUFFIX}`,
    filePath: 'command.ts',
  });

  return JSON.parse(
    compiledSource.slice(
      SOURCE_PREFIX.length,
      compiledSource.length - SOURCE_SUFFIX.length,
    ),
  );
};

describe('compileConditionExpressionsInSource', () => {
  it.each([
    ['!isSelectAll', 'not isSelectAll'],
    [
      'pageType === "RECORD_PAGE" && !isInSidePanel',
      'pageType == "RECORD_PAGE" and not isInSidePanel',
    ],
    [
      '((pageType === "INDEX_PAGE" || (pageType === "RECORD_PAGE" && ((!isSelectAll)))))',
      '((pageType == "INDEX_PAGE" or (pageType == "RECORD_PAGE" and ((not isSelectAll)))))',
    ],
    [
      'numberOfSelectedRecords >= 2 && numberOfSelectedRecords < 10 && numberOfSelectedRecords !== 5',
      'numberOfSelectedRecords >= 2 and numberOfSelectedRecords < 10 and numberOfSelectedRecords != 5',
    ],
    [
      'favoriteRecordIds.length < numberOfSelectedRecords',
      'arrayLength(favoriteRecordIds) < numberOfSelectedRecords',
    ],
    [
      'favoriteRecordIds.length === numberOfSelectedRecords',
      'arrayLength(favoriteRecordIds) == numberOfSelectedRecords',
    ],
    [
      'permissionFlags.AI && featureFlags.IS_AI_ENABLED',
      'permissionFlags.AI and featureFlags.IS_AI_ENABLED',
    ],
    [
      "objectMetadataItem.nameSingular !== 'messageCampaign'",
      "objectMetadataItem.nameSingular != 'messageCampaign'",
    ],
    [
      'isDefined(objectMetadataItem.nameSingular)',
      'isDefined(objectMetadataItem.nameSingular)',
    ],
    [
      "everyEquals(\n  selectedRecords,\n  'status',\n  'DRAFT',\n)",
      "everyEquals(\n  selectedRecords,\n  'status',\n  'DRAFT'\n)",
    ],
    [
      "objectPermissions.canUpdateObjectRecords &&\n    noneDefined(selectedRecords, 'deletedAt')",
      "objectPermissions.canUpdateObjectRecords and\n    noneDefined(selectedRecords, 'deletedAt')",
    ],
    ['true', 'true'],
    ['false', 'false'],
  ])(
    'compiles %s to the tree, ids included, of the formula string %s',
    (expression, legacyExpression) => {
      expect(compile(expression)).toEqual({
        conditionalDisplay:
          compileConditionalAvailabilityExpression(legacyExpression),
      });
    },
  );

  it.each([
    [
      "everyEquals(objectPermissions, 'canUpdateObjectRecords', true)",
      'everyEquals only accepts selectedRecords as its first argument',
    ],
    [
      'someDefined(favoriteRecordIds, "id")',
      'someDefined only accepts selectedRecords',
    ],
    ['isSelected && isSelectAll', 'unknown variable "isSelected"'],
    [
      'objectMetadataLabel === "Company"',
      'compare objectMetadataItem.nameSingular instead',
    ],
    [
      'isSelectAll ? isInSidePanel : false',
      'unsupported syntax ConditionalExpression',
    ],
    [
      'featureFlags["IS_AI_ENABLED"]',
      'unsupported syntax ElementAccessExpression',
    ],
    ['numberOfSelectedRecords + 1 > 2', 'unsupported operator "+"'],
    ['-numberOfSelectedRecords < 0', 'unsupported operator "-"'],
    [
      'objectMetadataItem?.isRemote',
      'unsupported optional or private member access',
    ],
    [
      'isEmptyString(objectMetadataItem.nameSingular)',
      'unsupported function "isEmptyString"',
    ],
    [
      'selectedRecords.length === 1',
      'unsupported member "length" of variable "selectedRecords"',
    ],
  ])('fails %s with a message naming the problem', (expression, reason) => {
    const compiled = compile(expression);

    expect(compiled).toEqual({
      errorMessage: expect.stringContaining(reason),
    });
    expect('errorMessage' in compiled && compiled.errorMessage).toContain(
      `"${expression}"`,
    );
  });

  it('leaves formula strings and files without condition expressions untouched', () => {
    const sources = [
      "defineCommandMenuItem({ conditionalPinnedExpression: 'numberOfSelectedRecords == 1' });",
      'export const value = isSelectAll;',
    ];

    sources.forEach((source) =>
      expect(
        compileConditionExpressionsInSource({ source, filePath: 'command.ts' }),
      ).toBe(source),
    );
  });

  it('compiles both condition properties of every command in a file', () => {
    const compiledSource = compileConditionExpressionsInSource({
      source: `export const commands = [
        { conditionalAvailabilityExpression: !isSelectAll, conditionalPinnedExpression: numberOfSelectedRecords === 1 },
        { 'conditionalAvailabilityExpression': isInSidePanel },
      ];`,
      filePath: 'commands.tsx',
    });

    expect(compiledSource.match(/"conditionalDisplay":\{/g)).toHaveLength(3);
  });
});
