import { isNumber } from '@sniptt/guards';

import { type ConditionalDisplayRecordFilterConditionNode } from '@/types/conditional-display/internal/ConditionalDisplayRecordFilterConditionNode';
import { parseJson } from '@/utils/parseJson';

export const shiftConditionalDisplayCountBoundary = ({
  recordFilter,
  offset,
}: {
  recordFilter: ConditionalDisplayRecordFilterConditionNode['recordFilter'];
  offset: number;
}): string | undefined => {
  const boundary = parseJson<unknown>(recordFilter.value);

  if (
    !isNumber(boundary) ||
    !Number.isInteger(boundary) ||
    boundary + offset < 0
  ) {
    return undefined;
  }

  return JSON.stringify(boundary + offset);
};
