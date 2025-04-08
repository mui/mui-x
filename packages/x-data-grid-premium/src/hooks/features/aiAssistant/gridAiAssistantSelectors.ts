import {
  createSelector,
  createRootSelector,
  createSelectorMemoized,
} from '@mui/x-data-grid-pro/internals';
import type { GridStatePremium } from '../../../models/gridStatePremium';
import { Conversation } from './gridAiAssistantInterfaces';

const gridAiAssistantStateSelector = createRootSelector(
  (state: GridStatePremium) => state.aiAssistant,
);

export const gridAiAssistantPanelOpenSelector = createSelector(
  gridAiAssistantStateSelector,
  (aiAssistant) => aiAssistant?.panelOpen,
);

export const gridAiAssistantActiveConversationIndexSelector = createSelector(
  gridAiAssistantStateSelector,
  (aiAssistant) => aiAssistant?.activeConversationIndex,
);

export const gridAiAssistantConversationsSelector = createSelector(
  gridAiAssistantStateSelector,
  (aiAssistant) => aiAssistant?.conversations,
);

export const gridAiAssistantActiveConversationSelector = createSelectorMemoized(
  gridAiAssistantConversationsSelector,
  gridAiAssistantActiveConversationIndexSelector,
  (conversations, index) => conversations[index] as Conversation | undefined,
);

export const gridAiAssistantSuggestionsSelector = createSelector(
  gridAiAssistantStateSelector,
  (aiAssistant) => aiAssistant?.suggestions,
);
