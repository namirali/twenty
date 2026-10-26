import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { glob } from 'tinyglobby';
import { CONDITIONAL_AVAILABILITY_EXPRESSION_CORPUS } from 'twenty-shared/testing';
import { compileConditionalAvailabilityExpression } from 'twenty-shared/utils';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

import { compileConditionExpressionsInSource } from '@/app/source/compile-condition-expressions-in-source';
import { type CompiledConditionExpression } from '@/app/source/types/compiled-condition-expression.type';

const TWENTY_APPS_DIRECTORY = fileURLToPath(
  new URL('../../../../../twenty-apps', import.meta.url),
);

const GENERIC_APP_CORPUS = [
  'includesSome(selectedRecords, "multiSelectField", "VALUE_19") or includesSome(selectedRecords, "multiSelectField", "VALUE_20")',
  'includesSome(selectedRecords, "multiSelectField", "VALUE_21") or includesSome(selectedRecords, "multiSelectField", "VALUE_22") or includesSome(selectedRecords, "multiSelectField", "VALUE_23") or includesSome(selectedRecords, "multiSelectField", "VALUE_24")',
  'noneEquals(selectedRecords, "selectField", "VALUE_25") and noneEquals(selectedRecords, "selectField", "VALUE_26")',
  'noneEquals(selectedRecords, "selectField", "VALUE_27") and noneEquals(selectedRecords, "selectField", "VALUE_26")',
  'noneEquals(selectedRecords, "selectField", "VALUE_28") and noneEquals(selectedRecords, "selectField", "VALUE_29") and noneEquals(selectedRecords, "selectField", "VALUE_30")',
  'not isSelectAll',
  'numberOfSelectedRecords == 1',
  'pageType == "INDEX_PAGE" and numberOfSelectedRecords == 1',
  'someEquals(selectedRecords, "selectField", "VALUE_32")',
];

const DOCUMENTED_HELPER_CORPUS = [
  'isNonEmptyString(objectMetadataItem.nameSingular)',
  'isNonEmptyString(objectMetadataLabel) and numberOfSelectedRecords == 1',
  'pageType == "RECORD_PAGE" and isNonEmptyString(objectMetadataItem.readability)',
  'includes(["INDEX_PAGE", "RECORD_PAGE"], pageType)',
  'includes(["company", "person"], objectMetadataItem.nameSingular) and not isSelectAll',
  'arrayLength(favoriteRecordIds) == numberOfSelectedRecords',
  'arrayLength(favoriteRecordIds) < numberOfSelectedRecords',
  'arrayLength(favoriteRecordIds) != numberOfSelectedRecords',
];

const UNMAPPED_HELPER_EXPRESSIONS: [string, string][] = [
  [
    'favoriteRecordIds.length > 0',
    'write favoriteRecordIds.length == numberOfSelectedRecords when every selected record is a favorite, or favoriteRecordIds.length < numberOfSelectedRecords when at least one is not',
  ],
  [
    'objectMetadataLabel === "Companies"',
    'compare objectMetadataItem.nameSingular instead (e.g. objectMetadataItem.nameSingular == "company")',
  ],
  [
    'includes(favoriteRecordIds, "record-id")',
    'includes accepts a list of values followed by a text context value, e.g. includes(["INDEX_PAGE", "RECORD_PAGE"], pageType)',
  ],
  [
    'isNonEmptyString(numberOfSelectedRecords)',
    'isNonEmptyString accepts a text context value',
  ],
];

const FORMULA_STRING_BY_REPOSITORY_APP_EXPRESSION: Record<string, string> = {
  true: 'true',
  '!isSelectAll': 'not isSelectAll',
  isInSidePanel: 'isInSidePanel',
  'numberOfSelectedRecords > 0': 'numberOfSelectedRecords > 0',
  'favoriteRecordIds.length > 0': 'arrayLength(favoriteRecordIds) > 0',
};

const SOURCE_PREFIX =
  'export default defineCommandMenuItem({ conditionalAvailabilityExpression: ';
const SOURCE_SUFFIX = ' });';

