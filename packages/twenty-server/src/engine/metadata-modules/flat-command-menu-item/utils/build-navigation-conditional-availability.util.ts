import { NEVER_AVAILABLE_CONDITIONAL_DISPLAY } from 'twenty-shared/constants';
import {
  type ConditionalDisplay,
  type ConditionalDisplayConditionNode,
  RecordFilterGroupLogicalOperator,
  ViewFilterOperand,
} from 'twenty-shared/types';
import {
  buildConditionalDisplayFromConditionNode,
  isDefined,
} from 'twenty-shared/utils';

import { HIDDEN_NAVIGATION_OBJECT_UNIVERSAL_IDENTIFIERS } from 'src/engine/metadata-modules/flat-command-menu-item/constants/hidden-navigation-object-universal-identifiers.constant';
import { NAVIGATION_FEATURE_FLAG_GATE_BY_OBJECT_UNIVERSAL_IDENTIFIER } from 'src/engine/metadata-modules/flat-command-menu-item/constants/navigation-feature-flag-gate-by-object-universal-identifier.constant';
import { buildNavigationConditionalAvailabilityExpression } from 'src/engine/metadata-modules/flat-command-menu-item/utils/build-navigation-conditional-availability-expression.util';

export const buildNavigationConditionalAvailability = ({
  universalIdentifier,
  nameSingular,
}: {
  universalIdentifier: string;
  nameSingular: string;
}): ConditionalDisplay => {
  if (HIDDEN_NAVIGATION_OBJECT_UNIVERSAL_IDENTIFIERS.has(universalIdentifier)) {
    return NEVER_AVAILABLE_CONDITIONAL_DISPLAY;
  }

  const legacyExpression = buildNavigationConditionalAvailabilityExpression({
    universalIdentifier,
    nameSingular,
  });
  const targetObjectReadPermissionConditionNode: ConditionalDisplayConditionNode =
    {
      kind: 'recordFilter',
      recordFilter: {
        contextKey: 'targetObjectReadPermissions',
        operand: ViewFilterOperand.IS,
        subFieldName: nameSingular,
        value: 'true',
      },
    };
  const featureFlagGate =
    NAVIGATION_FEATURE_FLAG_GATE_BY_OBJECT_UNIVERSAL_IDENTIFIER[
      universalIdentifier
    ];

  if (!isDefined(featureFlagGate)) {
    return buildConditionalDisplayFromConditionNode({
      conditionNode: targetObjectReadPermissionConditionNode,
      source: legacyExpression,
    });
  }

  return buildConditionalDisplayFromConditionNode({
    conditionNode: {
      kind: 'recordFilterGroup',
      logicalOperator: RecordFilterGroupLogicalOperator.AND,
      children: [
        {
          kind: 'recordFilter',
          recordFilter: {
            contextKey: 'featureFlags',
            operand: ViewFilterOperand.IS,
            subFieldName: featureFlagGate,
            value: 'true',
          },
        },
        targetObjectReadPermissionConditionNode,
      ],
    },
    source: legacyExpression,
  });
};
