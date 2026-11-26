import type * as React from 'react';
import type { ChatStore } from '../../store';
import type { ChatRealtimeEvent } from '../../types/chat-realtime';
import type { RealtimeMessageBuffer } from './realtimeMessageBuffer';
import { applyPresenceUpdate, applyReadUpdate } from './useChatControllerHelpers';

export function createRealtimeActions(params: {
  store: ChatStore<unknown>;
  conversationNavigationRequestIdRef: React.MutableRefObject<number>;
  realtimeMessageBuffer: RealtimeMessageBuffer;
}) {
  const { store, conversationNavigationRequestIdRef, realtimeMessageBuffer } = params;

  function handleRealtimeEvent(event: ChatRealtimeEvent): void {
    switch (event.type) {
      case 'message-added':
      case 'message-updated': {
        const { message } = event;
        const isUpdate = event.type === 'message-updated';
        const isStored = Boolean(store.state.messagesById[message.id]);
        const { activeConversationId } = store.state;

        // A message for another conversation stays out of the visible thread; stored ones are
        // applied whatever their conversation.
        if (
          !isStored &&
          activeConversationId != null &&
          message.conversationId != null &&
          message.conversationId !== activeConversationId
        ) {
          // A controlled thread is owned by the parent, so nothing is replayed into it.
          if (store.parameters.messages === undefined) {
            realtimeMessageBuffer.add(message.conversationId, message, isUpdate);
          }
          return;
        }
        // Before the store write: its change callback may open the conversation and replay the buffer.
        if (message.conversationId != null && message.conversationId === activeConversationId) {
          // The visible thread owns the message now; a held copy could undo a later local delete.
          realtimeMessageBuffer.remove(message.id, message.conversationId);
        } else {
          realtimeMessageBuffer.updateIfPresent(message, isUpdate);
        }
        if (isStored && isUpdate) {
          store.updateMessage(message.id, message);
        } else {
          store.addMessage(message);
        }
        return;
      }
      case 'message-removed':
        realtimeMessageBuffer.remove(event.messageId, event.conversationId);
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
        realtimeMessageBuffer.clear(event.conversationId);
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
