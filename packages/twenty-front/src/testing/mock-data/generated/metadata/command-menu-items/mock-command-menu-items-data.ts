/* oxlint-disable */
// @ts-nocheck
import { type CommandMenuItemFieldsFragment } from '~/generated-metadata/graphql';

// This file was automatically generated — do not edit manually.

// prettier-ignore
export const mockedCommandMenuItems: CommandMenuItemFieldsFragment[] =
[
  {
    "__typename": "CommandMenuItem",
    "id": "b198bf8a-776e-48c6-b2ab-382ce405dfb7",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATE_TO_NEXT_RECORD",
    "position": 1,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "93ff6966-18ed-50d5-af84-cc9f3c07c424",
          "contextKey": "pageType",
          "operand": "IS",
          "value": "\"RECORD_PAGE\""
        },
        {
          "id": "356dba54-e44c-5c41-906c-279bc53e5a0e",
          "contextKey": "isInSidePanel",
          "operand": "IS_NOT",
          "value": "true"
        },
        {
          "id": "d06f1e69-0331-512c-9b95-23706ed85d4e",
          "contextKey": "objectMetadataItem",
          "operand": "IS_NOT",
          "subFieldName": "nameSingular",
          "value": "\"messageCampaign\""
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Navigate to next {objectLabelSingular}",
    "icon": "IconChevronDown",
    "shortLabel": null,
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "f9810e4f-2cb9-412a-ac46-db23f5113419",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATE_TO_PREVIOUS_RECORD",
    "position": 2,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "93ff6966-18ed-50d5-af84-cc9f3c07c424",
          "contextKey": "pageType",
          "operand": "IS",
          "value": "\"RECORD_PAGE\""
        },
        {
          "id": "356dba54-e44c-5c41-906c-279bc53e5a0e",
          "contextKey": "isInSidePanel",
          "operand": "IS_NOT",
          "value": "true"
        },
        {
          "id": "d06f1e69-0331-512c-9b95-23706ed85d4e",
          "contextKey": "objectMetadataItem",
          "operand": "IS_NOT",
          "subFieldName": "nameSingular",
          "value": "\"messageCampaign\""
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Navigate to previous {objectLabelSingular}",
    "icon": "IconChevronUp",
    "shortLabel": null,
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "e7eb9cc7-5cee-4b51-a0d8-c3ac62c32f5d",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "CREATE_NEW_RECORD",
    "position": 3,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "d918b256-4f26-554f-9a75-56eba5b948fc",
          "contextKey": "pageType",
          "operand": "IS",
          "value": "\"INDEX_PAGE\""
        },
        {
          "id": "54984bd9-1409-57f9-b352-06383620f177",
          "contextKey": "objectPermissions",
          "operand": "IS",
          "subFieldName": "canUpdateObjectRecords",
          "value": "true"
        },
        {
          "id": "46ebd89a-f3b5-5df0-89cc-daa112146e30",
          "contextKey": "hasAnySoftDeleteFilterOnView",
          "operand": "IS_NOT",
          "value": "true"
        },
        {
          "id": "09d8c74d-5afb-527a-a12a-a57091015234",
          "contextKey": "objectMetadataItem",
          "operand": "IS",
          "subFieldName": "isUICreatable",
          "value": "true"
        },
        {
          "id": "45daee2c-a34d-5ae2-afe0-472be989b0d5",
          "contextKey": "objectMetadataItem",
          "operand": "IS",
          "subFieldName": "isUIEditable",
          "value": "true"
        },
        {
          "id": "356b1b85-5efa-52df-8917-36252a0abd5f",
          "contextKey": "objectMetadataItem",
          "operand": "IS_NOT",
          "subFieldName": "isRemote",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL_OBJECT_CONTEXT",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Create {objectLabelSingular}",
    "icon": "IconPlus",
    "shortLabel": "Create",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "5ab5d4f0-4c59-429f-a8b4-c0c1576fb915",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "DELETE_RECORDS",
    "position": 4,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "aa3fc354-d3a7-52ed-9dc5-72316f46e4ab",
          "contextKey": "numberOfSelectedRecords",
          "operand": "GREATER_THAN_OR_EQUAL",
          "value": "1",
          "recordFilterGroupId": "f3f8f1f8-fa75-5113-8425-354b03282423",
          "positionInRecordFilterGroup": 0
        },
        {
          "id": "0cd984d7-8b47-5373-93f3-4bfacbf5c4a9",
          "contextKey": "hasAnySoftDeleteFilterOnView",
          "operand": "IS_NOT",
          "value": "true",
          "recordFilterGroupId": "f3f8f1f8-fa75-5113-8425-354b03282423",
          "positionInRecordFilterGroup": 1
        },
        {
          "id": "4888061e-56f7-56e9-8055-b26cf86b548c",
          "contextKey": "objectPermissions",
          "operand": "IS",
          "subFieldName": "canSoftDeleteObjectRecords",
          "value": "true",
          "recordFilterGroupId": "f3f8f1f8-fa75-5113-8425-354b03282423",
          "positionInRecordFilterGroup": 2
        },
        {
          "id": "2678b911-3218-5775-b4a8-8bec80a6c4e2",
          "contextKey": "isSelectAll",
          "operand": "IS",
          "value": "true",
          "recordFilterGroupId": "ee692e55-c764-5357-bbda-ae93e72c32ea",
          "positionInRecordFilterGroup": 0
        },
        {
          "id": "fda5827f-fa36-50a2-b252-5bddb40101b7",
          "contextKey": "selectedRecords",
          "operand": "IS_EMPTY",
          "subFieldName": "deletedAt",
          "recordFilterGroupId": "ee692e55-c764-5357-bbda-ae93e72c32ea",
          "positionInRecordFilterGroup": 1
        }
      ],
      "recordFilterGroups": [
        {
          "id": "f3f8f1f8-fa75-5113-8425-354b03282423",
          "logicalOperator": "AND"
        },
        {
          "id": "ee692e55-c764-5357-bbda-ae93e72c32ea",
          "logicalOperator": "OR",
          "parentRecordFilterGroupId": "f3f8f1f8-fa75-5113-8425-354b03282423",
          "positionInRecordFilterGroup": 3
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Delete {objectLabel}",
    "icon": "IconTrash",
    "shortLabel": "Delete",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "76ba89b6-82dd-42f7-9a1b-e9a9d1be295d",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "RESTORE_RECORDS",
    "position": 5,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "944ec30d-a90d-5e08-93c7-005c05228af0",
          "contextKey": "numberOfSelectedRecords",
          "operand": "GREATER_THAN_OR_EQUAL",
          "value": "1",
          "recordFilterGroupId": "825b0d77-f0f0-54f1-be17-5a1b67146afe",
          "positionInRecordFilterGroup": 0
        },
        {
          "id": "61226194-3ce4-5a3f-9f62-ca41ba69d938",
          "contextKey": "isSelectAll",
          "operand": "IS",
          "value": "true",
          "recordFilterGroupId": "105d58ca-ec65-5a39-8d10-6e135383dc5f",
          "positionInRecordFilterGroup": 0
        },
        {
          "id": "f15a7d0b-ad1b-5d9b-94ba-13d975cb86b3",
          "contextKey": "selectedRecords",
          "operand": "IS_NOT_EMPTY",
          "subFieldName": "deletedAt",
          "recordFilterGroupId": "105d58ca-ec65-5a39-8d10-6e135383dc5f",
          "positionInRecordFilterGroup": 1
        },
        {
          "id": "65a35933-d5db-58f0-a46e-9e54a2185a05",
          "contextKey": "objectPermissions",
          "operand": "IS",
          "subFieldName": "canSoftDeleteObjectRecords",
          "value": "true",
          "recordFilterGroupId": "825b0d77-f0f0-54f1-be17-5a1b67146afe",
          "positionInRecordFilterGroup": 2
        },
        {
          "id": "6dbda408-9cec-53a2-922b-981172f7cd43",
          "contextKey": "pageType",
          "operand": "IS",
          "value": "\"RECORD_PAGE\"",
          "recordFilterGroupId": "82fb2a5d-f739-5a6f-9c47-931e9f3390b1",
          "positionInRecordFilterGroup": 0
        },
        {
          "id": "bed9ee8c-9dd4-54cb-ac65-3bed0bb72365",
          "contextKey": "hasAnySoftDeleteFilterOnView",
          "operand": "IS",
          "value": "true",
          "recordFilterGroupId": "82fb2a5d-f739-5a6f-9c47-931e9f3390b1",
          "positionInRecordFilterGroup": 1
        }
      ],
      "recordFilterGroups": [
        {
          "id": "825b0d77-f0f0-54f1-be17-5a1b67146afe",
          "logicalOperator": "AND"
        },
        {
          "id": "105d58ca-ec65-5a39-8d10-6e135383dc5f",
          "logicalOperator": "OR",
          "parentRecordFilterGroupId": "825b0d77-f0f0-54f1-be17-5a1b67146afe",
          "positionInRecordFilterGroup": 1
        },
        {
          "id": "82fb2a5d-f739-5a6f-9c47-931e9f3390b1",
          "logicalOperator": "OR",
          "parentRecordFilterGroupId": "825b0d77-f0f0-54f1-be17-5a1b67146afe",
          "positionInRecordFilterGroup": 3
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Restore {objectLabel}",
    "icon": "IconRefresh",
    "shortLabel": "Restore",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "6a719edc-0328-4e31-9b11-63842e637051",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "DESTROY_RECORDS",
    "position": 6,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "374a5a3b-a7d0-5432-8f57-8f2fc82139e7",
          "contextKey": "numberOfSelectedRecords",
          "operand": "GREATER_THAN_OR_EQUAL",
          "value": "1",
          "recordFilterGroupId": "e1da7c2b-1756-5bb9-9411-d8806d1e7027",
          "positionInRecordFilterGroup": 0
        },
        {
          "id": "8e089cce-580e-5d8f-b7b8-e2d32d6b3cac",
          "contextKey": "objectPermissions",
          "operand": "IS",
          "subFieldName": "canDestroyObjectRecords",
          "value": "true",
          "recordFilterGroupId": "e1da7c2b-1756-5bb9-9411-d8806d1e7027",
          "positionInRecordFilterGroup": 1
        },
        {
          "id": "8838471e-cfe9-510f-9e25-edf330540b24",
          "contextKey": "isSelectAll",
          "operand": "IS",
          "value": "true",
          "recordFilterGroupId": "9a547470-a47d-53c2-a727-efa1e8cc07e6",
          "positionInRecordFilterGroup": 0
        },
        {
          "id": "8abe6d49-2c71-5a9b-90ac-143acf784cd6",
          "contextKey": "selectedRecords",
          "operand": "IS_NOT_EMPTY",
          "subFieldName": "deletedAt",
          "recordFilterGroupId": "9a547470-a47d-53c2-a727-efa1e8cc07e6",
          "positionInRecordFilterGroup": 1
        },
        {
          "id": "a3219326-8493-52b2-9b2b-eeef9e1523fc",
          "contextKey": "pageType",
          "operand": "IS",
          "value": "\"RECORD_PAGE\"",
          "recordFilterGroupId": "6a5f980d-a435-5fac-9420-cb9283ddd4ba",
          "positionInRecordFilterGroup": 0
        },
        {
          "id": "ef6690e5-e6b4-5aab-86bc-a879ad7bbae6",
          "contextKey": "hasAnySoftDeleteFilterOnView",
          "operand": "IS",
          "value": "true",
          "recordFilterGroupId": "6a5f980d-a435-5fac-9420-cb9283ddd4ba",
          "positionInRecordFilterGroup": 1
        }
      ],
      "recordFilterGroups": [
        {
          "id": "e1da7c2b-1756-5bb9-9411-d8806d1e7027",
          "logicalOperator": "AND"
        },
        {
          "id": "9a547470-a47d-53c2-a727-efa1e8cc07e6",
          "logicalOperator": "OR",
          "parentRecordFilterGroupId": "e1da7c2b-1756-5bb9-9411-d8806d1e7027",
          "positionInRecordFilterGroup": 2
        },
        {
          "id": "6a5f980d-a435-5fac-9420-cb9283ddd4ba",
          "logicalOperator": "OR",
          "parentRecordFilterGroupId": "e1da7c2b-1756-5bb9-9411-d8806d1e7027",
          "positionInRecordFilterGroup": 3
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Permanently destroy {objectLabel}",
    "icon": "IconTrashX",
    "shortLabel": "Destroy",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "5f82fe2b-2e8e-4a10-ae46-59c25696067d",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "ADD_TO_FAVORITES",
    "position": 7,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "2f587e61-020b-5aa1-ac9a-c40a26efd6f0",
          "contextKey": "areAllSelectedRecordsFavorites",
          "operand": "IS",
          "value": "false"
        },
        {
          "id": "e8b2ebf6-fc27-52b7-a3d1-517e75e7e335",
          "contextKey": "selectedRecords",
          "operand": "IS_EMPTY",
          "subFieldName": "deletedAt"
        },
        {
          "id": "0e5dc9c0-dede-5f2e-a306-0808aef1f980",
          "contextKey": "hasAnySoftDeleteFilterOnView",
          "operand": "IS_NOT",
          "value": "true"
        },
        {
          "id": "90734b6e-f2d3-560e-bacf-63ecabcba929",
          "contextKey": "objectMetadataItem",
          "operand": "IS_NOT",
          "subFieldName": "nameSingular",
          "value": "\"messageCampaign\""
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Add to Favorites",
    "icon": "IconHeart",
    "shortLabel": null,
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "4bd7cb77-488b-46c4-82c4-17c976b24563",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "REMOVE_FROM_FAVORITES",
    "position": 8,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "0f55f4a5-873d-538c-a3a7-f75573e8f9b9",
          "contextKey": "areAllSelectedRecordsFavorites",
          "operand": "IS",
          "value": "true"
        },
        {
          "id": "cd13d62e-fc4f-5605-b7f1-3cbb5e12b1fc",
          "contextKey": "selectedRecords",
          "operand": "IS_EMPTY",
          "subFieldName": "deletedAt"
        },
        {
          "id": "c6f333dd-0a83-55a0-a72b-c98215e68b15",
          "contextKey": "hasAnySoftDeleteFilterOnView",
          "operand": "IS_NOT",
          "value": "true"
        },
        {
          "id": "bb3195e7-077c-5aca-8f3d-f70c05bd7587",
          "contextKey": "objectMetadataItem",
          "operand": "IS_NOT",
          "subFieldName": "nameSingular",
          "value": "\"messageCampaign\""
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Remove from Favorites",
    "icon": "IconHeartOff",
    "shortLabel": null,
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "d2888ea6-e337-4193-a27f-2f3b6fd9d9bb",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "EXPORT_NOTE_TO_PDF",
    "position": 9,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "bc9a3e74-83a0-595f-8af5-faf125d75e84",
          "contextKey": "pageType",
          "operand": "IS",
          "value": "\"RECORD_PAGE\"",
          "recordFilterGroupId": "11c9bc82-bcb2-53e5-b971-80a6aa300412",
          "positionInRecordFilterGroup": 0
        },
        {
          "id": "1c6e2d9b-8251-52f9-91c6-4a0c60dda478",
          "contextKey": "objectMetadataItem",
          "operand": "IS",
          "subFieldName": "nameSingular",
          "value": "\"note\"",
          "recordFilterGroupId": "816743c7-829b-53bd-8a9a-1b1a0ce41e42",
          "positionInRecordFilterGroup": 0
        },
        {
          "id": "3c131f3f-4f22-5642-8785-af3904e5b921",
          "contextKey": "objectMetadataItem",
          "operand": "IS",
          "subFieldName": "nameSingular",
          "value": "\"task\"",
          "recordFilterGroupId": "816743c7-829b-53bd-8a9a-1b1a0ce41e42",
          "positionInRecordFilterGroup": 1
        },
        {
          "id": "167e0428-f91f-524d-adb8-77527e3fd10e",
          "contextKey": "selectedRecords",
          "operand": "IS_NOT_EMPTY",
          "subFieldName": "bodyV2.blocknote",
          "recordFilterGroupId": "11c9bc82-bcb2-53e5-b971-80a6aa300412",
          "positionInRecordFilterGroup": 2
        }
      ],
      "recordFilterGroups": [
        {
          "id": "11c9bc82-bcb2-53e5-b971-80a6aa300412",
          "logicalOperator": "AND"
        },
        {
          "id": "816743c7-829b-53bd-8a9a-1b1a0ce41e42",
          "logicalOperator": "OR",
          "parentRecordFilterGroupId": "11c9bc82-bcb2-53e5-b971-80a6aa300412",
          "positionInRecordFilterGroup": 1
        }
      ],
      "quantifier": "SOME"
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Export to PDF",
    "icon": "IconFileExport",
    "shortLabel": "Export",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "0b43a7b7-597e-42cf-980c-52564b842e63",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "EXPORT_RECORDS",
    "position": 10,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "0cba3098-85f1-51fe-a92d-e223e6ba6081",
          "contextKey": "pageType",
          "operand": "IS",
          "value": "\"INDEX_PAGE\""
        },
        {
          "id": "c7628efd-b3ff-5f67-b3cc-a89534e9e5c5",
          "contextKey": "permissionFlags",
          "operand": "IS",
          "subFieldName": "EXPORT_CSV",
          "value": "true"
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Export {objectLabel}",
    "icon": "IconFileExport",
    "shortLabel": "Export",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "611db54f-a516-41ef-b557-45c5dc304d2a",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "UPDATE_MULTIPLE_RECORDS",
    "position": 11,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "855cab9b-03e6-5a12-835a-65d76d06453a",
          "contextKey": "numberOfSelectedRecords",
          "operand": "GREATER_THAN_OR_EQUAL",
          "value": "2"
        },
        {
          "id": "0c95de7c-5b96-523f-ba3b-6c718023b841",
          "contextKey": "objectPermissions",
          "operand": "IS",
          "subFieldName": "canUpdateObjectRecords",
          "value": "true"
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Update {objectLabelPlural}",
    "icon": "IconEdit",
    "shortLabel": "Update",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "89556e1d-ea65-4670-a936-789b4e1e6d11",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "MERGE_MULTIPLE_RECORDS",
    "position": 12,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "530a3cc0-c89d-5d06-8107-ca165b29578a",
          "contextKey": "isSelectAll",
          "operand": "IS_NOT",
          "value": "true"
        },
        {
          "id": "47d61333-071c-5fa4-867d-5f199ae395a9",
          "contextKey": "numberOfSelectedRecords",
          "operand": "GREATER_THAN_OR_EQUAL",
          "value": "2"
        },
        {
          "id": "d29af885-4fac-5837-bb8e-4b9082671ca2",
          "contextKey": "objectMetadataItem",
          "operand": "IS_NOT_EMPTY",
          "subFieldName": "duplicateCriteria"
        },
        {
          "id": "ccc946cb-aed5-59a8-bbf9-6b5e28f5783c",
          "contextKey": "objectPermissions",
          "operand": "IS",
          "subFieldName": "canUpdateObjectRecords",
          "value": "true"
        },
        {
          "id": "5a62d78d-af4f-5f68-95cf-26eea6a0f7e3",
          "contextKey": "objectPermissions",
          "operand": "IS",
          "subFieldName": "canDestroyObjectRecords",
          "value": "true"
        },
        {
          "id": "25e93671-ae65-529b-aa3a-c124e9c33c6a",
          "contextKey": "numberOfSelectedRecords",
          "operand": "LESS_THAN_OR_EQUAL",
          "value": "9"
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Merge {objectLabelPlural}",
    "icon": "IconArrowMerge",
    "shortLabel": "Merge",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "2b89ad33-2663-49b2-b8e5-61245f6859e9",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "IMPORT_RECORDS",
    "position": 13,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "5d36cee8-ebc6-54a8-9105-0f6de34cf04b",
          "contextKey": "pageType",
          "operand": "IS",
          "value": "\"INDEX_PAGE\""
        },
        {
          "id": "2d27d4f4-1456-5c8b-b9d3-a839cc93949a",
          "contextKey": "hasAnySoftDeleteFilterOnView",
          "operand": "IS_NOT",
          "value": "true"
        },
        {
          "id": "c87eed9d-b634-52fa-af81-d38a417f300b",
          "contextKey": "permissionFlags",
          "operand": "IS",
          "subFieldName": "IMPORT_CSV",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL_OBJECT_CONTEXT",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Import {objectLabelPlural}",
    "icon": "IconFileImport",
    "shortLabel": "Import",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "fca175b0-7748-447a-9fd2-68afffd5516c",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "EXPORT_VIEW",
    "position": 14,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "0cba3098-85f1-51fe-a92d-e223e6ba6081",
          "contextKey": "pageType",
          "operand": "IS",
          "value": "\"INDEX_PAGE\""
        },
        {
          "id": "c7628efd-b3ff-5f67-b3cc-a89534e9e5c5",
          "contextKey": "permissionFlags",
          "operand": "IS",
          "subFieldName": "EXPORT_CSV",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL_OBJECT_CONTEXT",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Export View",
    "icon": "IconFileExport",
    "shortLabel": "Export",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "161f6ebf-af0d-4921-896e-d2075bef3935",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "SEE_DELETED_RECORDS",
    "position": 15,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "55364171-1160-5b80-b33c-f3a59be908e2",
          "contextKey": "pageType",
          "operand": "IS",
          "value": "\"INDEX_PAGE\""
        },
        {
          "id": "2ac8c799-c880-5874-a026-ae895f5c0c7a",
          "contextKey": "hasAnySoftDeleteFilterOnView",
          "operand": "IS_NOT",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL_OBJECT_CONTEXT",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "See deleted {objectLabelPlural}",
    "icon": "IconRotate2",
    "shortLabel": "Deleted {objectLabelPlural}",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "66ce5c2a-3ba0-4d0e-8e95-2ba312e51322",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "CREATE_NEW_VIEW",
    "position": 16,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "55364171-1160-5b80-b33c-f3a59be908e2",
          "contextKey": "pageType",
          "operand": "IS",
          "value": "\"INDEX_PAGE\""
        },
        {
          "id": "2ac8c799-c880-5874-a026-ae895f5c0c7a",
          "contextKey": "hasAnySoftDeleteFilterOnView",
          "operand": "IS_NOT",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL_OBJECT_CONTEXT",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Create View",
    "icon": "IconLayout",
    "shortLabel": "Create View",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "cc91df53-7864-469f-85aa-c7f04d3a9e47",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "HIDE_DELETED_RECORDS",
    "position": 17,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "a8f16ded-2de3-5b3d-9ad6-08fac474a5d5",
          "contextKey": "pageType",
          "operand": "IS",
          "value": "\"INDEX_PAGE\""
        },
        {
          "id": "514fd09c-4c8b-55ab-a459-003085bfd318",
          "contextKey": "hasAnySoftDeleteFilterOnView",
          "operand": "IS",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL_OBJECT_CONTEXT",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Hide deleted {objectLabelPlural}",
    "icon": "IconEyeOff",
    "shortLabel": "Hide deleted",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "129de905-5dee-4b0e-ac0c-73f5d6653481",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "EDIT_RECORD_PAGE_LAYOUT",
    "position": 18,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "6ea01273-2c68-5f20-86ed-8a82421cb526",
          "contextKey": "pageType",
          "operand": "IS_NOT",
          "value": "\"SETTINGS_PAGE\""
        },
        {
          "id": "cfade857-4a77-51e8-b8ef-c411a608e223",
          "contextKey": "isLayoutCustomizationModeEnabled",
          "operand": "IS_NOT",
          "value": "true"
        },
        {
          "id": "a81d9ec7-ae18-53a4-9465-ff7b5c24ccb0",
          "contextKey": "permissionFlags",
          "operand": "IS",
          "subFieldName": "LAYOUTS",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Edit Layout",
    "icon": "IconPencil",
    "shortLabel": "Edit Layout",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "e92f82c1-bd12-4f34-ac30-4be5898ee9b6",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "EDIT_DASHBOARD_LAYOUT",
    "position": 19,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "bda7d4d4-75fe-5f42-b9ea-8802a1c568a0",
          "contextKey": "pageType",
          "operand": "IS",
          "value": "\"RECORD_PAGE\""
        },
        {
          "id": "f5177bc2-6c2e-59c1-8cd2-359ed8563059",
          "contextKey": "isDashboardPageLayoutInEditMode",
          "operand": "IS_NOT",
          "value": "true"
        },
        {
          "id": "74772b21-f647-5c7d-a142-11a6ded10ea3",
          "contextKey": "isLayoutCustomizationModeEnabled",
          "operand": "IS_NOT",
          "value": "true"
        },
        {
          "id": "2c306ef6-8833-5039-b957-f2a386cfc9fc",
          "contextKey": "selectedRecords",
          "operand": "IS_EMPTY",
          "subFieldName": "deletedAt"
        },
        {
          "id": "f004b04b-5104-5887-9920-346dea4118b6",
          "contextKey": "selectedRecords",
          "operand": "IS_NOT_EMPTY",
          "subFieldName": "pageLayoutId"
        },
        {
          "id": "54ac1921-0d38-563e-96b1-81cb633475cf",
          "contextKey": "objectPermissions",
          "operand": "IS",
          "subFieldName": "canUpdateObjectRecords",
          "value": "true"
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": "9ea13a87-2454-423c-ae41-db2cbeab0642",
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Edit Dashboard",
    "icon": "IconPencil",
    "shortLabel": "Edit",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "86ab7a0e-c6b5-4cf3-8bd5-9132425a4855",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "SAVE_DASHBOARD_LAYOUT",
    "position": 20,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "1c85fe87-c264-5b1d-9f64-efedd590ce78",
          "contextKey": "pageType",
          "operand": "IS",
          "value": "\"RECORD_PAGE\""
        },
        {
          "id": "69007a31-7838-5ff8-9e48-3deedfbaa88f",
          "contextKey": "isDashboardPageLayoutInEditMode",
          "operand": "IS",
          "value": "true"
        },
        {
          "id": "fdc8603a-a56d-5658-8a34-8d20043edcbb",
          "contextKey": "selectedRecords",
          "operand": "IS_EMPTY",
          "subFieldName": "deletedAt"
        },
        {
          "id": "da4e21f5-1954-5454-b468-b8a9c8472898",
          "contextKey": "selectedRecords",
          "operand": "IS_NOT_EMPTY",
          "subFieldName": "pageLayoutId"
        },
        {
          "id": "435c6e0f-3336-5c8f-988b-7ea8357a0d0e",
          "contextKey": "objectPermissions",
          "operand": "IS",
          "subFieldName": "canUpdateObjectRecords",
          "value": "true"
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": "9ea13a87-2454-423c-ae41-db2cbeab0642",
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Save Dashboard",
    "icon": "IconDeviceFloppy",
    "shortLabel": "Save",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "52247cf2-c4ce-4db8-bafb-9b772e11dd72",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "CANCEL_DASHBOARD_LAYOUT",
    "position": 21,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "1c85fe87-c264-5b1d-9f64-efedd590ce78",
          "contextKey": "pageType",
          "operand": "IS",
          "value": "\"RECORD_PAGE\""
        },
        {
          "id": "69007a31-7838-5ff8-9e48-3deedfbaa88f",
          "contextKey": "isDashboardPageLayoutInEditMode",
          "operand": "IS",
          "value": "true"
        },
        {
          "id": "fdc8603a-a56d-5658-8a34-8d20043edcbb",
          "contextKey": "selectedRecords",
          "operand": "IS_EMPTY",
          "subFieldName": "deletedAt"
        },
        {
          "id": "da4e21f5-1954-5454-b468-b8a9c8472898",
          "contextKey": "selectedRecords",
          "operand": "IS_NOT_EMPTY",
          "subFieldName": "pageLayoutId"
        },
        {
          "id": "435c6e0f-3336-5c8f-988b-7ea8357a0d0e",
          "contextKey": "objectPermissions",
          "operand": "IS",
          "subFieldName": "canUpdateObjectRecords",
          "value": "true"
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": "9ea13a87-2454-423c-ae41-db2cbeab0642",
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Cancel Edition",
    "icon": "IconCancel",
    "shortLabel": "Cancel",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "25386fe6-882c-4a70-81a0-357ee174f9e2",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "DUPLICATE_DASHBOARD",
    "position": 22,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "09ae8267-43b6-5a20-b7d5-8776c0da721f",
          "contextKey": "selectedRecords",
          "operand": "IS_EMPTY",
          "subFieldName": "deletedAt"
        },
        {
          "id": "d2fb8f22-6e00-50a8-b5c9-5dcf4be902f0",
          "contextKey": "objectPermissions",
          "operand": "IS",
          "subFieldName": "canUpdateObjectRecords",
          "value": "true"
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": "9ea13a87-2454-423c-ae41-db2cbeab0642",
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Duplicate Dashboard",
    "icon": "IconCopyPlus",
    "shortLabel": "Duplicate",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "9ac956fb-6b90-4133-a7c8-cf7e9747ce2c",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "ACTIVATE_WORKFLOW",
    "position": 23,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "d3f6f4fc-5781-5166-aac9-8d9f31cb20ed",
          "contextKey": "numberOfSelectedRecords",
          "operand": "IS",
          "value": "1",
          "recordFilterGroupId": "61c485e6-aa84-5d57-98aa-efc0407b31ce",
          "positionInRecordFilterGroup": 0
        },
        {
          "id": "244c32eb-8179-5a9e-8a96-ae7a4736a00b",
          "contextKey": "selectedRecords",
          "operand": "IS_NOT_EMPTY",
          "subFieldName": "currentVersion.trigger",
          "recordFilterGroupId": "61c485e6-aa84-5d57-98aa-efc0407b31ce",
          "positionInRecordFilterGroup": 1
        },
        {
          "id": "b1688102-0d2f-548f-801c-89eba8d6f0a0",
          "contextKey": "selectedRecords",
          "operand": "IS_NOT_EMPTY",
          "subFieldName": "currentVersion.steps",
          "recordFilterGroupId": "61c485e6-aa84-5d57-98aa-efc0407b31ce",
          "positionInRecordFilterGroup": 2
        },
        {
          "id": "6a9abbd8-4c35-53e6-aafe-7720f5b8ff10",
          "contextKey": "selectedRecords",
          "operand": "IS_NOT_EMPTY",
          "subFieldName": "currentVersion.steps",
          "recordFilterGroupId": "61c485e6-aa84-5d57-98aa-efc0407b31ce",
          "positionInRecordFilterGroup": 3
        },
        {
          "id": "52e92b6f-b17c-57bf-af02-be54ea2808f4",
          "contextKey": "selectedRecords",
          "operand": "IS",
          "subFieldName": "currentVersion.status",
          "value": "\"DRAFT\"",
          "recordFilterGroupId": "37e4bc91-09bd-517a-8b6f-ea7301440c52",
          "positionInRecordFilterGroup": 0
        },
        {
          "id": "156e356d-2d0e-5220-ac6e-50c09ee965cb",
          "contextKey": "selectedRecords",
          "operand": "DOES_NOT_CONTAIN",
          "subFieldName": "statuses",
          "value": "\"ACTIVE\"",
          "recordFilterGroupId": "37e4bc91-09bd-517a-8b6f-ea7301440c52",
          "positionInRecordFilterGroup": 1
        },
        {
          "id": "211d5470-01f1-5d3d-bf1a-5a1d03378ccf",
          "contextKey": "selectedRecords",
          "operand": "IS_EMPTY",
          "subFieldName": "deletedAt",
          "recordFilterGroupId": "61c485e6-aa84-5d57-98aa-efc0407b31ce",
          "positionInRecordFilterGroup": 5
        }
      ],
      "recordFilterGroups": [
        {
          "id": "61c485e6-aa84-5d57-98aa-efc0407b31ce",
          "logicalOperator": "AND"
        },
        {
          "id": "37e4bc91-09bd-517a-8b6f-ea7301440c52",
          "logicalOperator": "OR",
          "parentRecordFilterGroupId": "61c485e6-aa84-5d57-98aa-efc0407b31ce",
          "positionInRecordFilterGroup": 4
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": "7fa7fa3c-2efd-4689-9048-559222d3b80d",
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Activate Workflow",
    "icon": "IconPower",
    "shortLabel": "Activate",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "3ed63089-b5af-452b-89d9-97f86ba58f6e",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "DEACTIVATE_WORKFLOW",
    "position": 24,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "09a04afb-dc34-53e6-ac58-e8b65572d533",
          "contextKey": "numberOfSelectedRecords",
          "operand": "IS",
          "value": "1",
          "recordFilterGroupId": "c84cd673-5728-540a-aa70-f0f2db2e342c",
          "positionInRecordFilterGroup": 0
        },
        {
          "id": "798bb95d-2d6b-5ab5-9a18-a1da4a78cf01",
          "contextKey": "selectedRecords",
          "operand": "IS",
          "subFieldName": "currentVersion.status",
          "value": "\"ACTIVE\"",
          "recordFilterGroupId": "b8f00477-69ba-59be-b712-3496abef36a9",
          "positionInRecordFilterGroup": 0
        },
        {
          "id": "3e210d1b-c792-5df5-89ac-1ddc0ed471e4",
          "contextKey": "selectedRecords",
          "operand": "CONTAINS",
          "subFieldName": "statuses",
          "value": "\"ACTIVE\"",
          "recordFilterGroupId": "b8f00477-69ba-59be-b712-3496abef36a9",
          "positionInRecordFilterGroup": 1
        },
        {
          "id": "ee5d7bd0-14af-50ec-ba35-e8f09b70a64d",
          "contextKey": "selectedRecords",
          "operand": "IS_EMPTY",
          "subFieldName": "deletedAt",
          "recordFilterGroupId": "c84cd673-5728-540a-aa70-f0f2db2e342c",
          "positionInRecordFilterGroup": 2
        }
      ],
      "recordFilterGroups": [
        {
          "id": "c84cd673-5728-540a-aa70-f0f2db2e342c",
          "logicalOperator": "AND"
        },
        {
          "id": "b8f00477-69ba-59be-b712-3496abef36a9",
          "logicalOperator": "OR",
          "parentRecordFilterGroupId": "c84cd673-5728-540a-aa70-f0f2db2e342c",
          "positionInRecordFilterGroup": 1
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": "7fa7fa3c-2efd-4689-9048-559222d3b80d",
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Deactivate Workflow",
    "icon": "IconPlayerPause",
    "shortLabel": "Deactivate",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "eacee9a6-cc30-4759-9a07-9c1093f1e989",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "DISCARD_DRAFT_WORKFLOW",
    "position": 25,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "36e3ad72-6ddd-5df5-85ac-cad556bb3ad1",
          "contextKey": "selectedRecords",
          "operand": "IS_NOT_EMPTY",
          "subFieldName": "lastPublishedVersionId"
        },
        {
          "id": "65e880a0-4fbe-5312-9fa9-fb2d119c5c0d",
          "contextKey": "selectedRecords",
          "operand": "IS",
          "subFieldName": "currentVersion.status",
          "value": "\"DRAFT\""
        },
        {
          "id": "8c50e428-9bf0-5428-87b5-174cdf6ed077",
          "contextKey": "selectedRecords",
          "operand": "IS_EMPTY",
          "subFieldName": "deletedAt"
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": "7fa7fa3c-2efd-4689-9048-559222d3b80d",
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Discard Draft",
    "icon": "IconNoteOff",
    "shortLabel": "Discard Draft",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "44b1ea18-ffcf-4fb2-b863-c3433121e539",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "TEST_WORKFLOW",
    "position": 26,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "218d7cde-f4d6-511d-99c6-bf623bb19664",
          "contextKey": "numberOfSelectedRecords",
          "operand": "IS",
          "value": "1",
          "recordFilterGroupId": "25e1b770-00e9-5b26-9a39-fe66154591cc",
          "positionInRecordFilterGroup": 0
        },
        {
          "id": "eb466879-ce37-5992-9b25-7570b6b1c9a2",
          "contextKey": "selectedRecords",
          "operand": "IS_NOT_EMPTY",
          "subFieldName": "currentVersion.trigger",
          "recordFilterGroupId": "25e1b770-00e9-5b26-9a39-fe66154591cc",
          "positionInRecordFilterGroup": 1
        },
        {
          "id": "acc18934-c7cc-5de4-a86c-7c7d6bd85f4d",
          "contextKey": "selectedRecords",
          "operand": "IS_NOT_EMPTY",
          "subFieldName": "currentVersion.steps",
          "recordFilterGroupId": "25e1b770-00e9-5b26-9a39-fe66154591cc",
          "positionInRecordFilterGroup": 2
        },
        {
          "id": "6ac18d4c-eabc-5ca7-a7a4-f6fcf8da3d92",
          "contextKey": "selectedRecords",
          "operand": "IS_NOT_EMPTY",
          "subFieldName": "currentVersion.steps",
          "recordFilterGroupId": "25e1b770-00e9-5b26-9a39-fe66154591cc",
          "positionInRecordFilterGroup": 3
        },
        {
          "id": "80b1e899-199f-5a8a-aa2d-140f79a50ddc",
          "contextKey": "selectedRecords",
          "operand": "IS",
          "subFieldName": "currentVersion.trigger.type",
          "value": "\"MANUAL\"",
          "recordFilterGroupId": "bf9c58b8-22c3-5f6a-9140-269abf596d85",
          "positionInRecordFilterGroup": 0
        },
        {
          "id": "d221ec12-cbe6-53f1-b037-ede8e313fc8e",
          "contextKey": "selectedRecords",
          "operand": "IS_EMPTY",
          "subFieldName": "currentVersion.trigger.settings.objectType",
          "recordFilterGroupId": "bf9c58b8-22c3-5f6a-9140-269abf596d85",
          "positionInRecordFilterGroup": 1
        },
        {
          "id": "9e71619e-607b-517b-86a4-ebb34d19738c",
          "contextKey": "selectedRecords",
          "operand": "IS",
          "subFieldName": "currentVersion.trigger.type",
          "value": "\"WEBHOOK\"",
          "recordFilterGroupId": "82a57ba3-ade9-53b2-b32d-a41fbc1af2af",
          "positionInRecordFilterGroup": 1
        },
        {
          "id": "51b3471b-71f5-5b6a-9cbe-659953fea33e",
          "contextKey": "selectedRecords",
          "operand": "IS",
          "subFieldName": "currentVersion.trigger.type",
          "value": "\"CRON\"",
          "recordFilterGroupId": "82a57ba3-ade9-53b2-b32d-a41fbc1af2af",
          "positionInRecordFilterGroup": 2
        },
        {
          "id": "71b9b11f-622a-5fad-98a3-79223378d402",
          "contextKey": "selectedRecords",
          "operand": "IS_EMPTY",
          "subFieldName": "deletedAt",
          "recordFilterGroupId": "25e1b770-00e9-5b26-9a39-fe66154591cc",
          "positionInRecordFilterGroup": 5
        }
      ],
      "recordFilterGroups": [
        {
          "id": "25e1b770-00e9-5b26-9a39-fe66154591cc",
          "logicalOperator": "AND"
        },
        {
          "id": "82a57ba3-ade9-53b2-b32d-a41fbc1af2af",
          "logicalOperator": "OR",
          "parentRecordFilterGroupId": "25e1b770-00e9-5b26-9a39-fe66154591cc",
          "positionInRecordFilterGroup": 4
        },
        {
          "id": "bf9c58b8-22c3-5f6a-9140-269abf596d85",
          "logicalOperator": "AND",
          "parentRecordFilterGroupId": "82a57ba3-ade9-53b2-b32d-a41fbc1af2af",
          "positionInRecordFilterGroup": 0
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": "7fa7fa3c-2efd-4689-9048-559222d3b80d",
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Test Workflow",
    "icon": "IconPlayerPlay",
    "shortLabel": "Test",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "adecf949-bbbd-4fb5-a8d2-fb6f7cb78770",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "SEE_RUNS_WORKFLOW",
    "position": 28,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "bc7d8638-ad97-594b-a597-bc7754ac2294",
          "contextKey": "selectedRecords",
          "operand": "IS_EMPTY",
          "subFieldName": "deletedAt"
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": "7fa7fa3c-2efd-4689-9048-559222d3b80d",
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "See Runs",
    "icon": "IconHistoryToggle",
    "shortLabel": "See Runs",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "9c4f0003-6761-411b-a28d-3401c838c3fa",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "SEE_VERSIONS_WORKFLOW",
    "position": 29,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "bc7d8638-ad97-594b-a597-bc7754ac2294",
          "contextKey": "selectedRecords",
          "operand": "IS_EMPTY",
          "subFieldName": "deletedAt"
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": "7fa7fa3c-2efd-4689-9048-559222d3b80d",
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "See Versions History",
    "icon": "IconVersions",
    "shortLabel": "See Versions",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "45d3b320-43e0-4120-b98f-a3959bdcb807",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "TIDY_UP_WORKFLOW",
    "position": 31,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "a069e008-6d83-5031-9b1a-672c53cb9e7a",
          "contextKey": "pageType",
          "operand": "IS",
          "value": "\"RECORD_PAGE\""
        },
        {
          "id": "5e23227b-cc55-502d-bfd9-2b51d0d30722",
          "contextKey": "selectedRecords",
          "operand": "IS_NOT_EMPTY",
          "subFieldName": "currentVersion.trigger"
        },
        {
          "id": "e4a6b8d7-f189-56d2-9d1c-5f04f464814d",
          "contextKey": "selectedRecords",
          "operand": "IS_NOT_EMPTY",
          "subFieldName": "currentVersion.steps"
        },
        {
          "id": "b9d84760-181f-5828-a642-156dbbced9ce",
          "contextKey": "selectedRecords",
          "operand": "IS_NOT_EMPTY",
          "subFieldName": "currentVersion.steps"
        },
        {
          "id": "7098cfa8-455b-5e84-93a6-9420428a2e8d",
          "contextKey": "selectedRecords",
          "operand": "IS_EMPTY",
          "subFieldName": "deletedAt"
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": "7fa7fa3c-2efd-4689-9048-559222d3b80d",
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Tidy up Workflow",
    "icon": "IconReorder",
    "shortLabel": "Tidy up",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "19f51379-c988-44d4-8a25-7c193fab6be5",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "DUPLICATE_WORKFLOW",
    "position": 32,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "2905b18b-d907-5fda-8e44-ba0d36079115",
          "contextKey": "selectedRecords",
          "operand": "IS_NOT_EMPTY",
          "subFieldName": "currentVersion"
        },
        {
          "id": "0623abc1-89fe-5fa3-8154-7c34cf989fbc",
          "contextKey": "selectedRecords",
          "operand": "IS_EMPTY",
          "subFieldName": "deletedAt"
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": "7fa7fa3c-2efd-4689-9048-559222d3b80d",
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Duplicate Workflow",
    "icon": "IconCopy",
    "shortLabel": "Duplicate",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "5ba655ec-8787-45c2-9a8e-f6e34b8ff79d",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "SEE_WORKFLOW_WORKFLOW_RUN",
    "position": 34,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": null,
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": "dccf06e5-31d9-43fc-9612-30517caadf5f",
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "See Workflow",
    "icon": "IconSettingsAutomation",
    "shortLabel": "See Workflow",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "c07bd034-245e-41d4-b2e0-d949e113c304",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "STOP_WORKFLOW_RUN",
    "position": 35,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "0e697990-55eb-53aa-9265-52b769871078",
          "contextKey": "isSelectAll",
          "operand": "IS",
          "value": "true",
          "recordFilterGroupId": "21ab452e-c475-59e4-ac2d-0bf38ac3b0f2",
          "positionInRecordFilterGroup": 0
        },
        {
          "id": "67f8a70d-3b35-55b5-b3c9-7918af43bec5",
          "contextKey": "selectedRecords",
          "operand": "IS",
          "subFieldName": "status",
          "value": "\"NOT_STARTED\"",
          "recordFilterGroupId": "21ab452e-c475-59e4-ac2d-0bf38ac3b0f2",
          "positionInRecordFilterGroup": 1
        },
        {
          "id": "77a7c3a8-ae07-5275-9cf2-e76752ce7e00",
          "contextKey": "selectedRecords",
          "operand": "IS",
          "subFieldName": "status",
          "value": "\"ENQUEUED\"",
          "recordFilterGroupId": "21ab452e-c475-59e4-ac2d-0bf38ac3b0f2",
          "positionInRecordFilterGroup": 2
        },
        {
          "id": "c0447d6b-d7de-5871-a3ba-963ac8c78b29",
          "contextKey": "selectedRecords",
          "operand": "IS",
          "subFieldName": "status",
          "value": "\"RUNNING\"",
          "recordFilterGroupId": "21ab452e-c475-59e4-ac2d-0bf38ac3b0f2",
          "positionInRecordFilterGroup": 3
        }
      ],
      "recordFilterGroups": [
        {
          "id": "21ab452e-c475-59e4-ac2d-0bf38ac3b0f2",
          "logicalOperator": "OR"
        }
      ],
      "quantifier": "SOME"
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": "dccf06e5-31d9-43fc-9612-30517caadf5f",
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Stop",
    "icon": "IconPlayerStop",
    "shortLabel": "Stop",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "49027cbf-7155-4b3f-9c87-a076f90cf730",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "RETRY_WORKFLOW_RUN",
    "position": 36,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "d343ba01-6b08-5226-a49e-61037dfc990d",
          "contextKey": "selectedRecords",
          "operand": "IS",
          "subFieldName": "status",
          "value": "\"FAILED\""
        }
      ],
      "quantifier": "SOME"
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": "dccf06e5-31d9-43fc-9612-30517caadf5f",
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Retry",
    "icon": "IconRefresh",
    "shortLabel": "Retry",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "18af7266-0312-486d-acf9-aab6a9f8e9f9",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "SEE_RUNS_WORKFLOW_VERSION",
    "position": 37,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "a20750ba-20b5-554b-ac64-ead1a7832009",
          "contextKey": "selectedRecords",
          "operand": "IS_NOT_EMPTY",
          "subFieldName": "workflow"
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": "055e168c-bc15-4ef0-8928-7743f6b36a3f",
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "See Runs",
    "icon": "IconHistoryToggle",
    "shortLabel": "See Runs",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "e5febc39-5306-4734-b53d-9e0bdcd839f6",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "SEE_WORKFLOW_WORKFLOW_VERSION",
    "position": 38,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "045b84e1-d67e-5ba8-a9d1-1fd3633afe01",
          "contextKey": "selectedRecords",
          "operand": "IS_NOT_EMPTY",
          "subFieldName": "workflow.id"
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": "055e168c-bc15-4ef0-8928-7743f6b36a3f",
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "See Workflow",
    "icon": "IconSettingsAutomation",
    "shortLabel": "See Workflow",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "c29b31dc-aeb9-4955-ab30-a87611109224",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "USE_AS_DRAFT_WORKFLOW_VERSION",
    "position": 39,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "7bf58db2-b61d-5a32-bede-c2e272e38840",
          "contextKey": "selectedRecords",
          "operand": "IS_NOT",
          "subFieldName": "status",
          "value": "\"DRAFT\""
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": "055e168c-bc15-4ef0-8928-7743f6b36a3f",
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Use as Draft",
    "icon": "IconPencil",
    "shortLabel": "Use as Draft",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "81e107d2-ac9b-4b79-b712-a2f45ad0155f",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "SEE_VERSIONS_WORKFLOW_VERSION",
    "position": 40,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "a20750ba-20b5-554b-ac64-ead1a7832009",
          "contextKey": "selectedRecords",
          "operand": "IS_NOT_EMPTY",
          "subFieldName": "workflow"
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": "055e168c-bc15-4ef0-8928-7743f6b36a3f",
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "See Versions History",
    "icon": "IconVersions",
    "shortLabel": "See Versions",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "06503b41-5d7d-4279-8cef-8752970b1041",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "SEARCH_RECORDS",
    "position": 41,
    "isPinned": false,
    "payload": null,
    "hotKeys": [
      "/"
    ],
    "conditionalAvailability": null,
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Search",
    "icon": "IconSearch",
    "shortLabel": "Search",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "79e9391f-8304-42cc-911e-335f994d4abf",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "SEARCH_RECORDS_FALLBACK",
    "position": 42,
    "isPinned": false,
    "payload": null,
    "hotKeys": [
      "/"
    ],
    "conditionalAvailability": null,
    "availabilityType": "FALLBACK",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Search",
    "icon": "IconSearch",
    "shortLabel": "Search",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "de024bdc-3292-4e33-9ff4-13c1018189fa",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "ASK_AI",
    "position": 43,
    "isPinned": true,
    "payload": null,
    "hotKeys": [
      "@"
    ],
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "afc05440-4386-5b1b-84ad-c381d7b587c0",
          "contextKey": "permissionFlags",
          "operand": "IS",
          "subFieldName": "AI",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Ask AI",
    "icon": "IconSparkles",
    "shortLabel": null,
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "98522b3d-8b16-405a-9342-a261b11e4fe7",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "VIEW_PREVIOUS_AI_CHATS",
    "position": 44,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "afc05440-4386-5b1b-84ad-c381d7b587c0",
          "contextKey": "permissionFlags",
          "operand": "IS",
          "subFieldName": "AI",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "View Previous AI Chats",
    "icon": "IconHistory",
    "shortLabel": "Previous AI Chats",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "cbc53ab9-bc0b-4aad-bb3b-27f497cca6a9",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "REPLY_TO_EMAIL_THREAD",
    "position": 45,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "7cfa5a0c-74b8-5a51-86c7-30569681ac76",
          "contextKey": "numberOfSelectedRecords",
          "operand": "IS",
          "value": "1"
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": "272fafcc-c7e5-4a58-a175-67105b43b89a",
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Reply",
    "icon": "IconArrowBackUp",
    "shortLabel": "Reply",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "e6f45db2-bedd-496c-993c-ba3249b0bf6e",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "COMPOSE_EMAIL",
    "position": 46,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "f70ffa4a-c8e1-5c1e-97b8-d13848cc9be4",
          "contextKey": "permissionFlags",
          "operand": "IS",
          "subFieldName": "SEND_EMAIL_TOOL",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Compose Email",
    "icon": "IconMail",
    "shortLabel": "Compose",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "dc4df544-aad5-4f53-99b5-963cf475923d",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 47,
    "isPinned": false,
    "payload": {
      "__typename": "PathCommandMenuItemPayload",
      "path": "/settings/profile"
    },
    "hotKeys": [
      "G",
      "S"
    ],
    "conditionalAvailability": null,
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Settings",
    "icon": "IconSettings",
    "shortLabel": "Settings",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "b2ad9a7e-7022-4cdc-a3db-c9bfbd5f136f",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 48,
    "isPinned": false,
    "payload": {
      "__typename": "PathCommandMenuItemPayload",
      "path": "/settings/experience"
    },
    "hotKeys": null,
    "conditionalAvailability": null,
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Experience Settings",
    "icon": "IconColorSwatch",
    "shortLabel": "Experience",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "3df70e5d-619e-42ac-a910-779bf0d7ff75",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 49,
    "isPinned": false,
    "payload": {
      "__typename": "PathCommandMenuItemPayload",
      "path": "/settings/accounts"
    },
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "90b8a995-600a-5ef5-b7ec-c6608be8b792",
          "contextKey": "permissionFlags",
          "operand": "IS",
          "subFieldName": "CONNECTED_ACCOUNTS",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Accounts Settings",
    "icon": "IconAt",
    "shortLabel": "Accounts",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "4fcfe119-c455-4fc8-8bf6-a822fecc3fc5",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 50,
    "isPinned": false,
    "payload": {
      "__typename": "PathCommandMenuItemPayload",
      "path": "/settings/accounts/emails"
    },
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "90b8a995-600a-5ef5-b7ec-c6608be8b792",
          "contextKey": "permissionFlags",
          "operand": "IS",
          "subFieldName": "CONNECTED_ACCOUNTS",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Emails Settings",
    "icon": "IconMail",
    "shortLabel": "Emails",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "07208629-1b75-4e38-ab62-3114545d653c",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 51,
    "isPinned": false,
    "payload": {
      "__typename": "PathCommandMenuItemPayload",
      "path": "/settings/accounts/calendars"
    },
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "90b8a995-600a-5ef5-b7ec-c6608be8b792",
          "contextKey": "permissionFlags",
          "operand": "IS",
          "subFieldName": "CONNECTED_ACCOUNTS",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Calendars Settings",
    "icon": "IconCalendarEvent",
    "shortLabel": "Calendars",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "74d3702c-848a-4d33-a823-bd2f8d2e9256",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 52,
    "isPinned": false,
    "payload": {
      "__typename": "PathCommandMenuItemPayload",
      "path": "/settings/general"
    },
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "4d702d95-51fe-52e2-9f09-cd515d314f15",
          "contextKey": "permissionFlags",
          "operand": "IS",
          "subFieldName": "WORKSPACE",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to General Settings",
    "icon": "IconSettings",
    "shortLabel": "General",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "a6ecb227-b068-410d-9106-11765d12caec",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 53,
    "isPinned": false,
    "payload": {
      "__typename": "PathCommandMenuItemPayload",
      "path": "/settings/objects"
    },
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "d598aef4-3086-58ff-a69a-7330e5489f95",
          "contextKey": "permissionFlags",
          "operand": "IS",
          "subFieldName": "DATA_MODEL",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Data Model Settings",
    "icon": "IconHierarchy2",
    "shortLabel": "Data Model",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "715e396e-3e0f-4106-8565-bff25d6305f1",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 54,
    "isPinned": false,
    "payload": {
      "__typename": "PathCommandMenuItemPayload",
      "path": "/settings/members"
    },
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "c8766b81-74eb-5453-8ff8-8700ec50fba5",
          "contextKey": "permissionFlags",
          "operand": "IS",
          "subFieldName": "WORKSPACE_MEMBERS",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Members Settings",
    "icon": "IconUsers",
    "shortLabel": "Members",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "da4a46b1-e81c-4490-afc0-261a3c2b3831",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 55,
    "isPinned": false,
    "payload": {
      "__typename": "PathCommandMenuItemPayload",
      "path": "/settings/members#roles"
    },
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "c8766b81-74eb-5453-8ff8-8700ec50fba5",
          "contextKey": "permissionFlags",
          "operand": "IS",
          "subFieldName": "WORKSPACE_MEMBERS",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Roles Settings",
    "icon": "IconLock",
    "shortLabel": "Roles",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "2b6a2222-7bb5-4d11-a12c-90b880aa46a9",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 56,
    "isPinned": false,
    "payload": {
      "__typename": "PathCommandMenuItemPayload",
      "path": "/settings/domains"
    },
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "4d702d95-51fe-52e2-9f09-cd515d314f15",
          "contextKey": "permissionFlags",
          "operand": "IS",
          "subFieldName": "WORKSPACE",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Domains Settings",
    "icon": "IconWorld",
    "shortLabel": "Domains",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "91468a95-3a90-4842-8c2a-ac30b31e03f2",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 57,
    "isPinned": false,
    "payload": {
      "__typename": "PathCommandMenuItemPayload",
      "path": "/settings/billing"
    },
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "4d702d95-51fe-52e2-9f09-cd515d314f15",
          "contextKey": "permissionFlags",
          "operand": "IS",
          "subFieldName": "WORKSPACE",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Billing Settings",
    "icon": "IconCurrencyDollar",
    "shortLabel": "Billing",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "4ae0ad57-7b1c-484e-bc3d-46215bf289b5",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 58,
    "isPinned": false,
    "payload": {
      "__typename": "PathCommandMenuItemPayload",
      "path": "/settings/api-webhooks"
    },
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "38f3959c-0e1c-5e32-83b9-38569107506a",
          "contextKey": "permissionFlags",
          "operand": "IS",
          "subFieldName": "API_KEYS_AND_WEBHOOKS",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to MCP & APIs Settings",
    "icon": "IconPlug",
    "shortLabel": "MCP & APIs",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "c2c525f9-afbb-4977-9e0b-89662716f8e8",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 59,
    "isPinned": false,
    "payload": {
      "__typename": "PathCommandMenuItemPayload",
      "path": "/settings/applications"
    },
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "cbc7f5a3-3dd7-558b-a526-21f8af5c1417",
          "contextKey": "permissionFlags",
          "operand": "IS",
          "subFieldName": "APPLICATIONS",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Apps Settings",
    "icon": "IconApps",
    "shortLabel": "Apps",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "6a71172d-600e-4724-b141-1da9a8474dc8",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 60,
    "isPinned": false,
    "payload": {
      "__typename": "PathCommandMenuItemPayload",
      "path": "/settings/ai"
    },
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "4d702d95-51fe-52e2-9f09-cd515d314f15",
          "contextKey": "permissionFlags",
          "operand": "IS",
          "subFieldName": "WORKSPACE",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to AI Settings",
    "icon": "IconSparkles",
    "shortLabel": "AI",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "cc1aa4d1-76f4-468c-ae9b-0a8c4cf01406",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 61,
    "isPinned": false,
    "payload": {
      "__typename": "PathCommandMenuItemPayload",
      "path": "/settings/security"
    },
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "ab2a5cc1-0c77-532b-bf4b-f5c71b37fe20",
          "contextKey": "permissionFlags",
          "operand": "IS",
          "subFieldName": "SECURITY",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Security Settings",
    "icon": "IconKey",
    "shortLabel": "Security",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "8946b07e-ff90-46e8-b7aa-01f182607ae0",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 62,
    "isPinned": false,
    "payload": {
      "__typename": "PathCommandMenuItemPayload",
      "path": "/settings/admin-panel"
    },
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "63576a44-9e7b-5692-af6a-cf150de0cc7b",
          "contextKey": "canImpersonate",
          "operand": "IS",
          "value": "true",
          "recordFilterGroupId": "a924bc67-6040-5706-8b18-db403f8244a3",
          "positionInRecordFilterGroup": 0
        },
        {
          "id": "ce980b89-0eed-5df8-8c51-78f477f9e11c",
          "contextKey": "canAccessFullAdminPanel",
          "operand": "IS",
          "value": "true",
          "recordFilterGroupId": "a924bc67-6040-5706-8b18-db403f8244a3",
          "positionInRecordFilterGroup": 1
        }
      ],
      "recordFilterGroups": [
        {
          "id": "a924bc67-6040-5706-8b18-db403f8244a3",
          "logicalOperator": "OR"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Admin Panel Settings",
    "icon": "IconServer",
    "shortLabel": "Admin Panel",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "554f9ae5-9be4-44ad-b062-26d479a96942",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 63,
    "isPinned": false,
    "payload": {
      "__typename": "PathCommandMenuItemPayload",
      "path": "/settings/community"
    },
    "hotKeys": null,
    "conditionalAvailability": null,
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Community Settings",
    "icon": "IconUsers",
    "shortLabel": "Community",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "d5a95f05-e46c-4f09-ad4c-f4e9c24855cc",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "COMPOSE_EMAIL",
    "position": 64,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "e3ea29ce-14f5-535d-a8bb-f85b402a71a6",
          "contextKey": "numberOfSelectedRecords",
          "operand": "GREATER_THAN_OR_EQUAL",
          "value": "1"
        },
        {
          "id": "a5cf9cc4-6593-50df-83bb-99eea4d6c1a2",
          "contextKey": "permissionFlags",
          "operand": "IS",
          "subFieldName": "SEND_EMAIL_TOOL",
          "value": "true"
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": "d3f10fb7-eb59-4d61-b551-37a1d9724abf",
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Send Email",
    "icon": "IconMail",
    "shortLabel": "Send Email",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "3c67da08-4723-43db-b007-463e6a55923a",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "COMPOSE_EMAIL",
    "position": 65,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "c1118103-8053-5718-9aba-15b206f1717d",
          "contextKey": "numberOfSelectedRecords",
          "operand": "IS",
          "value": "1"
        },
        {
          "id": "e88ccd1a-7795-569f-abbb-9baf1e013b87",
          "contextKey": "permissionFlags",
          "operand": "IS",
          "subFieldName": "SEND_EMAIL_TOOL",
          "value": "true"
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": "ba21c3f3-7f9c-4cde-8666-378f279b2622",
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Send Email",
    "icon": "IconMail",
    "shortLabel": "Send Email",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "5d7c2850-93c3-4003-ae6a-84b68b363e96",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "COMPOSE_CAMPAIGN",
    "position": 66,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "b701694e-ba2b-5185-a126-9a1e0194dc62",
          "contextKey": "featureFlags",
          "operand": "IS",
          "subFieldName": "IS_MESSAGE_CAMPAIGN_ENABLED",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Compose Campaign",
    "icon": "IconSend",
    "shortLabel": "Campaign",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "c24e6933-f457-4f98-953e-a8fa7a49dbe8",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "COMPOSE_EMAIL",
    "position": 66,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "c1118103-8053-5718-9aba-15b206f1717d",
          "contextKey": "numberOfSelectedRecords",
          "operand": "IS",
          "value": "1"
        },
        {
          "id": "e88ccd1a-7795-569f-abbb-9baf1e013b87",
          "contextKey": "permissionFlags",
          "operand": "IS",
          "subFieldName": "SEND_EMAIL_TOOL",
          "value": "true"
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": "ed6f004f-b5bf-4071-8370-ee7aa91ae2f3",
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Send Email",
    "icon": "IconMail",
    "shortLabel": "Send Email",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "96b368e2-fff1-4db4-a5f1-ae1eebfc44e6",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "COMPOSE_CAMPAIGN",
    "position": 67,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "831e405d-adf6-55f5-a1a7-ffc744aad4ec",
          "contextKey": "pageType",
          "operand": "IS",
          "value": "\"INDEX_PAGE\""
        },
        {
          "id": "dd79a6ef-18f8-5558-a70e-b668158f6c2f",
          "contextKey": "featureFlags",
          "operand": "IS",
          "subFieldName": "IS_MESSAGE_CAMPAIGN_ENABLED",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL_OBJECT_CONTEXT",
    "availabilityObjectMetadataId": "1c5db583-0b37-4eed-a568-208372ecb0f0",
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Create Campaign",
    "icon": "IconPlus",
    "shortLabel": "Create",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "a6511e42-68cb-47af-acfb-74d696783f4b",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "SEND_MESSAGE_CAMPAIGN",
    "position": 68,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "ddf14345-727a-5659-926d-894e0ad58695",
          "contextKey": "numberOfSelectedRecords",
          "operand": "GREATER_THAN_OR_EQUAL",
          "value": "1"
        },
        {
          "id": "d9414f56-f36b-53f1-b81e-b64b3c87a885",
          "contextKey": "selectedRecords",
          "operand": "IS",
          "subFieldName": "status",
          "value": "\"DRAFT\""
        },
        {
          "id": "add9ddf6-8d86-5524-a7d1-3224edc02f0c",
          "contextKey": "selectedRecords",
          "operand": "IS_EMPTY",
          "subFieldName": "deletedAt"
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": "1c5db583-0b37-4eed-a568-208372ecb0f0",
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Send Campaign",
    "icon": "IconSend",
    "shortLabel": "Send",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "f0684cdb-61a5-4b2f-a394-82d74a0cb34b",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "SEND_MESSAGE_CAMPAIGN_TEST",
    "position": 69,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "ddf14345-727a-5659-926d-894e0ad58695",
          "contextKey": "numberOfSelectedRecords",
          "operand": "GREATER_THAN_OR_EQUAL",
          "value": "1"
        },
        {
          "id": "d9414f56-f36b-53f1-b81e-b64b3c87a885",
          "contextKey": "selectedRecords",
          "operand": "IS",
          "subFieldName": "status",
          "value": "\"DRAFT\""
        },
        {
          "id": "add9ddf6-8d86-5524-a7d1-3224edc02f0c",
          "contextKey": "selectedRecords",
          "operand": "IS_EMPTY",
          "subFieldName": "deletedAt"
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": "1c5db583-0b37-4eed-a568-208372ecb0f0",
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Send Test Email",
    "icon": "IconMail",
    "shortLabel": "Test",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "81947136-d43d-42a9-981b-f5d2e0fd7d22",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "EMAIL_BLOCK_SETTINGS",
    "position": 70,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "89cf8b80-4186-549d-a89f-94871f172f76",
          "contextKey": "pageType",
          "operand": "IS",
          "value": "\"RECORD_PAGE\""
        },
        {
          "id": "3582f223-88c5-5711-9ca3-f74540eb30d1",
          "contextKey": "numberOfSelectedRecords",
          "operand": "IS",
          "value": "1"
        },
        {
          "id": "a14fc14d-3c96-5ca7-8ec8-7483fc4015e7",
          "contextKey": "selectedRecords",
          "operand": "IS",
          "subFieldName": "status",
          "value": "\"DRAFT\""
        },
        {
          "id": "061cc873-5732-57d0-9226-fd6bb0754180",
          "contextKey": "selectedRecords",
          "operand": "IS_EMPTY",
          "subFieldName": "deletedAt"
        }
      ]
    },
    "availabilityType": "RECORD_SELECTION",
    "availabilityObjectMetadataId": "1c5db583-0b37-4eed-a568-208372ecb0f0",
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Block Settings",
    "icon": "IconAdjustments",
    "shortLabel": "Design",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "1f97e2f8-95d2-45c1-8b05-8e6057d9fd0b",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 71,
    "isPinned": false,
    "payload": null,
    "hotKeys": [
      "G",
      "C"
    ],
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "4a77411e-5aec-507b-8243-ca5c1da9d1bc",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "company",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Companies",
    "icon": "IconBuildingSkyscraper",
    "shortLabel": "Companies",
    "navigationTargetObjectMetadataId": "ba21c3f3-7f9c-4cde-8666-378f279b2622"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "1ef04a09-eaa0-40b7-948e-f91eb0bde515",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 72,
    "isPinned": false,
    "payload": null,
    "hotKeys": [
      "G",
      "D"
    ],
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "5cd17348-ee9f-53ea-b346-a12d94da25ae",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "dashboard",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Dashboards",
    "icon": "IconLayoutDashboard",
    "shortLabel": "Dashboards",
    "navigationTargetObjectMetadataId": "9ea13a87-2454-423c-ae41-db2cbeab0642"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "c597bf41-f34b-4957-9046-705fd460af85",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 73,
    "isPinned": false,
    "payload": null,
    "hotKeys": [
      "G",
      "N"
    ],
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "be9268d7-0193-58ad-b6ee-69c636290192",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "note",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Notes",
    "icon": "IconNotes",
    "shortLabel": "Notes",
    "navigationTargetObjectMetadataId": "0a534266-c027-48e0-9ce5-2cf5e8187cc0"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "7e924e3a-3cb6-4b6a-8993-2280817f0953",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 74,
    "isPinned": false,
    "payload": null,
    "hotKeys": [
      "G",
      "O"
    ],
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "ec39dbcd-94b5-5baa-8047-c2a22d826787",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "opportunity",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Opportunities",
    "icon": "IconTargetArrow",
    "shortLabel": "Opportunities",
    "navigationTargetObjectMetadataId": "ed6f004f-b5bf-4071-8370-ee7aa91ae2f3"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "3cefadd6-6aac-4e3a-b984-db231e6fc18d",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 75,
    "isPinned": false,
    "payload": null,
    "hotKeys": [
      "G",
      "P"
    ],
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "2bfd8eb5-da6b-526b-870d-fd41cee25d85",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "person",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to People",
    "icon": "IconUser",
    "shortLabel": "People",
    "navigationTargetObjectMetadataId": "d3f10fb7-eb59-4d61-b551-37a1d9724abf"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "f4079903-6305-464b-9f2b-ae922d242e47",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 76,
    "isPinned": false,
    "payload": null,
    "hotKeys": [
      "G",
      "T"
    ],
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "8041b350-3d9f-578b-bcbc-94184d95fce0",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "task",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Tasks",
    "icon": "IconCheckbox",
    "shortLabel": "Tasks",
    "navigationTargetObjectMetadataId": "737b37ea-9bcc-43ef-a550-68977f523c8f"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "703ac6cb-3ccc-4925-a633-8be4062eb86d",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 77,
    "isPinned": false,
    "payload": null,
    "hotKeys": [
      "G",
      "W"
    ],
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "55889e11-f025-58e1-b81d-aae2c2ca9d25",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "workflow",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Workflows",
    "icon": "IconSettingsAutomation",
    "shortLabel": "Workflows",
    "navigationTargetObjectMetadataId": "7fa7fa3c-2efd-4689-9048-559222d3b80d"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "4f3bd29d-68da-4746-8069-52f31b239ac2",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 78,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "cadcbe77-1057-503f-9aff-39d39bd624a7",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "attachment",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Attachments",
    "icon": "IconFileImport",
    "shortLabel": "Attachments",
    "navigationTargetObjectMetadataId": "617a23e4-7d6c-467e-8565-bd8c99d731ab"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "85544b30-b118-4036-a0d5-010f77083f37",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 79,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "e8666adb-b46a-5f51-8d6f-80008cde1f94",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "blocklist",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Blocklists",
    "icon": "IconForbid2",
    "shortLabel": "Blocklists",
    "navigationTargetObjectMetadataId": "8fd6d2bd-eac8-48cc-b922-05e2a706e0bd"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "62fdea8f-fb83-47e4-9618-1beb09febf18",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 80,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "14b3544b-9b4e-546b-b287-4d30ce9ed050",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "calendarChannelEventAssociation",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Calendar Channel Event Associations",
    "icon": "IconCalendar",
    "shortLabel": "Calendar Channel Event Associations",
    "navigationTargetObjectMetadataId": "6410d0ff-7545-46b9-9ff1-53963fd521ad"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "948f5d20-0d13-43a6-acce-e37892de04f4",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 81,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "b761b556-f45c-5b34-b283-bbb351fa4a69",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "calendarEventParticipant",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Calendar event participants",
    "icon": "IconCalendar",
    "shortLabel": "Calendar event participants",
    "navigationTargetObjectMetadataId": "09530818-90e9-40b7-ad4c-e8aac15f2f19"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "cdaed6a7-deab-47bc-968e-d8eda1d7ce94",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 82,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "3e37fee4-95fd-5350-99a0-428a640f0f76",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "calendarEvent",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Calendar events",
    "icon": "IconCalendar",
    "shortLabel": "Calendar events",
    "navigationTargetObjectMetadataId": "586bacbd-a25f-4d07-ba05-52bcf98341df"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "94cf0bb7-e009-4860-925d-be6d183a139c",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 83,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "a1075c97-1b68-5fb4-8d11-d19880e08c83",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "callRecording",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Call Recordings",
    "icon": "IconVideo",
    "shortLabel": "Call Recordings",
    "navigationTargetObjectMetadataId": "5c04283d-bbc6-4b7a-bc57-d89197a9123a"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "60fbb4f6-eec6-45c4-829f-88a570151923",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 84,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "7d0dcaaa-d7cd-5218-b86b-83857127d259",
          "contextKey": "featureFlags",
          "operand": "IS",
          "subFieldName": "IS_MESSAGE_CAMPAIGN_ENABLED",
          "value": "true"
        },
        {
          "id": "c540186c-8bce-563a-89aa-ab23d306683e",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "messageCampaign",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Campaigns",
    "icon": "IconSend",
    "shortLabel": "Campaigns",
    "navigationTargetObjectMetadataId": "1c5db583-0b37-4eed-a568-208372ecb0f0"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "ecd50256-3311-49bd-847e-defc91e1aa3f",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 85,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "c80cbbf1-3062-52bd-9b84-d06bf0d3e87f",
          "contextKey": "featureFlags",
          "operand": "IS",
          "subFieldName": "IS_MESSAGE_CAMPAIGN_ENABLED",
          "value": "true"
        },
        {
          "id": "ca3dba9d-a76c-5a57-91bf-e682fa095d8d",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "messageList",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Lists",
    "icon": "IconUsersGroup",
    "shortLabel": "Lists",
    "navigationTargetObjectMetadataId": "cd013f2a-b377-4766-8065-7425dd85eda7"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "87f1dc6f-49cc-4c42-ae39-df4db66462f9",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 86,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "a015120b-7b48-5c41-8a67-9b17ee929b0c",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "messageListMember",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to List Members",
    "icon": "IconUser",
    "shortLabel": "List Members",
    "navigationTargetObjectMetadataId": "0780b2a2-e2b2-4928-9de5-c7759c9a8486"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "8f7d93ed-8e6c-4896-9095-5fc485faf187",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 87,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "6e53bcbd-4a0b-5d59-a8ce-8540042a2eff",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "messageChannelMessageAssociation",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Message Channel Message Associations",
    "icon": "IconMessage",
    "shortLabel": "Message Channel Message Associations",
    "navigationTargetObjectMetadataId": "f71ef499-4b46-4003-ad14-993a8255a196"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "e4f77527-345c-4b57-bb6d-54eafa6c7e77",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 88,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "c380e7bb-ae2b-5667-b788-e9d63df1edcc",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "messageChannelMessageAssociationMessageFolder",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Message Channel Message Association Message Folders",
    "icon": "IconFolder",
    "shortLabel": "Message Channel Message Association Message Folders",
    "navigationTargetObjectMetadataId": "0618e2da-fc7d-4f7b-a783-f438d163e2f1"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "c27f2213-f379-4515-8ea8-c877334b76e0",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 89,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "2871b874-ffdd-5f5e-9a61-57baeb28431e",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "messageParticipant",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Message Participants",
    "icon": "IconUserCircle",
    "shortLabel": "Message Participants",
    "navigationTargetObjectMetadataId": "6bbdd505-3aa6-4898-9cb3-58da6efb2c17"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "4a6cab9b-5df7-4bd8-992d-49a409feb565",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 90,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "37cbf050-4808-59ac-bf22-85e2273b7737",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "messageThread",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Message Threads",
    "icon": "IconMessage",
    "shortLabel": "Message Threads",
    "navigationTargetObjectMetadataId": "272fafcc-c7e5-4a58-a175-67105b43b89a"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "e21d10bc-d76b-4ea8-b2d3-f5714dd19460",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 91,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "bd0d1ff9-0cce-5143-a0f5-bae26fe534f6",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "message",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Messages",
    "icon": "IconMessage",
    "shortLabel": "Messages",
    "navigationTargetObjectMetadataId": "ad834f16-bf2e-4b2a-a26a-5a39aa8a1f64"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "3b82c03c-f3ac-403f-8d9c-d3e5ce7bc28d",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 92,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "8c20a6cf-6d54-5de8-b959-0d4ecad3f177",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "noteTarget",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Note Targets",
    "icon": "IconCheckbox",
    "shortLabel": "Note Targets",
    "navigationTargetObjectMetadataId": "0efcb02c-df7e-40f4-a762-3f3ac458cb5b"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "3300aac9-bed6-44f6-b2a1-694c7320b999",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 93,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "60d8e8c9-fb7e-53e8-bf3d-e4cc5e93391e",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "taskTarget",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Task Targets",
    "icon": "IconCheckbox",
    "shortLabel": "Task Targets",
    "navigationTargetObjectMetadataId": "cc532b16-3122-42f4-a4e3-830607735055"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "f3caea0a-ed09-48d8-b5ca-d46b790f1a67",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 94,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "13ceaa93-37bf-5cc0-bec2-f1a415292f08",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "timelineActivity",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Timeline Activities",
    "icon": "IconTimelineEvent",
    "shortLabel": "Timeline Activities",
    "navigationTargetObjectMetadataId": "796da54d-e78b-4edc-b5e8-fad439cf3756"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "2bf47c5b-8cc1-4b56-b5b6-8a5e3d4b2252",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 95,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "06fc5dce-8743-53ab-9c50-c6541b569959",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "workflowAutomatedTrigger",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Workflow Automated Triggers",
    "icon": "IconSettingsAutomation",
    "shortLabel": "Workflow Automated Triggers",
    "navigationTargetObjectMetadataId": "046d4a84-c083-44d5-a896-3bcb5b9bb4be"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "73e5b369-20f8-4d55-afac-638d3e92214d",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 96,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "20f9b029-5c4a-5df3-91de-1be7d8c2c0d4",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "workflowRun",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Workflow Runs",
    "icon": "IconHistoryToggle",
    "shortLabel": "Workflow Runs",
    "navigationTargetObjectMetadataId": "dccf06e5-31d9-43fc-9612-30517caadf5f"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "7d933ed7-7113-4907-8981-36f003053011",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 97,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "361eb986-92c7-5855-9ff7-9701391f31ad",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "workflowVersion",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Workflow Versions",
    "icon": "IconVersions",
    "shortLabel": "Workflow Versions",
    "navigationTargetObjectMetadataId": "055e168c-bc15-4ef0-8928-7743f6b36a3f"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "e7f1b035-e943-4e01-8d71-c4b6b344b08c",
    "applicationId": "0be210aa-685b-4c31-9a2a-010b44eacaf5",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 98,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "11ec9307-8498-571c-b563-7e2b1f847e9c",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "workspaceMember",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Workspace Members",
    "icon": "IconUserCircle",
    "shortLabel": "Workspace Members",
    "navigationTargetObjectMetadataId": "d6be2f7c-2b2e-4f0d-a5d3-2c33066b43bb"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "02bdfd83-d212-45bd-8b68-bfdb5a1bfe81",
    "applicationId": "290a2a5c-febf-4d75-bea7-59e106622783",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 99,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "5664090b-8695-5e5b-bfad-56228879ffaa",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "rocket",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Rockets",
    "icon": "IconRocket",
    "shortLabel": "Rockets",
    "navigationTargetObjectMetadataId": "1d184c80-1f66-4397-9a5c-e88b4a38dde4"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "f8a1d580-b721-473e-85af-f62a0b5575d9",
    "applicationId": "290a2a5c-febf-4d75-bea7-59e106622783",
    "workflowVersionId": "1dddc806-4144-5020-898f-b1ab287b89d5",
    "frontComponentId": null,
    "engineComponentKey": "TRIGGER_WORKFLOW_VERSION",
    "position": 100,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": null,
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Quick Lead",
    "icon": "IconUserPlus",
    "shortLabel": "Quick Lead",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "fab46966-e7ed-4275-a98c-19f95dc51765",
    "applicationId": "290a2a5c-febf-4d75-bea7-59e106622783",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 100,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "45549924-9e56-5270-831a-233b096a127e",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "pet",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Pets",
    "icon": "IconCat",
    "shortLabel": "Pets",
    "navigationTargetObjectMetadataId": "56f2d73b-4c3a-4afc-beff-6037ee5023af"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "78c8e787-e9dd-4bca-90ab-7ba97db6b78e",
    "applicationId": "290a2a5c-febf-4d75-bea7-59e106622783",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 101,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "529b0a93-028a-5ca3-8b25-b294afbd0057",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "surveyResult",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Survey results",
    "icon": "IconRulerMeasure",
    "shortLabel": "Survey results",
    "navigationTargetObjectMetadataId": "6c0cac23-57de-461a-95d7-63e71541175b"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "18138020-f910-4bdf-b4cb-4fe5f74bf817",
    "applicationId": "290a2a5c-febf-4d75-bea7-59e106622783",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 102,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "20cb72f5-b136-5082-b0d4-3f620681ffaf",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "employmentHistory",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Employment Histories",
    "icon": "IconBriefcase",
    "shortLabel": "Employment Histories",
    "navigationTargetObjectMetadataId": "9ff8428e-1b16-4734-bafe-9df14bf0c122"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "6f76bb17-8600-4e6b-815c-8cec7857e394",
    "applicationId": "290a2a5c-febf-4d75-bea7-59e106622783",
    "workflowVersionId": null,
    "frontComponentId": null,
    "engineComponentKey": "NAVIGATION",
    "position": 103,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": {
      "recordFilters": [
        {
          "id": "ac5780aa-9e3d-52ac-a16b-472d4076e95e",
          "contextKey": "targetObjectReadPermissions",
          "operand": "IS",
          "subFieldName": "petCareAgreement",
          "value": "true"
        }
      ]
    },
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": null,
    "label": "Go to Pet Care Agreements",
    "icon": "IconPaw",
    "shortLabel": "Pet Care Agreements",
    "navigationTargetObjectMetadataId": "9c8a12aa-00ba-4c95-baa7-10243fa3a802"
  },
  {
    "__typename": "CommandMenuItem",
    "id": "ed287fc2-caf0-4a9c-8879-b034d1e63f9d",
    "applicationId": "290a2a5c-febf-4d75-bea7-59e106622783",
    "workflowVersionId": null,
    "frontComponentId": "7b051d47-04a2-5995-a5a1-1fb624bcdb4f",
    "engineComponentKey": "FRONT_COMPONENT_RENDERER",
    "position": 200,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": null,
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": {
      "id": "7b051d47-04a2-5995-a5a1-1fb624bcdb4f",
      "name": "Hello World",
      "isHeadless": false
    },
    "label": "Hello World",
    "icon": "IconAppWindow",
    "shortLabel": "Hello World",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "477fc69b-a726-4158-a452-319f0b245846",
    "applicationId": "290a2a5c-febf-4d75-bea7-59e106622783",
    "workflowVersionId": null,
    "frontComponentId": "2cb4ad5c-4c59-57ad-a645-4772f9296265",
    "engineComponentKey": "FRONT_COMPONENT_RENDERER",
    "position": 201,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": null,
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": {
      "id": "2cb4ad5c-4c59-57ad-a645-4772f9296265",
      "name": "Show Notification",
      "isHeadless": true
    },
    "label": "Show Notification",
    "icon": "IconBell",
    "shortLabel": "Show Notification",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "d50434c4-f276-4d2b-8bbf-d80712d87468",
    "applicationId": "290a2a5c-febf-4d75-bea7-59e106622783",
    "workflowVersionId": null,
    "frontComponentId": "2cb4ad5c-4c59-57ad-a645-4772f9296265",
    "engineComponentKey": "FRONT_COMPONENT_RENDERER",
    "position": 202,
    "isPinned": true,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": null,
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": "79c58df5-acf4-45d2-b36a-d7ad03c0a88d",
    "isActive": true,
    "frontComponent": {
      "id": "2cb4ad5c-4c59-57ad-a645-4772f9296265",
      "name": "Show Notification",
      "isHeadless": true
    },
    "label": "Show Notification",
    "icon": "IconStar",
    "shortLabel": "Show Notification",
    "navigationTargetObjectMetadataId": null
  },
  {
    "__typename": "CommandMenuItem",
    "id": "4637b40f-79e9-486c-a8dd-364f89f82766",
    "applicationId": "290a2a5c-febf-4d75-bea7-59e106622783",
    "workflowVersionId": null,
    "frontComponentId": "9d1f9ca8-1755-538f-bddb-26994d14a9f6",
    "engineComponentKey": "FRONT_COMPONENT_RENDERER",
    "position": 203,
    "isPinned": false,
    "payload": null,
    "hotKeys": null,
    "conditionalAvailability": null,
    "availabilityType": "GLOBAL",
    "availabilityObjectMetadataId": null,
    "pageLayoutId": null,
    "isActive": true,
    "frontComponent": {
      "id": "9d1f9ca8-1755-538f-bddb-26994d14a9f6",
      "name": "List Companies",
      "isHeadless": false
    },
    "label": "List Companies",
    "icon": "IconBuildingSkyscraper",
    "shortLabel": "List Companies",
    "navigationTargetObjectMetadataId": null
  }
];
