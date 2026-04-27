import { Store } from '@mui/x-internals/store';
import type {
  ChatConversation,
  ChatDraftAttachment,
  ChatMessage,
  ChatUser,
} from '../types/chat-entities';
import type { ChatError } from '../types/chat-error';
import type { ChatInternalState } from '../types/chat-state';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ChatStoreParameters<Cursor = string> {
  /** All participants in the chat. The current (local) user is derived as the first member with `role === 'user'`, unless `currentUser` is provided explicitly. */
  members?: ChatUser[];
  /** The local user sending messages. If omitted, derived from `members` by finding the entry with `role === 'user'`. */
  currentUser?: ChatUser;
  messages?: ChatMessage[];
  /** The initial messages when uncontrolled. Ignored after initialization and when `messages` is provided. */
  initialMessages?: ChatMessage[];
  onMessagesChange?: (messages: ChatMessage[]) => void;
  conversations?: ChatConversation[];
  /** The initial conversations when uncontrolled. Ignored after initialization and when `conversations` is provided. */
  initialConversations?: ChatConversation[];
  onConversationsChange?: (conversations: ChatConversation[]) => void;
  activeConversationId?: string;
  /** Internal flag used to distinguish a controlled `undefined` active conversation from an uncontrolled model. */
  activeConversationIdControlled?: boolean;
  /** The initial active conversation ID when uncontrolled. Ignored after initialization and when `activeConversationId` is provided. */
  initialActiveConversationId?: string;
  onActiveConversationChange?: (conversationId: string | undefined) => void;
  composerValue?: string;
  /** The initial composer value when uncontrolled. Ignored after initialization and when `composerValue` is provided. */
  initialComposerValue?: string;
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

function pruneMessageErrorsById(
  messageErrorsById: Record<string, ChatError | undefined>,
  messageIds: string[],
): Record<string, ChatError | undefined> {
  if (messageIds.length === 0) {
    return {};
  }

  const allowedIds = new Set(messageIds);
  const nextMessageErrorsById: Record<string, ChatError | undefined> = {};

  for (const [messageId, error] of Object.entries(messageErrorsById)) {
    if (allowedIds.has(messageId) && error != null) {
      nextMessageErrorsById[messageId] = error;
    }
  }

  return nextMessageErrorsById;
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
    applyModelInitialValue(parameters.messages, parameters.initialMessages, []),
  );
  const { ids: conversationIds, byId: conversationsById } = normalizeById(
    applyModelInitialValue(parameters.conversations, parameters.initialConversations, []),
  );

  return {
    conversationIds,
    conversationsById,
    activeConversationId: parameters.activeConversationIdControlled
      ? parameters.activeConversationId
      : applyModelInitialValue(
          parameters.activeConversationId,
          parameters.initialActiveConversationId,
          undefined,
        ),
    messageIds,
    messagesById,
    composerValue: applyModelInitialValue(
      parameters.composerValue,
      parameters.initialComposerValue,
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
    const fromParticipants = conv?.participants?.find((p) => p.role === role);
    if (fromParticipants) {
      return fromParticipants;
    }
    // Derive from message authors as last resort
    for (const msg of Object.values(this.state.messagesById)) {
      if (msg.author?.role === role) {
        return msg.author;
      }
    }
    return undefined;
  }

  private dirtyControlledModels = new Set<ControlledModel>();

  /** Whether any controlled model has been internally mutated since the last parameter sync. */
  get hasDirtyControlledModels(): boolean {
    return this.dirtyControlledModels.size > 0;
  }

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
      messageErrorsById: {},
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
      newState.messageErrorsById = pruneMessageErrorsById(this.state.messageErrorsById, messageIds);
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
      parameters.activeConversationIdControlled &&
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
   */
  public disposeEffect = (): (() => void) => {
    return () => {
      this.state.activeStreamAbortController?.abort();

      if (this.state.activeStreamAbortController || this.state.isStreaming) {
        this.update({
          activeStreamAbortController: null,
          isStreaming: false,
        });
      }
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

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { [id]: _removedMessage, ...messagesById } = this.state.messagesById;
    const nextMessageErrorsById = { ...this.state.messageErrorsById };
    delete nextMessageErrorsById[id];

    this.dirtyControlledModels.add('messages');
    this.update({
      messageIds: this.state.messageIds.filter((messageId) => messageId !== id),
      messagesById,
      messageErrorsById: nextMessageErrorsById,
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
    const messageIds = [...nextMessageIds, ...this.state.messageIds];
    this.update({
      messageIds,
      messagesById: nextMessagesById,
      messageErrorsById: pruneMessageErrorsById(this.state.messageErrorsById, messageIds),
    });
  };

  public setMessages = (messages: ChatMessage[]) => {
    const { ids: messageIds, byId: messagesById } = normalizeById(messages);

    this.dirtyControlledModels.add('messages');
    this.update({
      messageIds,
      messagesById,
      messageErrorsById: pruneMessageErrorsById(this.state.messageErrorsById, messageIds),
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

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { [id]: _removedConversation, ...conversationsById } = this.state.conversationsById;

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

  public setMessageError = (messageId: string, error: ChatError | null) => {
    const currentError = this.state.messageErrorsById[messageId];

    if (currentError === error) {
      return;
    }

    const nextMessageErrorsById = { ...this.state.messageErrorsById };

    if (error == null) {
      delete nextMessageErrorsById[messageId];
    } else {
      nextMessageErrorsById[messageId] = error;
    }

    this.set('messageErrorsById', nextMessageErrorsById);
  };

  public clearMessageError = (messageId: string) => {
    this.setMessageError(messageId, null);
  };

  public clearAllMessageErrors = () => {
    if (Object.keys(this.state.messageErrorsById).length === 0) {
      return;
    }

    this.set('messageErrorsById', {});
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
      messageErrorsById: {},
      activeStreamAbortController: null,
      isStreaming: false,
      hasMoreHistory: false,
      historyCursor: undefined,
      error: null,
    });
  };
}

/**
 * Narrows the one intentional cursor-erasure boundary used by helpers that
 * operate only on message/conversation state and never touch history cursors.
 */
export function asCursorAgnosticChatStore<Cursor>(store: ChatStore<Cursor>): ChatStore<unknown> {
  return store as unknown as ChatStore<unknown>;
}
