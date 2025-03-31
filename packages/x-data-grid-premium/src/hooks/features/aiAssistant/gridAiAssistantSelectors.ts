import { createSelector, createRootSelector } from '@mui/x-data-grid-pro/internals';
import type { GridStatePremium } from '../../../models/gridStatePremium';

const gridAiAssistantStateSelector = createRootSelector(
  (state: GridStatePremium) => state.aiAssistant,
);

export const gridAiAssistantPanelOpenSelector = createSelector(
  gridAiAssistantStateSelector,
  (aiAssistant) => aiAssistant?.panelOpen,
);

export const gridAiAssistantHistorySelector = createSelector(
  gridAiAssistantStateSelector,
  (aiAssistant) => aiAssistant?.history,
);

export const gridAiAssistantSuggestionsSelector = createSelector(
  gridAiAssistantStateSelector,
  (aiAssistant) => aiAssistant?.suggestions,
);
