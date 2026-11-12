import type * as React from 'react';
import type { ChatStore } from '../../store';
import type { ChatRealtimeEvent } from '../../types/chat-realtime';
import { applyPresenceUpdate, applyReadUpdate } from './useChatControllerHelpers';

export function createRealtimeActions(params: {
  store: ChatStore<unknown>;
  conversationNavigationRequestIdRef: React.MutableRefObject<number>;
}) {
  const { store, conversationNavigationRequestIdRef } = params;

  // Ignore message events for other conversations unless the message is already stored (e.g. controlled messages).
  function isOtherConversation(conversationId: string | undefined): boolean {
    const activeId = store.state.activeConversationId;
    return conversationId != null && activeId != null && conversationId !== activeId;
  }

  function handleRealtimeEvent(event: ChatRealtimeEvent): void {
    switch (event.type) {
      case 'message-added':
        if (
          !store.state.messagesById[event.message.id] &&
          isOtherConversation(event.message.conversationId)
        ) {
          return;
        }
        store.addMessage(event.message);
        return;
      case 'message-updated':
        if (store.state.messagesById[event.message.id]) {
          store.updateMessage(event.message.id, event.message);
        } else if (!isOtherConversation(event.message.conversationId)) {
          store.addMessage(event.message);
        }
        return;
      case 'message-removed':
        store.removeMessage(event.messageId);
        return;
      case 'conversation-added':
        store.addConversation(event.conversation);
        return;
      case 'conversation-updated':
        if (store.state.conversationsById[event.conversation.id]) {
          store.updateConversation(event.conversation.id, event.conversation);
        } else {
          store.addConversation(event.conversation);
        }
        return;
      case 'conversation-removed':
        store.removeConversation(event.conversationId);

        if (store.state.activeConversationId === event.conversationId) {
          conversationNavigationRequestIdRef.current += 1;
          store.setActiveConversation(undefined);
          store.resetMessages();
        }
        return;
      case 'presence':
        applyPresenceUpdate(store, event);
        return;
      case 'read':
        applyReadUpdate(store, event);
        return;
      case 'typing':
        store.setTypingUser(event.conversationId, event.userId, event.isTyping);
        return;
      default:
    }
  }

  return { handleRealtimeEvent };
}
