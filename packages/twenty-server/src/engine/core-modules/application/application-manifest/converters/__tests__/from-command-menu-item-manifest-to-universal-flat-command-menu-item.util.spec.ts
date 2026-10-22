import { type CommandMenuItemManifest } from 'twenty-shared/application';
import {
  type UniversalConditionalDisplay,
  ViewFilterOperand,
} from 'twenty-shared/types';

import { fromCommandMenuItemManifestToUniversalFlatCommandMenuItem } from 'src/engine/core-modules/application/application-manifest/converters/from-command-menu-item-manifest-to-universal-flat-command-menu-item.util';

const COMMAND_MENU_ITEM_MANIFEST: CommandMenuItemManifest = {
  universalIdentifier: '11111111-1111-4111-8111-111111111111',
  label: 'Escalate ticket',
  frontComponentUniversalIdentifier: '22222222-2222-4222-8222-222222222222',
};

const CONDITIONAL_AVAILABILITY: UniversalConditionalDisplay = {
  recordFilters: [
    {
      id: 'select-all-filter',
      contextKey: 'isSelectAll',
      operand: ViewFilterOperand.IS_NOT,
      value: 'true',
    },
  ],
};

const CONDITIONAL_PINNED: UniversalConditionalDisplay = {
  recordFilters: [
    {
      id: 'selected-records-filter',
      contextKey: 'numberOfSelectedRecords',
      operand: ViewFilterOperand.GREATER_THAN_OR_EQUAL,
      value: '1',
    },
  ],
};

const build = (commandMenuItemManifest: CommandMenuItemManifest) =>
  fromCommandMenuItemManifestToUniversalFlatCommandMenuItem({
    commandMenuItemManifest,
    applicationUniversalIdentifier: '66666666-6666-4666-8666-666666666666',
    now: '2026-10-22T10:00:00.000Z',
  });

describe('fromCommandMenuItemManifestToUniversalFlatCommandMenuItem', () => {
  it('carries the conditional availability and pinned trees onto the command menu item', () => {
    expect(
      build({
        ...COMMAND_MENU_ITEM_MANIFEST,
        conditionalAvailability: CONDITIONAL_AVAILABILITY,
        conditionalPinned: CONDITIONAL_PINNED,
      }),
    ).toMatchObject({
      universalConditionalAvailability: CONDITIONAL_AVAILABILITY,
      universalConditionalPinned: CONDITIONAL_PINNED,
    });
  });

  it('rejects a manifest declaring a conditional availability expression', () => {
    const legacyCommandMenuItemManifest = {
      ...COMMAND_MENU_ITEM_MANIFEST,
      conditionalAvailabilityExpression: 'numberOfSelectedRecords >= 1',
    };

    expect(() => build(legacyCommandMenuItemManifest)).toThrow(
      'Command menu item "Escalate ticket" declares the unsupported conditionalAvailabilityExpression, declare a conditionalAvailability tree instead',
    );
  });

  it('rejects a manifest declaring a conditional pinned expression', () => {
    const legacyCommandMenuItemManifest = {
      ...COMMAND_MENU_ITEM_MANIFEST,
      conditionalPinnedExpression: 'numberOfSelectedRecords >= 1',
    };

    expect(() => build(legacyCommandMenuItemManifest)).toThrow(
      'Command menu item "Escalate ticket" declares the unsupported conditionalPinnedExpression, declare a conditionalPinned tree instead',
    );
  });
});
