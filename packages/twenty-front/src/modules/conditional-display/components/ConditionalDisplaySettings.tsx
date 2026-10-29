import { ConditionalDisplayRuleModeSelect } from '@/conditional-display/components/ConditionalDisplayRuleModeSelect';
import { useConditionalDisplayRoles } from '@/conditional-display/hooks/useConditionalDisplayRoles';
import { type ConditionalDisplayRuleMode } from '@/conditional-display/types/ConditionalDisplayRuleMode';
import { buildConditionalDisplayFieldSelectLeadingSections } from '@/conditional-display/utils/buildConditionalDisplayFieldSelectLeadingSections';
import { getConditionalDisplaySettingsLabel } from '@/conditional-display/utils/getConditionalDisplaySettingsLabel';
import { mapConditionalDisplayToPersistedRecordFilters } from '@/conditional-display/utils/mapConditionalDisplayToPersistedRecordFilters';
import { sanitizeConditionalDisplay } from '@/conditional-display/utils/sanitizeConditionalDisplay';
import { objectMetadataItemsSelector } from '@/object-metadata/states/objectMetadataItemsSelector';
import { AdvancedFilterSidePanelContainer } from '@/object-record/advanced-filter/side-panel/components/AdvancedFilterSidePanelContainer';
import { RecordFieldsComponentInstanceContext } from '@/object-record/record-field/states/context/RecordFieldsComponentInstanceContext';
import { RecordFilterGroupsComponentInstanceContext } from '@/object-record/record-filter-group/states/context/RecordFilterGroupsComponentInstanceContext';
import { currentRecordFilterGroupsComponentState } from '@/object-record/record-filter-group/states/currentRecordFilterGroupsComponentState';
import { RecordFiltersSettingsInitializeStateEffect } from '@/object-record/record-filter/components/RecordFiltersSettingsInitializeStateEffect';
import { RecordFiltersComponentInstanceContext } from '@/object-record/record-filter/states/context/RecordFiltersComponentInstanceContext';
import { currentRecordFiltersComponentState } from '@/object-record/record-filter/states/currentRecordFiltersComponentState';
import { mapRecordFiltersToPersistedRecordFilters } from '@/object-record/record-filter/utils/mapRecordFiltersToPersistedRecordFilters';
import { SidePanelRecordFiltersDeletedFieldsWarning } from '@/side-panel/components/SidePanelRecordFiltersDeletedFieldsWarning';
import { useAtomComponentStateCallbackState } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateCallbackState';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useSetAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useSetAtomComponentState';
import { styled } from '@linaria/react';
import { useStore } from 'jotai';
import { useState } from 'react';
import {
  type ConditionalDisplay,
  type ConditionalDisplaySurface,
} from 'twenty-shared/types';
import { assertUnreachable, isNonEmptyArray } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme';

const StyledConditionalDisplaySettingsContainer = styled.div`
  display: flex;
  flex-direction: column;

  gap: ${themeCssVariables.spacing[4]};

  padding: ${themeCssVariables.spacing[3]};
`;

type ConditionalDisplaySettingsProps = {
  surface: ConditionalDisplaySurface;
  surfaceId: string;
  conditionalDisplay: ConditionalDisplay | null | undefined;
  objectMetadataId?: string | null;
  onConditionalDisplayChange?: (
    conditionalDisplay: ConditionalDisplay | null,
  ) => void;
};

