import { commandMenuItemsSelector } from '@/command-menu-item/states/commandMenuItemsSelector';
import { getConditionalDisplayFieldMetadataIds } from '@/conditional-display/utils/getConditionalDisplayFieldMetadataIds';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

export const useCommandMenuItemRuleFieldMetadataIds = (
  objectMetadataItemId: string,
): string[] => {
  const commandMenuItems = useAtomStateValue(commandMenuItemsSelector);

  return commandMenuItems
    .filter(
      (commandMenuItem) =>
        commandMenuItem.availabilityObjectMetadataId === objectMetadataItemId,
    )
    .flatMap((commandMenuItem) =>
      getConditionalDisplayFieldMetadataIds(commandMenuItem.conditionalDisplay),
    );
};
