import type {
  ChatAdapter,
  ChatConversation,
  ChatMessage as ChatHeadlessMessage,
  ChatRealtimeEvent,
} from '@mui/x-chat-headless';
import type { GridCopilotAdapter } from './gridCopilotInterfaces';

const DEFAULT_STORAGE_NAMESPACE = 'default';
const STORAGE_KEY_PREFIX = 'mui-x-copilot-history:v1';
const COPILOT_LOCAL_STORAGE_VERSION = 1;

const GRID_COPILOT_LOCAL_STORAGE_CONTROLLER = Symbol('GridCopilotLocalStorageController');

interface CopilotLocalStorageState {
  version: typeof COPILOT_LOCAL_STORAGE_VERSION;
  activeConversationId?: string;
  conversations: ChatConversation[];
  messagesByConversationId: Record<string, ChatHeadlessMessage[]>;
  gridStateByConversationId: Record<string, Record<string, unknown>>;
}

interface GridCopilotLocalStorageAdapterController {
  getInitialActiveConversationId: () => string | undefined;
  getConversationGridState: (conversationId: string) => Record<string, unknown> | undefined;
  persistActiveConversationId: (conversationId: string | undefined) => void;
  persistConversationMessages: (
    conversationId: string,
    messages: ChatHeadlessMessage[],
  ) => ChatConversation | undefined;
  persistConversationGridState: (conversationId: string, gridState: unknown) => void;
}

interface GridCopilotLocalStorageAdapter extends GridCopilotAdapter {
  [GRID_COPILOT_LOCAL_STORAGE_CONTROLLER]: GridCopilotLocalStorageAdapterController;
}

export interface GridCopilotLocalStorageAdapterOptions {
  /**
   * Logical namespace for the persisted Copilot history.
   * Use different keys when the same page hosts independent datasets.
   * @default 'default'
   */
  key?: string;
}

const copilotStorageSubscribersByKey = new Map<string, Set<(event: ChatRealtimeEvent) => void>>();

function getStorageKey(namespace: string | undefined): string {
  return `${STORAGE_KEY_PREFIX}:${namespace ?? DEFAULT_STORAGE_NAMESPACE}`;
}

function createEmptyCopilotStorageState(): CopilotLocalStorageState {
  return {
    version: COPILOT_LOCAL_STORAGE_VERSION,
    conversations: [],
    messagesByConversationId: {},
    gridStateByConversationId: {},
  };
}

function getCopilotLocalStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storage = window.localStorage;
    const testKey = '__mui_x_copilot_storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return storage;
  } catch {
    return null;
  }
}

function isCopilotStoredConversation(value: unknown): value is ChatConversation {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { id?: unknown }).id === 'string'
  );
}

function isCopilotStoredMessage(value: unknown): value is ChatHeadlessMessage {
  const role = (value as { role?: unknown })?.role;
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { id?: unknown }).id === 'string' &&
    (role === 'system' || role === 'user' || role === 'assistant') &&
    Array.isArray((value as { parts?: unknown }).parts)
  );
}

function isCopilotStoredGridState(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sortCopilotConversations(conversations: ChatConversation[]): ChatConversation[] {
  return [...conversations].sort((a, b) => {
    const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
    const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
    return bTime - aTime;
  });
}

function readCopilotStorageState(storageKey: string): CopilotLocalStorageState {
  const storage = getCopilotLocalStorage();
  if (!storage) {
    return createEmptyCopilotStorageState();
  }

  try {
    const raw = storage.getItem(storageKey);
    if (!raw) {
      return createEmptyCopilotStorageState();
    }

    const parsed = JSON.parse(raw) as Partial<CopilotLocalStorageState> | undefined;
    if (!parsed || typeof parsed !== 'object') {
      return createEmptyCopilotStorageState();
    }

    const conversations = Array.isArray(parsed.conversations)
      ? sortCopilotConversations(parsed.conversations.filter(isCopilotStoredConversation))
      : [];
    const messagesByConversationId: Record<string, ChatHeadlessMessage[]> = {};
    const rawMessagesByConversationId = parsed.messagesByConversationId;

    if (rawMessagesByConversationId && typeof rawMessagesByConversationId === 'object') {
      Object.entries(rawMessagesByConversationId).forEach(([conversationId, messages]) => {
        if (Array.isArray(messages)) {
          messagesByConversationId[conversationId] = messages.filter(isCopilotStoredMessage);
        }
      });
    }
    const gridStateByConversationId: Record<string, Record<string, unknown>> = {};
    const rawGridStateByConversationId = parsed.gridStateByConversationId;

    if (rawGridStateByConversationId && typeof rawGridStateByConversationId === 'object') {
      Object.entries(rawGridStateByConversationId).forEach(([conversationId, gridState]) => {
        if (isCopilotStoredGridState(gridState)) {
          gridStateByConversationId[conversationId] = gridState;
        }
      });
    }

    const activeConversationId =
      typeof parsed.activeConversationId === 'string' ? parsed.activeConversationId : undefined;

    return {
      version: COPILOT_LOCAL_STORAGE_VERSION,
      activeConversationId,
      conversations,
      messagesByConversationId,
      gridStateByConversationId,
    };
  } catch {
    return createEmptyCopilotStorageState();
  }
}

function writeCopilotStorageState(storageKey: string, state: CopilotLocalStorageState): void {
  const storage = getCopilotLocalStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // Storage can fail in private browsing or quota-limited contexts.
  }
}