export const ConditionalDisplaySettings = ({
  surface,
  surfaceId,
  conditionalDisplay,
  objectMetadataId,
  onConditionalDisplayChange,
}: ConditionalDisplaySettingsProps) => {
  const instanceId = `conditional-display-${surface}-${surfaceId}`;

  const { roles } = useConditionalDisplayRoles();

  const fieldSelectLeadingSections =
    buildConditionalDisplayFieldSelectLeadingSections(roles);

  const contextFieldMetadataItems = fieldSelectLeadingSections.flatMap(
    (fieldSelectLeadingSection) => fieldSelectLeadingSection.fieldMetadataItems,
  );

  const objectMetadataItem = useAtomStateValue(
    objectMetadataItemsSelector,
  ).find((item) => item.id === objectMetadataId);

  const currentRecordFilters = useAtomComponentStateValue(
    currentRecordFiltersComponentState,
    instanceId,
  );

  const currentRecordFiltersCallbackState = useAtomComponentStateCallbackState(
    currentRecordFiltersComponentState,
    instanceId,
  );

  const currentRecordFilterGroupsCallbackState =
    useAtomComponentStateCallbackState(
      currentRecordFilterGroupsComponentState,
      instanceId,
    );

  const setCurrentRecordFilters = useSetAtomComponentState(
    currentRecordFiltersComponentState,
    instanceId,
  );

  const setCurrentRecordFilterGroups = useSetAtomComponentState(
    currentRecordFilterGroupsComponentState,
    instanceId,
  );

  const store = useStore();

  const [selectedRuleMode, setSelectedRuleMode] =
    useState<ConditionalDisplayRuleMode>('EVERYONE');

  const ruleMode: ConditionalDisplayRuleMode =
    selectedRuleMode === 'CUSTOM_RULE' ||
    isNonEmptyArray(currentRecordFilters) ||
    isNonEmptyArray(conditionalDisplay?.recordFilters)
      ? 'CUSTOM_RULE'
      : 'EVERYONE';

  const fieldMetadataItems = objectMetadataItem?.fields ?? [];

  const validFieldMetadataIds = new Set(
    [...fieldMetadataItems, ...contextFieldMetadataItems]
      .filter((fieldMetadataItem) => fieldMetadataItem.isActive)
      .map((fieldMetadataItem) => fieldMetadataItem.id),
  );

  const handleConditionalDisplayUpdate = () => {
    onConditionalDisplayChange?.(
      sanitizeConditionalDisplay({
        recordFilters: mapRecordFiltersToPersistedRecordFilters(
          store.get(currentRecordFiltersCallbackState),
        ),
        recordFilterGroups: store.get(currentRecordFilterGroupsCallbackState),
        selectedRecordsMatch: conditionalDisplay?.selectedRecordsMatch,
        fieldMetadataItems,
      }),
    );
  };

  const handleRuleModeChange = (nextRuleMode: ConditionalDisplayRuleMode) => {
    setSelectedRuleMode(nextRuleMode);

    switch (nextRuleMode) {
      case 'EVERYONE':
        setCurrentRecordFilters([]);
        setCurrentRecordFilterGroups([]);
        onConditionalDisplayChange?.(null);
        return;
      case 'CUSTOM_RULE':
        return;
      default:
        assertUnreachable(nextRuleMode);
    }
  };

  return (
    <StyledConditionalDisplaySettingsContainer>
      <RecordFilterGroupsComponentInstanceContext.Provider
        value={{ instanceId }}
      >
        <RecordFiltersComponentInstanceContext.Provider value={{ instanceId }}>
          <ConditionalDisplayRuleModeSelect
            dropdownId={`${instanceId}-rule-mode`}
            label={getConditionalDisplaySettingsLabel(surface)}
            ruleMode={ruleMode}
            onRuleModeChange={handleRuleModeChange}
          />
          {ruleMode === 'CUSTOM_RULE' && (
            <>
              <SidePanelRecordFiltersDeletedFieldsWarning
                validFieldMetadataIds={validFieldMetadataIds}
              />
              <RecordFieldsComponentInstanceContext.Provider
                value={{ instanceId }}
              >
                <AdvancedFilterSidePanelContainer
                  onUpdate={handleConditionalDisplayUpdate}
                  objectMetadataItem={objectMetadataItem}
                  fieldSelectLeadingSections={fieldSelectLeadingSections}
                />
              </RecordFieldsComponentInstanceContext.Provider>
            </>
          )}
          <RecordFiltersSettingsInitializeStateEffect
            initialRecordFilters={{
              recordFilters:
                mapConditionalDisplayToPersistedRecordFilters(
                  conditionalDisplay,
                ),
              recordFilterGroups: conditionalDisplay?.recordFilterGroups ?? [],
            }}
            additionalFieldMetadataItems={contextFieldMetadataItems}
          />
        </RecordFiltersComponentInstanceContext.Provider>
      </RecordFilterGroupsComponentInstanceContext.Provider>
    </StyledConditionalDisplaySettingsContainer>
  );
};
