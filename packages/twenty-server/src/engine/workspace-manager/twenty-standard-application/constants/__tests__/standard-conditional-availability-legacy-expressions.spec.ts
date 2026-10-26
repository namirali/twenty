import {
  compileConditionalAvailabilityExpression,
  isDefined,
} from 'twenty-shared/utils';

import { STANDARD_COMMAND_MENU_ITEMS } from 'src/engine/workspace-manager/twenty-standard-application/constants/standard-command-menu-item.constant';
import { STANDARD_RECORD_PAGE_LAYOUTS } from 'src/engine/workspace-manager/twenty-standard-application/constants/standard-page-layout.constant';
import { type StandardRecordPageLayoutConfig } from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config/standard-page-layout-config.type';

const compileLegacyExpression = (expression: string | null | undefined) =>
  isDefined(expression)
    ? compileConditionalAvailabilityExpression(expression)
    : null;

describe('standard conditional availability legacy expressions', () => {
  it('compile to the trees declared next to them on command menu items', () => {
    Object.entries(STANDARD_COMMAND_MENU_ITEMS).forEach(
      ([commandMenuItemName, definition]) => {
        expect({
          commandMenuItemName,
          conditionalAvailability: compileLegacyExpression(
            definition.conditionalAvailabilityExpression,
          ),
          conditionalPinned: compileLegacyExpression(
            'conditionalPinnedExpression' in definition
              ? definition.conditionalPinnedExpression
              : null,
          ),
        }).toEqual({
          commandMenuItemName,
          conditionalAvailability: definition.conditionalAvailability,
          conditionalPinned:
            'conditionalPinned' in definition
              ? definition.conditionalPinned
              : null,
        });
      },
    );
  });

  it('compile to the trees declared next to them on record page widgets', () => {
    Object.values(
      STANDARD_RECORD_PAGE_LAYOUTS as Record<
        string,
        StandardRecordPageLayoutConfig
      >,
    )
      .flatMap((layout) =>
        Object.values(layout.tabs).flatMap((tab) => Object.values(tab.widgets)),
      )
      .forEach((widget) => {
        expect({
          universalIdentifier: widget.universalIdentifier,
          conditionalAvailability: compileLegacyExpression(
            widget.conditionalAvailabilityExpression,
          ),
        }).toEqual({
          universalIdentifier: widget.universalIdentifier,
          conditionalAvailability: widget.conditionalAvailability ?? null,
        });
      });
  });
});
