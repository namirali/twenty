import { type CommandMenuContextApi } from '../CommandMenuContextApi';

export type ConditionalDisplayEvaluationContext =
  Partial<CommandMenuContextApi> & {
    areAllSelectedRecordsFavorites?: boolean;
  };
