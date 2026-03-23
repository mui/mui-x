import { Store } from '@mui/x-internals/store';
import type { ChatConversation, ChatDraftAttachment, ChatMessage, ChatUser } from '../types/chat-entities';
import type { ChatError } from '../types/chat-error';
import type { ChatInternalState } from '../types/chat-state';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ChatStoreParameters<Cursor = string> {
  /** All participants in the chat. The current (local) user is derived as the first member with `role === 'user'`, unless `currentUser` is provided explicitly. */
  members?: ChatUser[];
  /** The local user sending messages. If omitted, derived from `members` by finding the entry with `role === 'user'`. */
  currentUser?: ChatUser;
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

export type ControlledModel =
  | 'messages'
  | 'conversations'
  | 'activeConversationId'
  | 'composerValue';

export interface ChatStoreConstructor<Cursor = string> {
  new (parameters: ChatStoreParameters<Cursor>): ChatStore<Cursor>;
}

function applyModelInitialValue<T>(
  controlledValue: T | undefined,
  defaultValue: T | undefined,
  fallback: T,
): T {
  if (controlledValue !== undefined) {
    return controlledValue;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  return fallback;
}

function normalizeById<T extends { id: string }>(
  items: T[],
): { ids: string[]; byId: Record<string, T> } {
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

/**
 * Returns `prevIds` when the two arrays contain the same strings in the same
 * order, avoiding a new reference that would trigger downstream re-renders
 * (e.g. `useMessageIds()`) when only message bodies changed.
 */
function stableIds(prevIds: string[], nextIds: string[]): string[] {
  if (prevIds === nextIds) {
    return prevIds;
  }

  if (prevIds.length !== nextIds.length) {
    return nextIds;
  }

  for (let i = 0; i < prevIds.length; i += 1) {
    if (prevIds[i] !== nextIds[i]) {
      return nextIds;
    }
  }

  return prevIds;
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
    composerValue: applyModelInitialValue(
      parameters.composerValue,
      parameters.defaultComposerValue,
      '',
    ),
  };
}

export class ChatStore<Cursor = string> extends Store<ChatInternalState<Cursor>> {
  public parameters: ChatStoreParameters<Cursor>;

  /** Local (sending) user: explicit prop → members list → active conversation participants. */
  get currentUser(): ChatUser | undefined {
    return this.getMemberByRole('user', this.parameters.currentUser);
  }

  /** Assistant member: members list → active conversation participants. */
  get assistantUser(): ChatUser | undefined {
    return this.getMemberByRole('assistant');
  }

  private getMemberByRole(role: 'user' | 'assistant', explicit?: ChatUser): ChatUser | undefined {
    if (explicit) {
      return explicit;
    }
    if (this.parameters.members) {
      return this.parameters.members.find((m) => m.role === role);
    }
    const convId = this.state.activeConversationId;
    const conv = convId ? this.state.conversationsById[convId] : undefined;
    return conv?.participants?.find((p) => p.role === role);
  }

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
      typingByConversation: {},
      activeStreamAbortController: null,
      isStreaming: false,
      hasMoreHistory: false,
      historyCursor: undefined,
      composerValue,
      composerIsComposing: false,
      composerAttachments: [],
      error: null,
    });

    this.parameters = parameters;
  }

  public updateStateFromParameters = (parameters: ChatStoreParameters<Cursor>) => {
    const newState: Partial<ChatInternalState<Cursor>> = {};

    if (
      parameters.messages !== undefined &&
      (parameters.messages !== this.parameters.messages ||
        this.dirtyControlledModels.has('messages'))
    ) {
      const { ids: messageIds, byId: messagesById } = normalizeById(parameters.messages);
      newState.messageIds = stableIds(this.state.messageIds, messageIds);
      newState.messagesById = messagesById;
      this.dirtyControlledModels.delete('messages');
    }

    if (
      parameters.conversations !== undefined &&
      (parameters.conversations !== this.parameters.conversations ||
        this.dirtyControlledModels.has('conversations'))
    ) {
      const { ids: conversationIds, byId: conversationsById } = normalizeById(
        parameters.conversations,
      );
      newState.conversationIds = stableIds(this.state.conversationIds, conversationIds);
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

  /**
   * Returns a cleanup function to be used as a React effect teardown.
   * Called by `useChatInstance` when the store instance changes or the component unmounts.
   * Currently a no-op; extend this when the store manages subscriptions or timers
   * that need explicit teardown on disposal.
   */
  public disposeEffect = (): (() => void) => {
    return () => {
      // TODO: cancel any pending store subscriptions or timers here
    };
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
  };

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

    const { [id]: removedMessage, ...messagesById } = this.state.messagesById;
    void removedMessage;

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

  public addConversation = (conversation: ChatConversation) => {
    const nextConversationIds = this.state.conversationsById[conversation.id]
      ? this.state.conversationIds
      : [...this.state.conversationIds, conversation.id];

    this.dirtyControlledModels.add('conversations');
    this.update({
      conversationIds: nextConversationIds,
      conversationsById: {
        ...this.state.conversationsById,
        [conversation.id]: conversation,
      },
    });
  };

  public updateConversation = (id: string, patch: Partial<ChatConversation>) => {
    const currentConversation = this.state.conversationsById[id];

    if (!currentConversation) {
      return;
    }

    this.dirtyControlledModels.add('conversations');
    this.update({
      conversationsById: {
        ...this.state.conversationsById,
        [id]: {
          ...currentConversation,
          ...patch,
        },
      },
    });
  };

  public removeConversation = (id: string) => {
    if (!this.state.conversationsById[id]) {
      return;
    }

    const { [id]: removedConversation, ...conversationsById } = this.state.conversationsById;
    void removedConversation;

    this.dirtyControlledModels.add('conversations');
    this.update({
      conversationIds: this.state.conversationIds.filter((conversationId) => conversationId !== id),
      conversationsById,
    });
  };

  public setActiveConversation = (id: string | undefined) => {
    this.dirtyControlledModels.add('activeConversationId');
    this.set('activeConversationId', id);
  };

  public setTypingUser = (conversationId: string, userId: string, isTyping: boolean) => {
    const current = this.state.typingByConversation[conversationId] ?? {};

    if (current[userId] === isTyping) {
      return;
    }

    this.update({
      typingByConversation: {
        ...this.state.typingByConversation,
        [conversationId]: {
          ...current,
          [userId]: isTyping,
        },
      },
    });
  };

  public setComposerValue = (value: string) => {
    this.dirtyControlledModels.add('composerValue');
    this.set('composerValue', value);
  };

  public setComposerIsComposing = (value: boolean) => {
    this.set('composerIsComposing', value);
  };

  public setComposerAttachments = (attachments: ChatDraftAttachment[]) => {
    this.set('composerAttachments', attachments);
  };

  public addComposerAttachment = (attachment: ChatDraftAttachment) => {
    this.setComposerAttachments([...this.state.composerAttachments, attachment]);
  };

  public removeComposerAttachment = (localId: string) => {
    const nextAttachments = this.state.composerAttachments.filter(
      (attachment) => attachment.localId !== localId,
    );

    if (nextAttachments.length === this.state.composerAttachments.length) {
      return;
    }

    this.setComposerAttachments(nextAttachments);
  };

  public clearComposer = () => {
    this.dirtyControlledModels.add('composerValue');
    this.update({
      composerValue: '',
      composerIsComposing: false,
      composerAttachments: [],
    });
  };

  public setStreaming = (value: boolean) => {
    this.set('isStreaming', value);
  };

  public setActiveStreamAbortController = (value: AbortController | null) => {
    this.set('activeStreamAbortController', value);
  };

  public setError = (error: ChatError | null) => {
    this.set('error', error);
  };

  public setHistoryState = ({
    cursor,
    hasMore,
  }: {
    cursor: Cursor | undefined;
    hasMore: boolean;
  }) => {
    this.update({
      historyCursor: cursor,
      hasMoreHistory: hasMore,
    });
  };

  public resetMessages = () => {
    this.dirtyControlledModels.add('messages');
    this.update({
      messageIds: [],
      messagesById: {},
      activeStreamAbortController: null,
      isStreaming: false,
      hasMoreHistory: false,
      historyCursor: undefined,
      error: null,
    });
  };
}
