import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { ChatAdapter, ChatMessage } from '@mui/x-chat-headless';
import { createChartsCopilotLocalStorageAdapter } from './createChartsCopilotLocalStorageAdapter';

// The test environment's window.localStorage is only a partial stub, so we
// inject a Map-backed fake that fully implements the Storage surface the
// adapter probes (setItem/getItem/removeItem).
function createFakeStorage(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.has(key) ? (store.get(key) as string) : null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, String(value));
    },
  } as Storage;
}

let originalDescriptor: PropertyDescriptor | undefined;

beforeEach(() => {
  originalDescriptor = Object.getOwnPropertyDescriptor(window, 'localStorage');
  Object.defineProperty(window, 'localStorage', {
    value: createFakeStorage(),
    configurable: true,
  });
});

afterEach(() => {
  if (originalDescriptor) {
    Object.defineProperty(window, 'localStorage', originalDescriptor);
  }
});

function emptyStream(): ReadableStream {
  return new ReadableStream({
    start(controller) {
      controller.close();
    },
  });
}

const inner: ChatAdapter = {
  async sendMessage() {
    return emptyStream();
  },
};

function userMessage(text: string): ChatMessage {
  return { id: 'm1', role: 'user', parts: [{ type: 'text', text }] } as unknown as ChatMessage;
}

async function send(adapter: ChatAdapter, message: ChatMessage): Promise<void> {
  await adapter.sendMessage({
    message,
    messages: [message],
    signal: new AbortController().signal,
  } as Parameters<ChatAdapter['sendMessage']>[0]);
}

describe('createChartsCopilotLocalStorageAdapter', () => {
  it('persists a sent message and round-trips it via the list APIs', async () => {
    const adapter = createChartsCopilotLocalStorageAdapter(inner, { key: 'roundtrip' });

    await send(adapter, userMessage('hello charts'));

    const conversations = await adapter.listConversations!(
      {} as Parameters<NonNullable<ChatAdapter['listConversations']>>[0],
    );
    expect(conversations.conversations).to.have.length(1);

    const conversationId = conversations.conversations[0].id;
    const messages = await adapter.listMessages!({ conversationId } as Parameters<
      NonNullable<ChatAdapter['listMessages']>
    >[0]);
    expect(messages.messages).to.have.length(1);
    expect(messages.messages[0].parts[0]).to.deep.include({ type: 'text', text: 'hello charts' });
  });

  it('isolates history between adapter keys', async () => {
    const a = createChartsCopilotLocalStorageAdapter(inner, { key: 'A' });
    const b = createChartsCopilotLocalStorageAdapter(inner, { key: 'B' });

    await send(a, userMessage('only in A'));

    const inA = await a.listConversations!(
      {} as Parameters<NonNullable<ChatAdapter['listConversations']>>[0],
    );
    const inB = await b.listConversations!(
      {} as Parameters<NonNullable<ChatAdapter['listConversations']>>[0],
    );
    expect(inA.conversations).to.have.length(1);
    expect(inB.conversations).to.have.length(0);
  });
});
