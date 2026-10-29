import { msg } from '@lingui/core/macro';
import { STANDARD_OBJECTS } from 'twenty-shared/metadata';
import {
  CommandMenuItemAvailabilityType,
  type ConditionalDisplay,
  RecordFilterGroupLogicalOperator,
  ViewFilterOperand,
} from 'twenty-shared/types';

import { EngineComponentKey } from 'src/engine/metadata-modules/command-menu-item/enums/engine-component-key.enum';
import { i18nLabel } from 'src/engine/workspace-manager/twenty-standard-application/utils/i18n-label.util';

export const STANDARD_COMMAND_MENU_ITEMS = {
  navigateToNextRecord: {
    universalIdentifier: '3db2457d-8e96-4b8e-94c9-ed95d3f95738',
    label: i18nLabel(
      msg({
        message: `Navigate to next {objectLabelSingular}`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconChevronDown',
    isPinned: true,
    position: 1,
    shortLabel: null,
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'pageType == "RECORD_PAGE" and not isInSidePanel and objectMetadataItem.nameSingular != "messageCampaign" and objectMetadataItem.nameSingular != "agentChatThread"',
    conditionalAvailability: {
      recordFilters: [
        {
          id: 'c8d0b8c3-2d35-5ea1-bff3-153cdf8f0be4',
          contextKey: 'pageType',
          operand: ViewFilterOperand.IS,
          value: '["RECORD_PAGE"]',
        },
        {
          id: '9a600a0c-4386-5250-a4c5-61860730986b',
          contextKey: 'isInSidePanel',
          operand: ViewFilterOperand.IS,
          value: 'false',
        },
        {
          id: 'f1a4844c-9cb3-57fc-82ee-1ab95462cef2',
          contextKey: 'objectMetadataItem',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'nameSingular',
          value: '["messageCampaign"]',
        },
        {
          id: 'e3278481-99a6-54cd-bfc6-5ba1a4d67cac',
          contextKey: 'objectMetadataItem',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'nameSingular',
          value: '["agentChatThread"]',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.NAVIGATE_TO_NEXT_RECORD,
    hotKeys: null,
  },
  navigateToPreviousRecord: {
    universalIdentifier: 'ec10f871-415b-420b-8150-7e09f6f04833',
    label: i18nLabel(
      msg({
        message: `Navigate to previous {objectLabelSingular}`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconChevronUp',
    isPinned: true,
    position: 2,
    shortLabel: null,
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'pageType == "RECORD_PAGE" and not isInSidePanel and objectMetadataItem.nameSingular != "messageCampaign" and objectMetadataItem.nameSingular != "agentChatThread"',
    conditionalAvailability: {
      recordFilters: [
        {
          id: 'c8d0b8c3-2d35-5ea1-bff3-153cdf8f0be4',
          contextKey: 'pageType',
          operand: ViewFilterOperand.IS,
          value: '["RECORD_PAGE"]',
        },
        {
          id: '9a600a0c-4386-5250-a4c5-61860730986b',
          contextKey: 'isInSidePanel',
          operand: ViewFilterOperand.IS,
          value: 'false',
        },
        {
          id: 'f1a4844c-9cb3-57fc-82ee-1ab95462cef2',
          contextKey: 'objectMetadataItem',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'nameSingular',
          value: '["messageCampaign"]',
        },
        {
          id: 'e3278481-99a6-54cd-bfc6-5ba1a4d67cac',
          contextKey: 'objectMetadataItem',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'nameSingular',
          value: '["agentChatThread"]',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.NAVIGATE_TO_PREVIOUS_RECORD,
    hotKeys: null,
  },
  createNewRecord: {
    universalIdentifier: '08d255bf-58cd-47a5-bd82-78c5c58592f1',
    label: i18nLabel(
      msg({
        message: `Create {objectLabelSingular}`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconPlus',
    isPinned: true,
    position: 3,
    shortLabel: i18nLabel(
      msg({
        message: `Create`,
        context: 'commandMenuItem.shortLabel',
      }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL_OBJECT_CONTEXT,
    conditionalAvailabilityExpression:
      'pageType == "INDEX_PAGE" and objectPermissions.canUpdateObjectRecords and not hasAnySoftDeleteFilterOnView and objectMetadataItem.isUICreatable and objectMetadataItem.isUIEditable and not objectMetadataItem.isRemote',
    conditionalAvailability: {
      recordFilters: [
        {
          id: 'd918b256-4f26-554f-9a75-56eba5b948fc',
          contextKey: 'pageType',
          operand: ViewFilterOperand.IS,
          value: '["INDEX_PAGE"]',
        },
        {
          id: '54984bd9-1409-57f9-b352-06383620f177',
          contextKey: 'objectPermissions',
          operand: ViewFilterOperand.IS,
          subFieldName: 'canUpdateObjectRecords',
          value: 'true',
        },
        {
          id: '46ebd89a-f3b5-5df0-89cc-daa112146e30',
          contextKey: 'hasAnySoftDeleteFilterOnView',
          operand: ViewFilterOperand.IS,
          value: 'false',
        },
        {
          id: '09d8c74d-5afb-527a-a12a-a57091015234',
          contextKey: 'objectMetadataItem',
          operand: ViewFilterOperand.IS,
          subFieldName: 'isUICreatable',
          value: 'true',
        },
        {
          id: '45daee2c-a34d-5ae2-afe0-472be989b0d5',
          contextKey: 'objectMetadataItem',
          operand: ViewFilterOperand.IS,
          subFieldName: 'isUIEditable',
          value: 'true',
        },
        {
          id: '356b1b85-5efa-52df-8917-36252a0abd5f',
          contextKey: 'objectMetadataItem',
          operand: ViewFilterOperand.IS,
          subFieldName: 'isRemote',
          value: 'false',
        },
      ],
    } satisfies ConditionalDisplay,
    conditionalPinnedExpression: 'numberOfSelectedRecords == 0',
    conditionalPinned: {
      recordFilters: [
        {
          id: 'eb320d5e-0d23-57f8-a05d-f7f8972f1f52',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.IS,
          value: '0',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.CREATE_NEW_RECORD,
    hotKeys: null,
  },
  deleteRecords: {
    universalIdentifier: 'd5a55d57-ed1d-4791-89b8-53b7e121d69d',
    label: i18nLabel(
      msg({
        message: `Delete {objectLabel}`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconTrash',
    isPinned: false,
    position: 4,
    shortLabel: i18nLabel(
      msg({ message: `Delete`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords >= 1 and not hasAnySoftDeleteFilterOnView and objectPermissions.canSoftDeleteObjectRecords and (isSelectAll or noneDefined(selectedRecords, "deletedAt")) and (isSelectAll or noneEquals(selectedRecords, "recordPermissions.canSoftDelete", false))',
    conditionalAvailability: {
      recordFilters: [
        {
          id: 'ee8fc1b3-1945-5270-b122-6195b75436a5',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.GREATER_THAN_OR_EQUAL,
          value: '1',
          recordFilterGroupId: '8c09f2f1-b559-535c-8382-c6d7cf7a0805',
          positionInRecordFilterGroup: 0,
        },
        {
          id: 'bcc5b074-d7a2-5a0c-a8b6-c7194225c721',
          contextKey: 'hasAnySoftDeleteFilterOnView',
          operand: ViewFilterOperand.IS,
          value: 'false',
          recordFilterGroupId: '8c09f2f1-b559-535c-8382-c6d7cf7a0805',
          positionInRecordFilterGroup: 1,
        },
        {
          id: 'bd287d44-6665-5978-8742-b7614596fe8d',
          contextKey: 'objectPermissions',
          operand: ViewFilterOperand.IS,
          subFieldName: 'canSoftDeleteObjectRecords',
          value: 'true',
          recordFilterGroupId: '8c09f2f1-b559-535c-8382-c6d7cf7a0805',
          positionInRecordFilterGroup: 2,
        },
        {
          id: '0be12531-269d-5409-bfd5-f45cf1fbe5e0',
          contextKey: 'isSelectAll',
          operand: ViewFilterOperand.IS,
          value: 'true',
          recordFilterGroupId: '292c4ea7-6f0f-5b9e-a107-300e171c38d0',
          positionInRecordFilterGroup: 0,
        },
        {
          id: '386d0124-18c3-54a4-8373-f7ad896ca69b',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
          recordFilterGroupId: '292c4ea7-6f0f-5b9e-a107-300e171c38d0',
          positionInRecordFilterGroup: 1,
        },
        {
          id: '21048ff8-ce8f-5f8e-8588-5c0e01cdcb81',
          contextKey: 'isSelectAll',
          operand: ViewFilterOperand.IS,
          value: 'true',
          recordFilterGroupId: '9ff0909c-ecb9-5993-b859-225ae6e3ac6b',
          positionInRecordFilterGroup: 0,
        },
        {
          id: '528ddfdf-5768-538d-bb43-9805b57db5bd',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'recordPermissions.canSoftDelete',
          value: 'false',
          recordFilterGroupId: '9ff0909c-ecb9-5993-b859-225ae6e3ac6b',
          positionInRecordFilterGroup: 1,
        },
      ],
      recordFilterGroups: [
        {
          id: '8c09f2f1-b559-535c-8382-c6d7cf7a0805',
          logicalOperator: RecordFilterGroupLogicalOperator.AND,
        },
        {
          id: '292c4ea7-6f0f-5b9e-a107-300e171c38d0',
          logicalOperator: RecordFilterGroupLogicalOperator.OR,
          parentRecordFilterGroupId: '8c09f2f1-b559-535c-8382-c6d7cf7a0805',
          positionInRecordFilterGroup: 3,
        },
        {
          id: '9ff0909c-ecb9-5993-b859-225ae6e3ac6b',
          logicalOperator: RecordFilterGroupLogicalOperator.OR,
          parentRecordFilterGroupId: '8c09f2f1-b559-535c-8382-c6d7cf7a0805',
          positionInRecordFilterGroup: 4,
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.DELETE_RECORDS,
    hotKeys: null,
  },
  restoreRecords: {
    universalIdentifier: '2d733846-8cc5-4314-ab79-916ae0801baa',
    label: i18nLabel(
      msg({
        message: `Restore {objectLabel}`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconRefresh',
    isPinned: true,
    position: 5,
    shortLabel: i18nLabel(
      msg({ message: `Restore`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords >= 1 and (isSelectAll or everyDefined(selectedRecords, "deletedAt")) and objectPermissions.canSoftDeleteObjectRecords and (pageType == "RECORD_PAGE" or hasAnySoftDeleteFilterOnView) and (isSelectAll or noneEquals(selectedRecords, "recordPermissions.canSoftDelete", false))',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '12fc1ef3-6fa2-54d4-8629-f22ba0f9507c',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.GREATER_THAN_OR_EQUAL,
          value: '1',
          recordFilterGroupId: 'cb991a43-30e7-5a14-a5b0-03c7a808dec1',
          positionInRecordFilterGroup: 0,
        },
        {
          id: 'e4523e9f-0bac-5212-afaa-01659441935e',
          contextKey: 'isSelectAll',
          operand: ViewFilterOperand.IS,
          value: 'true',
          recordFilterGroupId: '33cab78c-99f7-52a2-be78-41216ab68c46',
          positionInRecordFilterGroup: 0,
        },
        {
          id: '8341ced7-12dd-5528-ac87-a95ad33dead4',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT_EMPTY,
          subFieldName: 'deletedAt',
          recordFilterGroupId: '33cab78c-99f7-52a2-be78-41216ab68c46',
          positionInRecordFilterGroup: 1,
        },
        {
          id: '1d6e018c-5ade-5485-85be-db4457f69a2e',
          contextKey: 'objectPermissions',
          operand: ViewFilterOperand.IS,
          subFieldName: 'canSoftDeleteObjectRecords',
          value: 'true',
          recordFilterGroupId: 'cb991a43-30e7-5a14-a5b0-03c7a808dec1',
          positionInRecordFilterGroup: 2,
        },
        {
          id: 'db880ca8-7236-59ca-9d15-46082efbbb0c',
          contextKey: 'pageType',
          operand: ViewFilterOperand.IS,
          value: '["RECORD_PAGE"]',
          recordFilterGroupId: '1a9b483e-4da7-52fd-82c2-117c69b5ce8e',
          positionInRecordFilterGroup: 0,
        },
        {
          id: 'f7721f6c-9269-511e-859d-4527cf3ebe8a',
          contextKey: 'hasAnySoftDeleteFilterOnView',
          operand: ViewFilterOperand.IS,
          value: 'true',
          recordFilterGroupId: '1a9b483e-4da7-52fd-82c2-117c69b5ce8e',
          positionInRecordFilterGroup: 1,
        },
        {
          id: 'dae1da73-2da1-540a-90eb-20641933ae41',
          contextKey: 'isSelectAll',
          operand: ViewFilterOperand.IS,
          value: 'true',
          recordFilterGroupId: 'be7316e2-47a7-5d9b-8a25-139909681a0c',
          positionInRecordFilterGroup: 0,
        },
        {
          id: 'a80fb1f5-aca4-52aa-9cfd-6dec2df90176',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'recordPermissions.canSoftDelete',
          value: 'false',
          recordFilterGroupId: 'be7316e2-47a7-5d9b-8a25-139909681a0c',
          positionInRecordFilterGroup: 1,
        },
      ],
      recordFilterGroups: [
        {
          id: 'cb991a43-30e7-5a14-a5b0-03c7a808dec1',
          logicalOperator: RecordFilterGroupLogicalOperator.AND,
        },
        {
          id: '33cab78c-99f7-52a2-be78-41216ab68c46',
          logicalOperator: RecordFilterGroupLogicalOperator.OR,
          parentRecordFilterGroupId: 'cb991a43-30e7-5a14-a5b0-03c7a808dec1',
          positionInRecordFilterGroup: 1,
        },
        {
          id: '1a9b483e-4da7-52fd-82c2-117c69b5ce8e',
          logicalOperator: RecordFilterGroupLogicalOperator.OR,
          parentRecordFilterGroupId: 'cb991a43-30e7-5a14-a5b0-03c7a808dec1',
          positionInRecordFilterGroup: 3,
        },
        {
          id: 'be7316e2-47a7-5d9b-8a25-139909681a0c',
          logicalOperator: RecordFilterGroupLogicalOperator.OR,
          parentRecordFilterGroupId: 'cb991a43-30e7-5a14-a5b0-03c7a808dec1',
          positionInRecordFilterGroup: 4,
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.RESTORE_RECORDS,
    hotKeys: null,
  },
  destroyRecords: {
    universalIdentifier: '0ea2ebc4-02ca-4d15-b424-5352b9e487df',
    label: i18nLabel(
      msg({
        message: `Permanently destroy {objectLabel}`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconTrashX',
    isPinned: false,
    position: 6,
    shortLabel: i18nLabel(
      msg({ message: `Destroy`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords >= 1 and objectPermissions.canDestroyObjectRecords and (isSelectAll or everyDefined(selectedRecords, "deletedAt")) and (pageType == "RECORD_PAGE" or hasAnySoftDeleteFilterOnView) and (isSelectAll or noneEquals(selectedRecords, "recordPermissions.canDelete", false))',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '10fabfb4-99ed-5273-a429-f935588d5ab3',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.GREATER_THAN_OR_EQUAL,
          value: '1',
          recordFilterGroupId: '9506897d-3057-52b3-a2c2-fb78bfb4d68e',
          positionInRecordFilterGroup: 0,
        },
        {
          id: '0a04c515-84fc-5886-80fb-18fc0b86b67a',
          contextKey: 'objectPermissions',
          operand: ViewFilterOperand.IS,
          subFieldName: 'canDestroyObjectRecords',
          value: 'true',
          recordFilterGroupId: '9506897d-3057-52b3-a2c2-fb78bfb4d68e',
          positionInRecordFilterGroup: 1,
        },
        {
          id: '046f0293-1fb2-5371-8c02-513bb5744316',
          contextKey: 'isSelectAll',
          operand: ViewFilterOperand.IS,
          value: 'true',
          recordFilterGroupId: '7e65b191-8be7-5f09-a9af-3ee51ad44371',
          positionInRecordFilterGroup: 0,
        },
        {
          id: '316b5869-7025-5815-a203-ecc4ec8d6165',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT_EMPTY,
          subFieldName: 'deletedAt',
          recordFilterGroupId: '7e65b191-8be7-5f09-a9af-3ee51ad44371',
          positionInRecordFilterGroup: 1,
        },
        {
          id: 'cff7fc35-d03e-5549-84a9-25c0376837e8',
          contextKey: 'pageType',
          operand: ViewFilterOperand.IS,
          value: '["RECORD_PAGE"]',
          recordFilterGroupId: '59f04802-6855-5855-a226-200b013f088f',
          positionInRecordFilterGroup: 0,
        },
        {
          id: 'e362d059-d847-5b21-a44e-cbe8b789b266',
          contextKey: 'hasAnySoftDeleteFilterOnView',
          operand: ViewFilterOperand.IS,
          value: 'true',
          recordFilterGroupId: '59f04802-6855-5855-a226-200b013f088f',
          positionInRecordFilterGroup: 1,
        },
        {
          id: '2ba64dc7-1207-5b79-a933-a781412f2942',
          contextKey: 'isSelectAll',
          operand: ViewFilterOperand.IS,
          value: 'true',
          recordFilterGroupId: '9fa398ce-0560-5ce0-ad7b-80cbf74ea157',
          positionInRecordFilterGroup: 0,
        },
        {
          id: 'da7f6a58-175a-5532-94f9-13c9eea3eea3',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'recordPermissions.canDelete',
          value: 'false',
          recordFilterGroupId: '9fa398ce-0560-5ce0-ad7b-80cbf74ea157',
          positionInRecordFilterGroup: 1,
        },
      ],
      recordFilterGroups: [
        {
          id: '9506897d-3057-52b3-a2c2-fb78bfb4d68e',
          logicalOperator: RecordFilterGroupLogicalOperator.AND,
        },
        {
          id: '7e65b191-8be7-5f09-a9af-3ee51ad44371',
          logicalOperator: RecordFilterGroupLogicalOperator.OR,
          parentRecordFilterGroupId: '9506897d-3057-52b3-a2c2-fb78bfb4d68e',
          positionInRecordFilterGroup: 2,
        },
        {
          id: '59f04802-6855-5855-a226-200b013f088f',
          logicalOperator: RecordFilterGroupLogicalOperator.OR,
          parentRecordFilterGroupId: '9506897d-3057-52b3-a2c2-fb78bfb4d68e',
          positionInRecordFilterGroup: 3,
        },
        {
          id: '9fa398ce-0560-5ce0-ad7b-80cbf74ea157',
          logicalOperator: RecordFilterGroupLogicalOperator.OR,
          parentRecordFilterGroupId: '9506897d-3057-52b3-a2c2-fb78bfb4d68e',
          positionInRecordFilterGroup: 4,
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.DESTROY_RECORDS,
    hotKeys: null,
  },
  addToFavorites: {
    universalIdentifier: '38bf80c3-bd55-4753-80ba-38aa66429a03',
    label: i18nLabel(
      msg({ message: `Add to Favorites`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconHeart',
    isPinned: true,
    position: 7,
    shortLabel: null,
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'arrayLength(favoriteRecordIds) < numberOfSelectedRecords and noneDefined(selectedRecords, "deletedAt") and not hasAnySoftDeleteFilterOnView and objectMetadataItem.nameSingular != "messageCampaign" and objectMetadataItem.nameSingular != "workflow"',
    conditionalAvailability: {
      recordFilters: [
        {
          id: 'b67003b3-c5ad-5ec6-896c-026595443413',
          contextKey: 'areAllSelectedRecordsFavorites',
          operand: ViewFilterOperand.IS,
          value: 'false',
        },
        {
          id: '7aeec769-65f9-5dff-9b96-a8b252635c48',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
        {
          id: 'b60e2336-5796-5d68-a27d-48845bf6ec07',
          contextKey: 'hasAnySoftDeleteFilterOnView',
          operand: ViewFilterOperand.IS,
          value: 'false',
        },
        {
          id: '4850da95-60ad-5105-9a4f-32955b7ffd00',
          contextKey: 'objectMetadataItem',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'nameSingular',
          value: '["messageCampaign"]',
        },
        {
          id: '6f14cef3-c8b2-58d0-9275-161702fba3ec',
          contextKey: 'objectMetadataItem',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'nameSingular',
          value: '["workflow"]',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.ADD_TO_FAVORITES,
    hotKeys: null,
  },
  removeFromFavorites: {
    universalIdentifier: '3ea42507-44fa-4895-a36d-cbfef7355a50',
    label: i18nLabel(
      msg({
        message: `Remove from Favorites`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconHeartOff',
    isPinned: true,
    position: 8,
    shortLabel: null,
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'arrayLength(favoriteRecordIds) == numberOfSelectedRecords and noneDefined(selectedRecords, "deletedAt") and not hasAnySoftDeleteFilterOnView and objectMetadataItem.nameSingular != "messageCampaign" and objectMetadataItem.nameSingular != "workflow"',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '23959f62-7700-50be-bbb2-6c251549afed',
          contextKey: 'areAllSelectedRecordsFavorites',
          operand: ViewFilterOperand.IS,
          value: 'true',
        },
        {
          id: '8608c896-a4c9-5e0d-aeee-6e9f31df9e88',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
        {
          id: '37ecfc4f-72c0-52e5-97da-aacf0ecd5b86',
          contextKey: 'hasAnySoftDeleteFilterOnView',
          operand: ViewFilterOperand.IS,
          value: 'false',
        },
        {
          id: 'b8e89a2e-868f-5e3a-b426-0b7c01ea73ce',
          contextKey: 'objectMetadataItem',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'nameSingular',
          value: '["messageCampaign"]',
        },
        {
          id: '8c19c5fd-2030-5da4-ae12-ace8cb6fa5f5',
          contextKey: 'objectMetadataItem',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'nameSingular',
          value: '["workflow"]',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.REMOVE_FROM_FAVORITES,
    hotKeys: null,
  },
  exportRecords: {
    universalIdentifier: 'c6f5c54d-d52b-4e75-8188-2190d77126f2',
    label: i18nLabel(
      msg({
        message: `Export {objectLabel}`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconFileExport',
    isPinned: false,
    position: 10,
    shortLabel: i18nLabel(
      msg({ message: `Export`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'pageType == "INDEX_PAGE" and permissionFlags.EXPORT_CSV',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '0cba3098-85f1-51fe-a92d-e223e6ba6081',
          contextKey: 'pageType',
          operand: ViewFilterOperand.IS,
          value: '["INDEX_PAGE"]',
        },
        {
          id: 'c7628efd-b3ff-5f67-b3cc-a89534e9e5c5',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'EXPORT_CSV',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.EXPORT_RECORDS,
    hotKeys: null,
  },
  updateMultipleRecords: {
    universalIdentifier: '2e080651-f098-4a78-bea9-7a70002dc57c',
    label: i18nLabel(
      msg({
        message: `Update {objectLabelPlural}`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconEdit',
    isPinned: true,
    position: 11,
    shortLabel: i18nLabel(
      msg({ message: `Update`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords >= 2 and objectPermissions.canUpdateObjectRecords',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '855cab9b-03e6-5a12-835a-65d76d06453a',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.GREATER_THAN_OR_EQUAL,
          value: '2',
        },
        {
          id: '0c95de7c-5b96-523f-ba3b-6c718023b841',
          contextKey: 'objectPermissions',
          operand: ViewFilterOperand.IS,
          subFieldName: 'canUpdateObjectRecords',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.UPDATE_MULTIPLE_RECORDS,
    hotKeys: null,
  },
  mergeMultipleRecords: {
    universalIdentifier: '6c14eb04-8e7e-4d47-93c0-8ec4834e2e60',
    label: i18nLabel(
      msg({
        message: `Merge {objectLabelPlural}`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconArrowMerge',
    isPinned: false,
    position: 12,
    shortLabel: i18nLabel(
      msg({ message: `Merge`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'not isSelectAll and numberOfSelectedRecords >= 2 and not objectMetadataItem.isSystem and objectMetadataItem.nameSingular != "workflow" and objectMetadataItem.nameSingular != "dashboard" and objectPermissions.canUpdateObjectRecords and objectPermissions.canDestroyObjectRecords and numberOfSelectedRecords <= 9 and noneEquals(selectedRecords, "recordPermissions.canUpdate", false) and noneEquals(selectedRecords, "recordPermissions.canDelete", false)',
    conditionalAvailability: {
      recordFilters: [
        {
          id: 'b97657d4-9375-5020-a4d5-e0b64d8593a7',
          contextKey: 'isSelectAll',
          operand: ViewFilterOperand.IS,
          value: 'false',
        },
        {
          id: '1d59fd75-9c57-525d-88f4-03bada43affb',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.GREATER_THAN_OR_EQUAL,
          value: '2',
        },
        {
          id: '970edecf-c7ee-508f-95c6-2a980ff73577',
          contextKey: 'objectMetadataItem',
          operand: ViewFilterOperand.IS,
          subFieldName: 'isSystem',
          value: 'false',
        },
        {
          id: '456a2fed-4323-5fcc-bf1e-e0782b58ff84',
          contextKey: 'objectMetadataItem',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'nameSingular',
          value: '["workflow"]',
        },
        {
          id: '107ea04e-1b4a-51b5-a105-97715df76262',
          contextKey: 'objectMetadataItem',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'nameSingular',
          value: '["dashboard"]',
        },
        {
          id: '244b66fa-e192-5893-8c5c-990ce38d6b1d',
          contextKey: 'objectPermissions',
          operand: ViewFilterOperand.IS,
          subFieldName: 'canUpdateObjectRecords',
          value: 'true',
        },
        {
          id: 'b2b14071-ab68-5ecd-853b-257c79eaa9ad',
          contextKey: 'objectPermissions',
          operand: ViewFilterOperand.IS,
          subFieldName: 'canDestroyObjectRecords',
          value: 'true',
        },
        {
          id: 'a9709fb5-dd68-5d30-b3e0-f2a4d17d3a61',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.LESS_THAN_OR_EQUAL,
          value: '9',
        },
        {
          id: '9b0171b4-a5c7-5070-95f3-b32d8464fa36',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'recordPermissions.canUpdate',
          value: 'false',
        },
        {
          id: '3feacbf7-c034-581c-9897-bb2ef20c5a6d',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'recordPermissions.canDelete',
          value: 'false',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.MERGE_MULTIPLE_RECORDS,
    hotKeys: null,
  },
  mergeWithRecord: {
    universalIdentifier: 'eb8acbd6-b285-466b-a172-7a643d8d5e3f',
    label: i18nLabel(
      msg({
        message: `Merge with Another {objectLabelSingular}`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconArrowMerge',
    isPinned: false,
    position: 12,
    shortLabel: i18nLabel(
      msg({ message: `Merge`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'pageType == "RECORD_PAGE" and numberOfSelectedRecords == 1 and noneDefined(selectedRecords, "deletedAt") and not objectMetadataItem.isSystem and objectMetadataItem.nameSingular != "workflow" and objectMetadataItem.nameSingular != "dashboard" and objectPermissions.canUpdateObjectRecords and objectPermissions.canDestroyObjectRecords and noneEquals(selectedRecords, "recordPermissions.canUpdate", false) and noneEquals(selectedRecords, "recordPermissions.canDelete", false)',
    conditionalAvailability: {
      recordFilters: [
        {
          id: 'e987a416-0262-51a0-9d0a-06bbe460b61d',
          contextKey: 'pageType',
          operand: ViewFilterOperand.IS,
          value: '["RECORD_PAGE"]',
        },
        {
          id: 'c9e31569-3836-5a7b-98bb-d676594231ac',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.IS,
          value: '1',
        },
        {
          id: '54ca148c-29b2-50fb-b1a8-21fe240ff8f1',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
        {
          id: 'a445e41c-8196-5e56-8016-e81388ce77b1',
          contextKey: 'objectMetadataItem',
          operand: ViewFilterOperand.IS,
          subFieldName: 'isSystem',
          value: 'false',
        },
        {
          id: '31936cf7-f5c8-52f7-8f13-369a7a4b5682',
          contextKey: 'objectMetadataItem',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'nameSingular',
          value: '["workflow"]',
        },
        {
          id: '360f5162-1c29-513b-b43f-059b106fa4b4',
          contextKey: 'objectMetadataItem',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'nameSingular',
          value: '["dashboard"]',
        },
        {
          id: '7454dd6e-a486-55f8-97de-4999ff4a4bac',
          contextKey: 'objectPermissions',
          operand: ViewFilterOperand.IS,
          subFieldName: 'canUpdateObjectRecords',
          value: 'true',
        },
        {
          id: '671cd2f4-f8b1-5a3f-a81a-213ee31363ce',
          contextKey: 'objectPermissions',
          operand: ViewFilterOperand.IS,
          subFieldName: 'canDestroyObjectRecords',
          value: 'true',
        },
        {
          id: '0a019b17-238c-51b0-8acb-b5b2cb84f35a',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'recordPermissions.canUpdate',
          value: 'false',
        },
        {
          id: 'ce061156-d350-5106-8afa-afbadce7daf5',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'recordPermissions.canDelete',
          value: 'false',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.MERGE_WITH_RECORD,
    hotKeys: null,
  },
  importRecords: {
    universalIdentifier: 'a2dc9de7-4798-422e-bb55-bfad7b9bdbe8',
    label: i18nLabel(
      msg({
        message: `Import {objectLabelPlural}`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconFileImport',
    isPinned: false,
    position: 13,
    shortLabel: i18nLabel(
      msg({ message: `Import`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL_OBJECT_CONTEXT,
    conditionalAvailabilityExpression:
      'pageType == "INDEX_PAGE" and not hasAnySoftDeleteFilterOnView and permissionFlags.IMPORT_CSV',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '5d36cee8-ebc6-54a8-9105-0f6de34cf04b',
          contextKey: 'pageType',
          operand: ViewFilterOperand.IS,
          value: '["INDEX_PAGE"]',
        },
        {
          id: '2d27d4f4-1456-5c8b-b9d3-a839cc93949a',
          contextKey: 'hasAnySoftDeleteFilterOnView',
          operand: ViewFilterOperand.IS,
          value: 'false',
        },
        {
          id: 'c87eed9d-b634-52fa-af81-d38a417f300b',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'IMPORT_CSV',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.IMPORT_RECORDS,
    hotKeys: null,
  },
  exportView: {
    universalIdentifier: '80680f2a-c426-48b3-a839-c63a6183dc4b',
    label: i18nLabel(
      msg({ message: `Export View`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconFileExport',
    isPinned: false,
    position: 14,
    shortLabel: i18nLabel(
      msg({ message: `Export`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL_OBJECT_CONTEXT,
    conditionalAvailabilityExpression:
      'pageType == "INDEX_PAGE" and permissionFlags.EXPORT_CSV',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '0cba3098-85f1-51fe-a92d-e223e6ba6081',
          contextKey: 'pageType',
          operand: ViewFilterOperand.IS,
          value: '["INDEX_PAGE"]',
        },
        {
          id: 'c7628efd-b3ff-5f67-b3cc-a89534e9e5c5',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'EXPORT_CSV',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.EXPORT_VIEW,
    hotKeys: null,
  },
  seeDeletedRecords: {
    universalIdentifier: 'd63c21c3-9785-4750-be87-5f36269b8e0d',
    label: i18nLabel(
      msg({
        message: `See deleted {objectLabelPlural}`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconRotate2',
    isPinned: false,
    position: 15,
    shortLabel: i18nLabel(
      msg({
        message: `Deleted {objectLabelPlural}`,
        context: 'commandMenuItem.shortLabel',
      }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL_OBJECT_CONTEXT,
    conditionalAvailabilityExpression:
      'pageType == "INDEX_PAGE" and not hasAnySoftDeleteFilterOnView',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '55364171-1160-5b80-b33c-f3a59be908e2',
          contextKey: 'pageType',
          operand: ViewFilterOperand.IS,
          value: '["INDEX_PAGE"]',
        },
        {
          id: '2ac8c799-c880-5874-a026-ae895f5c0c7a',
          contextKey: 'hasAnySoftDeleteFilterOnView',
          operand: ViewFilterOperand.IS,
          value: 'false',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.SEE_DELETED_RECORDS,
    hotKeys: null,
  },
  createNewView: {
    universalIdentifier: '6ec7c339-e167-431d-bec6-d1c737df677c',
    label: i18nLabel(
      msg({ message: `Create View`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconLayout',
    isPinned: false,
    position: 16,
    shortLabel: i18nLabel(
      msg({ message: `Create View`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL_OBJECT_CONTEXT,
    conditionalAvailabilityExpression:
      'pageType == "INDEX_PAGE" and not hasAnySoftDeleteFilterOnView',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '55364171-1160-5b80-b33c-f3a59be908e2',
          contextKey: 'pageType',
          operand: ViewFilterOperand.IS,
          value: '["INDEX_PAGE"]',
        },
        {
          id: '2ac8c799-c880-5874-a026-ae895f5c0c7a',
          contextKey: 'hasAnySoftDeleteFilterOnView',
          operand: ViewFilterOperand.IS,
          value: 'false',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.CREATE_NEW_VIEW,
    hotKeys: null,
  },
  hideDeletedRecords: {
    universalIdentifier: '1420db7f-0fba-49e2-b23e-4b7caa0fafa0',
    label: i18nLabel(
      msg({
        message: `Hide deleted {objectLabelPlural}`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconEyeOff',
    isPinned: false,
    position: 17,
    shortLabel: i18nLabel(
      msg({ message: `Hide deleted`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL_OBJECT_CONTEXT,
    conditionalAvailabilityExpression:
      'pageType == "INDEX_PAGE" and hasAnySoftDeleteFilterOnView',
    conditionalAvailability: {
      recordFilters: [
        {
          id: 'a8f16ded-2de3-5b3d-9ad6-08fac474a5d5',
          contextKey: 'pageType',
          operand: ViewFilterOperand.IS,
          value: '["INDEX_PAGE"]',
        },
        {
          id: '514fd09c-4c8b-55ab-a459-003085bfd318',
          contextKey: 'hasAnySoftDeleteFilterOnView',
          operand: ViewFilterOperand.IS,
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.HIDE_DELETED_RECORDS,
    hotKeys: null,
  },
  editRecordPageLayout: {
    universalIdentifier: 'd9794c67-1799-424f-8871-5ea771dd4a6d',
    label: i18nLabel(
      msg({ message: `Edit Layout`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconPencil',
    isPinned: false,
    position: 18,
    shortLabel: i18nLabel(
      msg({ message: `Edit Layout`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL,
    conditionalAvailabilityExpression:
      'pageType != "SETTINGS_PAGE" and not isLayoutCustomizationModeEnabled and permissionFlags.LAYOUTS',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '6ea01273-2c68-5f20-86ed-8a82421cb526',
          contextKey: 'pageType',
          operand: ViewFilterOperand.IS_NOT,
          value: '["SETTINGS_PAGE"]',
        },
        {
          id: 'cfade857-4a77-51e8-b8ef-c411a608e223',
          contextKey: 'isLayoutCustomizationModeEnabled',
          operand: ViewFilterOperand.IS,
          value: 'false',
        },
        {
          id: 'a81d9ec7-ae18-53a4-9465-ff7b5c24ccb0',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'LAYOUTS',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.EDIT_RECORD_PAGE_LAYOUT,
    hotKeys: null,
  },
  editDashboardLayout: {
    universalIdentifier: 'b9b53bbc-3129-4eb9-8344-c3f9628ffa7d',
    label: i18nLabel(
      msg({ message: `Edit Dashboard`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconPencil',
    isPinned: true,
    position: 19,
    shortLabel: i18nLabel(
      msg({ message: `Edit`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'pageType == "RECORD_PAGE" and not isDashboardPageLayoutInEditMode and not isLayoutCustomizationModeEnabled and noneDefined(selectedRecords, "deletedAt") and everyDefined(selectedRecords, "pageLayoutId") and objectPermissions.canUpdateObjectRecords',
    conditionalAvailability: {
      recordFilters: [
        {
          id: 'bda7d4d4-75fe-5f42-b9ea-8802a1c568a0',
          contextKey: 'pageType',
          operand: ViewFilterOperand.IS,
          value: '["RECORD_PAGE"]',
        },
        {
          id: 'f5177bc2-6c2e-59c1-8cd2-359ed8563059',
          contextKey: 'isDashboardPageLayoutInEditMode',
          operand: ViewFilterOperand.IS,
          value: 'false',
        },
        {
          id: '74772b21-f647-5c7d-a142-11a6ded10ea3',
          contextKey: 'isLayoutCustomizationModeEnabled',
          operand: ViewFilterOperand.IS,
          value: 'false',
        },
        {
          id: '2c306ef6-8833-5039-b957-f2a386cfc9fc',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
        {
          id: 'f004b04b-5104-5887-9920-346dea4118b6',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT_EMPTY,
          subFieldName: 'pageLayoutId',
        },
        {
          id: '54ac1921-0d38-563e-96b1-81cb633475cf',
          contextKey: 'objectPermissions',
          operand: ViewFilterOperand.IS,
          subFieldName: 'canUpdateObjectRecords',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.dashboard.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.EDIT_DASHBOARD_LAYOUT,
    hotKeys: null,
  },
  saveDashboardLayout: {
    universalIdentifier: '18b23908-f816-42ab-bc0a-eb5fae29c695',
    label: i18nLabel(
      msg({ message: `Save Dashboard`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconDeviceFloppy',
    isPinned: true,
    position: 20,
    shortLabel: i18nLabel(
      msg({ message: `Save`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'pageType == "RECORD_PAGE" and isDashboardPageLayoutInEditMode and noneDefined(selectedRecords, "deletedAt") and everyDefined(selectedRecords, "pageLayoutId") and objectPermissions.canUpdateObjectRecords',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '1c85fe87-c264-5b1d-9f64-efedd590ce78',
          contextKey: 'pageType',
          operand: ViewFilterOperand.IS,
          value: '["RECORD_PAGE"]',
        },
        {
          id: '69007a31-7838-5ff8-9e48-3deedfbaa88f',
          contextKey: 'isDashboardPageLayoutInEditMode',
          operand: ViewFilterOperand.IS,
          value: 'true',
        },
        {
          id: 'fdc8603a-a56d-5658-8a34-8d20043edcbb',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
        {
          id: 'da4e21f5-1954-5454-b468-b8a9c8472898',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT_EMPTY,
          subFieldName: 'pageLayoutId',
        },
        {
          id: '435c6e0f-3336-5c8f-988b-7ea8357a0d0e',
          contextKey: 'objectPermissions',
          operand: ViewFilterOperand.IS,
          subFieldName: 'canUpdateObjectRecords',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.dashboard.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.SAVE_DASHBOARD_LAYOUT,
    hotKeys: null,
  },
  cancelDashboardLayout: {
    universalIdentifier: '030ecd01-0aaf-4e6d-8400-105996548887',
    label: i18nLabel(
      msg({ message: `Cancel Edition`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconCancel',
    isPinned: true,
    position: 21,
    shortLabel: i18nLabel(
      msg({ message: `Cancel`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'pageType == "RECORD_PAGE" and isDashboardPageLayoutInEditMode and noneDefined(selectedRecords, "deletedAt") and everyDefined(selectedRecords, "pageLayoutId") and objectPermissions.canUpdateObjectRecords',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '1c85fe87-c264-5b1d-9f64-efedd590ce78',
          contextKey: 'pageType',
          operand: ViewFilterOperand.IS,
          value: '["RECORD_PAGE"]',
        },
        {
          id: '69007a31-7838-5ff8-9e48-3deedfbaa88f',
          contextKey: 'isDashboardPageLayoutInEditMode',
          operand: ViewFilterOperand.IS,
          value: 'true',
        },
        {
          id: 'fdc8603a-a56d-5658-8a34-8d20043edcbb',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
        {
          id: 'da4e21f5-1954-5454-b468-b8a9c8472898',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT_EMPTY,
          subFieldName: 'pageLayoutId',
        },
        {
          id: '435c6e0f-3336-5c8f-988b-7ea8357a0d0e',
          contextKey: 'objectPermissions',
          operand: ViewFilterOperand.IS,
          subFieldName: 'canUpdateObjectRecords',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.dashboard.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.CANCEL_DASHBOARD_LAYOUT,
    hotKeys: null,
  },
  duplicateDashboard: {
    universalIdentifier: '2ee07307-60ce-41ef-bfee-7c718f67557e',
    label: i18nLabel(
      msg({ message: `Duplicate Dashboard`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconCopyPlus',
    isPinned: false,
    position: 22,
    shortLabel: i18nLabel(
      msg({ message: `Duplicate`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'noneDefined(selectedRecords, "deletedAt") and objectPermissions.canUpdateObjectRecords',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '09ae8267-43b6-5a20-b7d5-8776c0da721f',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
        {
          id: 'd2fb8f22-6e00-50a8-b5c9-5dcf4be902f0',
          contextKey: 'objectPermissions',
          operand: ViewFilterOperand.IS,
          subFieldName: 'canUpdateObjectRecords',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.dashboard.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.DUPLICATE_DASHBOARD,
    hotKeys: null,
  },
  activateWorkflow: {
    universalIdentifier: '44f19c85-0fd0-482f-a14e-da513c60b1b3',
    label: i18nLabel(
      msg({ message: `Activate Workflow`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconPower',
    isPinned: true,
    position: 23,
    shortLabel: i18nLabel(
      msg({ message: `Activate`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords == 1 and everyDefined(selectedRecords, "currentVersion.trigger") and everyDefined(selectedRecords, "currentVersion.steps") and every(selectedRecords, "currentVersion.steps.length") and (everyEquals(selectedRecords, "currentVersion.status", "DRAFT") or includesNone(selectedRecords, "statuses", "ACTIVE")) and noneDefined(selectedRecords, "deletedAt")',
    conditionalAvailability: {
      recordFilters: [
        {
          id: 'd3f6f4fc-5781-5166-aac9-8d9f31cb20ed',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.IS,
          value: '1',
          recordFilterGroupId: '61c485e6-aa84-5d57-98aa-efc0407b31ce',
          positionInRecordFilterGroup: 0,
        },
        {
          id: '244c32eb-8179-5a9e-8a96-ae7a4736a00b',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT_EMPTY,
          subFieldName: 'currentVersion.trigger',
          recordFilterGroupId: '61c485e6-aa84-5d57-98aa-efc0407b31ce',
          positionInRecordFilterGroup: 1,
        },
        {
          id: 'b1688102-0d2f-548f-801c-89eba8d6f0a0',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT_EMPTY,
          subFieldName: 'currentVersion.steps',
          recordFilterGroupId: '61c485e6-aa84-5d57-98aa-efc0407b31ce',
          positionInRecordFilterGroup: 2,
        },
        {
          id: '6a9abbd8-4c35-53e6-aafe-7720f5b8ff10',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT_EMPTY,
          subFieldName: 'currentVersion.steps',
          recordFilterGroupId: '61c485e6-aa84-5d57-98aa-efc0407b31ce',
          positionInRecordFilterGroup: 3,
        },
        {
          id: '52e92b6f-b17c-57bf-af02-be54ea2808f4',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'currentVersion.status',
          value: '"DRAFT"',
          recordFilterGroupId: '37e4bc91-09bd-517a-8b6f-ea7301440c52',
          positionInRecordFilterGroup: 0,
        },
        {
          id: '156e356d-2d0e-5220-ac6e-50c09ee965cb',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.DOES_NOT_CONTAIN,
          subFieldName: 'statuses',
          value: '"ACTIVE"',
          recordFilterGroupId: '37e4bc91-09bd-517a-8b6f-ea7301440c52',
          positionInRecordFilterGroup: 1,
        },
        {
          id: '211d5470-01f1-5d3d-bf1a-5a1d03378ccf',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
          recordFilterGroupId: '61c485e6-aa84-5d57-98aa-efc0407b31ce',
          positionInRecordFilterGroup: 5,
        },
      ],
      recordFilterGroups: [
        {
          id: '61c485e6-aa84-5d57-98aa-efc0407b31ce',
          logicalOperator: RecordFilterGroupLogicalOperator.AND,
        },
        {
          id: '37e4bc91-09bd-517a-8b6f-ea7301440c52',
          logicalOperator: RecordFilterGroupLogicalOperator.OR,
          parentRecordFilterGroupId: '61c485e6-aa84-5d57-98aa-efc0407b31ce',
          positionInRecordFilterGroup: 4,
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.workflow.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.ACTIVATE_WORKFLOW,
    hotKeys: null,
  },
  deactivateWorkflow: {
    universalIdentifier: '57f21a06-a17a-47b1-a123-90d90dbdf0b7',
    label: i18nLabel(
      msg({ message: `Deactivate Workflow`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconPlayerPause',
    isPinned: true,
    position: 24,
    shortLabel: i18nLabel(
      msg({ message: `Deactivate`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords == 1 and (everyEquals(selectedRecords, "currentVersion.status", "ACTIVE") or includesEvery(selectedRecords, "statuses", "ACTIVE")) and noneDefined(selectedRecords, "deletedAt") and noneEquals(selectedRecords, "recordPermissions.canUpdate", false)',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '935cbcb1-323f-578f-87d8-ece70c5d4dc2',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.IS,
          value: '1',
          recordFilterGroupId: '49be7794-f709-53b6-9499-8d62227fb359',
          positionInRecordFilterGroup: 0,
        },
        {
          id: '2e0ded69-ec57-5bbe-8f9b-8cdcb0151acf',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'currentVersion.status',
          value: '"ACTIVE"',
          recordFilterGroupId: 'a71ca65d-6e2a-5616-94f8-1d9b6c4f6c84',
          positionInRecordFilterGroup: 0,
        },
        {
          id: '056c1709-191a-57b9-a92c-e36be6ff34fd',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.CONTAINS,
          subFieldName: 'statuses',
          value: '"ACTIVE"',
          recordFilterGroupId: 'a71ca65d-6e2a-5616-94f8-1d9b6c4f6c84',
          positionInRecordFilterGroup: 1,
        },
        {
          id: 'aa0a3794-dbdf-555c-8895-af4415fd3f3c',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
          recordFilterGroupId: '49be7794-f709-53b6-9499-8d62227fb359',
          positionInRecordFilterGroup: 2,
        },
        {
          id: '0360c9a0-b6f5-53f6-a269-c0513d4702ff',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'recordPermissions.canUpdate',
          value: 'false',
          recordFilterGroupId: '49be7794-f709-53b6-9499-8d62227fb359',
          positionInRecordFilterGroup: 3,
        },
      ],
      recordFilterGroups: [
        {
          id: '49be7794-f709-53b6-9499-8d62227fb359',
          logicalOperator: RecordFilterGroupLogicalOperator.AND,
        },
        {
          id: 'a71ca65d-6e2a-5616-94f8-1d9b6c4f6c84',
          logicalOperator: RecordFilterGroupLogicalOperator.OR,
          parentRecordFilterGroupId: '49be7794-f709-53b6-9499-8d62227fb359',
          positionInRecordFilterGroup: 1,
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.workflow.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.DEACTIVATE_WORKFLOW,
    hotKeys: null,
  },
  discardDraftWorkflow: {
    universalIdentifier: '4c227f2e-03bb-4a66-9b13-49f263264f4a',
    label: i18nLabel(
      msg({ message: `Discard Draft`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconNoteOff',
    isPinned: true,
    position: 25,
    shortLabel: i18nLabel(
      msg({ message: `Discard Draft`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'every(selectedRecords, "lastPublishedVersionId") and everyEquals(selectedRecords, "currentVersion.status", "DRAFT") and noneDefined(selectedRecords, "deletedAt")',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '36e3ad72-6ddd-5df5-85ac-cad556bb3ad1',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT_EMPTY,
          subFieldName: 'lastPublishedVersionId',
        },
        {
          id: '65e880a0-4fbe-5312-9fa9-fb2d119c5c0d',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'currentVersion.status',
          value: '"DRAFT"',
        },
        {
          id: '8c50e428-9bf0-5428-87b5-174cdf6ed077',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.workflow.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.DISCARD_DRAFT_WORKFLOW,
    hotKeys: null,
  },
  testWorkflow: {
    universalIdentifier: 'f85d552a-87a3-4667-99f7-71b47917539c',
    label: i18nLabel(
      msg({ message: `Test Workflow`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconPlayerPlay',
    isPinned: true,
    position: 26,
    shortLabel: i18nLabel(
      msg({ message: `Test`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords == 1 and everyDefined(selectedRecords, "currentVersion.trigger") and everyDefined(selectedRecords, "currentVersion.steps") and every(selectedRecords, "currentVersion.steps.length") and ((everyEquals(selectedRecords, "currentVersion.trigger.type", "MANUAL") and noneDefined(selectedRecords, "currentVersion.trigger.settings.objectType")) or everyEquals(selectedRecords, "currentVersion.trigger.type", "WEBHOOK") or everyEquals(selectedRecords, "currentVersion.trigger.type", "CRON")) and noneDefined(selectedRecords, "deletedAt")',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '218d7cde-f4d6-511d-99c6-bf623bb19664',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.IS,
          value: '1',
          recordFilterGroupId: '25e1b770-00e9-5b26-9a39-fe66154591cc',
          positionInRecordFilterGroup: 0,
        },
        {
          id: 'eb466879-ce37-5992-9b25-7570b6b1c9a2',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT_EMPTY,
          subFieldName: 'currentVersion.trigger',
          recordFilterGroupId: '25e1b770-00e9-5b26-9a39-fe66154591cc',
          positionInRecordFilterGroup: 1,
        },
        {
          id: 'acc18934-c7cc-5de4-a86c-7c7d6bd85f4d',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT_EMPTY,
          subFieldName: 'currentVersion.steps',
          recordFilterGroupId: '25e1b770-00e9-5b26-9a39-fe66154591cc',
          positionInRecordFilterGroup: 2,
        },
        {
          id: '6ac18d4c-eabc-5ca7-a7a4-f6fcf8da3d92',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT_EMPTY,
          subFieldName: 'currentVersion.steps',
          recordFilterGroupId: '25e1b770-00e9-5b26-9a39-fe66154591cc',
          positionInRecordFilterGroup: 3,
        },
        {
          id: '80b1e899-199f-5a8a-aa2d-140f79a50ddc',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'currentVersion.trigger.type',
          value: '"MANUAL"',
          recordFilterGroupId: 'bf9c58b8-22c3-5f6a-9140-269abf596d85',
          positionInRecordFilterGroup: 0,
        },
        {
          id: 'd221ec12-cbe6-53f1-b037-ede8e313fc8e',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'currentVersion.trigger.settings.objectType',
          recordFilterGroupId: 'bf9c58b8-22c3-5f6a-9140-269abf596d85',
          positionInRecordFilterGroup: 1,
        },
        {
          id: '9e71619e-607b-517b-86a4-ebb34d19738c',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'currentVersion.trigger.type',
          value: '"WEBHOOK"',
          recordFilterGroupId: '82a57ba3-ade9-53b2-b32d-a41fbc1af2af',
          positionInRecordFilterGroup: 1,
        },
        {
          id: '51b3471b-71f5-5b6a-9cbe-659953fea33e',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'currentVersion.trigger.type',
          value: '"CRON"',
          recordFilterGroupId: '82a57ba3-ade9-53b2-b32d-a41fbc1af2af',
          positionInRecordFilterGroup: 2,
        },
        {
          id: '71b9b11f-622a-5fad-98a3-79223378d402',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
          recordFilterGroupId: '25e1b770-00e9-5b26-9a39-fe66154591cc',
          positionInRecordFilterGroup: 5,
        },
      ],
      recordFilterGroups: [
        {
          id: '25e1b770-00e9-5b26-9a39-fe66154591cc',
          logicalOperator: RecordFilterGroupLogicalOperator.AND,
        },
        {
          id: '82a57ba3-ade9-53b2-b32d-a41fbc1af2af',
          logicalOperator: RecordFilterGroupLogicalOperator.OR,
          parentRecordFilterGroupId: '25e1b770-00e9-5b26-9a39-fe66154591cc',
          positionInRecordFilterGroup: 4,
        },
        {
          id: 'bf9c58b8-22c3-5f6a-9140-269abf596d85',
          logicalOperator: RecordFilterGroupLogicalOperator.AND,
          parentRecordFilterGroupId: '82a57ba3-ade9-53b2-b32d-a41fbc1af2af',
          positionInRecordFilterGroup: 0,
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.workflow.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.TEST_WORKFLOW,
    hotKeys: null,
  },
  seeRunsWorkflow: {
    universalIdentifier: 'e57efc2d-00a2-493a-b76c-f2dabd23a5eb',
    label: i18nLabel(
      msg({ message: `See Runs`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconHistoryToggle',
    isPinned: true,
    position: 28,
    shortLabel: i18nLabel(
      msg({ message: `See Runs`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords == 1 and noneDefined(selectedRecords, "deletedAt")',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '05a4bf32-444d-51c6-a702-8274d8c71173',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.IS,
          value: '1',
        },
        {
          id: '1f028c27-934e-518b-9668-16413de17446',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.workflow.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.SEE_RUNS_WORKFLOW,
    hotKeys: null,
  },
  seeVersionsWorkflow: {
    universalIdentifier: '92781d24-b875-4282-8cdb-d127f04a5c7d',
    label: i18nLabel(
      msg({
        message: `See Versions History`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconVersions',
    isPinned: false,
    position: 29,
    shortLabel: i18nLabel(
      msg({ message: `See Versions`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords == 1 and noneDefined(selectedRecords, "deletedAt")',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '05a4bf32-444d-51c6-a702-8274d8c71173',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.IS,
          value: '1',
        },
        {
          id: '1f028c27-934e-518b-9668-16413de17446',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.workflow.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.SEE_VERSIONS_WORKFLOW,
    hotKeys: null,
  },
  tidyUpWorkflow: {
    universalIdentifier: '1f3a3cab-161a-4775-af47-11be4d0bf411',
    label: i18nLabel(
      msg({ message: `Tidy up Workflow`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconReorder',
    isPinned: false,
    position: 31,
    shortLabel: i18nLabel(
      msg({ message: `Tidy up`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'pageType == "RECORD_PAGE" and everyDefined(selectedRecords, "currentVersion.trigger") and everyDefined(selectedRecords, "currentVersion.steps") and every(selectedRecords, "currentVersion.steps.length") and noneDefined(selectedRecords, "deletedAt") and noneEquals(selectedRecords, "recordPermissions.canUpdate", false)',
    conditionalAvailability: {
      recordFilters: [
        {
          id: 'a2a69433-23a8-5218-ad8b-ddfefe5bf0c3',
          contextKey: 'pageType',
          operand: ViewFilterOperand.IS,
          value: '["RECORD_PAGE"]',
        },
        {
          id: 'b0888b13-1db5-5fb5-b685-60c7aad2f7c2',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT_EMPTY,
          subFieldName: 'currentVersion.trigger',
        },
        {
          id: '14c286e6-54bc-565a-b441-835af354560f',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT_EMPTY,
          subFieldName: 'currentVersion.steps',
        },
        {
          id: '0a1d168b-acf4-5072-b71a-cfe51ca704fb',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT_EMPTY,
          subFieldName: 'currentVersion.steps',
        },
        {
          id: '4de134c3-1db8-5f97-b749-ec8f292c72bb',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
        {
          id: '60957185-7c32-5a80-aae3-34d75bb93e8c',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'recordPermissions.canUpdate',
          value: 'false',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.workflow.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.TIDY_UP_WORKFLOW,
    hotKeys: null,
  },
  duplicateWorkflow: {
    universalIdentifier: '91094438-b4c2-46ad-a23b-8af4b23ba514',
    label: i18nLabel(
      msg({ message: `Duplicate Workflow`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconCopy',
    isPinned: false,
    position: 32,
    shortLabel: i18nLabel(
      msg({ message: `Duplicate`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'everyDefined(selectedRecords, "currentVersion") and noneDefined(selectedRecords, "deletedAt") and noneEquals(selectedRecords, "recordPermissions.canUpdate", false)',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '5adfcdbd-e8a7-5d68-846d-afd51a6e576e',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT_EMPTY,
          subFieldName: 'currentVersion',
        },
        {
          id: 'fa362867-1bbf-5924-9b2f-b6946ff4b92c',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
        {
          id: '1036ca83-acf7-5548-83b1-bd52e3827416',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'recordPermissions.canUpdate',
          value: 'false',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.workflow.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.DUPLICATE_WORKFLOW,
    hotKeys: null,
  },
  makeWorkflowPrivate: {
    universalIdentifier: '26f98606-8b6e-42f2-bc97-2cfc4359bada',
    label: i18nLabel(
      msg({
        message: `Make Workflow Private`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconCircleDashed',
    isPinned: false,
    position: 33,
    shortLabel: i18nLabel(
      msg({ message: `Make Private`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords == 1 and everyEquals(selectedRecords, "visibility", "WORKSPACE") and every(selectedRecords, "canChangeVisibility") and noneDefined(selectedRecords, "deletedAt") and noneEquals(selectedRecords, "recordPermissions.canUpdate", false)',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '10feda32-2eee-5370-8099-4fdaeb6eae29',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.IS,
          value: '1',
        },
        {
          id: '083d20e7-8b25-57c3-aa3b-8ee2a96f4980',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'visibility',
          value: '"WORKSPACE"',
        },
        {
          id: '138fed2b-41f4-51c2-b012-cd6fc1640b22',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'canChangeVisibility',
          value: 'true',
        },
        {
          id: 'aec1c4e7-29e2-5880-9a25-79e1f33ed7b3',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
        {
          id: '4f060606-e6d5-53a6-b5a5-6d362f9cb71f',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'recordPermissions.canUpdate',
          value: 'false',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.workflow.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.TOGGLE_WORKFLOW_VISIBILITY,
    hotKeys: null,
  },
  shareWorkflowWithWorkspace: {
    universalIdentifier: '37745922-ba18-4bea-a1da-8625ad22d233',
    label: i18nLabel(
      msg({
        message: `Share Workflow with Workspace`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconCircle',
    isPinned: false,
    position: 33,
    shortLabel: i18nLabel(
      msg({
        message: `Share with Workspace`,
        context: 'commandMenuItem.shortLabel',
      }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords == 1 and everyEquals(selectedRecords, "visibility", "PRIVATE") and every(selectedRecords, "canChangeVisibility") and noneDefined(selectedRecords, "deletedAt")',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '46a494ac-eb28-5967-b786-4f1fb5f07c1f',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.IS,
          value: '1',
        },
        {
          id: 'dd1eea1d-945e-5e0f-bc01-ee9779bb222c',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'visibility',
          value: '"PRIVATE"',
        },
        {
          id: 'b28441f5-798d-535c-9740-e01df8ddbc88',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'canChangeVisibility',
          value: 'true',
        },
        {
          id: 'b67d4986-21c4-5d33-9bd9-4de5bba69396',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.workflow.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.TOGGLE_WORKFLOW_VISIBILITY,
    hotKeys: null,
  },
  seeWorkflowWorkflowRun: {
    universalIdentifier: '9d9cc62d-3543-45c3-93f3-23d2d8979f2b',
    label: i18nLabel(
      msg({ message: `See Workflow`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconSettingsAutomation',
    isPinned: true,
    position: 34,
    shortLabel: i18nLabel(
      msg({ message: `See Workflow`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression: null,
    conditionalAvailability: null,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.workflowRun.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.SEE_WORKFLOW_WORKFLOW_RUN,
    hotKeys: null,
  },
  stopWorkflowRun: {
    universalIdentifier: '4c186606-9515-4561-a1eb-9a072b4f5e58',
    label: i18nLabel(
      msg({ message: `Stop`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconPlayerStop',
    isPinned: true,
    position: 35,
    shortLabel: i18nLabel(
      msg({ message: `Stop`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'isSelectAll or someEquals(selectedRecords, "status", "NOT_STARTED") or someEquals(selectedRecords, "status", "ENQUEUED") or someEquals(selectedRecords, "status", "RUNNING")',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '0e697990-55eb-53aa-9265-52b769871078',
          contextKey: 'isSelectAll',
          operand: ViewFilterOperand.IS,
          value: 'true',
          recordFilterGroupId: '21ab452e-c475-59e4-ac2d-0bf38ac3b0f2',
          positionInRecordFilterGroup: 0,
        },
        {
          id: '67f8a70d-3b35-55b5-b3c9-7918af43bec5',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'status',
          value: '"NOT_STARTED"',
          recordFilterGroupId: '21ab452e-c475-59e4-ac2d-0bf38ac3b0f2',
          positionInRecordFilterGroup: 1,
        },
        {
          id: '77a7c3a8-ae07-5275-9cf2-e76752ce7e00',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'status',
          value: '"ENQUEUED"',
          recordFilterGroupId: '21ab452e-c475-59e4-ac2d-0bf38ac3b0f2',
          positionInRecordFilterGroup: 2,
        },
        {
          id: 'c0447d6b-d7de-5871-a3ba-963ac8c78b29',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'status',
          value: '"RUNNING"',
          recordFilterGroupId: '21ab452e-c475-59e4-ac2d-0bf38ac3b0f2',
          positionInRecordFilterGroup: 3,
        },
      ],
      recordFilterGroups: [
        {
          id: '21ab452e-c475-59e4-ac2d-0bf38ac3b0f2',
          logicalOperator: RecordFilterGroupLogicalOperator.OR,
        },
      ],
      selectedRecordsMatch: 'SOME',
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.workflowRun.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.STOP_WORKFLOW_RUN,
    hotKeys: null,
  },
  retryWorkflowRun: {
    universalIdentifier: '99b97c50-b31b-411a-a532-ec05402123c0',
    label: i18nLabel(
      msg({ message: `Retry`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconRefresh',
    isPinned: true,
    position: 36,
    shortLabel: i18nLabel(
      msg({ message: `Retry`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'someEquals(selectedRecords, "status", "FAILED")',
    conditionalAvailability: {
      recordFilters: [
        {
          id: 'd343ba01-6b08-5226-a49e-61037dfc990d',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'status',
          value: '"FAILED"',
        },
      ],
      selectedRecordsMatch: 'SOME',
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.workflowRun.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.RETRY_WORKFLOW_RUN,
    hotKeys: null,
  },
  seeRunsWorkflowVersion: {
    universalIdentifier: '44e305c7-4f0a-45ec-803f-6471b56455cb',
    label: i18nLabel(
      msg({ message: `See Runs`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconHistoryToggle',
    isPinned: true,
    position: 37,
    shortLabel: i18nLabel(
      msg({ message: `See Runs`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'everyDefined(selectedRecords, "workflow")',
    conditionalAvailability: {
      recordFilters: [
        {
          id: 'a20750ba-20b5-554b-ac64-ead1a7832009',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT_EMPTY,
          subFieldName: 'workflow',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.workflowVersion.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.SEE_RUNS_WORKFLOW_VERSION,
    hotKeys: null,
  },
  seeWorkflowWorkflowVersion: {
    universalIdentifier: 'b43052db-023e-4083-9b63-2c2dfbfd1320',
    label: i18nLabel(
      msg({ message: `See Workflow`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconSettingsAutomation',
    isPinned: true,
    position: 38,
    shortLabel: i18nLabel(
      msg({ message: `See Workflow`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'everyDefined(selectedRecords, "workflow.id")',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '045b84e1-d67e-5ba8-a9d1-1fd3633afe01',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT_EMPTY,
          subFieldName: 'workflow.id',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.workflowVersion.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.SEE_WORKFLOW_WORKFLOW_VERSION,
    hotKeys: null,
  },
  useAsDraftWorkflowVersion: {
    universalIdentifier: '483c0c1d-ea4d-4a4d-8a59-2dcf9f8e38f6',
    label: i18nLabel(
      msg({ message: `Use as Draft`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconPencil',
    isPinned: true,
    position: 39,
    shortLabel: i18nLabel(
      msg({ message: `Use as Draft`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'noneEquals(selectedRecords, "status", "DRAFT")',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '7bf58db2-b61d-5a32-bede-c2e272e38840',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'status',
          value: '"DRAFT"',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.workflowVersion.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.USE_AS_DRAFT_WORKFLOW_VERSION,
    hotKeys: null,
  },
  seeVersionsWorkflowVersion: {
    universalIdentifier: '1d4abeb7-2750-4af7-9a92-fbadd2a9e4ba',
    label: i18nLabel(
      msg({
        message: `See Versions History`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconVersions',
    isPinned: false,
    position: 40,
    shortLabel: i18nLabel(
      msg({ message: `See Versions`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'everyDefined(selectedRecords, "workflow")',
    conditionalAvailability: {
      recordFilters: [
        {
          id: 'a20750ba-20b5-554b-ac64-ead1a7832009',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT_EMPTY,
          subFieldName: 'workflow',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.workflowVersion.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.SEE_VERSIONS_WORKFLOW_VERSION,
    hotKeys: null,
  },
  searchRecords: {
    universalIdentifier: 'fa24e25e-68f8-4548-82ff-c7b5168b7c7d',
    label: i18nLabel(
      msg({ message: `Search`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconSearch',
    isPinned: false,
    position: 41,
    shortLabel: i18nLabel(
      msg({ message: `Search`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL,
    conditionalAvailabilityExpression: null,
    conditionalAvailability: null,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.SEARCH_RECORDS,
    hotKeys: ['/'],
  },
  searchRecordsFallback: {
    universalIdentifier: 'c659890c-7266-46c9-bfe1-75cefff8b6d0',
    label: i18nLabel(
      msg({ message: `Search`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconSearch',
    isPinned: false,
    position: 42,
    shortLabel: i18nLabel(
      msg({ message: `Search`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.FALLBACK,
    conditionalAvailabilityExpression: null,
    conditionalAvailability: null,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.SEARCH_RECORDS_FALLBACK,
    hotKeys: ['/'],
  },
  askAi: {
    universalIdentifier: 'ce5fb54d-2b19-4dd1-b7b4-9532a1761a41',
    label: i18nLabel(
      msg({ message: `Ask AI`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconMessageCirclePlus',
    isPinned: true,
    position: 43,
    shortLabel: null,
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL,
    conditionalAvailabilityExpression:
      'permissionFlags.AI and not isInSidePanel and objectMetadataItem.nameSingular != "agentChatThread"',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '8c8038fe-f9ab-5125-930d-12b91e10a432',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'AI',
          value: 'true',
        },
        {
          id: '5a5c8642-bfa6-5c21-8693-1673f91621ba',
          contextKey: 'isInSidePanel',
          operand: ViewFilterOperand.IS,
          value: 'false',
        },
        {
          id: 'd171285a-a7e7-5a0f-ba45-ea065731034d',
          contextKey: 'objectMetadataItem',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'nameSingular',
          value: '["agentChatThread"]',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.ASK_AI,
    hotKeys: ['@'],
  },
  viewPreviousAiChats: {
    universalIdentifier: '3084c3c9-cc23-4dad-9e00-92025f5cba7a',
    label: i18nLabel(
      msg({
        message: `Open chat`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconMessage',
    isPinned: false,
    position: 44,
    shortLabel: i18nLabel(
      msg({
        message: `Open chat`,
        context: 'commandMenuItem.shortLabel',
      }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL,
    conditionalAvailabilityExpression: 'permissionFlags.AI',
    conditionalAvailability: {
      recordFilters: [
        {
          id: 'afc05440-4386-5b1b-84ad-c381d7b587c0',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'AI',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.VIEW_PREVIOUS_AI_CHATS,
    hotKeys: null,
  },
  newAiChat: {
    universalIdentifier: '604bc9b2-e438-4572-bd35-726fa0fb2ec7',
    label: i18nLabel(
      msg({ message: `New chat`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconMessageCirclePlus',
    isPinned: true,
    position: 43,
    shortLabel: i18nLabel(
      msg({ message: `New chat`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL,
    conditionalAvailabilityExpression: 'permissionFlags.AI',
    conditionalAvailability: {
      recordFilters: [
        {
          id: 'afc05440-4386-5b1b-84ad-c381d7b587c0',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'AI',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    conditionalPinnedExpression:
      'pageType == "RECORD_PAGE" and objectMetadataItem.nameSingular == "agentChatThread" and not isInSidePanel',
    conditionalPinned: {
      recordFilters: [
        {
          id: '4684c8b1-8266-5e3a-87b6-33c17d956ec5',
          contextKey: 'pageType',
          operand: ViewFilterOperand.IS,
          value: '["RECORD_PAGE"]',
        },
        {
          id: '89522170-9fb1-59cf-b6b3-3b8e488ce8dc',
          contextKey: 'objectMetadataItem',
          operand: ViewFilterOperand.IS,
          subFieldName: 'nameSingular',
          value: '["agentChatThread"]',
        },
        {
          id: '9c875df4-0641-56c5-bd2c-ad2deb63a1b8',
          contextKey: 'isInSidePanel',
          operand: ViewFilterOperand.IS,
          value: 'false',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.NEW_AI_CHAT,
    hotKeys: null,
  },
  shareRecord: {
    universalIdentifier: 'b9336f9f-d10c-42c0-b7cd-40c94ae235ef',
    label: i18nLabel(
      msg({
        message: `Share {objectLabelSingular}`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconShare',
    isPinned: false,
    position: 3,
    shortLabel: i18nLabel(
      msg({ message: `Share`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords == 1 and noneDefined(selectedRecords, "deletedAt")',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '05a4bf32-444d-51c6-a702-8274d8c71173',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.IS,
          value: '1',
        },
        {
          id: '1f028c27-934e-518b-9668-16413de17446',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.agentChatThread.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.SHARE_RECORD,
    hotKeys: null,
  },
  markAiChatAsRead: {
    universalIdentifier: '094d0b1f-91db-4e9a-ae8e-eed425b788b4',
    label: i18nLabel(
      msg({ message: `Mark as read`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconEye',
    isPinned: false,
    position: 73,
    shortLabel: i18nLabel(
      msg({ message: `Mark as read`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords >= 1 and permissionFlags.AI and featureFlags.IS_AI_CHAT_INBOX_ENABLED and noneDefined(selectedRecords, "deletedAt") and every(selectedRecords, "inboxStatus.isUnread")',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '95c54f55-a47c-5ecb-b708-7e761a48285d',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.GREATER_THAN_OR_EQUAL,
          value: '1',
        },
        {
          id: '04460dda-5d50-533e-8e1b-a6987c27fbee',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'AI',
          value: 'true',
        },
        {
          id: '88a7bbb3-bec3-52b5-8988-f94acd0ba827',
          contextKey: 'featureFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'IS_AI_CHAT_INBOX_ENABLED',
          value: 'true',
        },
        {
          id: 'e0118054-2527-5856-b312-b7b583f820a1',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
        {
          id: '404803b8-b72d-56b9-9f11-f41c542b7d31',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'inboxStatus.isUnread',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.agentChatThread.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.MARK_AI_CHAT_AS_READ,
    hotKeys: null,
  },
  markAiChatAsUnread: {
    universalIdentifier: '3a7762aa-2090-4113-85a6-f41295b9aed6',
    label: i18nLabel(
      msg({ message: `Mark as unread`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconEyeOff',
    isPinned: false,
    position: 74,
    shortLabel: i18nLabel(
      msg({ message: `Mark as unread`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords >= 1 and permissionFlags.AI and featureFlags.IS_AI_CHAT_INBOX_ENABLED and noneDefined(selectedRecords, "deletedAt") and everyEquals(selectedRecords, "inboxStatus.isUnread", false)',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '853773b0-abb4-55ae-acb4-d000901e0b30',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.GREATER_THAN_OR_EQUAL,
          value: '1',
        },
        {
          id: '5ff8a8c7-29f4-5965-96d2-bc2d2956edc2',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'AI',
          value: 'true',
        },
        {
          id: '1df8422b-a332-508c-bfa5-abd265c95dcd',
          contextKey: 'featureFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'IS_AI_CHAT_INBOX_ENABLED',
          value: 'true',
        },
        {
          id: 'fee08ec1-02e1-5dd6-bf5b-04357930e8b9',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
        {
          id: 'f27755b6-8d85-51ec-8c94-f7ddb7a8632d',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'inboxStatus.isUnread',
          value: 'false',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.agentChatThread.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.MARK_AI_CHAT_AS_UNREAD,
    hotKeys: null,
  },
  markAiChatAsDone: {
    universalIdentifier: 'be18e927-4873-496d-bc12-b767b995653f',
    label: i18nLabel(
      msg({ message: `Mark as done`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconCheck',
    isPinned: true,
    position: 75,
    shortLabel: i18nLabel(
      msg({ message: `Done`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords >= 1 and permissionFlags.AI and featureFlags.IS_AI_CHAT_INBOX_ENABLED and noneDefined(selectedRecords, "deletedAt") and everyEquals(selectedRecords, "inboxStatus.scope", "INBOX")',
    conditionalAvailability: {
      recordFilters: [
        {
          id: 'a92fb117-91e4-5fb6-8c7f-7fad51b884ad',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.GREATER_THAN_OR_EQUAL,
          value: '1',
        },
        {
          id: '7aa16418-e41b-5e96-b420-292f6472d4e3',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'AI',
          value: 'true',
        },
        {
          id: 'd9d800e0-c6fe-538c-bf6e-dc459519e967',
          contextKey: 'featureFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'IS_AI_CHAT_INBOX_ENABLED',
          value: 'true',
        },
        {
          id: '53649bf4-40e2-5fc4-a103-f6f7f0e12393',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
        {
          id: 'bdeb7b6e-75b2-5576-b138-dabc8fd864f1',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'inboxStatus.scope',
          value: '"INBOX"',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.agentChatThread.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.MARK_AI_CHAT_AS_DONE,
    hotKeys: ['E'],
  },
  reopenAiChat: {
    universalIdentifier: 'c3166829-0e0e-4821-9851-de5cf18945f3',
    label: i18nLabel(
      msg({ message: `Reopen`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconCircleDashed',
    isPinned: true,
    position: 76,
    shortLabel: i18nLabel(
      msg({ message: `Reopen`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords >= 1 and permissionFlags.AI and featureFlags.IS_AI_CHAT_INBOX_ENABLED and noneDefined(selectedRecords, "deletedAt") and everyEquals(selectedRecords, "inboxStatus.scope", "ARCHIVED")',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '1da37393-2127-532d-8860-330d439b3d3e',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.GREATER_THAN_OR_EQUAL,
          value: '1',
        },
        {
          id: '41a63404-74fb-5279-b624-fb529c0fd691',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'AI',
          value: 'true',
        },
        {
          id: '033d4163-6129-55bd-90a7-782d75216cbe',
          contextKey: 'featureFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'IS_AI_CHAT_INBOX_ENABLED',
          value: 'true',
        },
        {
          id: 'a567793e-b7da-5f1c-bc04-a41ca9e195d7',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
        {
          id: '89431652-9eef-5c52-8bf2-b5f84e9cfb3b',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'inboxStatus.scope',
          value: '"ARCHIVED"',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.agentChatThread.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.REOPEN_AI_CHAT,
    hotKeys: ['E'],
  },
  unsnoozeAiChat: {
    universalIdentifier: '0fdab734-1e64-498d-8d3b-606e7f64d224',
    label: i18nLabel(
      msg({ message: `Unsnooze`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconZzzOff',
    isPinned: true,
    position: 76,
    shortLabel: i18nLabel(
      msg({ message: `Unsnooze`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords >= 1 and permissionFlags.AI and featureFlags.IS_AI_CHAT_INBOX_ENABLED and noneDefined(selectedRecords, "deletedAt") and everyEquals(selectedRecords, "inboxStatus.scope", "SNOOZED")',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '64404efc-bad2-5f59-a921-4987ad45f293',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.GREATER_THAN_OR_EQUAL,
          value: '1',
        },
        {
          id: 'c56cc21f-12b1-50d3-a365-d1be50177489',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'AI',
          value: 'true',
        },
        {
          id: '698b8f3a-6607-57dc-b929-b182f610dff9',
          contextKey: 'featureFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'IS_AI_CHAT_INBOX_ENABLED',
          value: 'true',
        },
        {
          id: '1c152a38-8fd4-585c-92ff-b321787c5be2',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
        {
          id: '357724c2-c26f-5c14-b04c-3a358582a265',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'inboxStatus.scope',
          value: '"SNOOZED"',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.agentChatThread.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.REOPEN_AI_CHAT,
    hotKeys: ['E'],
  },
  snoozeAiChat: {
    universalIdentifier: '9fbb747d-2e09-4822-a1e5-6792d0a28fb7',
    label: i18nLabel(
      msg({ message: `Snooze`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconZzz',
    isPinned: true,
    position: 77,
    shortLabel: i18nLabel(
      msg({ message: `Snooze`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords >= 1 and permissionFlags.AI and featureFlags.IS_AI_CHAT_INBOX_ENABLED and noneDefined(selectedRecords, "deletedAt") and everyDefined(selectedRecords, "inboxStatus") and noneEquals(selectedRecords, "inboxStatus.scope", "SNOOZED")',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '007c20f6-4678-5a75-bd2e-5c7705e6fee9',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.GREATER_THAN_OR_EQUAL,
          value: '1',
        },
        {
          id: 'ab52d416-890a-589a-9612-0fa3896e198f',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'AI',
          value: 'true',
        },
        {
          id: '1ad96fa6-6f09-5aa1-8a24-b1ad8b60b303',
          contextKey: 'featureFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'IS_AI_CHAT_INBOX_ENABLED',
          value: 'true',
        },
        {
          id: '5e0b2718-1826-594c-86f4-becf51cb2f37',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
        {
          id: 'b932f9eb-f0ac-5605-a0c7-3c5b6b963b10',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT_EMPTY,
          subFieldName: 'inboxStatus',
        },
        {
          id: '0c4ca071-0f22-50a5-aef1-6c6f4defe1cd',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'inboxStatus.scope',
          value: '"SNOOZED"',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.agentChatThread.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.SNOOZE_AI_CHAT,
    hotKeys: ['H'],
  },
  subscribeToAiChat: {
    universalIdentifier: 'bf5345f0-14d3-438b-ab02-1daa5386743f',
    label: i18nLabel(
      msg({ message: `Subscribe`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconBell',
    isPinned: false,
    position: 78,
    shortLabel: i18nLabel(
      msg({ message: `Subscribe`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords >= 1 and permissionFlags.AI and featureFlags.IS_AI_CHAT_INBOX_ENABLED and noneDefined(selectedRecords, "deletedAt") and everyEquals(selectedRecords, "inboxStatus.isSubscribed", false)',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '12928afd-d09a-5e3a-b4da-9a97de16e9e5',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.GREATER_THAN_OR_EQUAL,
          value: '1',
        },
        {
          id: '962be05b-0f4a-5103-b6e5-9d44210b5fda',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'AI',
          value: 'true',
        },
        {
          id: 'e1418927-b741-5fe6-a386-3972882e51fa',
          contextKey: 'featureFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'IS_AI_CHAT_INBOX_ENABLED',
          value: 'true',
        },
        {
          id: '58b7fb02-b5c5-5021-b2df-94797e2d57ae',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
        {
          id: 'd9afff0a-4de0-5b59-a7c2-8755a0cbc5c3',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'inboxStatus.isSubscribed',
          value: 'false',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.agentChatThread.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.SUBSCRIBE_TO_AI_CHAT,
    hotKeys: null,
  },
  unsubscribeFromAiChat: {
    universalIdentifier: '31dbf857-d442-447a-be76-e4eb8ef34fcf',
    label: i18nLabel(
      msg({ message: `Unsubscribe`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconBellOff',
    isPinned: false,
    position: 79,
    shortLabel: i18nLabel(
      msg({ message: `Unsubscribe`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords >= 1 and permissionFlags.AI and featureFlags.IS_AI_CHAT_INBOX_ENABLED and noneDefined(selectedRecords, "deletedAt") and everyEquals(selectedRecords, "inboxStatus.isSubscribed", true) and noneEquals(selectedRecords, "inboxStatus.isAssignedToMe", true)',
    conditionalAvailability: {
      recordFilters: [
        {
          id: 'a99ca67f-d1bb-5314-8cdd-cd1138be03c7',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.GREATER_THAN_OR_EQUAL,
          value: '1',
        },
        {
          id: '435b6a21-4518-55a8-bc71-d1fff4cf4cf1',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'AI',
          value: 'true',
        },
        {
          id: '8a703288-177d-530c-af40-cff7de736908',
          contextKey: 'featureFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'IS_AI_CHAT_INBOX_ENABLED',
          value: 'true',
        },
        {
          id: 'c0fd757e-aa15-59a6-b95b-a4ea749dbf91',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
        {
          id: 'fc36ec99-42a0-5d87-8063-c57956477a80',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'inboxStatus.isSubscribed',
          value: 'true',
        },
        {
          id: 'fa89b8a6-cb63-5009-954b-18859e78d63c',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'inboxStatus.isAssignedToMe',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.agentChatThread.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.UNSUBSCRIBE_FROM_AI_CHAT,
    hotKeys: null,
  },
  assignAiChat: {
    universalIdentifier: '8e5a5bf5-fc62-4fe8-a419-a01051306668',
    label: i18nLabel(
      msg({ message: `Assign`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconUsers',
    isPinned: true,
    position: 80,
    shortLabel: i18nLabel(
      msg({ message: `Assign`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords >= 1 and permissionFlags.AI and featureFlags.IS_AI_CHAT_INBOX_ENABLED and noneDefined(selectedRecords, "deletedAt") and noneEquals(selectedRecords, "recordPermissions.canUpdate", false)',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '60df2fd6-92e3-557b-b396-a7b74c41ac13',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.GREATER_THAN_OR_EQUAL,
          value: '1',
        },
        {
          id: '44de86df-252d-5ef1-a0aa-7590524a4c2b',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'AI',
          value: 'true',
        },
        {
          id: '5632450a-3dd6-51f2-95d0-1d847c5421bd',
          contextKey: 'featureFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'IS_AI_CHAT_INBOX_ENABLED',
          value: 'true',
        },
        {
          id: '878d42ea-aa23-519a-bd01-faedf66d3f76',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
        {
          id: 'af10ecb8-9136-5f29-a86d-aaaec0b64205',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_NOT,
          subFieldName: 'recordPermissions.canUpdate',
          value: 'false',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.agentChatThread.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.ASSIGN_AI_CHAT,
    hotKeys: ['A'],
  },
  // Chats have their own Share item; it is a system object, so this one never shows there
  shareAnyRecord: {
    universalIdentifier: '1e703e2c-9f3a-4a23-8448-107b01be509c',
    label: i18nLabel(
      msg({
        message: `Share {objectLabelSingular}`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconShare',
    isPinned: false,
    position: 3,
    shortLabel: i18nLabel(
      msg({ message: `Share`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords == 1 and featureFlags.IS_RECORD_LEVEL_SHARING_ENABLED and not objectMetadataItem.isSystem and noneDefined(selectedRecords, "deletedAt")',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '1013aef2-9abe-5f12-8248-ba4a90d00230',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.IS,
          value: '1',
        },
        {
          id: 'd38e3d73-3e18-5efc-855c-259a58b49365',
          contextKey: 'featureFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'IS_RECORD_LEVEL_SHARING_ENABLED',
          value: 'true',
        },
        {
          id: 'd1e45727-9003-5551-8886-db77b78d2dbf',
          contextKey: 'objectMetadataItem',
          operand: ViewFilterOperand.IS,
          subFieldName: 'isSystem',
          value: 'false',
        },
        {
          id: 'd4525c33-480f-5238-9ade-a907463876e4',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.SHARE_RECORD,
    hotKeys: null,
  },
  replyToEmailThread: {
    universalIdentifier: '8f015cbd-c764-434e-a6c6-bb7581b4be44',
    label: i18nLabel(
      msg({ message: `Reply`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconArrowBackUp',
    isPinned: true,
    position: 45,
    shortLabel: i18nLabel(
      msg({ message: `Reply`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression: 'numberOfSelectedRecords == 1',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '7cfa5a0c-74b8-5a51-86c7-30569681ac76',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.IS,
          value: '1',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.messageThread.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.REPLY_TO_EMAIL_THREAD,
    hotKeys: null,
  },
  composeEmail: {
    universalIdentifier: '96457c5a-b028-4d48-94e3-27f4c41296b8',
    label: i18nLabel(
      msg({ message: `Compose Email`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconMail',
    isPinned: false,
    position: 46,
    shortLabel: i18nLabel(
      msg({ message: `Compose`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL,
    conditionalAvailabilityExpression: 'permissionFlags.SEND_EMAIL_TOOL',
    conditionalAvailability: {
      recordFilters: [
        {
          id: 'f70ffa4a-c8e1-5c1e-97b8-d13848cc9be4',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'SEND_EMAIL_TOOL',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.COMPOSE_EMAIL,
    hotKeys: null,
  },
  composeCampaign: {
    universalIdentifier: '30473656-e7cb-42e0-b198-6c4e8b906106',
    label: i18nLabel(
      msg({ message: `Compose Campaign`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconSend',
    isPinned: false,
    position: 66,
    shortLabel: i18nLabel(
      msg({ message: `Campaign`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL,
    conditionalAvailabilityExpression: null,
    conditionalAvailability: null,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.COMPOSE_CAMPAIGN,
    hotKeys: null,
  },
  composeCampaignPinned: {
    universalIdentifier: '7ad6f0c7-ac02-4062-b5cf-1f36e1664bc8',
    label: i18nLabel(
      msg({ message: `Create Campaign`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconPlus',
    isPinned: true,
    position: 67,
    shortLabel: i18nLabel(
      msg({ message: `Create`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL_OBJECT_CONTEXT,
    conditionalAvailabilityExpression: 'pageType == "INDEX_PAGE"',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '5871ac47-aeee-570d-8c84-e4d95d37ec9c',
          contextKey: 'pageType',
          operand: ViewFilterOperand.IS,
          value: '["INDEX_PAGE"]',
        },
      ],
    } satisfies ConditionalDisplay,
    conditionalPinnedExpression: 'numberOfSelectedRecords == 0',
    conditionalPinned: {
      recordFilters: [
        {
          id: 'eb320d5e-0d23-57f8-a05d-f7f8972f1f52',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.IS,
          value: '0',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.messageCampaign.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.COMPOSE_CAMPAIGN,
    hotKeys: null,
  },
  sendMessageCampaign: {
    universalIdentifier: 'b08f4ccd-070b-460f-a4b6-6d0c14f1c44d',
    label: i18nLabel(
      msg({ message: `Send Campaign`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconSend',
    isPinned: true,
    position: 68,
    shortLabel: i18nLabel(
      msg({ message: `Send`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords == 1 and (everyEquals(selectedRecords, "status", "DRAFT") or everyEquals(selectedRecords, "status", "SCHEDULED")) and noneDefined(selectedRecords, "deletedAt")',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '9b7a5651-9b18-5445-ac20-124bc62e7bb7',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.IS,
          value: '1',
          recordFilterGroupId: '55c7aa9e-2838-570b-8fc9-3091f4e36395',
          positionInRecordFilterGroup: 0,
        },
        {
          id: '458e1a9b-2b31-5a73-ba62-c0269606de97',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'status',
          value: '"DRAFT"',
          recordFilterGroupId: 'bae2535a-309a-50d7-88f7-c7cc6bfdcf31',
          positionInRecordFilterGroup: 0,
        },
        {
          id: '902b4b95-77e2-59b9-bb74-8dd35db15621',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'status',
          value: '"SCHEDULED"',
          recordFilterGroupId: 'bae2535a-309a-50d7-88f7-c7cc6bfdcf31',
          positionInRecordFilterGroup: 1,
        },
        {
          id: '83d65bba-fb6e-51e0-8150-ce6ca715be26',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
          recordFilterGroupId: '55c7aa9e-2838-570b-8fc9-3091f4e36395',
          positionInRecordFilterGroup: 2,
        },
      ],
      recordFilterGroups: [
        {
          id: '55c7aa9e-2838-570b-8fc9-3091f4e36395',
          logicalOperator: RecordFilterGroupLogicalOperator.AND,
        },
        {
          id: 'bae2535a-309a-50d7-88f7-c7cc6bfdcf31',
          logicalOperator: RecordFilterGroupLogicalOperator.OR,
          parentRecordFilterGroupId: '55c7aa9e-2838-570b-8fc9-3091f4e36395',
          positionInRecordFilterGroup: 1,
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.messageCampaign.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.SEND_MESSAGE_CAMPAIGN,
    hotKeys: null,
  },
  sendMessageCampaignTest: {
    universalIdentifier: 'a6e6fd08-2c75-4d43-8795-1baafbac165e',
    label: i18nLabel(
      msg({ message: `Send Test Email`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconMail',
    isPinned: true,
    position: 69,
    shortLabel: i18nLabel(
      msg({ message: `Test`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords == 1 and (everyEquals(selectedRecords, "status", "DRAFT") or everyEquals(selectedRecords, "status", "SCHEDULED")) and noneDefined(selectedRecords, "deletedAt")',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '9b7a5651-9b18-5445-ac20-124bc62e7bb7',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.IS,
          value: '1',
          recordFilterGroupId: '55c7aa9e-2838-570b-8fc9-3091f4e36395',
          positionInRecordFilterGroup: 0,
        },
        {
          id: '458e1a9b-2b31-5a73-ba62-c0269606de97',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'status',
          value: '"DRAFT"',
          recordFilterGroupId: 'bae2535a-309a-50d7-88f7-c7cc6bfdcf31',
          positionInRecordFilterGroup: 0,
        },
        {
          id: '902b4b95-77e2-59b9-bb74-8dd35db15621',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'status',
          value: '"SCHEDULED"',
          recordFilterGroupId: 'bae2535a-309a-50d7-88f7-c7cc6bfdcf31',
          positionInRecordFilterGroup: 1,
        },
        {
          id: '83d65bba-fb6e-51e0-8150-ce6ca715be26',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
          recordFilterGroupId: '55c7aa9e-2838-570b-8fc9-3091f4e36395',
          positionInRecordFilterGroup: 2,
        },
      ],
      recordFilterGroups: [
        {
          id: '55c7aa9e-2838-570b-8fc9-3091f4e36395',
          logicalOperator: RecordFilterGroupLogicalOperator.AND,
        },
        {
          id: 'bae2535a-309a-50d7-88f7-c7cc6bfdcf31',
          logicalOperator: RecordFilterGroupLogicalOperator.OR,
          parentRecordFilterGroupId: '55c7aa9e-2838-570b-8fc9-3091f4e36395',
          positionInRecordFilterGroup: 1,
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.messageCampaign.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.SEND_MESSAGE_CAMPAIGN_TEST,
    hotKeys: null,
  },
  cancelMessageCampaign: {
    universalIdentifier: 'b266ca2d-f6bb-4c45-aace-a44d5099f6af',
    label: i18nLabel(
      msg({ message: `Cancel Campaign`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconX',
    isPinned: true,
    position: 71,
    shortLabel: i18nLabel(
      msg({ message: `Cancel`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords == 1 and (everyEquals(selectedRecords, "status", "SCHEDULED") or everyEquals(selectedRecords, "status", "SENDING")) and noneDefined(selectedRecords, "deletedAt")',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '0c7499f4-d076-51e5-a3f9-325d8b4d327a',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.IS,
          value: '1',
          recordFilterGroupId: 'c3d465b7-af1f-5e3a-afa5-8249da8be67a',
          positionInRecordFilterGroup: 0,
        },
        {
          id: '59eb35fc-5b58-5912-a095-87e081607808',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'status',
          value: '"SCHEDULED"',
          recordFilterGroupId: '06024f9b-ab74-5f5f-b01c-7ad8841d1a7a',
          positionInRecordFilterGroup: 0,
        },
        {
          id: '6b31495f-51fb-5864-9b9f-3baebd429333',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'status',
          value: '"SENDING"',
          recordFilterGroupId: '06024f9b-ab74-5f5f-b01c-7ad8841d1a7a',
          positionInRecordFilterGroup: 1,
        },
        {
          id: '4700f0ce-7042-5b26-a27a-b24ea3fcaa3e',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
          recordFilterGroupId: 'c3d465b7-af1f-5e3a-afa5-8249da8be67a',
          positionInRecordFilterGroup: 2,
        },
      ],
      recordFilterGroups: [
        {
          id: 'c3d465b7-af1f-5e3a-afa5-8249da8be67a',
          logicalOperator: RecordFilterGroupLogicalOperator.AND,
        },
        {
          id: '06024f9b-ab74-5f5f-b01c-7ad8841d1a7a',
          logicalOperator: RecordFilterGroupLogicalOperator.OR,
          parentRecordFilterGroupId: 'c3d465b7-af1f-5e3a-afa5-8249da8be67a',
          positionInRecordFilterGroup: 1,
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.messageCampaign.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.CANCEL_MESSAGE_CAMPAIGN,
    hotKeys: null,
  },
  duplicateMessageCampaign: {
    universalIdentifier: 'b85e34bd-abfa-40b5-91c0-e5d64b586341',
    label: i18nLabel(
      msg({ message: `Duplicate Campaign`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconCopy',
    isPinned: true,
    position: 72,
    shortLabel: i18nLabel(
      msg({ message: `Duplicate`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords == 1 and noneDefined(selectedRecords, "deletedAt") and objectPermissions.canUpdateObjectRecords',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '8d3f71fb-3846-5a66-bd6c-7eed9162361b',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.IS,
          value: '1',
        },
        {
          id: '2fad89d4-22d1-5307-ae4c-c8b3c31c1925',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
        {
          id: '74b3f128-cd78-5637-92bc-d633f6830fe3',
          contextKey: 'objectPermissions',
          operand: ViewFilterOperand.IS,
          subFieldName: 'canUpdateObjectRecords',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    // Pinned only on sent campaigns, the ones people re-run; drafts keep it in the menu
    conditionalPinnedExpression:
      'everyEquals(selectedRecords, "status", "SENT")',
    conditionalPinned: {
      recordFilters: [
        {
          id: 'bf375b02-e2c9-565c-b5a1-bac15ed6b5ba',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'status',
          value: '"SENT"',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.messageCampaign.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.DUPLICATE_MESSAGE_CAMPAIGN,
    hotKeys: null,
  },
  emailBlockSettings: {
    universalIdentifier: '5c8a2f41-97be-4f3d-9a46-2f18d17f30a2',
    label: i18nLabel(
      msg({ message: `Add Block`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconPlus',
    isPinned: true,
    position: 70,
    shortLabel: i18nLabel(
      msg({ message: `Add Block`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'pageType == "RECORD_PAGE" and numberOfSelectedRecords == 1 and everyEquals(selectedRecords, "status", "DRAFT") and noneDefined(selectedRecords, "deletedAt")',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '89cf8b80-4186-549d-a89f-94871f172f76',
          contextKey: 'pageType',
          operand: ViewFilterOperand.IS,
          value: '["RECORD_PAGE"]',
        },
        {
          id: '3582f223-88c5-5711-9ca3-f74540eb30d1',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.IS,
          value: '1',
        },
        {
          id: 'a14fc14d-3c96-5ca7-8ec8-7483fc4015e7',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'status',
          value: '"DRAFT"',
        },
        {
          id: '061cc873-5732-57d0-9226-fd6bb0754180',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.messageCampaign.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.EMAIL_BLOCK_SETTINGS,
    hotKeys: null,
  },
  emailPageStyle: {
    universalIdentifier: 'c1c2d63f-7ec3-46aa-8a79-414cefb42705',
    label: i18nLabel(
      msg({ message: `Email Style`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconPaint',
    isPinned: false,
    position: 70.5,
    shortLabel: i18nLabel(
      msg({ message: `Email Style`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'pageType == "RECORD_PAGE" and numberOfSelectedRecords == 1 and everyEquals(selectedRecords, "status", "DRAFT") and noneDefined(selectedRecords, "deletedAt")',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '89cf8b80-4186-549d-a89f-94871f172f76',
          contextKey: 'pageType',
          operand: ViewFilterOperand.IS,
          value: '["RECORD_PAGE"]',
        },
        {
          id: '3582f223-88c5-5711-9ca3-f74540eb30d1',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.IS,
          value: '1',
        },
        {
          id: 'a14fc14d-3c96-5ca7-8ec8-7483fc4015e7',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS,
          subFieldName: 'status',
          value: '"DRAFT"',
        },
        {
          id: '061cc873-5732-57d0-9226-fd6bb0754180',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.messageCampaign.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.EMAIL_PAGE_STYLE,
    hotKeys: null,
  },
  goToSettings: {
    universalIdentifier: 'ef9aba44-0068-453e-930a-f8c182af18ee',
    label: i18nLabel(
      msg({ message: `Go to Settings`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconSettings',
    isPinned: false,
    position: 47,
    shortLabel: i18nLabel(
      msg({ message: `Settings`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL,
    conditionalAvailabilityExpression: null,
    conditionalAvailability: null,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.NAVIGATION,
    hotKeys: ['G', 'S'],
    payload: { path: '/settings/profile' },
  },
  goToSettingsExperience: {
    universalIdentifier: 'bceb0328-c018-48ba-80d8-a1a97dc0a8ba',
    label: i18nLabel(
      msg({
        message: `Go to Experience Settings`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconColorSwatch',
    isPinned: false,
    position: 48,
    shortLabel: i18nLabel(
      msg({ message: `Experience`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL,
    conditionalAvailabilityExpression: null,
    conditionalAvailability: null,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.NAVIGATION,
    hotKeys: null,
    payload: { path: '/settings/experience' },
  },
  goToSettingsAccounts: {
    universalIdentifier: '447a65cc-8535-408e-9c48-db24affb7530',
    label: i18nLabel(
      msg({
        message: `Go to Accounts Settings`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconAt',
    isPinned: false,
    position: 49,
    shortLabel: i18nLabel(
      msg({ message: `Accounts`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL,
    conditionalAvailabilityExpression: 'permissionFlags.CONNECTED_ACCOUNTS',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '90b8a995-600a-5ef5-b7ec-c6608be8b792',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'CONNECTED_ACCOUNTS',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.NAVIGATION,
    hotKeys: null,
    payload: { path: '/settings/accounts' },
  },
  goToSettingsAccountsEmails: {
    universalIdentifier: '4feab22c-165f-4d13-81ca-c9eb6082ca50',
    label: i18nLabel(
      msg({
        message: `Go to Emails Settings`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconMail',
    isPinned: false,
    position: 50,
    shortLabel: i18nLabel(
      msg({ message: `Emails`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL,
    conditionalAvailabilityExpression: 'permissionFlags.CONNECTED_ACCOUNTS',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '90b8a995-600a-5ef5-b7ec-c6608be8b792',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'CONNECTED_ACCOUNTS',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.NAVIGATION,
    hotKeys: null,
    payload: { path: '/settings/accounts/emails' },
  },
  goToSettingsAccountsCalendars: {
    universalIdentifier: '3267ec0e-9dee-4d9b-8f1b-6005bfd90202',
    label: i18nLabel(
      msg({
        message: `Go to Calendars Settings`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconCalendarEvent',
    isPinned: false,
    position: 51,
    shortLabel: i18nLabel(
      msg({ message: `Calendars`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL,
    conditionalAvailabilityExpression: 'permissionFlags.CONNECTED_ACCOUNTS',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '90b8a995-600a-5ef5-b7ec-c6608be8b792',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'CONNECTED_ACCOUNTS',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.NAVIGATION,
    hotKeys: null,
    payload: { path: '/settings/accounts/calendars' },
  },
  goToSettingsGeneral: {
    universalIdentifier: 'ad68e516-96ea-455a-a838-c59788e88c23',
    label: i18nLabel(
      msg({
        message: `Go to General Settings`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconSettings',
    isPinned: false,
    position: 52,
    shortLabel: i18nLabel(
      msg({ message: `General`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL,
    conditionalAvailabilityExpression: 'permissionFlags.WORKSPACE',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '4d702d95-51fe-52e2-9f09-cd515d314f15',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'WORKSPACE',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.NAVIGATION,
    hotKeys: null,
    payload: { path: '/settings/general' },
  },
  goToSettingsObjects: {
    universalIdentifier: '9302bfeb-f6cd-4858-ab5b-5f70f4d358c4',
    label: i18nLabel(
      msg({
        message: `Go to Data Model Settings`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconHierarchy',
    isPinned: false,
    position: 53,
    shortLabel: i18nLabel(
      msg({ message: `Data Model`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL,
    conditionalAvailabilityExpression: 'permissionFlags.DATA_MODEL',
    conditionalAvailability: {
      recordFilters: [
        {
          id: 'd598aef4-3086-58ff-a69a-7330e5489f95',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'DATA_MODEL',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.NAVIGATION,
    hotKeys: null,
    payload: { path: '/settings/objects' },
  },
  goToSettingsMembers: {
    universalIdentifier: 'fb4d9f1b-5b13-49d9-8353-80041719d411',
    label: i18nLabel(
      msg({
        message: `Go to Members Settings`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconUsers',
    isPinned: false,
    position: 54,
    shortLabel: i18nLabel(
      msg({ message: `Members`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL,
    conditionalAvailabilityExpression: 'permissionFlags.WORKSPACE_MEMBERS',
    conditionalAvailability: {
      recordFilters: [
        {
          id: 'c8766b81-74eb-5453-8ff8-8700ec50fba5',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'WORKSPACE_MEMBERS',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.NAVIGATION,
    hotKeys: null,
    payload: { path: '/settings/members' },
  },
  goToSettingsRoles: {
    universalIdentifier: '4050f307-c592-4c9f-ad91-89cde330fbf7',
    label: i18nLabel(
      msg({
        message: `Go to Roles Settings`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconLock',
    isPinned: false,
    position: 55,
    shortLabel: i18nLabel(
      msg({ message: `Roles`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL,
    conditionalAvailabilityExpression: 'permissionFlags.WORKSPACE_MEMBERS',
    conditionalAvailability: {
      recordFilters: [
        {
          id: 'c8766b81-74eb-5453-8ff8-8700ec50fba5',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'WORKSPACE_MEMBERS',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.NAVIGATION,
    hotKeys: null,
    payload: { path: '/settings/members#roles' },
  },
  goToSettingsDomains: {
    universalIdentifier: '2d071684-fb5e-4222-b560-4c7ab2597fb4',
    label: i18nLabel(
      msg({
        message: `Go to Domains Settings`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconWorld',
    isPinned: false,
    position: 56,
    shortLabel: i18nLabel(
      msg({ message: `Domains`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL,
    conditionalAvailabilityExpression: 'permissionFlags.WORKSPACE',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '4d702d95-51fe-52e2-9f09-cd515d314f15',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'WORKSPACE',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.NAVIGATION,
    hotKeys: null,
    payload: { path: '/settings/domains' },
  },
  goToSettingsBilling: {
    universalIdentifier: 'f46a0fb9-14e9-4d48-801d-c33bdd543f74',
    label: i18nLabel(
      msg({
        message: `Go to Billing Settings`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconCreditCard',
    isPinned: false,
    position: 57,
    shortLabel: i18nLabel(
      msg({ message: `Billing`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL,
    conditionalAvailabilityExpression: 'permissionFlags.WORKSPACE',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '4d702d95-51fe-52e2-9f09-cd515d314f15',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'WORKSPACE',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.NAVIGATION,
    hotKeys: null,
    payload: { path: '/settings/billing' },
  },
  goToSettingsApiWebhooks: {
    universalIdentifier: 'ed2c2fde-1e7a-4a42-ba63-221eaa7c9759',
    label: i18nLabel(
      msg({
        message: `Go to Developers Settings`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconCode',
    isPinned: false,
    position: 58,
    shortLabel: i18nLabel(
      msg({ message: `Developers`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL,
    conditionalAvailabilityExpression: 'permissionFlags.API_KEYS_AND_WEBHOOKS',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '38f3959c-0e1c-5e32-83b9-38569107506a',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'API_KEYS_AND_WEBHOOKS',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.NAVIGATION,
    hotKeys: null,
    payload: { path: '/settings/developers' },
  },
  goToSettingsApplications: {
    universalIdentifier: '44db6d7a-79ac-485e-b3da-da8776bd7777',
    label: i18nLabel(
      msg({ message: `Go to Apps Settings`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconApps',
    isPinned: false,
    position: 59,
    shortLabel: i18nLabel(
      msg({ message: `Apps`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL,
    conditionalAvailabilityExpression: 'permissionFlags.APPLICATIONS',
    conditionalAvailability: {
      recordFilters: [
        {
          id: 'cbc7f5a3-3dd7-558b-a526-21f8af5c1417',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'APPLICATIONS',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.NAVIGATION,
    hotKeys: null,
    payload: { path: '/settings/applications' },
  },
  goToSettingsAI: {
    universalIdentifier: '3eaec228-809d-452d-b5ef-7b777398c538',
    label: i18nLabel(
      msg({ message: `Go to AI Settings`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconSparkles',
    isPinned: false,
    position: 60,
    shortLabel: i18nLabel(
      msg({ message: `AI`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL,
    conditionalAvailabilityExpression: 'permissionFlags.WORKSPACE',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '4d702d95-51fe-52e2-9f09-cd515d314f15',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'WORKSPACE',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.NAVIGATION,
    hotKeys: null,
    payload: { path: '/settings/ai' },
  },
  goToSettingsSecurity: {
    universalIdentifier: '358e69b2-0789-44e2-add7-bdef68413be8',
    label: i18nLabel(
      msg({
        message: `Go to Security Settings`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconKey',
    isPinned: false,
    position: 61,
    shortLabel: i18nLabel(
      msg({ message: `Security`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL,
    conditionalAvailabilityExpression: 'permissionFlags.SECURITY',
    conditionalAvailability: {
      recordFilters: [
        {
          id: 'ab2a5cc1-0c77-532b-bf4b-f5c71b37fe20',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'SECURITY',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.NAVIGATION,
    hotKeys: null,
    payload: { path: '/settings/security' },
  },
  goToSettingsAdminPanel: {
    universalIdentifier: 'dd22798b-fca6-42af-ba3b-0d48f263afbd',
    label: i18nLabel(
      msg({
        message: `Go to Admin Panel Settings`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconServer',
    isPinned: false,
    position: 62,
    shortLabel: i18nLabel(
      msg({ message: `Admin Panel`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL,
    conditionalAvailabilityExpression:
      'canImpersonate or canAccessFullAdminPanel',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '63576a44-9e7b-5692-af6a-cf150de0cc7b',
          contextKey: 'canImpersonate',
          operand: ViewFilterOperand.IS,
          value: 'true',
          recordFilterGroupId: 'a924bc67-6040-5706-8b18-db403f8244a3',
          positionInRecordFilterGroup: 0,
        },
        {
          id: 'ce980b89-0eed-5df8-8c51-78f477f9e11c',
          contextKey: 'canAccessFullAdminPanel',
          operand: ViewFilterOperand.IS,
          value: 'true',
          recordFilterGroupId: 'a924bc67-6040-5706-8b18-db403f8244a3',
          positionInRecordFilterGroup: 1,
        },
      ],
      recordFilterGroups: [
        {
          id: 'a924bc67-6040-5706-8b18-db403f8244a3',
          logicalOperator: RecordFilterGroupLogicalOperator.OR,
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.NAVIGATION,
    hotKeys: null,
    payload: { path: '/settings/admin-panel' },
  },
  goToSettingsUpdates: {
    universalIdentifier: '5d1ba354-0090-4a42-9a43-601461b26068',
    label: i18nLabel(
      msg({
        message: `Go to Community Settings`,
        context: 'commandMenuItem.label',
      }),
    ),
    icon: 'IconUsers',
    isPinned: false,
    position: 63,
    shortLabel: i18nLabel(
      msg({ message: `Community`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL,
    conditionalAvailabilityExpression: null,
    conditionalAvailability: null,
    availabilityObjectMetadataUniversalIdentifier: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.NAVIGATION,
    hotKeys: null,
    payload: { path: '/settings/community' },
  },
  composeEmailToPerson: {
    universalIdentifier: 'f01d4b8b-2b4e-4ae0-9c6f-0b9a9a3e5b21',
    label: i18nLabel(
      msg({ message: `Send Email`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconMail',
    isPinned: true,
    position: 64,
    shortLabel: i18nLabel(
      msg({ message: `Send Email`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords >= 1 and permissionFlags.SEND_EMAIL_TOOL',
    conditionalAvailability: {
      recordFilters: [
        {
          id: 'e3ea29ce-14f5-535d-a8bb-f85b402a71a6',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.GREATER_THAN_OR_EQUAL,
          value: '1',
        },
        {
          id: 'a5cf9cc4-6593-50df-83bb-99eea4d6c1a2',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'SEND_EMAIL_TOOL',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.person.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.COMPOSE_EMAIL,
    hotKeys: null,
  },
  composeEmailToCompany: {
    universalIdentifier: 'a76d3ab8-4c3a-4e5d-8a4a-1f5d6e7f8a90',
    label: i18nLabel(
      msg({ message: `Send Email`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconMail',
    isPinned: true,
    position: 65,
    shortLabel: i18nLabel(
      msg({ message: `Send Email`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords == 1 and permissionFlags.SEND_EMAIL_TOOL',
    conditionalAvailability: {
      recordFilters: [
        {
          id: 'c1118103-8053-5718-9aba-15b206f1717d',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.IS,
          value: '1',
        },
        {
          id: 'e88ccd1a-7795-569f-abbb-9baf1e013b87',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'SEND_EMAIL_TOOL',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.company.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.COMPOSE_EMAIL,
    hotKeys: null,
  },
  composeEmailToOpportunity: {
    universalIdentifier: 'b3e7c9f2-5d6e-4f7a-8b9c-0d1e2f3a4b5c',
    label: i18nLabel(
      msg({ message: `Send Email`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconMail',
    isPinned: true,
    position: 66,
    shortLabel: i18nLabel(
      msg({ message: `Send Email`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords == 1 and permissionFlags.SEND_EMAIL_TOOL',
    conditionalAvailability: {
      recordFilters: [
        {
          id: 'c1118103-8053-5718-9aba-15b206f1717d',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.IS,
          value: '1',
        },
        {
          id: 'e88ccd1a-7795-569f-abbb-9baf1e013b87',
          contextKey: 'permissionFlags',
          operand: ViewFilterOperand.IS,
          subFieldName: 'SEND_EMAIL_TOOL',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.opportunity.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.COMPOSE_EMAIL,
    hotKeys: null,
  },
  duplicateMessageList: {
    universalIdentifier: '19b519d4-a871-4fc2-980c-f5d6c92c6962',
    label: i18nLabel(
      msg({ message: `Duplicate List`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconCopyPlus',
    isPinned: true,
    position: 71,
    shortLabel: i18nLabel(
      msg({ message: `Duplicate`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'numberOfSelectedRecords == 1 and noneDefined(selectedRecords, "deletedAt") and objectPermissions.canUpdateObjectRecords',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '8d3f71fb-3846-5a66-bd6c-7eed9162361b',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.IS,
          value: '1',
        },
        {
          id: '2fad89d4-22d1-5307-ae4c-c8b3c31c1925',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
        },
        {
          id: '74b3f128-cd78-5637-92bc-d633f6830fe3',
          contextKey: 'objectPermissions',
          operand: ViewFilterOperand.IS,
          subFieldName: 'canUpdateObjectRecords',
          value: 'true',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.messageList.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.DUPLICATE_MESSAGE_LIST,
    hotKeys: null,
  },
  addToMessageList: {
    universalIdentifier: '22bc988d-c499-43b3-a870-d62a42efc6bb',
    label: i18nLabel(
      msg({ message: `Add to List`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconUserPlus',
    isPinned: false,
    position: 73,
    shortLabel: i18nLabel(
      msg({ message: `Add to List`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
    conditionalAvailabilityExpression:
      'targetObjectWritePermissions.messageListMember and numberOfSelectedRecords >= 1 and not hasAnySoftDeleteFilterOnView and (isSelectAll or noneDefined(selectedRecords, "deletedAt"))',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '2845b853-9d49-595c-8901-4a5a054e9620',
          contextKey: 'targetObjectWritePermissions',
          operand: ViewFilterOperand.IS,
          subFieldName: 'messageListMember',
          value: 'true',
          recordFilterGroupId: '55f8c7f0-c8de-539b-bf9f-d3dd422d35bc',
          positionInRecordFilterGroup: 0,
        },
        {
          id: '7cc3510c-b204-5342-99df-e3b3ae814cb9',
          contextKey: 'numberOfSelectedRecords',
          operand: ViewFilterOperand.GREATER_THAN_OR_EQUAL,
          value: '1',
          recordFilterGroupId: '55f8c7f0-c8de-539b-bf9f-d3dd422d35bc',
          positionInRecordFilterGroup: 1,
        },
        {
          id: '733fde26-3cbc-5467-bfaf-74bbaf6febcc',
          contextKey: 'hasAnySoftDeleteFilterOnView',
          operand: ViewFilterOperand.IS,
          value: 'false',
          recordFilterGroupId: '55f8c7f0-c8de-539b-bf9f-d3dd422d35bc',
          positionInRecordFilterGroup: 2,
        },
        {
          id: '86145d5a-4744-56df-9a20-a3ab5e2a8180',
          contextKey: 'isSelectAll',
          operand: ViewFilterOperand.IS,
          value: 'true',
          recordFilterGroupId: 'cd90534e-a969-5f0d-912b-9bd6f5266d7e',
          positionInRecordFilterGroup: 0,
        },
        {
          id: '54e1f6f2-6c2b-53a5-8f7c-7a2a2a7a9740',
          contextKey: 'selectedRecords',
          operand: ViewFilterOperand.IS_EMPTY,
          subFieldName: 'deletedAt',
          recordFilterGroupId: 'cd90534e-a969-5f0d-912b-9bd6f5266d7e',
          positionInRecordFilterGroup: 1,
        },
      ],
      recordFilterGroups: [
        {
          id: '55f8c7f0-c8de-539b-bf9f-d3dd422d35bc',
          logicalOperator: RecordFilterGroupLogicalOperator.AND,
        },
        {
          id: 'cd90534e-a969-5f0d-912b-9bd6f5266d7e',
          logicalOperator: RecordFilterGroupLogicalOperator.OR,
          parentRecordFilterGroupId: '55f8c7f0-c8de-539b-bf9f-d3dd422d35bc',
          positionInRecordFilterGroup: 3,
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.person.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.ADD_TO_MESSAGE_LIST,
    hotKeys: null,
  },
  addViewToMessageList: {
    universalIdentifier: '679bd5df-324f-4d9c-becc-370d824f4db0',
    label: i18nLabel(
      msg({ message: `Add View to List`, context: 'commandMenuItem.label' }),
    ),
    icon: 'IconUserPlus',
    isPinned: false,
    position: 74,
    shortLabel: i18nLabel(
      msg({ message: `Add to List`, context: 'commandMenuItem.shortLabel' }),
    ),
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL_OBJECT_CONTEXT,
    conditionalAvailabilityExpression:
      'targetObjectWritePermissions.messageListMember and pageType == "INDEX_PAGE" and not hasAnySoftDeleteFilterOnView',
    conditionalAvailability: {
      recordFilters: [
        {
          id: '41f834d1-3b3f-5e19-9df1-ad045a82cdf6',
          contextKey: 'targetObjectWritePermissions',
          operand: ViewFilterOperand.IS,
          subFieldName: 'messageListMember',
          value: 'true',
        },
        {
          id: 'd02fb294-47ab-53ff-b0af-de8625d9e95b',
          contextKey: 'pageType',
          operand: ViewFilterOperand.IS,
          value: '["INDEX_PAGE"]',
        },
        {
          id: '926e3e8c-af2a-523e-b6c0-e00980a12dc2',
          contextKey: 'hasAnySoftDeleteFilterOnView',
          operand: ViewFilterOperand.IS,
          value: 'false',
        },
      ],
    } satisfies ConditionalDisplay,
    availabilityObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS.person.universalIdentifier,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.ADD_VIEW_TO_MESSAGE_LIST,
    hotKeys: null,
  },
} as const;
