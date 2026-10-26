import { fastDeepEqual } from 'twenty-shared/utils';

import { type EngineGateOriginal } from 'src/database/commands/upgrade-version-command/2-52/types/engine-gate-original.type';

export const buildEngineGateOriginal = ({
  original,
  migrated,
}: {
  original: EngineGateOriginal;
  migrated: EngineGateOriginal;
}): EngineGateOriginal | undefined =>
  fastDeepEqual(original.conditionalDisplay, migrated.conditionalDisplay) &&
  fastDeepEqual(original.overrides, migrated.overrides)
    ? undefined
    : {
        conditionalDisplay: original.conditionalDisplay,
        overrides: original.overrides,
      };
