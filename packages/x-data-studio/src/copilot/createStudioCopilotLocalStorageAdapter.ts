import type {
  ChatAdapter,
  ChatConversation,
  ChatMessage as ChatHeadlessMessage,
  ChatRealtimeEvent,
} from '@mui/x-chat-headless';

const DEFAULT_STORAGE_NAMESPACE = 'default';
const STORAGE_KEY_PREFIX = 'mui-x-copilot-history:v1:data-studio';
const COPILOT_LOCAL_STORAGE_VERSION = 1;

const STUDIO_COPILOT_LOCAL_STORAGE_CONTROLLER = Symbol('StudioCopilotLocalStorageController');

interface StudioCopilotLocalStorageState {
  version: typeof COPILOT_LOCAL_STORAGE_VERSION;
  activeConversationId?: string;
  conversations: ChatConversation[];
  messagesByConversationId: Record<string, ChatHeadlessMessage[]>;
  studioStateByConversationId: Record<string, Record<string, unknown>>;
}

export interface StudioCopilotLocalStorageAdapterController {
  getInitialActiveConversationId: () => string | undefined;
  getConversationStudioState: (conversationId: string) => Record<string, unknown> | undefined;
  persistActiveConversationId: (conversationId: string | undefined) => void;
  persistConversationMessages: (
    conversationId: string,
    messages: ChatHeadlessMessage[],
  ) => ChatConversation | undefined;
  persistConversationStudioState: (conversationId: string, studioState: unknown) => void;
}

interface StudioCopilotLocalStorageAdapter extends ChatAdapter {
  [STUDIO_COPILOT_LOCAL_STORAGE_CONTROLLER]: StudioCopilotLocalStorageAdapterController;
}

export interface StudioCopilotLocalStorageAdapterOptions {
  /**
   * Logical namespace for the persisted Copilot history.
   * Use different keys when the same page hosts independent studios.
   * @default 'default'
   */
  key?: string;
}

const copilotStorageSubscribersByKey = new Map<string, Set<(event: ChatRealtimeEvent) => void>>();

function getStorageKey(namespace: string | undefined): string {
  return `${STORAGE_KEY_PREFIX}:${namespace ?? DEFAULT_STORAGE_NAMESPACE}`;
}

function createEmptyState(): StudioCopilotLocalStorageState {
  return {
    version: COPILOT_LOCAL_STORAGE_VERSION,
    conversations: [],
    messagesByConversationId: {},
    studioStateByConversationId: {},
  };
}

function getLocalStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const storage = window.localStorage;
    const testKey = '__mui_x_studio_copilot_storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return storage;
  } catch {
    return null;
  }
}

function isStoredConversation(value: unknown): value is ChatConversation {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { id?: unknown }).id === 'string'
  );
}

function isStoredMessage(value: unknown): value is ChatHeadlessMessage {
  const role = (value as { role?: unknown })?.role;
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { id?: unknown }).id === 'string' &&
    (role === 'system' || role === 'user' || role === 'assistant') &&
    Array.isArray((value as { parts?: unknown }).parts)
  );
}