const buildFromSource = (expression: string): CompiledConditionExpression => {
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

const toTypeScriptSource = (formulaString: string): string =>
  formulaString
    .split(/("[^"]*")/)
    .map((segment) =>
      segment.startsWith('"')
        ? segment
        : segment
            .replace(/\band\b/g, '&&')
            .replace(/\bor\b/g, '||')
            .replace(/\bnot\s+/g, '!')
            .replace(/!=/g, '!==')
            .replace(/(?<![!<>=])==/g, '===')
            .replace(/arrayLength\((\w+)\)/g, '$1.length'),
    )
    .join('');

const collectRepositoryAppExpressions = async (): Promise<string[]> => {
  const filePaths = await glob(['fixtures/**/*.ts', 'public/**/*.ts'], {
    cwd: TWENTY_APPS_DIRECTORY,
    ignore: ['**/node_modules/**', '**/dist/**', '**/.twenty/**'],
    absolute: true,
  });
  const expressions: string[] = [];

  for (const filePath of filePaths) {
    const source = await readFile(filePath, 'utf8');

    if (!source.includes('Expression')) {
      continue;
    }

    const sourceFile = ts.createSourceFile(
      filePath,
      source,
      ts.ScriptTarget.Latest,
      true,
    );
    const visit = (node: ts.Node) => {
      if (
        ts.isPropertyAssignment(node) &&
        ts.isIdentifier(node.name) &&
        [
          'conditionalAvailabilityExpression',
          'conditionalPinnedExpression',
        ].includes(node.name.text) &&
        !ts.isStringLiteralLike(node.initializer)
      ) {
        expressions.push(node.initializer.getText(sourceFile));
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
  }

  return expressions;
};

const expectSameAsFormulaString = ({
  expression,
  formulaString,
}: {
  expression: string;
  formulaString: string;
}) => {
  let expectedConditionalDisplay: ReturnType<
    typeof compileConditionalAvailabilityExpression
  >;

  try {
    expectedConditionalDisplay =
      compileConditionalAvailabilityExpression(formulaString);
  } catch {
    expect(buildFromSource(expression)).toEqual({
      expression,
      errorMessage: expect.any(String),
    });

    return;
  }

  expect(buildFromSource(expression)).toEqual({
    expression,
    conditionalDisplay: expectedConditionalDisplay,
  });
};

describe('conditional availability built from source code', () => {
  it.each([
    ...new Set([
      ...CONDITIONAL_AVAILABILITY_EXPRESSION_CORPUS,
      ...GENERIC_APP_CORPUS,
    ]),
  ])(
    'builds the same tree, ids included, as the formula string %s',
    (formulaString) =>
      expectSameAsFormulaString({
        expression: toTypeScriptSource(formulaString),
        formulaString,
      }),
  );

  it('builds the same tree, ids included, as the formula string every repository app expression stored before', async () => {
    const expressions = await collectRepositoryAppExpressions();

    expect(expressions.length).toBeGreaterThan(0);
    expressions.forEach((expression) => {
      expect(
        Object.keys(FORMULA_STRING_BY_REPOSITORY_APP_EXPRESSION),
      ).toContain(expression);
      expectSameAsFormulaString({
        expression,
        formulaString: FORMULA_STRING_BY_REPOSITORY_APP_EXPRESSION[expression],
      });
    });
  });

  it.each(DOCUMENTED_HELPER_CORPUS)(
    'builds a tree, the same as the formula string, for the documented helper formula %s',
    (formulaString) => {
      const expression = toTypeScriptSource(formulaString);

      expect(buildFromSource(expression)).toEqual({
        expression,
        conditionalDisplay:
          compileConditionalAvailabilityExpression(formulaString),
      });
    },
  );

  it.each(UNMAPPED_HELPER_EXPRESSIONS)(
    'fails the build of %s with what to write instead',
    (expression, expectedMessage) => {
      expect(buildFromSource(expression)).toEqual({
        expression,
        errorMessage: expect.stringContaining(expectedMessage),
      });
    },
  );
});
