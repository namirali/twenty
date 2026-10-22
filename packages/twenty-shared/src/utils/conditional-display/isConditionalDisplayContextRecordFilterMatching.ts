import { isArray, isNonEmptyString, isNumber } from '@sniptt/guards';

import { CONDITIONAL_DISPLAY_CONTEXT_KEYS } from '@/constants/ConditionalDisplayContextKeys';
import { type ConditionalDisplayEvaluationContext } from '@/types/conditional-display/ConditionalDisplayEvaluationContext';
import { type ConditionalDisplayRecordFilter } from '@/types/conditional-display/ConditionalDisplayRecordFilter';
import { ViewFilterOperand } from '@/types/ViewFilterOperand';
import { safeGetNestedProperty } from '@/utils/command-menu-items/safeGetNestedProperty';
import { isConditionalDisplayContextKey } from '@/utils/conditional-display/isConditionalDisplayContextKey';
import { isEmptinessOperand } from '@/utils/filter/isEmptinessOperand';
import { jsonRelationFilterValueSchema } from '@/utils/filter/utils/validation-schemas/jsonRelationFilterValueSchema';
import { parseJson } from '@/utils/parseJson';
import { isDefined } from '@/utils/validation/isDefined';

const isEmptySubject = (subject: unknown): boolean =>
  !isDefined(subject) ||
  subject === '' ||
  (isArray(subject) && subject.length === 0);

const isSubjectMatching = ({
  subject,
  recordFilter,
}: {
  subject: unknown;
  recordFilter: ConditionalDisplayRecordFilter;
}): boolean => {
  const { operand } = recordFilter;

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

const isCurrentWorkspaceMemberMatching = ({
  recordFilter,
  currentWorkspaceMemberId,
}: {
  recordFilter: ConditionalDisplayRecordFilter;
  currentWorkspaceMemberId: string | null | undefined;
}): boolean => {
  if (!isDefined(currentWorkspaceMemberId)) {
    return false;
  }

  const relationFilterValue = jsonRelationFilterValueSchema.safeParse(
    recordFilter.value,
  );

  if (!relationFilterValue.success) {
    return false;
  }

  return (
    relationFilterValue.data.isCurrentWorkspaceMemberSelected === true ||
    relationFilterValue.data.selectedRecordIds.includes(
      currentWorkspaceMemberId,
    )
  );
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
  const { contextKey, subFieldName } = recordFilter;

  if (!isDefined(contextKey) || !isConditionalDisplayContextKey(contextKey)) {
    return false;
  }

  switch (CONDITIONAL_DISPLAY_CONTEXT_KEYS[contextKey].valueKind) {
    case 'ROLE_IDS':
    case 'DEVICE': {
      const contextValue = safeGetNestedProperty(context, contextKey);
      const selectedValues = parseJson<unknown>(recordFilter.value);

      return (
        recordFilter.operand === ViewFilterOperand.IS &&
        isDefined(contextValue) &&
        isArray(selectedValues) &&
        selectedValues.includes(contextValue)
      );
    }
    case 'WORKSPACE_MEMBER':
      return (
        recordFilter.operand === ViewFilterOperand.IS &&
        isCurrentWorkspaceMemberMatching({
          recordFilter,
          currentWorkspaceMemberId: context.currentWorkspaceMemberId,
        })
      );
    case 'MAP_ENTRY': {
      const map = safeGetNestedProperty(context, contextKey);

      if (!isDefined(map) || !isNonEmptyString(subFieldName)) {
        return false;
      }

      return isSubjectMatching({
        subject: safeGetNestedProperty(map, subFieldName),
        recordFilter,
      });
    }
    case 'RECORD_PATH':
      if (!isDefined(record) || !isNonEmptyString(subFieldName)) {
        return false;
      }

      return isSubjectMatching({
        subject: safeGetNestedProperty(record, subFieldName),
        recordFilter,
      });
    case 'BOOLEAN':
    case 'NUMBER':
    case 'PAGE_TYPE': {
      const subject = safeGetNestedProperty(context, contextKey);

      if (!isDefined(subject)) {
        return false;
      }

      return isSubjectMatching({ subject, recordFilter });
    }
  }
};
