import { faker } from '@faker-js/faker';
import { expectOneNotInternalServerErrorSnapshot } from 'test/integration/graphql/utils/expect-one-not-internal-server-error-snapshot.util';
import { createCommandMenuItem } from 'test/integration/metadata/suites/command-menu-item/utils/create-command-menu-item.util';
import { fetchTestFieldMetadataIds } from 'test/integration/metadata/suites/page-layout-widget/utils/fetch-test-field-metadata-ids.util';
import {
  eachTestingContextFilter,
  type EachTestingContext,
} from 'twenty-shared/testing';
import {
  CommandMenuItemAvailabilityType,
  ViewFilterOperand,
} from 'twenty-shared/types';

import { type CreateCommandMenuItemInput } from 'src/engine/metadata-modules/command-menu-item/dtos/create-command-menu-item.input';
import { EngineComponentKey } from 'src/engine/metadata-modules/command-menu-item/enums/engine-component-key.enum';

type TestContext = {
  input: CreateCommandMenuItemInput;
};

type ConditionalDisplayTestContext = {
  input: CreateCommandMenuItemInput;
  expectedMessage: string;
};

const failingCommandMenuItemCreationTestCases: EachTestingContext<TestContext>[] =
  [
    {
      title: 'when creating with empty label',
      context: {
        input: {
          workflowVersionId: faker.string.uuid(),
          engineComponentKey: EngineComponentKey.TRIGGER_WORKFLOW_VERSION,
          label: '',
        },
      },
    },
    {
      title: 'when creating with missing label',
      context: {
        input: {
          workflowVersionId: faker.string.uuid(),
          engineComponentKey: EngineComponentKey.TRIGGER_WORKFLOW_VERSION,
        } as CreateCommandMenuItemInput,
      },
    },
    {
      title: 'when creating with missing engineComponentKey',
      context: {
        input: {
          label: 'Test Label',
        } as CreateCommandMenuItemInput,
      },
    },
    {
      title: 'when creating with empty workflowVersionId',
      context: {
        input: {
          workflowVersionId: '',
          engineComponentKey: EngineComponentKey.TRIGGER_WORKFLOW_VERSION,
          label: 'Test Label',
        },
      },
    },
    {
      title: 'when creating with invalid workflowVersionId (not a UUID)',
      context: {
        input: {
          workflowVersionId: 'not-a-valid-uuid',
          engineComponentKey: EngineComponentKey.TRIGGER_WORKFLOW_VERSION,
          label: 'Test Label',
        },
      },
    },
    {
      title: 'when creating TRIGGER_WORKFLOW_VERSION without workflowVersionId',
      context: {
        input: {
          engineComponentKey: EngineComponentKey.TRIGGER_WORKFLOW_VERSION,
          label: 'Test Label',
        },
      },
    },
    {
      title: 'when creating TRIGGER_WORKFLOW_VERSION with frontComponentId',
      context: {
        input: {
          workflowVersionId: faker.string.uuid(),
          frontComponentId: faker.string.uuid(),
          engineComponentKey: EngineComponentKey.TRIGGER_WORKFLOW_VERSION,
          label: 'Test Label',
        },
      },
    },
    {
      title: 'when creating FRONT_COMPONENT_RENDERER without frontComponentId',
      context: {
        input: {
          engineComponentKey: EngineComponentKey.FRONT_COMPONENT_RENDERER,
          label: 'Test Label',
        },
      },
    },
    {
      title: 'when creating FRONT_COMPONENT_RENDERER with workflowVersionId',
      context: {
        input: {
          frontComponentId: faker.string.uuid(),
          workflowVersionId: faker.string.uuid(),
          engineComponentKey: EngineComponentKey.FRONT_COMPONENT_RENDERER,
          label: 'Test Label',
        },
      },
    },
    {
      title: 'when creating standard key with workflowVersionId',
      context: {
        input: {
          workflowVersionId: faker.string.uuid(),
          engineComponentKey: EngineComponentKey.GO_TO_PEOPLE,
          label: 'Test Label',
        },
      },
    },
    {
      title: 'when creating standard key with frontComponentId',
      context: {
        input: {
          frontComponentId: faker.string.uuid(),
          engineComponentKey: EngineComponentKey.GO_TO_PEOPLE,
          label: 'Test Label',
        },
      },
    },
  ];

