import { type CommandMenuContextApi } from '../CommandMenuContextApi';

export type ConditionalDisplayEvaluationContext =
  Partial<CommandMenuContextApi> & {
    areAllSelectedRecordsFavorites?: boolean;
    currentRoleId?: string | null;
    currentWorkspaceMemberId?: string | null;
    device?: string | null;
  };
