import * as React from 'react';
import { act, renderHook } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import { ChatStore } from '../store';
import type { ChatConversation, ChatMessage } from '../types/chat-entities';
import type { ChatError } from '../types/chat-error';
import { ChatStoreContext } from '../internals/useChatStoreContext';
import { useChatStatus } from './useChatStatus';
import { useConversation, useConversations } from './useConversation';
import { useMessage, useMessageIds } from './useMessage';

const userMessage: ChatMessage = {
  id: 'm1',
  role: 'user',
  parts: [{ type: 'text', text: 'Hello' }],
};

const assistantMessage: ChatMessage = {
  id: 'm2',
  role: 'assistant',
  status: 'sent',
  parts: [{ type: 'text', text: 'Hi there' }],
};

const conversation1: ChatConversation = {
  id: 'c1',
  title: 'General',
};

const conversation2: ChatConversation = {
  id: 'c2',
  title: 'Support',
};

function createStoreWrapper(store: ChatStore) {
  return function StoreWrapper({ children }: React.PropsWithChildren) {
    return <ChatStoreContext.Provider value={store}>{children}</ChatStoreContext.Provider>;
  };
}

function useRenderCount<Value>(value: Value) {
  const renderCount = React.useRef(0);
  renderCount.current += 1;

  return {
    value,
    renderCount: renderCount.current,
  };
}