const failingCommandMenuItemConditionalDisplayCreationTestCases: EachTestingContext<ConditionalDisplayTestContext>[] =
  [
    {
      title: 'when conditionalDisplay uses an engine context key',
      context: {
        input: {
          workflowVersionId: faker.string.uuid(),
          engineComponentKey: EngineComponentKey.TRIGGER_WORKFLOW_VERSION,
          label: 'Command With Engine Key In Display',
          conditionalDisplay: {
            recordFilters: [
              {
                id: '0',
                contextKey: 'isSelectAll',
                operand: ViewFilterOperand.IS,
                value: 'true',
              },
            ],
          },
        },
        expectedMessage:
          'Conditional display context key "isSelectAll" is not allowed in conditionalDisplay',
      },
    },
    {
      title: 'when conditionalAvailability uses an admin context key',
      context: {
        input: {
          workflowVersionId: faker.string.uuid(),
          engineComponentKey: EngineComponentKey.TRIGGER_WORKFLOW_VERSION,
          label: 'Command With Admin Key In Availability',
          conditionalAvailability: {
            recordFilters: [
              {
                id: '0',
                contextKey: 'currentWorkspaceMemberId',
                operand: ViewFilterOperand.IS,
                value: JSON.stringify({
                  isCurrentWorkspaceMemberSelected: true,
                  selectedRecordIds: [],
                }),
              },
            ],
          },
        },
        expectedMessage:
          'Conditional display context key "currentWorkspaceMemberId" is not allowed in conditionalAvailability',
      },
    },
    {
      title:
        'when conditionalAvailability uses featureFlags without a sub field name',
      context: {
        input: {
          workflowVersionId: faker.string.uuid(),
          engineComponentKey: EngineComponentKey.TRIGGER_WORKFLOW_VERSION,
          label: 'Command With Feature Flag Without Entry',
          conditionalAvailability: {
            recordFilters: [
              {
                id: '0',
                contextKey: 'featureFlags',
                operand: ViewFilterOperand.IS,
                value: 'true',
              },
            ],
          },
        },
        expectedMessage:
          'Conditional display context key "featureFlags" requires a sub field name',
      },
    },
    {
      title:
        'when conditionalAvailability uses numberOfSelectedRecords with operand CONTAINS',
      context: {
        input: {
          workflowVersionId: faker.string.uuid(),
          engineComponentKey: EngineComponentKey.TRIGGER_WORKFLOW_VERSION,
          label: 'Command With Selection Count Contains',
          conditionalAvailability: {
            recordFilters: [
              {
                id: '0',
                contextKey: 'numberOfSelectedRecords',
                operand: ViewFilterOperand.CONTAINS,
                value: '1',
              },
            ],
          },
        },
        expectedMessage:
          'Operand "CONTAINS" is not supported on conditional display context key "numberOfSelectedRecords" of type "NUMBER". Supported operands: IS, IS_NOT, GREATER_THAN_OR_EQUAL, LESS_THAN_OR_EQUAL, IS_EMPTY, IS_NOT_EMPTY.',
      },
    },
    {
      title: 'when conditionalAvailability uses an unknown pageType value',
      context: {
        input: {
          workflowVersionId: faker.string.uuid(),
          engineComponentKey: EngineComponentKey.TRIGGER_WORKFLOW_VERSION,
          label: 'Command With Unknown Page Type',
          conditionalAvailability: {
            recordFilters: [
              {
                id: '0',
                contextKey: 'pageType',
                operand: ViewFilterOperand.IS,
                value: '["UNKNOWN_PAGE"]',
              },
            ],
          },
        },
        expectedMessage:
          'Conditional display context key "pageType" uses option(s) UNKNOWN_PAGE that do not exist. Allowed values: INDEX_PAGE, RECORD_PAGE, STANDALONE_PAGE, SETTINGS_PAGE.',
      },
    },
  ];

