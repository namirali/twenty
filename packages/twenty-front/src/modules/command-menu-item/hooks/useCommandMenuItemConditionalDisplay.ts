import { useConditionalDisplayCurrentUserContext } from '@/conditional-display/hooks/useConditionalDisplayCurrentUserContext';
import { type ConditionalDisplayEvaluationContext } from '@/conditional-display/types/ConditionalDisplayEvaluationContext';
import { evaluateConditionalDisplayWithObjectMetadata } from '@/conditional-display/utils/evaluateConditionalDisplayWithObjectMetadata';
import { getConditionalDisplayDevice } from '@/conditional-display/utils/getConditionalDisplayDevice';
import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';
import { useMemo } from 'react';
import { useIsMobile } from 'twenty-ui/utilities';
import {
  type CommandMenuContextApi,
  type ConditionalDisplay,
} from 'twenty-shared/types';
import { type CommandMenuItemFieldsFragment } from '~/generated-metadata/graphql';

export const useCommandMenuItemConditionalDisplay = (
  commandMenuContextApi: CommandMenuContextApi,
) => {
  const { objectMetadataItems } = useObjectMetadataItems();

  const { currentRoleId, currentWorkspaceMemberId } =
    useConditionalDisplayCurrentUserContext();

  const isMobile = useIsMobile();

  return useMemo(() => {
    const conditionalDisplayContext: ConditionalDisplayEvaluationContext = {
      ...commandMenuContextApi,
      currentRoleId,
      currentWorkspaceMemberId,
      device: getConditionalDisplayDevice({
        isMobile,
        isInSidePanel: commandMenuContextApi.isInSidePanel,
      }),
    };

    const evaluateForCommandMenuItem = (
      conditionalDisplay: ConditionalDisplay | null | undefined,
      item: CommandMenuItemFieldsFragment,
    ) =>
      evaluateConditionalDisplayWithObjectMetadata({
        conditionalDisplay,
        context: conditionalDisplayContext,
        records: commandMenuContextApi.selectedRecords,
        objectMetadataItem: objectMetadataItems.find(
          (objectMetadataItem) =>
            objectMetadataItem.id === item.availabilityObjectMetadataId,
        ),
        objectMetadataItems,
      });

    const doesCommandMenuItemMatchConditionalDisplay = (
      item: CommandMenuItemFieldsFragment,
    ) => evaluateForCommandMenuItem(item.conditionalDisplay, item);

    const isCommandMenuItemShown = (item: CommandMenuItemFieldsFragment) =>
      evaluateForCommandMenuItem(item.conditionalAvailability, item) &&
      doesCommandMenuItemMatchConditionalDisplay(item);

    return {
      conditionalDisplayContext,
      doesCommandMenuItemMatchConditionalDisplay,
      isCommandMenuItemShown,
    };
  }, [
    commandMenuContextApi,
    currentRoleId,
    currentWorkspaceMemberId,
    isMobile,
    objectMetadataItems,
  ]);
};
