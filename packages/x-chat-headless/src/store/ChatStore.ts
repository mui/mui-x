import { Store } from '@mui/x-internals/store';
import type { ChatConversation, ChatMessage } from '../types/chat-entities';
import type { ChatError } from '../types/chat-error';
import type { ChatInternalState } from '../types/chat-state';

export interface ChatStoreParameters<Cursor = string> {
  defaultMessages?: ChatMessage[];
  defaultConversations?: ChatConversation[];
}

function normalizeMessages(messages: ChatMessage[]) {
  const messageIds: string[] = [];
  const messagesById: Record<string, ChatMessage> = {};
  const seenMessageIds = new Set<string>();

  for (const message of messages) {
    messagesById[message.id] = message;

    if (!seenMessageIds.has(message.id)) {
      seenMessageIds.add(message.id);
      messageIds.push(message.id);
    }
  }

  return { messageIds, messagesById };
}

function normalizeConversations(conversations: ChatConversation[]) {
  const conversationIds: string[] = [];
  const conversationsById: Record<string, ChatConversation> = {};
  const seenConversationIds = new Set<string>();

  for (const conversation of conversations) {
    conversationsById[conversation.id] = conversation;

    if (!seenConversationIds.has(conversation.id)) {
      seenConversationIds.add(conversation.id);
      conversationIds.push(conversation.id);
    }
  }

  return { conversationIds, conversationsById };
}

export class ChatStore<Cursor = string> extends Store<ChatInternalState<Cursor>> {
  public constructor(parameters: ChatStoreParameters<Cursor> = {}) {
    const { defaultMessages = [], defaultConversations = [] } = parameters;
    const { messageIds, messagesById } = normalizeMessages(defaultMessages);
    const { conversationIds, conversationsById } = normalizeConversations(defaultConversations);

    super({
      conversationIds,
      conversationsById,
      activeConversationId: undefined,
      messageIds,
      messagesById,
      isStreaming: false,
      hasMoreHistory: false,
      historyCursor: undefined,
      composerValue: '',
      composerAttachments: [],
      error: null,
    });
  }

  public addMessage = (message: ChatMessage) => {
    const nextMessageIds = this.state.messagesById[message.id]
      ? this.state.messageIds
      : [...this.state.messageIds, message.id];

    this.update({
      messageIds: nextMessageIds,
      messagesById: {
        ...this.state.messagesById,
        [message.id]: message,
      },
    });
  };

  public updateMessage = (id: string, patch: Partial<ChatMessage>) => {
    const currentMessage = this.state.messagesById[id];

    if (!currentMessage) {
      return;
    }

    this.update({
      messagesById: {
        ...this.state.messagesById,
        [id]: {
          ...currentMessage,
          ...patch,
        },
      },
    });
  };

  public removeMessage = (id: string) => {
    if (!this.state.messagesById[id]) {
      return;
    }

    const { [id]: _removedMessage, ...messagesById } = this.state.messagesById;

    this.update({
      messageIds: this.state.messageIds.filter((messageId) => messageId !== id),
      messagesById,
    });
  };

  public prependMessages = (messages: ChatMessage[]) => {
    if (messages.length === 0) {
      return;
    }

    const nextMessagesById = { ...this.state.messagesById };
    const nextMessageIds: string[] = [];
    const existingMessageIds = new Set(this.state.messageIds);
    const prependedMessageIds = new Set<string>();

    for (const message of messages) {
      nextMessagesById[message.id] = message;

      if (!existingMessageIds.has(message.id) && !prependedMessageIds.has(message.id)) {
        prependedMessageIds.add(message.id);
        nextMessageIds.push(message.id);
      }
    }

    this.update({
      messageIds: [...nextMessageIds, ...this.state.messageIds],
      messagesById: nextMessagesById,
    });
  };

  public setConversations = (conversations: ChatConversation[]) => {
    const { conversationIds, conversationsById } = normalizeConversations(conversations);

    this.update({
      conversationIds,
      conversationsById,
    });
  };

  public setActiveConversation = (id: string | undefined) => {
    this.set('activeConversationId', id);
  };

  public setStreaming = (value: boolean) => {
    this.set('isStreaming', value);
  };

  public setError = (error: ChatError | null) => {
    this.set('error', error);
  };

  public resetMessages = () => {
    this.update({
      messageIds: [],
      messagesById: {},
      isStreaming: false,
      hasMoreHistory: false,
      historyCursor: undefined,
      error: null,
    });
  };
}
