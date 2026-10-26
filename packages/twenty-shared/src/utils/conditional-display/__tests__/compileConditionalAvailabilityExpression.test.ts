import { NEVER_AVAILABLE_CONDITIONAL_DISPLAY } from '@/constants/NeverAvailableConditionalDisplay';
import { CONDITIONAL_AVAILABILITY_EXPRESSION_CORPUS } from '@/testing/constants/ConditionalAvailabilityExpressionCorpus';
import { RecordFilterGroupLogicalOperator } from '@/types/RecordFilterGroupLogicalOperator';
import { ViewFilterOperand } from '@/types/ViewFilterOperand';
import { compileConditionalAvailabilityExpression } from '@/utils/conditional-display/compileConditionalAvailabilityExpression';

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
          value: '["INDEX_PAGE"]',
        },
        {
          id: expect.any(String),
          contextKey: 'hasAnySoftDeleteFilterOnView',
          operand: ViewFilterOperand.IS,
          value: 'false',
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
      ) ?? {};

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
      ) ?? {};

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
          operand: ViewFilterOperand.IS,
          value: 'false',
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

  it('should set selectedRecordsMatch to SOME only when a some function is used', () => {
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
      selectedRecordsMatch: 'SOME',
    });
    expect(
      compileConditionalAvailabilityExpression(
        'noneEquals(selectedRecords, "status", "DRAFT")',
      )?.selectedRecordsMatch,
    ).toBeUndefined();
  });

  it('should compile the favorites comparisons into areAllSelectedRecordsFavorites', () => {
    expect(
      compileConditionalAvailabilityExpression(
        'arrayLength(favoriteRecordIds) < numberOfSelectedRecords',
      )?.recordFilters,
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
      )?.recordFilters,
    ).toEqual([
      {
        id: expect.any(String),
        contextKey: 'areAllSelectedRecordsFavorites',
        operand: ViewFilterOperand.IS,
        value: 'true',
      },
    ]);
  });

  it('should compile object properties into rows on the field type they behave like', () => {
    expect(
      compileConditionalAvailabilityExpression(
        'objectMetadataItem.nameSingular != "workflow" and not objectMetadataItem.isRemote and isDefined(objectMetadataItem.duplicateCriteria)',
      )?.recordFilters,
    ).toEqual([
      {
        id: expect.any(String),
        contextKey: 'objectMetadataItem',
        subFieldName: 'nameSingular',
        operand: ViewFilterOperand.IS_NOT,
        value: '["workflow"]',
      },
      {
        id: expect.any(String),
        contextKey: 'objectMetadataItem',
        subFieldName: 'isRemote',
        operand: ViewFilterOperand.IS,
        value: 'false',
      },
      {
        id: expect.any(String),
        contextKey: 'objectMetadataItem',
        subFieldName: 'duplicateCriteria',
        operand: ViewFilterOperand.IS_NOT_EMPTY,
      },
    ]);
  });

  it.each([
    'featureFlags.IS_AI_ENABLED == "yes"',
    'objectMetadataItem.labelSingular == "Person"',
    'pageType == "UNKNOWN_PAGE"',
    'isDefined(permissionFlags.AI)',
  ])(
    'should throw on %s, which the field type of its context key does not accept',
    (expression) => {
      expect(() =>
        compileConditionalAvailabilityExpression(expression),
      ).toThrow(expression);
    },
  );

  it('should rewrite strict count comparisons into inclusive bounds', () => {
    expect(
      compileConditionalAvailabilityExpression(
        'numberOfSelectedRecords > 1 and numberOfSelectedRecords < 10',
      )?.recordFilters,
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
      )?.recordFilters,
    ).toEqual([
      {
        id: expect.any(String),
        contextKey: 'selectedRecords',
        subFieldName: 'currentVersion.steps',
        operand: ViewFilterOperand.IS_NOT_EMPTY,
      },
    ]);
  });

  it('should compile false into the never available tree and true into no tree', () => {
    expect(compileConditionalAvailabilityExpression('false')).toEqual(
      NEVER_AVAILABLE_CONDITIONAL_DISPLAY,
    );
    expect(compileConditionalAvailabilityExpression('true')).toBeNull();
  });

  it.each([
    'device == "MOBILE"',
    'pageType == "RECORD_PAGE" and currentRoleId == "role"',
    'currentWorkspaceMemberId != "member"',
  ])('should throw on the admin subject in %s', (expression) => {
    expect(() => compileConditionalAvailabilityExpression(expression)).toThrow(
      'engine conditions cannot carry admin subjects',
    );
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
        compileConditionalAvailabilityExpression(expression) ?? {};
      const ids = [...recordFilters, ...recordFilterGroups].map(({ id }) => id);

      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  it('should throw on an unmapped function with the expression in the message', () => {
    const expression =
      'pageType == "RECORD_PAGE" and arrayLength(selectedRecords) > 1';

    expect(() => compileConditionalAvailabilityExpression(expression)).toThrow(
      expression,
    );
    expect(() => compileConditionalAvailabilityExpression(expression)).toThrow(
      'unsupported call of arrayLength',
    );
  });

  it('should compile isNonEmptyString over a text context value into a not empty row', () => {
    expect(
      compileConditionalAvailabilityExpression(
        'isNonEmptyString(pageType) and isNonEmptyString(objectMetadataItem.nameSingular)',
      )?.recordFilters,
    ).toEqual([
      {
        id: expect.any(String),
        contextKey: 'pageType',
        operand: ViewFilterOperand.IS_NOT_EMPTY,
      },
      {
        id: expect.any(String),
        contextKey: 'objectMetadataItem',
        subFieldName: 'nameSingular',
        operand: ViewFilterOperand.IS_NOT_EMPTY,
      },
    ]);
  });

  it('should compile isNonEmptyString(objectMetadataLabel) into a check that an object is set', () => {
    expect(
      compileConditionalAvailabilityExpression(
        'isNonEmptyString(objectMetadataLabel)',
      )?.recordFilters,
    ).toEqual([
      {
        id: expect.any(String),
        contextKey: 'objectMetadataItem',
        subFieldName: 'nameSingular',
        operand: ViewFilterOperand.IS_NOT_EMPTY,
      },
    ]);
  });

  it('should compile includes over a list of values into an is any of row', () => {
    expect(
      compileConditionalAvailabilityExpression(
        'includes(["INDEX_PAGE", "RECORD_PAGE"], pageType)',
      )?.recordFilters,
    ).toEqual([
      {
        id: expect.any(String),
        contextKey: 'pageType',
        operand: ViewFilterOperand.IS,
        value: '["INDEX_PAGE","RECORD_PAGE"]',
      },
    ]);
  });

  it('should compile a favorites count different from the selection like a smaller one', () => {
    expect(
      compileConditionalAvailabilityExpression(
        'arrayLength(favoriteRecordIds) != numberOfSelectedRecords',
      )?.recordFilters,
    ).toEqual(
      compileConditionalAvailabilityExpression(
        'arrayLength(favoriteRecordIds) < numberOfSelectedRecords',
      )?.recordFilters?.map((recordFilter) => ({
        ...recordFilter,
        id: expect.any(String),
      })),
    );
  });

  it.each([
    [
      'isNonEmptyString(isSelectAll)',
      'isNonEmptyString accepts a text context value (pageType, objectMetadataItem.nameSingular, objectMetadataItem.readability or objectMetadataLabel); use isDefined(...) for other context values and someNonEmptyString(selectedRecords, "path") for record fields',
    ],
    [
      'includes(favoriteRecordIds, "record-id")',
      'includes accepts a list of values followed by a text context value, e.g. includes(["INDEX_PAGE", "RECORD_PAGE"], pageType); use someEquals or includesSome(selectedRecords, "path", value) for record fields',
    ],
    [
      'includes(["UNKNOWN_PAGE"], pageType)',
      'includes accepts a list of values followed by a text context value',
    ],
    [
      'objectMetadataLabel == "Companies"',
      'use isNonEmptyString(objectMetadataLabel) to require an object, or compare objectMetadataItem.nameSingular instead (e.g. objectMetadataItem.nameSingular == "company")',
    ],
    [
      'arrayLength(favoriteRecordIds) > 0',
      'write favoriteRecordIds.length == numberOfSelectedRecords when every selected record is a favorite, or favoriteRecordIds.length < numberOfSelectedRecords when at least one is not',
    ],
  ])(
    'should throw on %s, naming what to write instead',
    (expression, expectedMessage) => {
      expect(() =>
        compileConditionalAvailabilityExpression(expression),
      ).toThrow(expectedMessage);
    },
  );

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
    ).toThrow(
      '"or" between record functions over several selected records; guard the formula with `numberOfSelectedRecords == 1` at the top level, or express it as a single every/some over one path',
    );
  });

  it('should throw on the negation of a record function', () => {
    expect(() =>
      compileConditionalAvailabilityExpression(
        'not everyDefined(selectedRecords, "deletedAt")',
      ),
    ).toThrow('operator "not"');
  });

  it('should throw on the truthiness of a record path outside the accepted forms', () => {
    expect(() =>
      compileConditionalAvailabilityExpression(
        'every(selectedRecords, "isActive")',
      ),
    ).toThrow(
      'truthiness of record path "isActive": every, some and none accept a path ending in ".length", a boolean path (canChangeVisibility, inboxStatus.isUnread) or an identifier path (lastPublishedVersionId)',
    );
  });

  it('should throw on a list function over anything but selectedRecords', () => {
    expect(() =>
      compileConditionalAvailabilityExpression(
        'everyEquals(objectPermissions, "canUpdateObjectRecords", true)',
      ),
    ).toThrow(
      'everyEquals over variable "objectPermissions": everyEquals only accepts selectedRecords as its first argument',
    );
  });

  it('should throw on an unknown variable', () => {
    expect(() =>
      compileConditionalAvailabilityExpression('isSelected and isSelectAll'),
    ).toThrow('unknown variable "isSelected"');
  });
});
