import { isPlainObject } from 'twenty-shared/utils';

import { LEGACY_CONDITIONAL_EXPRESSION_OVERRIDE_PROPERTY } from 'src/database/commands/upgrade-version-command/2-54/constants/legacy-conditional-expression-override-property.constant';
import { type AuthoredOverrides } from 'src/engine/metadata-modules/overrides/types/authored-overrides.type';
import { normalizeAuthoredOverrides } from 'src/engine/metadata-modules/overrides/utils/normalize-authored-overrides.util';

export const normalizeLegacyAuthoredOverrides = ({
  overrides,
  workspaceCustomApplicationUniversalIdentifier,
}: {
  overrides: unknown;
  workspaceCustomApplicationUniversalIdentifier: string;
}): AuthoredOverrides<Record<string, unknown>> | null => {
  if (
    isPlainObject(overrides) &&
    LEGACY_CONDITIONAL_EXPRESSION_OVERRIDE_PROPERTY in overrides
  ) {
    return { [workspaceCustomApplicationUniversalIdentifier]: overrides };
  }

  return normalizeAuthoredOverrides<Record<string, unknown>>({
    metadataName: 'pageLayoutWidget',
    overrides,
    workspaceCustomApplicationUniversalIdentifier,
  });
};
