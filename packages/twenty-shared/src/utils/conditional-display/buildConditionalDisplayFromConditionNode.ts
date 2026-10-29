import { TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER } from '@/application/constants/TwentyStandardApplicationUniversalIdentifier';
import { computeDeterministicUuid } from '@/application/deterministic-identifier/compute-deterministic-uuid.util';
import { type ConditionalDisplay } from '@/types/conditional-display/ConditionalDisplay';
import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';
import { type ConditionalDisplayRecordFilter } from '@/types/conditional-display/ConditionalDisplayRecordFilter';
import { type ConditionalDisplayRecordFilterGroup } from '@/types/conditional-display/ConditionalDisplayRecordFilterGroup';
import { type ConditionalDisplayRecordFilterGroupConditionNode } from '@/types/conditional-display/ConditionalDisplayRecordFilterGroupConditionNode';
import { hasConditionalDisplaySomeSelectedRecordsMatch } from '@/utils/conditional-display/internal/hasConditionalDisplaySomeSelectedRecordsMatch';
import { isConditionalDisplayConjunctionOfRecordFilters } from '@/utils/conditional-display/internal/isConditionalDisplayConjunctionOfRecordFilters';
import { isConditionalDisplayRecordFilterConditionNode } from '@/utils/conditional-display/internal/isConditionalDisplayRecordFilterConditionNode';
import { isDefined } from '@/utils/validation/isDefined';

export const buildConditionalDisplayFromConditionNode = ({
  conditionNode,
  source,
}: {
  conditionNode: ConditionalDisplayConditionNode;
  source: string;
}): ConditionalDisplay => {
  let index = 0;

  const generateId = () => {
    const id = computeDeterministicUuid({
      entityNamespace: 'conditionalDisplay',
      value: `${source}:${index}`,
      applicationUniversalIdentifier:
        TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
    });

    index += 1;

    return id;
  };

  const recordFilters: ConditionalDisplayRecordFilter[] = [];
  const recordFilterGroups: ConditionalDisplayRecordFilterGroup[] = [];

  const emitRecordFilterGroup = ({
    recordFilterGroupConditionNode,
    parentRecordFilterGroupId,
    positionInRecordFilterGroup,
  }: {
    recordFilterGroupConditionNode: ConditionalDisplayRecordFilterGroupConditionNode;
    parentRecordFilterGroupId?: string;
    positionInRecordFilterGroup?: number;
  }) => {
    const recordFilterGroup: ConditionalDisplayRecordFilterGroup = {
      id: generateId(),
      logicalOperator: recordFilterGroupConditionNode.logicalOperator,
    };

    if (isDefined(parentRecordFilterGroupId)) {
      recordFilterGroup.parentRecordFilterGroupId = parentRecordFilterGroupId;
      recordFilterGroup.positionInRecordFilterGroup =
        positionInRecordFilterGroup;
    }

    recordFilterGroups.push(recordFilterGroup);

    recordFilterGroupConditionNode.children.forEach((child, position) => {
      if (isConditionalDisplayRecordFilterConditionNode(child)) {
        recordFilters.push({
          id: generateId(),
          ...child.recordFilter,
          recordFilterGroupId: recordFilterGroup.id,
          positionInRecordFilterGroup: position,
        });

        return;
      }

      emitRecordFilterGroup({
        recordFilterGroupConditionNode: child,
        parentRecordFilterGroupId: recordFilterGroup.id,
        positionInRecordFilterGroup: position,
      });
    });
  };

  if (
    !isConditionalDisplayRecordFilterConditionNode(conditionNode) &&
    !isConditionalDisplayConjunctionOfRecordFilters(conditionNode)
  ) {
    emitRecordFilterGroup({ recordFilterGroupConditionNode: conditionNode });
  } else {
    const ungroupedRecordFilterConditionNodes =
      isConditionalDisplayRecordFilterConditionNode(conditionNode)
        ? [conditionNode]
        : conditionNode.children.filter(
            isConditionalDisplayRecordFilterConditionNode,
          );

    ungroupedRecordFilterConditionNodes.forEach(({ recordFilter }) =>
      recordFilters.push({ id: generateId(), ...recordFilter }),
    );
  }

  const conditionalDisplay: ConditionalDisplay = { recordFilters };

  if (recordFilterGroups.length > 0) {
    conditionalDisplay.recordFilterGroups = recordFilterGroups;
  }

  if (hasConditionalDisplaySomeSelectedRecordsMatch(conditionNode)) {
    conditionalDisplay.selectedRecordsMatch = 'SOME';
  }

  return conditionalDisplay;
};