describe('CommandMenuItem creation should fail', () => {
  it.each(eachTestingContextFilter(failingCommandMenuItemCreationTestCases))(
    '$title',
    async ({ context }) => {
      const { errors } = await createCommandMenuItem({
        expectToFail: true,
        input: context.input,
      });

      expectOneNotInternalServerErrorSnapshot({
        errors,
      });
    },
  );

  it('when the caller lacks the LAYOUTS permission', async () => {
    const { errors } = await createCommandMenuItem({
      expectToFail: true,
      input: {
        engineComponentKey: EngineComponentKey.GO_TO_PEOPLE,
        label: 'Member Pinned Item',
        isPinned: true,
      },
      token: APPLE_JONY_MEMBER_ACCESS_TOKEN,
    });

    expect(errors?.[0]?.extensions?.code).toBe('FORBIDDEN');
  });

  it('when a GLOBAL command has a conditional display on a record field', async () => {
    const { fieldMetadataId2: nameFieldMetadataId } =
      await fetchTestFieldMetadataIds();

    const { errors } = await createCommandMenuItem({
      expectToFail: true,
      input: {
        workflowVersionId: faker.string.uuid(),
        engineComponentKey: EngineComponentKey.TRIGGER_WORKFLOW_VERSION,
        label: 'Global Command With Field Rule',
        availabilityType: CommandMenuItemAvailabilityType.GLOBAL,
        conditionalDisplay: {
          recordFilters: [
            {
              id: '0',
              fieldMetadataId: nameFieldMetadataId,
              operand: ViewFilterOperand.IS_NOT_EMPTY,
              value: '',
            },
          ],
        },
      },
    });

    expect(errors).toMatchObject([
      {
        extensions: {
          code: 'METADATA_VALIDATION_FAILED',
          errors: {
            commandMenuItem: [
              {
                errors: [
                  {
                    code: 'INVALID_COMMAND_MENU_ITEM_INPUT',
                    message:
                      'Conditional display rules on commandMenuItem cannot reference a record field',
                  },
                ],
              },
            ],
          },
        },
      },
    ]);
  });

  it('when conditionalAvailability references a record field', async () => {
    const { fieldMetadataId2: nameFieldMetadataId } =
      await fetchTestFieldMetadataIds();

    const { errors } = await createCommandMenuItem({
      expectToFail: true,
      input: {
        workflowVersionId: faker.string.uuid(),
        engineComponentKey: EngineComponentKey.TRIGGER_WORKFLOW_VERSION,
        label: 'Command With Field Rule In Availability',
        conditionalAvailability: {
          recordFilters: [
            {
              id: '0',
              fieldMetadataId: nameFieldMetadataId,
              operand: ViewFilterOperand.IS_NOT_EMPTY,
              value: '',
            },
          ],
        },
      },
    });

    expect(errors).toMatchObject([
      {
        extensions: {
          code: 'METADATA_VALIDATION_FAILED',
          errors: {
            commandMenuItem: [
              {
                errors: [
                  {
                    code: 'INVALID_COMMAND_MENU_ITEM_INPUT',
                    message:
                      'Conditional display rules in conditionalAvailability cannot reference a record field',
                  },
                ],
              },
            ],
          },
        },
      },
    ]);
  });

  it.each(
    eachTestingContextFilter(
      failingCommandMenuItemConditionalDisplayCreationTestCases,
    ),
  )('$title', async ({ context }) => {
    const { errors } = await createCommandMenuItem({
      expectToFail: true,
      input: context.input,
    });

    expect(errors).toMatchObject([
      {
        extensions: {
          code: 'METADATA_VALIDATION_FAILED',
          errors: {
            commandMenuItem: [
              {
                errors: [
                  {
                    code: 'INVALID_COMMAND_MENU_ITEM_INPUT',
                    message: context.expectedMessage,
                  },
                ],
              },
            ],
          },
        },
      },
    ]);
  });
});
