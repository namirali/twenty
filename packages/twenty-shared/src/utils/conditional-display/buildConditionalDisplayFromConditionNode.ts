import { v5 } from 'uuid';

import { CONDITIONAL_DISPLAY_COMPILATION_NAMESPACE } from '@/constants/ConditionalDisplayCompilationNamespace';
import { type ConditionalDisplay } from '@/types/conditional-display/ConditionalDisplay';
import { type ConditionalDisplayConditionNode } from '@/types/conditional-display/ConditionalDisplayConditionNode';
import { type ConditionalDisplayRecordFilter } from '@/types/conditional-display/ConditionalDisplayRecordFilter';
import { type ConditionalDisplayRecordFilterGroup } from '@/types/conditional-display/ConditionalDisplayRecordFilterGroup';
import { RecordFilterGroupLogicalOperator } from '@/types/RecordFilterGroupLogicalOperator';
import { isDefined } from '@/utils/validation/isDefined';

type RecordFilterConditionNode = Extract<
  ConditionalDisplayConditionNode,
  { kind: 'recordFilter' }
>;

type RecordFilterGroupConditionNode = Extract<
  ConditionalDisplayConditionNode,
  { kind: 'recordFilterGroup' }
>;

const isRecordFilterConditionNode = (
  conditionNode: ConditionalDisplayConditionNode,
): conditionNode is RecordFilterConditionNode =>
  conditionNode.kind === 'recordFilter';

const hasSomeSelectedRecordsMatch = (
  conditionNode: ConditionalDisplayConditionNode,
): boolean =>
  isRecordFilterConditionNode(conditionNode)
    ? conditionNode.selectedRecordsMatch === 'SOME'
    : conditionNode.children.some(hasSomeSelectedRecordsMatch);

const isConjunctionOfRecordFilters = (
  recordFilterGroupConditionNode: RecordFilterGroupConditionNode,
): boolean =>
  recordFilterGroupConditionNode.logicalOperator ===
    RecordFilterGroupLogicalOperator.AND &&
  recordFilterGroupConditionNode.children.every(isRecordFilterConditionNode);

export const buildConditionalDisplayFromConditionNode = ({
  conditionNode,
  source,
}: {
  conditionNode: ConditionalDisplayConditionNode;
  source: string;
}): ConditionalDisplay => {
  let index = 0;

  const generateId = () => {
    const id = v5(
      `${source}:${index}`,
      CONDITIONAL_DISPLAY_COMPILATION_NAMESPACE,
    );

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
    recordFilterGroupConditionNode: RecordFilterGroupConditionNode;
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
      if (isRecordFilterConditionNode(child)) {
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
    !isRecordFilterConditionNode(conditionNode) &&
    !isConjunctionOfRecordFilters(conditionNode)
  ) {
    emitRecordFilterGroup({ recordFilterGroupConditionNode: conditionNode });
  } else {
    const ungroupedRecordFilterConditionNodes = isRecordFilterConditionNode(
      conditionNode,
    )
      ? [conditionNode]
      : conditionNode.children.filter(isRecordFilterConditionNode);

    ungroupedRecordFilterConditionNodes.forEach(({ recordFilter }) =>
      recordFilters.push({ id: generateId(), ...recordFilter }),
    );
  }

  const conditionalDisplay: ConditionalDisplay = { recordFilters };

  if (recordFilterGroups.length > 0) {
    conditionalDisplay.recordFilterGroups = recordFilterGroups;
  }

  if (hasSomeSelectedRecordsMatch(conditionNode)) {
    conditionalDisplay.selectedRecordsMatch = 'SOME';
  }

  return conditionalDisplay;
};