function isStoredStudioState(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sortConversations(conversations: ChatConversation[]): ChatConversation[] {
  return [...conversations].sort((a, b) => {
    const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
    const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
    return bTime - aTime;
  });
}

function readState(storageKey: string): StudioCopilotLocalStorageState {
  const storage = getLocalStorage();
  if (!storage) {
    return createEmptyState();
  }
  try {
    const raw = storage.getItem(storageKey);
    if (!raw) {
      return createEmptyState();
    }
    const parsed = JSON.parse(raw) as Partial<StudioCopilotLocalStorageState> | undefined;
    if (!parsed || typeof parsed !== 'object') {
      return createEmptyState();
    }
    const conversations = Array.isArray(parsed.conversations)
      ? sortConversations(parsed.conversations.filter(isStoredConversation))
      : [];
    const messagesByConversationId: Record<string, ChatHeadlessMessage[]> = {};
    if (parsed.messagesByConversationId && typeof parsed.messagesByConversationId === 'object') {
      Object.entries(parsed.messagesByConversationId).forEach(([conversationId, messages]) => {
        if (Array.isArray(messages)) {
          messagesByConversationId[conversationId] = messages.filter(isStoredMessage);
        }
      });
    }
    const studioStateByConversationId: Record<string, Record<string, unknown>> = {};
    if (
      parsed.studioStateByConversationId &&
      typeof parsed.studioStateByConversationId === 'object'
    ) {
      Object.entries(parsed.studioStateByConversationId).forEach(([conversationId, studioState]) => {
        if (isStoredStudioState(studioState)) {
          studioStateByConversationId[conversationId] = studioState;
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
      studioStateByConversationId,
    };
  } catch {
    return createEmptyState();
  }
}

function writeState(storageKey: string, state: StudioCopilotLocalStorageState): void {
  const storage = getLocalStorage();
  if (!storage) {
    return;
  }
  try {
    storage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // Storage can fail in private browsing or quota-limited contexts.
  }
}

function updateState(
  storageKey: string,
  updater: (state: StudioCopilotLocalStorageState) => StudioCopilotLocalStorageState,
): StudioCopilotLocalStorageState {
  const next = updater(readState(storageKey));
  writeState(storageKey, next);
  return next;
}

function getSubscribers(storageKey: string): Set<(event: ChatRealtimeEvent) => void> {
  let subscribers = copilotStorageSubscribersByKey.get(storageKey);
  if (!subscribers) {
    subscribers = new Set();
    copilotStorageSubscribersByKey.set(storageKey, subscribers);
  }
  return subscribers;
}

function emitEvent(storageKey: string, event: ChatRealtimeEvent): void {
  const notify = () => {
    getSubscribers(storageKey).forEach((listener) => {
      try {
        listener(event);
      } catch {
        // A subscriber should not block persistence updates for other panels.
      }
    });
  };
  if (typeof queueMicrotask === 'function') {
    queueMicrotask(notify);
    return;
  }
  Promise.resolve().then(notify);
}

function emitMessageEvents(storageKey: string, messages: ChatHeadlessMessage[]): void {
  messages.forEach((message) => {
    emitEvent(storageKey, { type: 'message-updated', message });
  });
}

function getStoredActiveConversationId(storageKey: string): string | undefined {
  const state = readState(storageKey);
  if (
    state.activeConversationId &&
    state.conversations.some((conv) => conv.id === state.activeConversationId)
  ) {
    return state.activeConversationId;
  }
  return undefined;
}

function persistActiveConversationId(
  storageKey: string,
  conversationId: string | undefined,
): void {
  updateState(storageKey, (state) => ({ ...state, activeConversationId: conversationId }));
}

function getStoredConversationStudioState(
  storageKey: string,
  conversationId: string,
): Record<string, unknown> | undefined {
  return readState(storageKey).studioStateByConversationId[conversationId];
}

function persistConversationStudioState(
  storageKey: string,
  conversationId: string,
  studioState: unknown,
): void {
  if (!isStoredStudioState(studioState)) {
    return;
  }
  updateState(storageKey, (state) => ({
    ...state,
    studioStateByConversationId: {
      ...state.studioStateByConversationId,
      [conversationId]: studioState,
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
  const firstUser = messages.find((m) => m.role === 'user');
  const title = firstUser ? getMessageText(firstUser).replace(/\s+/g, ' ') : '';
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

function persistConversationMessages(
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
  updateState(storageKey, (state) => {
    previousConversation = state.conversations.find((c) => c.id === conversationId);
    const merged = [...(state.messagesByConversationId[conversationId] ?? [])];
    nextMessages.forEach((next) => {
      const idx = merged.findIndex((m) => m.id === next.id);
      if (idx === -1) {
        merged.push(next);
      } else {
        merged[idx] = next;
      }
    });
    nextConversation = {
      ...previousConversation,
      id: conversationId,
      title: previousConversation?.title ?? createConversationTitle(merged),
      lastMessageAt: getLatestMessageDate(merged),
    };
    return {
      ...state,
      activeConversationId: conversationId,
      conversations: sortConversations([
        nextConversation,
        ...state.conversations.filter((c) => c.id !== conversationId),
      ]),
      messagesByConversationId: {
        ...state.messagesByConversationId,
        [conversationId]: merged,
      },
    };
  });
  if (nextConversation) {
    emitEvent(storageKey, {
      type: previousConversation ? 'conversation-updated' : 'conversation-added',
      conversation: nextConversation,
    });
  }
  emitMessageEvents(storageKey, nextMessages);
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

function createConversationId(): string {
  return `mui-x-studio-copilot-${randomId()}`;
}

export function getStudioCopilotLocalStorageAdapterController(
  adapter: ChatAdapter,
): StudioCopilotLocalStorageAdapterController | undefined {
  return (adapter as Partial<StudioCopilotLocalStorageAdapter>)[
    STUDIO_COPILOT_LOCAL_STORAGE_CONTROLLER
  ];
}

export function createStudioCopilotLocalStorageAdapter(
  baseAdapter: ChatAdapter,
  options: StudioCopilotLocalStorageAdapterOptions = {},
): ChatAdapter {
  const storageKey = getStorageKey(options.key);
  const controller: StudioCopilotLocalStorageAdapterController = {
    getInitialActiveConversationId: () => getStoredActiveConversationId(storageKey),
    getConversationStudioState: (conversationId) =>
      getStoredConversationStudioState(storageKey, conversationId),
    persistActiveConversationId: (conversationId) =>
      persistActiveConversationId(storageKey, conversationId),
    persistConversationMessages: (conversationId, messages) =>
      persistConversationMessages(storageKey, conversationId, messages),
    persistConversationStudioState: (conversationId, studioState) =>
      persistConversationStudioState(storageKey, conversationId, studioState),
  };

  const adapter: StudioCopilotLocalStorageAdapter = {
    ...baseAdapter,
    [STUDIO_COPILOT_LOCAL_STORAGE_CONTROLLER]: controller,
    async listConversations() {
      return {
        conversations: readState(storageKey).conversations,
        hasMore: false,
      };
    },
    async listMessages({ conversationId }) {
      return {
        messages: readState(storageKey).messagesByConversationId[conversationId] ?? [],
        hasMore: false,
      };
    },
    async sendMessage(input) {
      const conversationId =
        input.conversationId ?? input.message.conversationId ?? createConversationId();
      const message = withConversationId(input.message, conversationId);
      const messages = input.messages.some((candidate) => candidate.id === input.message.id)
        ? input.messages.map((candidate) =>
            candidate.id === input.message.id
              ? message
              : withConversationId(candidate, candidate.conversationId ?? conversationId),
          )
        : [...input.messages, message];

      persistActiveConversationId(storageKey, conversationId);
      persistConversationMessages(storageKey, conversationId, messages);

      try {
        return await baseAdapter.sendMessage({
          ...input,
          conversationId,
          message,
          messages,
        });
      } catch (error) {
        persistConversationMessages(
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
