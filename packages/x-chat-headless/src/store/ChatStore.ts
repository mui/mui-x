import { Store } from '@mui/x-internals/store';
import type { ChatConversation, ChatMessage } from '../types/chat-entities';
import type { ChatError } from '../types/chat-error';
import type { ChatInternalState } from '../types/chat-state';

export interface ChatStoreParameters<Cursor = string> {
  messages?: ChatMessage[];
  defaultMessages?: ChatMessage[];
  onMessagesChange?: (messages: ChatMessage[]) => void;
  conversations?: ChatConversation[];
  defaultConversations?: ChatConversation[];
  onConversationsChange?: (conversations: ChatConversation[]) => void;
  activeConversationId?: string;
  defaultActiveConversationId?: string;
  onActiveConversationChange?: (conversationId: string | undefined) => void;
  composerValue?: string;
  defaultComposerValue?: string;
  onComposerValueChange?: (value: string) => void;
}

export type ControlledModel = 'messages' | 'conversations' | 'activeConversationId' | 'composerValue';

export interface ChatStoreConstructor<Cursor = string> {
  new (parameters: ChatStoreParameters<Cursor>): ChatStore<Cursor>;
}

function applyModelInitialValue<T>(controlledValue: T | undefined, defaultValue: T | undefined, fallback: T): T {
  if (controlledValue !== undefined) {
    return controlledValue;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  return fallback;
}

function normalizeById<T extends { id: string }>(items: T[]): { ids: string[]; byId: Record<string, T> } {
  const ids: string[] = [];
  const byId: Record<string, T> = {};
  const seen = new Set<string>();

  for (const item of items) {
    byId[item.id] = item;

    if (!seen.has(item.id)) {
      seen.add(item.id);
      ids.push(item.id);
    }
  }

  return { ids, byId };
}

function deriveStateFromParameters<Cursor = string>(parameters: ChatStoreParameters<Cursor>) {
  const { ids: messageIds, byId: messagesById } = normalizeById(
    applyModelInitialValue(parameters.messages, parameters.defaultMessages, []),
  );
  const { ids: conversationIds, byId: conversationsById } = normalizeById(
    applyModelInitialValue(parameters.conversations, parameters.defaultConversations, []),
  );

  return {
    conversationIds,
    conversationsById,
    activeConversationId: applyModelInitialValue(
      parameters.activeConversationId,
      parameters.defaultActiveConversationId,
      undefined,
    ),
    messageIds,
    messagesById,
    composerValue: applyModelInitialValue(parameters.composerValue, parameters.defaultComposerValue, ''),
  };
}

export class ChatStore<Cursor = string> extends Store<ChatInternalState<Cursor>> {
  public parameters: ChatStoreParameters<Cursor>;

  private dirtyControlledModels = new Set<ControlledModel>();

  public constructor(parameters: ChatStoreParameters<Cursor> = {}) {
    const {
      messageIds,
      messagesById,
      conversationIds,
      conversationsById,
      activeConversationId,
      composerValue,
    } = deriveStateFromParameters(parameters);

    super({
      conversationIds,
      conversationsById,
      activeConversationId,
      messageIds,
      messagesById,
      isStreaming: false,
      hasMoreHistory: false,
      historyCursor: undefined,
      composerValue,
      composerAttachments: [],
      error: null,
    });

    this.parameters = parameters;
  }

  public updateStateFromParameters = (parameters: ChatStoreParameters<Cursor>) => {
    const newState: Partial<ChatInternalState<Cursor>> = {};

    if (parameters.messages !== undefined && (parameters.messages !== this.parameters.messages || this.dirtyControlledModels.has('messages'))) {
      const { ids: messageIds, byId: messagesById } = normalizeById(parameters.messages);
      newState.messageIds = messageIds;
      newState.messagesById = messagesById;
      this.dirtyControlledModels.delete('messages');
    }

    if (
      parameters.conversations !== undefined &&
      (parameters.conversations !== this.parameters.conversations ||
        this.dirtyControlledModels.has('conversations'))
    ) {
      const { ids: conversationIds, byId: conversationsById } = normalizeById(parameters.conversations);
      newState.conversationIds = conversationIds;
      newState.conversationsById = conversationsById;
      this.dirtyControlledModels.delete('conversations');
    }

    if (
      parameters.activeConversationId !== undefined &&
      (parameters.activeConversationId !== this.parameters.activeConversationId ||
        this.dirtyControlledModels.has('activeConversationId'))
    ) {
      newState.activeConversationId = parameters.activeConversationId;
      this.dirtyControlledModels.delete('activeConversationId');
    }

    if (
      parameters.composerValue !== undefined &&
      (parameters.composerValue !== this.parameters.composerValue ||
        this.dirtyControlledModels.has('composerValue'))
    ) {
      newState.composerValue = parameters.composerValue;
      this.dirtyControlledModels.delete('composerValue');
    }

    this.parameters = parameters;
    this.update(newState);
  };

  public disposeEffect = () => {
    return () => {};
  };

  public registerStoreEffect = <Value>(
    selector: (state: ChatInternalState<Cursor>) => Value,
    effect: (previous: Value, next: Value) => void,
  ) => {
    let previousValue = selector(this.state);

    return this.subscribe((state) => {
      const nextValue = selector(state);

      if (!Object.is(previousValue, nextValue)) {
        effect(previousValue, nextValue);
        previousValue = nextValue;
      }
    });
  }

  public addMessage = (message: ChatMessage) => {
    const nextMessageIds = this.state.messagesById[message.id]
      ? this.state.messageIds
      : [...this.state.messageIds, message.id];

    this.dirtyControlledModels.add('messages');
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

    this.dirtyControlledModels.add('messages');
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

    this.dirtyControlledModels.add('messages');
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

    this.dirtyControlledModels.add('messages');
    this.update({
      messageIds: [...nextMessageIds, ...this.state.messageIds],
      messagesById: nextMessagesById,
    });
  };

  public setMessages = (messages: ChatMessage[]) => {
    const { ids: messageIds, byId: messagesById } = normalizeById(messages);

    this.dirtyControlledModels.add('messages');
    this.update({
      messageIds,
      messagesById,
    });
  };

  public setConversations = (conversations: ChatConversation[]) => {
    const { ids: conversationIds, byId: conversationsById } = normalizeById(conversations);

    this.dirtyControlledModels.add('conversations');
    this.update({
      conversationIds,
      conversationsById,
    });
  };

  public setActiveConversation = (id: string | undefined) => {
    this.dirtyControlledModels.add('activeConversationId');
    this.set('activeConversationId', id);
  };

  public setComposerValue = (value: string) => {
    this.dirtyControlledModels.add('composerValue');
    this.set('composerValue', value);
  };

  public setStreaming = (value: boolean) => {
    this.set('isStreaming', value);
  };

  public setError = (error: ChatError | null) => {
    this.set('error', error);
  };

  public resetMessages = () => {
    this.dirtyControlledModels.add('messages');
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
