import {
  createSelector,
  createRootSelector,
  createSelectorMemoized,
} from '@mui/x-data-grid-pro/internals';
import type { GridStatePremium } from '../../../models/gridStatePremium';

const gridAiAssistantStateSelector = createRootSelector(
  (state: GridStatePremium) => state.aiAssistant,
);

export const gridAiAssistantPanelOpenSelector = createSelector(
  gridAiAssistantStateSelector,
  (aiAssistant) => aiAssistant?.panelOpen,
);

export const gridAiAssistantActiveConversationIdSelector = createSelector(
  gridAiAssistantStateSelector,
  (aiAssistant) => aiAssistant?.activeConversationId,
);

export const gridAiAssistantConversationsSelector = createSelector(
  gridAiAssistantStateSelector,
  (aiAssistant) => aiAssistant?.conversations,
);

export const gridAiAssistantConversationSelector = createSelectorMemoized(
  gridAiAssistantConversationsSelector,
  (conversations, id: string) => conversations.find((c) => c.id === id),
);

export const gridAiAssistantSuggestionsSelector = createSelector(
  gridAiAssistantStateSelector,
  (aiAssistant) => aiAssistant?.suggestions,
);
