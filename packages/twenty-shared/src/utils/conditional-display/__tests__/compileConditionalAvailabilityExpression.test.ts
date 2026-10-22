import { RecordFilterGroupLogicalOperator } from '@/types/RecordFilterGroupLogicalOperator';
import { ViewFilterOperand } from '@/types/ViewFilterOperand';
import { compileConditionalAvailabilityExpression } from '@/utils/conditional-display/compileConditionalAvailabilityExpression';

import { CONDITIONAL_AVAILABILITY_EXPRESSION_CORPUS } from './conditionalAvailabilityExpressionCorpus.fixture';

const DISTINCT_CORPUS_EXPRESSIONS = [
  ...new Set(CONDITIONAL_AVAILABILITY_EXPRESSION_CORPUS),
];

describe('compileConditionalAvailabilityExpression', () => {
  it.each(DISTINCT_CORPUS_EXPRESSIONS)('should compile %s', (expression) => {
    expect(() =>
      compileConditionalAvailabilityExpression(expression),
    ).not.toThrow();
  });

  it('should compile a top-level and of leaves into ungrouped rows', () => {
    expect(
      compileConditionalAvailabilityExpression(
        'pageType == "INDEX_PAGE" and not hasAnySoftDeleteFilterOnView and permissionFlags.IMPORT_CSV',
      ),
    ).toEqual({
      recordFilters: [
        {
          id: expect.any(String),
          contextKey: 'pageType',
          operand: ViewFilterOperand.IS,
          value: '"INDEX_PAGE"',
        },
        {
          id: expect.any(String),
          contextKey: 'hasAnySoftDeleteFilterOnView',
          operand: ViewFilterOperand.IS_NOT,
          value: 'true',
        },
        {
          id: expect.any(String),
          contextKey: 'permissionFlags',
          subFieldName: 'IMPORT_CSV',
          operand: ViewFilterOperand.IS,
          value: 'true',
        },
      ],
    });
  });

  it('should compile an or into a root group holding its rows', () => {
    const { recordFilters, recordFilterGroups } =
      compileConditionalAvailabilityExpression(
        'canImpersonate or canAccessFullAdminPanel',
      );

    const rootRecordFilterGroupId = recordFilterGroups?.[0]?.id;

    expect(recordFilterGroups).toEqual([
      {
        id: rootRecordFilterGroupId,
        logicalOperator: RecordFilterGroupLogicalOperator.OR,
      },
    ]);
    expect(recordFilters).toEqual([
      {
        id: expect.any(String),
        contextKey: 'canImpersonate',
        operand: ViewFilterOperand.IS,
        value: 'true',
        recordFilterGroupId: rootRecordFilterGroupId,
        positionInRecordFilterGroup: 0,
      },
      {
        id: expect.any(String),
        contextKey: 'canAccessFullAdminPanel',
        operand: ViewFilterOperand.IS,
        value: 'true',
        recordFilterGroupId: rootRecordFilterGroupId,
        positionInRecordFilterGroup: 1,
      },
    ]);
  });

  it('should nest an or group under the root and group at its position', () => {
    const { recordFilters, recordFilterGroups } =
      compileConditionalAvailabilityExpression(
        'numberOfSelectedRecords == 1 and (everyEquals(selectedRecords, "currentVersion.status", "ACTIVE") or includesEvery(selectedRecords, "statuses", "ACTIVE")) and noneDefined(selectedRecords, "deletedAt")',
      );

    const rootRecordFilterGroupId = recordFilterGroups?.[0]?.id;
    const orRecordFilterGroupId = recordFilterGroups?.[1]?.id;

    expect(recordFilterGroups).toEqual([
      {
        id: rootRecordFilterGroupId,
        logicalOperator: RecordFilterGroupLogicalOperator.AND,
      },
      {
        id: orRecordFilterGroupId,
        logicalOperator: RecordFilterGroupLogicalOperator.OR,
        parentRecordFilterGroupId: rootRecordFilterGroupId,
        positionInRecordFilterGroup: 1,
      },
    ]);
    expect(recordFilters).toEqual([
      {
        id: expect.any(String),
        contextKey: 'numberOfSelectedRecords',
        operand: ViewFilterOperand.IS,
        value: '1',
        recordFilterGroupId: rootRecordFilterGroupId,
        positionInRecordFilterGroup: 0,
      },
      {
        id: expect.any(String),
        contextKey: 'selectedRecords',
        subFieldName: 'currentVersion.status',
        operand: ViewFilterOperand.IS,
        value: '"ACTIVE"',
        recordFilterGroupId: orRecordFilterGroupId,
        positionInRecordFilterGroup: 0,
      },
      {
        id: expect.any(String),
        contextKey: 'selectedRecords',
        subFieldName: 'statuses',
        operand: ViewFilterOperand.CONTAINS,
        value: '"ACTIVE"',
        recordFilterGroupId: orRecordFilterGroupId,
        positionInRecordFilterGroup: 1,
      },
      {
        id: expect.any(String),
        contextKey: 'selectedRecords',
        subFieldName: 'deletedAt',
        operand: ViewFilterOperand.IS_EMPTY,
        recordFilterGroupId: rootRecordFilterGroupId,
        positionInRecordFilterGroup: 2,
      },
    ]);
  });

  it('should apply De Morgan to a negated group', () => {
    expect(
      compileConditionalAvailabilityExpression(
        'not (isSelectAll or numberOfSelectedRecords >= 2)',
      ),
    ).toEqual({
      recordFilters: [
        {
          id: expect.any(String),
          contextKey: 'isSelectAll',
          operand: ViewFilterOperand.IS_NOT,
          value: 'true',
        },
        {
          id: expect.any(String),
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.LESS_THAN_OR_EQUAL,
          value: '1',
        },
      ],
    });
  });

  it('should set the SOME quantifier only when a some function is used', () => {
    expect(
      compileConditionalAvailabilityExpression(
        'someEquals(selectedRecords, "status", "FAILED")',
      ),
    ).toEqual({
      recordFilters: [
        {
          id: expect.any(String),
          contextKey: 'selectedRecords',
          subFieldName: 'status',
          operand: ViewFilterOperand.IS,
          value: '"FAILED"',
        },
      ],
      quantifier: 'SOME',
    });
    expect(
      compileConditionalAvailabilityExpression(
        'noneEquals(selectedRecords, "status", "DRAFT")',
      ).quantifier,
    ).toBeUndefined();
  });

  it('should compile the favorites comparisons into areAllSelectedRecordsFavorites', () => {
    expect(
      compileConditionalAvailabilityExpression(
        'arrayLength(favoriteRecordIds) < numberOfSelectedRecords',
      ).recordFilters,
    ).toEqual([
      {
        id: expect.any(String),
        contextKey: 'areAllSelectedRecordsFavorites',
        operand: ViewFilterOperand.IS,
        value: 'false',
      },
    ]);
    expect(
      compileConditionalAvailabilityExpression(
        'arrayLength(favoriteRecordIds) == numberOfSelectedRecords',
      ).recordFilters,
    ).toEqual([
      {
        id: expect.any(String),
        contextKey: 'areAllSelectedRecordsFavorites',
        operand: ViewFilterOperand.IS,
        value: 'true',
      },
    ]);
  });

  it('should rewrite strict count comparisons into inclusive bounds', () => {
    expect(
      compileConditionalAvailabilityExpression(
        'numberOfSelectedRecords > 1 and numberOfSelectedRecords < 10',
      ).recordFilters,
    ).toEqual([
      {
        id: expect.any(String),
        contextKey: 'numberOfSelectedRecords',
        operand: ViewFilterOperand.GREATER_THAN_OR_EQUAL,
        value: '2',
      },
      {
        id: expect.any(String),
        contextKey: 'numberOfSelectedRecords',
        operand: ViewFilterOperand.LESS_THAN_OR_EQUAL,
        value: '9',
      },
    ]);
  });

  it('should compile a length path into a non-empty parent path', () => {
    expect(
      compileConditionalAvailabilityExpression(
        'every(selectedRecords, "currentVersion.steps.length")',
      ).recordFilters,
    ).toEqual([
      {
        id: expect.any(String),
        contextKey: 'selectedRecords',
        subFieldName: 'currentVersion.steps',
        operand: ViewFilterOperand.IS_NOT_EMPTY,
      },
    ]);
  });

  it('should compile a device comparison into the device rule', () => {
    expect(
      compileConditionalAvailabilityExpression('device == "MOBILE"'),
    ).toEqual({
      recordFilters: [
        {
          id: expect.any(String),
          contextKey: 'device',
          operand: ViewFilterOperand.IS,
          value: '["MOBILE"]',
        },
      ],
    });
  });

  it('should compile the same expression to the same tree', () => {
    DISTINCT_CORPUS_EXPRESSIONS.forEach((expression) => {
      expect(compileConditionalAvailabilityExpression(expression)).toEqual(
        compileConditionalAvailabilityExpression(expression),
      );
    });
  });

  it('should give every row and group of a tree its own id', () => {
    DISTINCT_CORPUS_EXPRESSIONS.forEach((expression) => {
      const { recordFilters = [], recordFilterGroups = [] } =
        compileConditionalAvailabilityExpression(expression);
      const ids = [...recordFilters, ...recordFilterGroups].map(({ id }) => id);

      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  it('should throw on an unmapped function with the expression in the message', () => {
    const expression =
      'pageType == "RECORD_PAGE" and isNonEmptyString(objectMetadataItem.labelSingular)';

    expect(() => compileConditionalAvailabilityExpression(expression)).toThrow(
      expression,
    );
    expect(() => compileConditionalAvailabilityExpression(expression)).toThrow(
      'isNonEmptyString',
    );
  });

  it('should throw on an expression mixing every and some functions', () => {
    expect(() =>
      compileConditionalAvailabilityExpression(
        'everyDefined(selectedRecords, "deletedAt") and someEquals(selectedRecords, "status", "DRAFT")',
      ),
    ).toThrow('mix of every and some record functions');
  });

  it('should throw on an or between every functions over several selected records', () => {
    expect(() =>
      compileConditionalAvailabilityExpression(
        'everyEquals(selectedRecords, "status", "DRAFT") or everyEquals(selectedRecords, "status", "SCHEDULED")',
      ),
    ).toThrow('"or" between record functions over several selected records');
  });

  it('should throw on the negation of a record function', () => {
    expect(() =>
      compileConditionalAvailabilityExpression(
        'not everyDefined(selectedRecords, "deletedAt")',
      ),
    ).toThrow('operator "not"');
  });

  it('should throw on the duplicateMessageCampaign formula missing its and', () => {
    expect(() =>
      compileConditionalAvailabilityExpression(
        'featureFlags.IS_MESSAGE_CAMPAIGN_ENABLEDeveryEquals(selectedRecords, "status", "SENT")',
      ),
    ).toThrow('IS_MESSAGE_CAMPAIGN_ENABLEDeveryEquals');
  });
});
