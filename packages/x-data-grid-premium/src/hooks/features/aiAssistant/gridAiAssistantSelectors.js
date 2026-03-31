import { createSelector, createRootSelector, createSelectorMemoized, } from '@mui/x-data-grid-pro/internals';
const gridAiAssistantStateSelector = createRootSelector((state) => state.aiAssistant);
export const gridAiAssistantActiveConversationIndexSelector = createSelector(gridAiAssistantStateSelector, (aiAssistant) => aiAssistant?.activeConversationIndex);
export const gridAiAssistantConversationsSelector = createSelector(gridAiAssistantStateSelector, (aiAssistant) => aiAssistant?.conversations);
export const gridAiAssistantActiveConversationSelector = createSelectorMemoized(gridAiAssistantConversationsSelector, gridAiAssistantActiveConversationIndexSelector, (conversations, index) => conversations[index]);
