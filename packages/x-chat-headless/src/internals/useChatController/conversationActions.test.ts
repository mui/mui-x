import { describe, expect, it, vi } from 'vitest';
import { ChatStore } from '../../store/ChatStore';
import { createConversationActions } from './conversationActions';
import type { ChatAdapter } from '../../adapters';
import type { ChatMessage } from '../../types/chat-entities';

function createAdapter(overrides: Partial<ChatAdapter> = {}): ChatAdapter {
  return {
    sendMessage: vi.fn().mockResolvedValue(
      new ReadableStream({
        start(controller) {
          controller.close();
        },
      }),
    ),
    ...overrides,
  };
}

const userMessage: ChatMessage = {
  id: 'm1',
  role: 'user',
  parts: [{ type: 'text', text: 'Hello' }],
};

describe('createConversationActions', () => {
  describe('loadConversationMessages', () => {
    it('resets messages and returns early when conversationId is undefined and resetWhenUndefined=true', async () => {
      const store = new ChatStore({ initialMessages: [userMessage] });
      const { loadConversationMessages } = createConversationActions({
        store,
        runtimeRef: { current: { adapter: createAdapter() } },
        setRuntimeError: vi.fn(),
        stopStreaming: vi.fn(),
        conversationNavigationRequestIdRef: { current: 0 },
        conversationLoadRequestIdRef: { current: 0 },
      });

      await loadConversationMessages(undefined);

      expect(store.state.messageIds).toEqual([]);
    });

    it('does not reset messages when conversationId is undefined and resetWhenUndefined=false', async () => {
      const store = new ChatStore({ initialMessages: [userMessage] });
      const { loadConversationMessages } = createConversationActions({
        store,
        runtimeRef: { current: { adapter: createAdapter() } },
        setRuntimeError: vi.fn(),
        stopStreaming: vi.fn(),
        conversationNavigationRequestIdRef: { current: 0 },
        conversationLoadRequestIdRef: { current: 0 },
      });

      await loadConversationMessages(undefined, { resetWhenUndefined: false });

      expect(store.state.messageIds).toEqual(['m1']);
    });

    it('returns early when adapter has no listMessages', async () => {
      const store = new ChatStore();
      store.setActiveConversation('c1');
      const adapter = createAdapter();
      // listMessages is optional - make sure it's absent
      delete (adapter as any).listMessages;

      const { loadConversationMessages } = createConversationActions({
        store,
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        stopStreaming: vi.fn(),
        conversationNavigationRequestIdRef: { current: 0 },
        conversationLoadRequestIdRef: { current: 0 },
      });

      // Should not throw and should not add messages
      await loadConversationMessages('c1');
      expect(store.state.messageIds).toEqual([]);
    });

    it('calls adapter.listMessages and populates store on success', async () => {
      const store = new ChatStore();
      store.setActiveConversation('c1');

      const messages: ChatMessage[] = [{ id: 'm1', role: 'user', parts: [] }];
      const adapter = createAdapter({
        listMessages: vi.fn().mockResolvedValue({
          messages,
          cursor: 'cursor-abc',
          hasMore: true,
        }),
      });

      const { loadConversationMessages } = createConversationActions({
        store,
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        stopStreaming: vi.fn(),
        conversationNavigationRequestIdRef: { current: 0 },
        conversationLoadRequestIdRef: { current: 0 },
      });

      await loadConversationMessages('c1');

      expect(store.state.messageIds).toEqual(['m1']);
      expect(store.state.historyCursor).toBe('cursor-abc');
      expect(store.state.hasMoreHistory).toBe(true);
      expect(store.state.error).toBeNull();
    });

    it('ignores stale response when requestId has changed during fetch', async () => {
      const store = new ChatStore();
      store.setActiveConversation('c1');

      const conversationLoadRequestIdRef = { current: 0 };
      let resolveFetch!: (value: any) => void;

      const adapter = createAdapter({
        listMessages: vi.fn().mockReturnValue(
          new Promise((resolve) => {
            resolveFetch = resolve;
          }),
        ),
      });

      const { loadConversationMessages } = createConversationActions({
        store,
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        stopStreaming: vi.fn(),
        conversationNavigationRequestIdRef: { current: 0 },
        conversationLoadRequestIdRef,
      });

      const promise = loadConversationMessages('c1');
      // Simulate a newer request arriving before this one resolves
      conversationLoadRequestIdRef.current += 1;
      resolveFetch({ messages: [{ id: 'm1', role: 'user', parts: [] }], hasMore: false });
      await promise;

      // Stale response is ignored
      expect(store.state.messageIds).toEqual([]);
    });

    it('ignores stale response when activeConversationId changed during fetch', async () => {
      const store = new ChatStore();
      store.setActiveConversation('c1');

      let resolveFetch!: (value: any) => void;
      const adapter = createAdapter({
        listMessages: vi.fn().mockReturnValue(
          new Promise((resolve) => {
            resolveFetch = resolve;
          }),
        ),
      });

      const { loadConversationMessages } = createConversationActions({
        store,
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        stopStreaming: vi.fn(),
        conversationNavigationRequestIdRef: { current: 0 },
        conversationLoadRequestIdRef: { current: 0 },
      });

      const promise = loadConversationMessages('c1');
      // Simulate conversation switch while loading
      store.setActiveConversation('c2');
      resolveFetch({ messages: [{ id: 'm1', role: 'user', parts: [] }], hasMore: false });
      await promise;

      expect(store.state.messageIds).toEqual([]);
    });

    it('sets HISTORY_ERROR via setRuntimeError on failure', async () => {
      const store = new ChatStore();
      store.setActiveConversation('c1');

      const setRuntimeError = vi.fn();
      const adapter = createAdapter({
        listMessages: vi.fn().mockRejectedValue(new Error('Network error')),
      });

      const { loadConversationMessages } = createConversationActions({
        store,
        runtimeRef: { current: { adapter } },
        setRuntimeError,
        stopStreaming: vi.fn(),
        conversationNavigationRequestIdRef: { current: 0 },
        conversationLoadRequestIdRef: { current: 0 },
      });

      await loadConversationMessages('c1');

      expect(setRuntimeError).toHaveBeenCalledTimes(1);
      expect(setRuntimeError.mock.calls[0][0].code).toBe('HISTORY_ERROR');
      expect(setRuntimeError.mock.calls[0][0].message).toBe('Network error');
    });

    it('ignores failure when requestId is stale', async () => {
      const store = new ChatStore();
      store.setActiveConversation('c1');

      const conversationLoadRequestIdRef = { current: 0 };
      const setRuntimeError = vi.fn();
      let rejectFetch!: (err: Error) => void;

      const adapter = createAdapter({
        listMessages: vi.fn().mockReturnValue(
          new Promise((_, reject) => {
            rejectFetch = reject;
          }),
        ),
      });

      const { loadConversationMessages } = createConversationActions({
        store,
        runtimeRef: { current: { adapter } },
        setRuntimeError,
        stopStreaming: vi.fn(),
        conversationNavigationRequestIdRef: { current: 0 },
        conversationLoadRequestIdRef,
      });

      const promise = loadConversationMessages('c1');
      conversationLoadRequestIdRef.current += 1;
      rejectFetch(new Error('Stale error'));
      await promise;

      expect(setRuntimeError).not.toHaveBeenCalled();
    });
  });

  describe('loadMoreHistory', () => {
    it('returns early when there is no active conversation', async () => {
      const store = new ChatStore();
      const adapter = createAdapter({ listMessages: vi.fn() });

      const { loadMoreHistory } = createConversationActions({
        store,
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        stopStreaming: vi.fn(),
        conversationNavigationRequestIdRef: { current: 0 },
        conversationLoadRequestIdRef: { current: 0 },
      });

      await loadMoreHistory();

      expect(adapter.listMessages).not.toHaveBeenCalled();
    });

    it('calls listMessages with cursor and prepends results to the front', async () => {
      const store = new ChatStore({
        initialMessages: [{ id: 'm2', role: 'user', parts: [] }],
      });
      store.setActiveConversation('c1');

      const olderMessages: ChatMessage[] = [{ id: 'm1', role: 'user', parts: [] }];
      const adapter = createAdapter({
        listMessages: vi.fn().mockResolvedValue({
          messages: olderMessages,
          cursor: null,
          hasMore: false,
        }),
      });

      const { loadMoreHistory } = createConversationActions({
        store,
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        stopStreaming: vi.fn(),
        conversationNavigationRequestIdRef: { current: 0 },
        conversationLoadRequestIdRef: { current: 0 },
      });

      await loadMoreHistory();

      expect(store.state.messageIds).toEqual(['m1', 'm2']);
      expect(store.state.hasMoreHistory).toBe(false);
    });

    it('falls back to adapter.loadMore when listMessages is absent', async () => {
      const store = new ChatStore();
      store.setActiveConversation('c1');

      const loadMore = vi.fn().mockResolvedValue({
        messages: [{ id: 'm1', role: 'user', parts: [] }],
        hasMore: false,
      });
      const adapter: ChatAdapter = {
        sendMessage: vi.fn().mockResolvedValue(
          new ReadableStream({ start(c) { c.close(); } }),
        ),
        loadMore,
      };

      const { loadMoreHistory } = createConversationActions({
        store,
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        stopStreaming: vi.fn(),
        conversationNavigationRequestIdRef: { current: 0 },
        conversationLoadRequestIdRef: { current: 0 },
      });

      await loadMoreHistory();

      expect(loadMore).toHaveBeenCalledTimes(1);
      expect(store.state.messageIds).toEqual(['m1']);
    });

    it('sets HISTORY_ERROR on failure', async () => {
      const store = new ChatStore();
      store.setActiveConversation('c1');
      const setRuntimeError = vi.fn();

      const adapter = createAdapter({
        listMessages: vi.fn().mockRejectedValue(new Error('Pagination failed')),
      });

      const { loadMoreHistory } = createConversationActions({
        store,
        runtimeRef: { current: { adapter } },
        setRuntimeError,
        stopStreaming: vi.fn(),
        conversationNavigationRequestIdRef: { current: 0 },
        conversationLoadRequestIdRef: { current: 0 },
      });

      await loadMoreHistory();

      expect(setRuntimeError).toHaveBeenCalledTimes(1);
      expect(setRuntimeError.mock.calls[0][0].code).toBe('HISTORY_ERROR');
    });
  });

  describe('setActiveConversation', () => {
    it('no-ops when setting the same conversation id', async () => {
      const store = new ChatStore();
      store.setActiveConversation('c1');
      const stopStreaming = vi.fn();
      const adapter = createAdapter({ listMessages: vi.fn() });

      const { setActiveConversation } = createConversationActions({
        store,
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        stopStreaming,
        conversationNavigationRequestIdRef: { current: 0 },
        conversationLoadRequestIdRef: { current: 0 },
      });

      await setActiveConversation('c1');

      expect(stopStreaming).not.toHaveBeenCalled();
      expect(adapter.listMessages).not.toHaveBeenCalled();
    });

    it('calls stopStreaming, increments navigation requestId, sets active conversation, and loads messages', async () => {
      const store = new ChatStore();
      store.setActiveConversation('c1');
      const stopStreaming = vi.fn();
      const conversationNavigationRequestIdRef = { current: 0 };

      const messages: ChatMessage[] = [{ id: 'm1', role: 'user', parts: [] }];
      const adapter = createAdapter({
        listMessages: vi.fn().mockResolvedValue({ messages, hasMore: false }),
      });

      const { setActiveConversation } = createConversationActions({
        store,
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        stopStreaming,
        conversationNavigationRequestIdRef,
        conversationLoadRequestIdRef: { current: 0 },
      });

      await setActiveConversation('c2');

      expect(stopStreaming).toHaveBeenCalledTimes(1);
      expect(store.state.activeConversationId).toBe('c2');
      expect(conversationNavigationRequestIdRef.current).toBe(1);
      expect(store.state.messageIds).toEqual(['m1']);
    });
  });
});
