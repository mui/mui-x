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
   * Keeps a message that is not in the store out of the visible thread when it belongs to a
   * conversation other than the active one. Returns `false` to apply it now.
   */
  function bufferMessage(message: ChatMessage, isUpdate: boolean): boolean {
    const { activeConversationId } = store.state;
    const { conversationId } = message;

    if (
      activeConversationId == null ||
      conversationId == null ||
      conversationId === activeConversationId
    ) {
      return false;
    }

    // A controlled thread is owned by the parent, so nothing is replayed into it.
    if (store.parameters.messages === undefined) {
      realtimeMessageBuffer.add(conversationId, message, isUpdate);
    }

    return true;
  }

  function handleRealtimeEvent(event: ChatRealtimeEvent): void {
    switch (event.type) {
      case 'message-added':
      case 'message-updated': {
        const { message } = event;
        const isUpdate = event.type === 'message-updated';
        const isStored = Boolean(store.state.messagesById[message.id]);

        // Messages already stored are applied whatever their conversation.
        if (!isStored && bufferMessage(message, isUpdate)) {
          return;
        }
        if (isStored && isUpdate) {
          store.updateMessage(message.id, message);
        } else {
          store.addMessage(message);
        }
        realtimeMessageBuffer.updateIfPresent(message, isUpdate);
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
