import type { ChatConversation, ChatMessage } from './chat-entities';

export type ChatRealtimeEvent =
  | {
      type: 'conversation-added';
      conversation: ChatConversation;
    }
  | {
      type: 'conversation-updated';
      conversation: ChatConversation;
    }
  | {
      type: 'conversation-removed';
      conversationId: string;
    }
  | {
      type: 'message-added';
      message: ChatMessage;
    }
  | {
      type: 'message-updated';
      message: ChatMessage;
    }
  | {
      type: 'message-removed';
      messageId: string;
      conversationId?: string;
    }
  | {
      type: 'typing';
      conversationId: string;
      userId: string;
      isTyping: boolean;
    }
  | {
      type: 'presence';
      userId: string;
      isOnline: boolean;
    }
  | {
      type: 'read';
      conversationId: string;
      messageId?: string;
      userId?: string;
    };