function updateCopilotStorageState(
  storageKey: string,
  updater: (state: CopilotLocalStorageState) => CopilotLocalStorageState,
): CopilotLocalStorageState {
  const nextState = updater(readCopilotStorageState(storageKey));
  writeCopilotStorageState(storageKey, nextState);
  return nextState;
}

function getSubscribers(storageKey: string): Set<(event: ChatRealtimeEvent) => void> {
  let subscribers = copilotStorageSubscribersByKey.get(storageKey);
  if (!subscribers) {
    subscribers = new Set();
    copilotStorageSubscribersByKey.set(storageKey, subscribers);
  }
  return subscribers;
}

function emitCopilotStorageEvent(storageKey: string, event: ChatRealtimeEvent): void {
  const notifySubscribers = () => {
    getSubscribers(storageKey).forEach((listener) => {
      try {
        listener(event);
      } catch {
        // A subscriber should not block persistence updates for other panels.
      }
    });
  };

  if (typeof queueMicrotask === 'function') {
    queueMicrotask(notifySubscribers);
    return;
  }

  Promise.resolve().then(notifySubscribers);
}

function emitCopilotStorageMessageEvents(
  storageKey: string,
  messages: ChatHeadlessMessage[],
): void {
  messages.forEach((message) => {
    emitCopilotStorageEvent(storageKey, {
      type: 'message-updated',
      message,
    });
  });
}

function getStoredCopilotActiveConversationId(storageKey: string): string | undefined {
  const state = readCopilotStorageState(storageKey);
  if (
    state.activeConversationId &&
    state.conversations.some((conversation) => conversation.id === state.activeConversationId)
  ) {
    return state.activeConversationId;
  }
  return undefined;
}

function persistCopilotActiveConversationId(
  storageKey: string,
  conversationId: string | undefined,
): void {
  updateCopilotStorageState(storageKey, (state) => ({
    ...state,
    activeConversationId: conversationId,
  }));
}

function getStoredCopilotConversationGridState(
  storageKey: string,
  conversationId: string,
): Record<string, unknown> | undefined {
  return readCopilotStorageState(storageKey).gridStateByConversationId[conversationId];
}

function persistCopilotConversationGridState(
  storageKey: string,
  conversationId: string,
  gridState: unknown,
): void {
  if (!isCopilotStoredGridState(gridState)) {
    return;
  }

  updateCopilotStorageState(storageKey, (state) => ({
    ...state,
    gridStateByConversationId: {
      ...state.gridStateByConversationId,
      [conversationId]: gridState,
    },
  }));
}

function getMessageText(message: ChatHeadlessMessage): string {
  return message.parts
    .map((part) => (part.type === 'text' ? part.text : null))
    .filter(Boolean)
    .join(' ')
    .trim();
}

function createConversationTitle(messages: ChatHeadlessMessage[]): string {
  const firstUserText = messages.find((message) => message.role === 'user');
  const title = firstUserText ? getMessageText(firstUserText).replace(/\s+/g, ' ') : '';
  return title ? title.slice(0, 80) : 'New conversation';
}

function getMessageDate(message: ChatHeadlessMessage): string | undefined {
  return message.updatedAt ?? message.createdAt;
}

function getLatestMessageDate(messages: ChatHeadlessMessage[]): string {
  let latest: string | undefined;
  let latestTime = Number.NEGATIVE_INFINITY;

  messages.forEach((message) => {
    const value = getMessageDate(message);
    if (!value) {
      return;
    }

    const time = new Date(value).getTime();
    if (!Number.isNaN(time) && time > latestTime) {
      latest = value;
      latestTime = time;
    }
  });

  return latest ?? new Date().toISOString();
}

function normalizeMessageForStorage(
  message: ChatHeadlessMessage,
  conversationId: string,
): ChatHeadlessMessage {
  return {
    ...message,
    conversationId,
    status:
      message.status === 'sending' || message.status === 'streaming' ? 'sent' : message.status,
    parts: message.parts.map((part) => {
      if ((part.type === 'text' || part.type === 'reasoning') && part.state === 'streaming') {
        return { ...part, state: 'done' };
      }
      return part;
    }) as ChatHeadlessMessage['parts'],
  };
}

function getConversationMessagesForStorage(
  conversationId: string,
  messages: ChatHeadlessMessage[],
): ChatHeadlessMessage[] {
  return messages
    .filter(
      (message) => message.conversationId == null || message.conversationId === conversationId,
    )
    .map((message) => normalizeMessageForStorage(message, conversationId));
}

