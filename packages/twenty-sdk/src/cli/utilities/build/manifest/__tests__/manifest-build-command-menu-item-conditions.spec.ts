import { join } from 'path';

import { buildManifest } from '@/cli/utilities/build/manifest/manifest-build';
import { ViewFilterOperand } from 'twenty-shared/types';

const MOCKS_DIR = join(__dirname, '__mocks__');

const CONDITIONAL_AVAILABILITY_APP_PATH = join(
  MOCKS_DIR,
  'conditional-availability-app',
);

const UNMAPPED_CONDITIONAL_AVAILABILITY_APP_PATH = join(
  MOCKS_DIR,
  'unmapped-conditional-availability-app',
);

const findCommandMenuItem = async (universalIdentifier: string) => {
  const { manifest, errors } = await buildManifest(
    CONDITIONAL_AVAILABILITY_APP_PATH,
  );

  expect(errors).toEqual([]);

  return manifest?.commandMenuItems.find(
    (commandMenuItem) =>
      commandMenuItem.universalIdentifier === universalIdentifier,
  );
};

describe('buildManifest command menu item conditions', () => {
  it('compiles a simple boolean expression into a conditionalAvailability tree', async () => {
    const commandMenuItem = await findCommandMenuItem(
      'c0a1b2c3-0000-4000-8000-000000000011',
    );

    expect(commandMenuItem?.conditionalAvailability).toEqual({
      recordFilters: [
        {
          id: expect.any(String),
          contextKey: 'isInSidePanel',
          operand: ViewFilterOperand.IS,
          value: 'true',
        },
      ],
    });
    expect(commandMenuItem).not.toHaveProperty(
      'conditionalAvailabilityExpression',
    );
  }, 60000);

  it('compiles a numberOfSelectedRecords comparison and the pinned expression into trees', async () => {
    const commandMenuItem = await findCommandMenuItem(
      'c0a1b2c3-0000-4000-8000-000000000012',
    );

    expect(commandMenuItem?.conditionalAvailability).toEqual({
      recordFilters: [
        {
          id: expect.any(String),
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.GREATER_THAN_OR_EQUAL,
          value: '1',
        },
      ],
    });
    expect(commandMenuItem?.conditionalPinned).toEqual({
      recordFilters: [
        {
          id: expect.any(String),
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.IS,
          value: '1',
        },
      ],
    });
    expect(commandMenuItem).not.toHaveProperty('conditionalPinnedExpression');
  }, 60000);

  it('compiles a negated boolean into an IS_NOT row', async () => {
    const commandMenuItem = await findCommandMenuItem(
      'c0a1b2c3-0000-4000-8000-000000000013',
    );

    expect(commandMenuItem?.conditionalAvailability).toEqual({
      recordFilters: [
        {
          id: expect.any(String),
          contextKey: 'isSelectAll',
          operand: ViewFilterOperand.IS_NOT,
          value: 'true',
        },
      ],
    });
  }, 60000);

  it('writes no tree for an expression that is always true', async () => {
    const commandMenuItem = await findCommandMenuItem(
      'c0a1b2c3-0000-4000-8000-000000000014',
    );

    expect(commandMenuItem).toBeDefined();
    expect(commandMenuItem).not.toHaveProperty('conditionalAvailability');
    expect(commandMenuItem).not.toHaveProperty(
      'conditionalAvailabilityExpression',
    );
  }, 60000);

  it('fails the build with the compiler message when an expression cannot be mapped', async () => {
    const { errors } = await buildManifest(
      UNMAPPED_CONDITIONAL_AVAILABILITY_APP_PATH,
    );

    expect(errors).toEqual([
      'favorite-count.command-menu-item.ts - conditionalAvailabilityExpression: Cannot compile conditional availability expression "arrayLength(favoriteRecordIds) > 0": unsupported operator ">" between arrayLength(favoriteRecordIds) and literal 0',
    ]);
  }, 60000);
});
