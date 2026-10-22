import { isArray, isNonEmptyString, isNumber } from '@sniptt/guards';

import { CONDITIONAL_DISPLAY_CONTEXT_KEYS } from '@/constants/ConditionalDisplayContextKeys';
import { type ConditionalDisplayContextKey } from '@/types/conditional-display/ConditionalDisplayContextKey';
import { type ConditionalDisplayEvaluationContext } from '@/types/conditional-display/ConditionalDisplayEvaluationContext';
import { type ConditionalDisplayRecordFilter } from '@/types/conditional-display/ConditionalDisplayRecordFilter';
import { ViewFilterOperand } from '@/types/ViewFilterOperand';
import { safeGetNestedProperty } from '@/utils/command-menu-items/safeGetNestedProperty';
import { isEmptinessOperand } from '@/utils/filter/isEmptinessOperand';
import { parseJson } from '@/utils/parseJson';
import { isDefined } from '@/utils/validation/isDefined';

const isEmptySubject = (subject: unknown): boolean =>
  !isDefined(subject) ||
  subject === '' ||
  (isArray(subject) && subject.length === 0);

const getSubject = ({
  contextKey,
  subFieldName,
  context,
  record,
}: {
  contextKey: ConditionalDisplayContextKey;
  subFieldName: string;
  context: ConditionalDisplayEvaluationContext;
  record: unknown;
}): unknown => {
  switch (CONDITIONAL_DISPLAY_CONTEXT_KEYS[contextKey].valueKind) {
    case 'MAP_ENTRY':
      return safeGetNestedProperty(
        safeGetNestedProperty(context, contextKey),
        subFieldName,
      );
    case 'RECORD_PATH':
      return safeGetNestedProperty(record, subFieldName);
    default:
      return safeGetNestedProperty(context, contextKey);
  }
};

export const isConditionalDisplayContextRecordFilterMatching = ({
  recordFilter,
  context,
  record,
}: {
  recordFilter: ConditionalDisplayRecordFilter;
  context: ConditionalDisplayEvaluationContext;
  record: unknown;
}): boolean => {
  const { contextKey, subFieldName, operand } = recordFilter;

  if (!isDefined(contextKey)) {
    return false;
  }

  const { owner, valueKind } = CONDITIONAL_DISPLAY_CONTEXT_KEYS[contextKey];

  if (owner === 'admin') {
    return false;
  }

  const isSubFieldNameRequired =
    valueKind === 'MAP_ENTRY' || valueKind === 'RECORD_PATH';

  if (isSubFieldNameRequired && !isNonEmptyString(subFieldName)) {
    return false;
  }

  if (valueKind === 'RECORD_PATH' && !isDefined(record)) {
    return false;
  }

  const subject = getSubject({
    contextKey,
    subFieldName: subFieldName ?? '',
    context,
    record,
  });

  if (isEmptinessOperand(operand)) {
    return operand === ViewFilterOperand.IS_EMPTY
      ? isEmptySubject(subject)
      : !isEmptySubject(subject);
  }

  const literal = parseJson<unknown>(recordFilter.value);

  if (!isDefined(literal)) {
    return false;
  }

  switch (operand) {
    case ViewFilterOperand.IS:
      return subject === literal;
    case ViewFilterOperand.IS_NOT:
      return subject !== literal;
    case ViewFilterOperand.CONTAINS:
      return isArray(subject) && subject.includes(literal);
    case ViewFilterOperand.DOES_NOT_CONTAIN:
      return isArray(subject) && !subject.includes(literal);
    case ViewFilterOperand.GREATER_THAN_OR_EQUAL:
      return isNumber(subject) && isNumber(literal) && subject >= literal;
    case ViewFilterOperand.LESS_THAN_OR_EQUAL:
      return isNumber(subject) && isNumber(literal) && subject <= literal;
    default:
      return false;
  }
};
