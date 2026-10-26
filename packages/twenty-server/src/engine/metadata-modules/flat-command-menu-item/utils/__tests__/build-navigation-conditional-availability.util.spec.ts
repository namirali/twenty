import { STANDARD_OBJECTS } from 'twenty-shared/metadata';
import { compileConditionalAvailabilityExpression } from 'twenty-shared/utils';

import { buildNavigationConditionalAvailability } from 'src/engine/metadata-modules/flat-command-menu-item/utils/build-navigation-conditional-availability.util';
import { buildNavigationConditionalAvailabilityExpression } from 'src/engine/metadata-modules/flat-command-menu-item/utils/build-navigation-conditional-availability-expression.util';

const expectSameTreeAsTheCompiledLegacyExpression = (navigationTarget: {
  universalIdentifier: string;
  nameSingular: string;
}) =>
  expect(buildNavigationConditionalAvailability(navigationTarget)).toEqual(
    compileConditionalAvailabilityExpression(
      buildNavigationConditionalAvailabilityExpression(navigationTarget),
    ),
  );

describe('buildNavigationConditionalAvailability', () => {
  it('builds the compiled tree of a read-permission gate', () => {
    expectSameTreeAsTheCompiledLegacyExpression({
      universalIdentifier: 'custom-object-universal-id',
      nameSingular: 'rocketLaunch',
    });
  });

  it('builds the compiled tree of a feature flag and read-permission gate', () => {
    expectSameTreeAsTheCompiledLegacyExpression({
      universalIdentifier: STANDARD_OBJECTS.messageCampaign.universalIdentifier,
      nameSingular: 'messageCampaign',
    });
  });

  it('builds the compiled tree of a hidden navigation', () => {
    expectSameTreeAsTheCompiledLegacyExpression({
      universalIdentifier: STANDARD_OBJECTS.workflowVersion.universalIdentifier,
      nameSingular: 'workflowVersion',
    });
  });
});
