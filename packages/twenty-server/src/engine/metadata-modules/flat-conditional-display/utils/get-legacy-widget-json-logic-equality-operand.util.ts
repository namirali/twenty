import { ViewFilterOperand } from 'twenty-shared/types';

export const getLegacyWidgetJsonLogicEqualityOperand = (
  operator: string,
): ViewFilterOperand | undefined => {
  switch (operator) {
    case '==':
    case '===':
      return ViewFilterOperand.IS;
    case '!=':
    case '!==':
      return ViewFilterOperand.IS_NOT;
    default:
      return undefined;
  }
};