describe('selector hooks', () => {
  it('useMessageIds returns store-ordered ids and keeps a stable reference when only a message body changes', () => {
    const store = new ChatStore({
      defaultMessages: [userMessage, assistantMessage],
    });
    const wrapper = createStoreWrapper(store);
    const { result } = renderHook(() => useRenderCount(useMessageIds()), { wrapper });

    const initialIds = result.current.value;

    expect(initialIds).toEqual(['m1', 'm2']);

    act(() => {
      store.updateMessage('m1', {
        status: 'streaming',
      });
    });

    expect(result.current.value).toBe(initialIds);
    expect(result.current.renderCount).toBe(1);
  });

  it('useMessage rerenders only for the subscribed message and returns null when missing', () => {
    const store = new ChatStore({
      defaultMessages: [userMessage, assistantMessage],
    });
    const wrapper = createStoreWrapper(store);
    // eslint-disable-next-line testing-library/render-result-naming-convention
    const messageIdsHook = renderHook(() => useRenderCount(useMessageIds()), { wrapper });
    // eslint-disable-next-line testing-library/render-result-naming-convention
    const targetMessageHook = renderHook(() => useRenderCount(useMessage('m1')), { wrapper });
    // eslint-disable-next-line testing-library/render-result-naming-convention
    const otherMessageHook = renderHook(() => useRenderCount(useMessage('m2')), { wrapper });
    // eslint-disable-next-line testing-library/render-result-naming-convention
    const missingMessageHook = renderHook(() => useMessage('missing'), { wrapper });

    expect(targetMessageHook.result.current.value).toEqual(userMessage);
    expect(otherMessageHook.result.current.value).toEqual(assistantMessage);
    expect(missingMessageHook.result.current).toBeNull();

    act(() => {
      store.updateMessage('m1', {
        status: 'streaming',
      });
    });

    expect(messageIdsHook.result.current.renderCount).toBe(1);
    expect(targetMessageHook.result.current.renderCount).toBe(2);
    expect(targetMessageHook.result.current.value).toEqual({
      ...userMessage,
      status: 'streaming',
    });
    expect(otherMessageHook.result.current.renderCount).toBe(1);
    expect(otherMessageHook.result.current.value).toEqual(assistantMessage);
  });

  it('useConversations and useConversation subscribe to the conversation slice and normalize missing values to null', () => {
    const store = new ChatStore({
      defaultConversations: [conversation1, conversation2],
    });
    const wrapper = createStoreWrapper(store);
    // eslint-disable-next-line testing-library/render-result-naming-convention
    const conversationsHook = renderHook(() => useRenderCount(useConversations()), { wrapper });
    // eslint-disable-next-line testing-library/render-result-naming-convention
    const conversationHook = renderHook(() => useRenderCount(useConversation('c1')), { wrapper });
    // eslint-disable-next-line testing-library/render-result-naming-convention
    const missingConversationHook = renderHook(() => useConversation('missing'), { wrapper });

    const initialConversations = conversationsHook.result.current.value;

    expect(initialConversations).toEqual([conversation1, conversation2]);
    expect(conversationHook.result.current.value).toEqual(conversation1);
    expect(missingConversationHook.result.current).toBeNull();

    act(() => {
      store.updateMessage('missing', {
        status: 'sent',
      });
    });

    expect(conversationsHook.result.current.value).toBe(initialConversations);
    expect(conversationsHook.result.current.renderCount).toBe(1);
    expect(conversationHook.result.current.renderCount).toBe(1);

    act(() => {
      store.setConversations([
        {
          ...conversation1,
          title: 'General updated',
        },
        conversation2,
      ]);
    });

    expect(conversationsHook.result.current.renderCount).toBe(2);
    expect(conversationsHook.result.current.value).toEqual([
      {
        ...conversation1,
        title: 'General updated',
      },
      conversation2,
    ]);
    expect(conversationHook.result.current.renderCount).toBe(2);
    expect(conversationHook.result.current.value).toEqual({
      ...conversation1,
      title: 'General updated',
    });
  });

  it('useChatStatus only rerenders for status changes and returns a stable object for unrelated updates', () => {
    const store = new ChatStore({
      defaultMessages: [userMessage],
    });
    const wrapper = createStoreWrapper(store);
    // eslint-disable-next-line testing-library/render-result-naming-convention
    const statusHook = renderHook(() => useRenderCount(useChatStatus()), { wrapper });

    const initialStatus = statusHook.result.current.value;
    const streamError: ChatError = {
      code: 'STREAM_ERROR',
      message: 'Stream failed',
      source: 'stream',
      recoverable: true,
      retryable: true,
    };

    expect(initialStatus).toEqual({
      isStreaming: false,
      hasMoreHistory: false,
      error: null,
      conversationError: null,
      isLoadingConversations: false,
      isLoadingMessages: false,
      isRealtimeConnecting: false,
      typingUserIds: [],
    });

    act(() => {
      store.addMessage(assistantMessage);
    });

    expect(statusHook.result.current.value).toBe(initialStatus);
    expect(statusHook.result.current.renderCount).toBe(1);

    act(() => {
      store.update({
        hasMoreHistory: true,
      });
    });

    const statusAfterHistory = statusHook.result.current.value;

    expect(statusHook.result.current.renderCount).toBe(2);
    expect(statusAfterHistory).toEqual({
      isStreaming: false,
      hasMoreHistory: true,
      error: null,
      conversationError: null,
      isLoadingConversations: false,
      isLoadingMessages: false,
      isRealtimeConnecting: false,
      typingUserIds: [],
    });

    act(() => {
      store.update({
        isStreaming: true,
        error: streamError,
      });
    });

    expect(statusHook.result.current.renderCount).toBe(3);
    expect(statusHook.result.current.value).toEqual({
      isStreaming: true,
      hasMoreHistory: true,
      error: streamError,
      conversationError: null,
      isLoadingConversations: false,
      isLoadingMessages: false,
      isRealtimeConnecting: false,
      typingUserIds: [],
    });
  });

  it('useChatStatus.typingUserIds reflects typing events for the active conversation and ignores message updates', () => {
    const store = new ChatStore({
      defaultMessages: [userMessage],
      defaultActiveConversationId: 'c1',
    });
    const wrapper = createStoreWrapper(store);
    // eslint-disable-next-line testing-library/render-result-naming-convention
    const statusHook = renderHook(() => useRenderCount(useChatStatus()), { wrapper });

    expect(statusHook.result.current.value.typingUserIds).toEqual([]);

    // Setting a user typing in the active conversation triggers a rerender
    act(() => {
      store.setTypingUser('c1', 'u1', true);
    });

    expect(statusHook.result.current.renderCount).toBe(2);
    expect(statusHook.result.current.value.typingUserIds).toEqual(['u1']);

    // A second user starts typing
    act(() => {
      store.setTypingUser('c1', 'u2', true);
    });

    expect(statusHook.result.current.renderCount).toBe(3);
    expect(statusHook.result.current.value.typingUserIds).toEqual(['u1', 'u2']);

    // Typing in a different conversation does not affect the active conversation's typingUserIds
    // eslint-disable-next-line testing-library/render-result-naming-convention
    const renderCountBeforeOtherConv = statusHook.result.current.renderCount;
    act(() => {
      store.setTypingUser('c2', 'u3', true);
    });

    expect(statusHook.result.current.renderCount).toBe(renderCountBeforeOtherConv + 1);
    expect(statusHook.result.current.value.typingUserIds).toEqual(['u1', 'u2']);

    // u1 stops typing
    act(() => {
      store.setTypingUser('c1', 'u1', false);
    });

    expect(statusHook.result.current.value.typingUserIds).toEqual(['u2']);

    // A plain message update does not change typingUserIds reference
    const typingIdsBeforeMessageUpdate = statusHook.result.current.value.typingUserIds;
    act(() => {
      store.addMessage(assistantMessage);
    });

    expect(statusHook.result.current.value.typingUserIds).toBe(typingIdsBeforeMessageUpdate);
  });
});
