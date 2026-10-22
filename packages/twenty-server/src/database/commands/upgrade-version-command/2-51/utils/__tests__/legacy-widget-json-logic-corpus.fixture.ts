const selectedRecordMultiSelectFieldIncludes = (value: string) => ({
  in: [value, { var: 'selectedRecords.0.multiSelectField' }],
});

export const LEGACY_WIDGET_JSON_LOGIC_CORPUS: Record<string, unknown>[] = [
  {
    '!': {
      or: [
        selectedRecordMultiSelectFieldIncludes('VALUE_1'),
        selectedRecordMultiSelectFieldIncludes('VALUE_2'),
        selectedRecordMultiSelectFieldIncludes('VALUE_3'),
        selectedRecordMultiSelectFieldIncludes('VALUE_4'),
        selectedRecordMultiSelectFieldIncludes('VALUE_5'),
        selectedRecordMultiSelectFieldIncludes('VALUE_6'),
        selectedRecordMultiSelectFieldIncludes('VALUE_7'),
        selectedRecordMultiSelectFieldIncludes('VALUE_8'),
        selectedRecordMultiSelectFieldIncludes('VALUE_9'),
        selectedRecordMultiSelectFieldIncludes('VALUE_10'),
        selectedRecordMultiSelectFieldIncludes('VALUE_11'),
        selectedRecordMultiSelectFieldIncludes('VALUE_12'),
        selectedRecordMultiSelectFieldIncludes('VALUE_13'),
        selectedRecordMultiSelectFieldIncludes('VALUE_14'),
      ],
    },
  },
  { '==': [{ var: 'selectedRecords.0.selectField' }, 'VALUE_15'] },
  { '==': [{ var: 'selectedRecords.0.selectField' }, 'VALUE_16'] },
  { and: [{ '===': [{ var: 'device' }, 'MOBILE'] }] },
  { and: [{ '===': [{ var: 'device' }, 'DESKTOP'] }] },
  selectedRecordMultiSelectFieldIncludes('VALUE_14'),
  selectedRecordMultiSelectFieldIncludes('VALUE_12'),
  selectedRecordMultiSelectFieldIncludes('VALUE_11'),
  selectedRecordMultiSelectFieldIncludes('VALUE_2'),
  selectedRecordMultiSelectFieldIncludes('VALUE_13'),
  selectedRecordMultiSelectFieldIncludes('VALUE_1'),
  selectedRecordMultiSelectFieldIncludes('VALUE_4'),
];