function persistCopilotConversationMessages(
  storageKey: string,
  conversationId: string,
  messages: ChatHeadlessMessage[],
): ChatConversation | undefined {
  const nextMessages = getConversationMessagesForStorage(conversationId, messages);
  if (nextMessages.length === 0) {
    return undefined;
  }

  let nextConversation: ChatConversation | undefined;
  let previousConversation: ChatConversation | undefined;

  updateCopilotStorageState(storageKey, (state) => {
    previousConversation = state.conversations.find(
      (conversation) => conversation.id === conversationId,
    );
    const mergedMessages = [...(state.messagesByConversationId[conversationId] ?? [])];
    nextMessages.forEach((nextMessage) => {
      const existingMessageIndex = mergedMessages.findIndex(
        (message) => message.id === nextMessage.id,
      );
      if (existingMessageIndex === -1) {
        mergedMessages.push(nextMessage);
      } else {
        mergedMessages[existingMessageIndex] = nextMessage;
      }
    });

    nextConversation = {
      ...previousConversation,
      id: conversationId,
      title: previousConversation?.title ?? createConversationTitle(mergedMessages),
      lastMessageAt: getLatestMessageDate(mergedMessages),
    };

    return {
      ...state,
      activeConversationId: conversationId,
      conversations: sortCopilotConversations([
        nextConversation,
        ...state.conversations.filter((conversation) => conversation.id !== conversationId),
      ]),
      messagesByConversationId: {
        ...state.messagesByConversationId,
        [conversationId]: mergedMessages,
      },
    };
  });

  if (nextConversation) {
    emitCopilotStorageEvent(storageKey, {
      type: previousConversation ? 'conversation-updated' : 'conversation-added',
      conversation: nextConversation,
    });
  }
  emitCopilotStorageMessageEvents(storageKey, nextMessages);

  return nextConversation;
}

function withConversationId(
  message: ChatHeadlessMessage,
  conversationId: string,
): ChatHeadlessMessage {
  return { ...message, conversationId };
}

function randomId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function createCopilotConversationId(): string {
  return `mui-x-copilot-${randomId()}`;
}

export function getGridCopilotLocalStorageAdapterController(
  adapter: ChatAdapter,
): GridCopilotLocalStorageAdapterController | undefined {
  return (adapter as Partial<GridCopilotLocalStorageAdapter>)[
    GRID_COPILOT_LOCAL_STORAGE_CONTROLLER
  ];
}

export function createGridCopilotLocalStorageAdapter(
  baseAdapter: GridCopilotAdapter,
  options: GridCopilotLocalStorageAdapterOptions = {},
): GridCopilotAdapter {
  const storageKey = getStorageKey(options.key);
  const controller: GridCopilotLocalStorageAdapterController = {
    getInitialActiveConversationId: () => getStoredCopilotActiveConversationId(storageKey),
    getConversationGridState: (conversationId) =>
      getStoredCopilotConversationGridState(storageKey, conversationId),
    persistActiveConversationId: (conversationId) =>
      persistCopilotActiveConversationId(storageKey, conversationId),
    persistConversationMessages: (conversationId, messages) =>
      persistCopilotConversationMessages(storageKey, conversationId, messages),
    persistConversationGridState: (conversationId, gridState) =>
      persistCopilotConversationGridState(storageKey, conversationId, gridState),
  };

  const adapter: GridCopilotLocalStorageAdapter = {
    ...baseAdapter,
    [GRID_COPILOT_LOCAL_STORAGE_CONTROLLER]: controller,
    async listConversations() {
      return {
        conversations: readCopilotStorageState(storageKey).conversations,
        hasMore: false,
      };
    },
    async listMessages({ conversationId }) {
      return {
        messages:
          readCopilotStorageState(storageKey).messagesByConversationId[conversationId] ?? [],
        hasMore: false,
      };
    },
    async sendMessage(input) {
      const conversationId =
        input.conversationId ?? input.message.conversationId ?? createCopilotConversationId();
      const message = withConversationId(input.message, conversationId);
      const messages = input.messages.some((candidate) => candidate.id === input.message.id)
        ? input.messages.map((candidate) =>
            candidate.id === input.message.id
              ? message
              : withConversationId(candidate, candidate.conversationId ?? conversationId),
          )
        : [...input.messages, message];

      persistCopilotActiveConversationId(storageKey, conversationId);
      persistCopilotConversationMessages(storageKey, conversationId, messages);

      try {
        return await baseAdapter.sendMessage({
          ...input,
          conversationId,
          message,
          messages,
        });
      } catch (error) {
        persistCopilotConversationMessages(
          storageKey,
          conversationId,
          messages.map((candidate) =>
            candidate.id === message.id ? { ...candidate, status: 'error' } : candidate,
          ),
        );
        throw error;
      }
    },
    async subscribe(input) {
      const subscribers = getSubscribers(storageKey);
      subscribers.add(input.onEvent);
      const cleanup = await baseAdapter.subscribe?.(input);

      return () => {
        subscribers.delete(input.onEvent);
        cleanup?.();
      };
    },
  };

  return adapter;
}
