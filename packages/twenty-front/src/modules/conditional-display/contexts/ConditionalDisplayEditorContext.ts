import { createContext } from 'react';
import { type ConditionalDisplayAdminContextKey } from 'twenty-shared/types';

type ConditionalDisplayEditorContextValue = {
  availableContextKeys: ConditionalDisplayAdminContextKey[];
};

export const ConditionalDisplayEditorContext =
  createContext<ConditionalDisplayEditorContextValue>({
    availableContextKeys: [],
  });
