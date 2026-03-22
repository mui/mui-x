import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import type { ChatConversation, ChatMessage } from '../types/chat-entities';
import type { ChatInternalState } from '../types/chat-state';

type State<Cursor = string> = ChatInternalState<Cursor>;

export const chatSelectors = {
  messageIds: createSelector((state: State) => state.messageIds),
  messagesById: createSelector((state: State) => state.messagesById),
  conversationIds: createSelector((state: State) => state.conversationIds),
  conversationsById: createSelector((state: State) => state.conversationsById),
  activeConversationId: createSelector((state: State) => state.activeConversationId),
  isStreaming: createSelector((state: State) => state.isStreaming),
  hasMoreHistory: createSelector((state: State) => state.hasMoreHistory),
  error: createSelector((state: State) => state.error),
  messages: createSelectorMemoized(
    (state: State) => state.messageIds,
    (state: State) => state.messagesById,
    (messageIds, messagesById): ChatMessage[] => messageIds.map((id) => messagesById[id]!),
  ),
  message: createSelector(
    (state: State) => state.messagesById,
    (messagesById, id: string): ChatMessage | undefined => messagesById[id],
  ),
  conversations: createSelectorMemoized(
    (state: State) => state.conversationIds,
    (state: State) => state.conversationsById,
    (conversationIds, conversationsById): ChatConversation[] =>
      conversationIds.map((id) => conversationsById[id]!),
  ),
  conversation: createSelector(
    (state: State) => state.conversationsById,
    (conversationsById, id: string): ChatConversation | undefined => conversationsById[id],
  ),
  activeConversation: createSelector(
    (state: State) => state.activeConversationId,
    (state: State) => state.conversationsById,
    (activeConversationId, conversationsById): ChatConversation | undefined =>
      activeConversationId == null ? undefined : conversationsById[activeConversationId],
  ),
  messageCount: createSelector(
    (state: State) => state.messageIds,
    (messageIds): number => messageIds.length,
  ),
  conversationCount: createSelector(
    (state: State) => state.conversationIds,
    (conversationIds): number => conversationIds.length,
  ),
  composerValue: createSelector((state: State) => state.composerValue),
  composerAttachments: createSelector((state: State) => state.composerAttachments),
  /**
   * Returns the IDs of users currently typing in the given conversation.
   * If no conversationId argument is provided, falls back to the active conversation.
   */
  typingUserIds: createSelectorMemoized(
    (state: State) => state.typingByConversation,
    (state: State) => state.activeConversationId,
    (typingByConversation, activeConversationId, conversationId: string | undefined): string[] => {
      const id = conversationId ?? activeConversationId;
      if (!id) {
        return [];
      }
      const byUser = typingByConversation[id];
      if (!byUser) {
        return [];
      }
      return Object.keys(byUser).filter((userId) => byUser[userId]);
    },
  ),
} as const;

export const selectMessageIds = chatSelectors.messageIds;
export const selectMessagesById = chatSelectors.messagesById;
export const selectConversationIds = chatSelectors.conversationIds;
export const selectConversationsById = chatSelectors.conversationsById;
export const selectActiveConversationId = chatSelectors.activeConversationId;
export const selectIsStreaming = chatSelectors.isStreaming;
export const selectHasMoreHistory = chatSelectors.hasMoreHistory;
export const selectError = chatSelectors.error;
export const selectMessages = chatSelectors.messages;
export const selectMessage = chatSelectors.message;
export const selectConversations = chatSelectors.conversations;
export const selectConversation = chatSelectors.conversation;
export const selectActiveConversation = chatSelectors.activeConversation;
export const selectMessageCount = chatSelectors.messageCount;
export const selectConversationCount = chatSelectors.conversationCount;
export const selectComposerValue = chatSelectors.composerValue;
export const selectComposerAttachments = chatSelectors.composerAttachments;
export const selectTypingUserIds = chatSelectors.typingUserIds;
