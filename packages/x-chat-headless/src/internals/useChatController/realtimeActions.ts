import type * as React from 'react';
import type { ChatStore } from '../../store';
import type { ChatMessage } from '../../types/chat-entities';
import type { ChatRealtimeEvent } from '../../types/chat-realtime';
import type { RealtimeMessageBuffer } from './realtimeMessageBuffer';
import { applyPresenceUpdate, applyReadUpdate } from './useChatControllerHelpers';

export function createRealtimeActions(params: {
  store: ChatStore<unknown>;
  conversationNavigationRequestIdRef: React.MutableRefObject<number>;
  realtimeMessageBuffer: RealtimeMessageBuffer;
}) {
  const { store, conversationNavigationRequestIdRef, realtimeMessageBuffer } = params;

  /**
   * Keeps a message that is not in the store out of the visible thread when it belongs to another
   * conversation, or to the active one while its history loads. Returns `false` to apply it now.
   */
  function bufferMessage(message: ChatMessage): boolean {
    const { activeConversationId, historyStatus } = store.state;

    if (activeConversationId == null) {
      return false;
    }

    const conversationId = message.conversationId ?? activeConversationId;
    // A controlled thread is owned by the parent, so nothing is replayed into it.
    const isControlled = store.parameters.messages !== undefined;

    if (conversationId === activeConversationId) {
      if (historyStatus !== 'loading' || isControlled) {
        return false;
      }

      realtimeMessageBuffer.add(conversationId, message, true);
      return true;
    }

    if (!isControlled) {
      realtimeMessageBuffer.add(conversationId, message, false);
    }

    return true;
  }

  function handleRealtimeEvent(event: ChatRealtimeEvent): void {
    switch (event.type) {
      case 'message-added':
        // Messages already stored are applied whatever their conversation.
        if (store.state.messagesById[event.message.id] || !bufferMessage(event.message)) {
          store.addMessage(event.message);
        }
        return;
      case 'message-updated':
        if (store.state.messagesById[event.message.id]) {
          store.updateMessage(event.message.id, event.message);
        } else if (!bufferMessage(event.message)) {
          store.addMessage(event.message);
        }
        return;
      case 'message-removed':
        realtimeMessageBuffer.remove(event.messageId);
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
