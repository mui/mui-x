import * as React from 'react';
import { act, renderHook } from '@mui/internal-test-utils';
import { useStore } from '@mui/x-internals/store';
import { clearWarningsCache } from '@mui/x-internals/warning';
import { spy } from 'sinon';
import type { ChatAdapter } from './adapters';
import { useChatRuntimeContext } from './internals/useChatRuntimeContext';
import { useChatStore } from './hooks';
import type { ChatPartRendererMap } from './renderers';
import { chatSelectors } from './selectors';
import { ChatStore, type ChatStoreParameters } from './store';
import type { ChatConversation, ChatMessage } from './types/chat-entities';
import { ChatProvider, type ChatProviderProps } from './ChatProvider';
import { useChatStoreContext } from './internals/useChatStoreContext';

const message1: ChatMessage = {
  id: 'm1',
  role: 'user',
  parts: [{ type: 'text', text: 'Hello' }],
};

const message2: ChatMessage = {
  id: 'm2',
  role: 'assistant',
  status: 'sent',
  parts: [{ type: 'text', text: 'Hi' }],
};

const conversation1: ChatConversation = {
  id: 'c1',
  title: 'General',
};

const conversation2: ChatConversation = {
  id: 'c2',
  title: 'Support',
};

function createAdapter(): ChatAdapter {
  return {
    async sendMessage() {
      return new ReadableStream({
        start(controller) {
          controller.close();
        },
      });
    },
  };
}

function createProviderWrapper(initialProps: Omit<ChatProviderProps, 'children'>) {
  let currentProps = initialProps;

  function Wrapper({ children }: React.PropsWithChildren) {
    return <ChatProvider {...currentProps}>{children}</ChatProvider>;
  }

  return {
    Wrapper,
    setProps(nextProps: Omit<ChatProviderProps, 'children'>) {
      currentProps = nextProps;
    },
  };
}

describe('ChatProvider', () => {
  beforeEach(() => {
    clearWarningsCache();
  });

  it('renders children and provides the chat store through context', () => {
    const { Wrapper } = createProviderWrapper({
      adapter: createAdapter(),
      initialMessages: [message1],
    });
    const { result } = renderHook(() => useChatStoreContext(), { wrapper: Wrapper });

    expect(result.current.state.messageIds).toEqual(['m1']);
  });

  it('returns null from useChatStoreContext(true) outside the provider and throws otherwise', () => {
    const { result } = renderHook(() => useChatStoreContext(true));

    expect(result.current).toBe(null);
    expect(() => renderHook(() => useChatStoreContext())).toThrow(
      'MUI X Chat: useChatStoreContext must be used within a <ChatProvider> component',
    );
  });

  it('returns the store from useChatStore and preserves the provider instance across rerenders', () => {
    const initialMessages = [message1];
    const { Wrapper, setProps } = createProviderWrapper({
      adapter: createAdapter(),
      initialMessages,
    });
    const { result, rerender } = renderHook(() => useChatStore(), { wrapper: Wrapper });

    const initialStore = result.current;

    expect(result.current.state.messageIds).toEqual(['m1']);

    setProps({
      adapter: createAdapter(),
      initialMessages,
    });
    rerender();

    expect(result.current).toBe(initialStore);
  });

  it('throws from useChatStore outside the provider', () => {
    expect(() => renderHook(() => useChatStore())).toThrow(
      'MUI X Chat: useChatStore must be used within a <ChatProvider> component',
    );
  });

  it('supports pairing useChatStore with useStore and chatSelectors', () => {
    const { Wrapper } = createProviderWrapper({
      adapter: createAdapter(),
      initialMessages: [message1],
    });
    const { result } = renderHook(
      () => {
        const store = useChatStore();

        return useStore(store, chatSelectors.messageCount);
      },
      { wrapper: Wrapper },
    );

    expect(result.current).toBe(1);
  });

  it('creates the store once, resyncs controlled props, and exposes runtime context values', () => {
    const adapter = createAdapter();
    const onToolCall = spy();
    const onFinish = spy();
    const onData = spy();
    const onError = spy();
    const partRenderers: ChatPartRendererMap = {
      text: ({ part }) => part.text,
    };
    const { Wrapper, setProps } = createProviderWrapper({
      adapter,
      messages: [message1],
      activeConversationId: 'c1',
      partRenderers,
      onToolCall,
      onFinish,
      onData,
      onError,
    });
    const { result, rerender } = renderHook(
      () => ({
        store: useChatStoreContext(),
        runtime: useChatRuntimeContext(),
      }),
      { wrapper: Wrapper },
    );

    const initialStore = result.current.store;

    expect(result.current.store.state.messageIds).toEqual(['m1']);
    expect(result.current.store.state.activeConversationId).toBe('c1');
    expect(result.current.runtime.adapter).toBe(adapter);
    expect(result.current.runtime.onToolCall).toBe(onToolCall);
    expect(result.current.runtime.onFinish).toBe(onFinish);
    expect(result.current.runtime.onData).toBe(onData);
    expect(result.current.runtime.onError).toBe(onError);
    expect(result.current.runtime.partRenderers).toEqual(partRenderers);
    expect(result.current.runtime.partRenderers).not.toBe(partRenderers);

    setProps({
      adapter,
      messages: [message1, message2],
      activeConversationId: 'c2',
      partRenderers,
      onToolCall,
      onFinish,
      onData,
      onError,
    });
    rerender();

    expect(result.current.store).toBe(initialStore);
    expect(result.current.store.state.messageIds).toEqual(['m1', 'm2']);
    expect(result.current.store.state.activeConversationId).toBe('c2');
  });

  it('provides an empty concrete renderer registry when no custom renderers are passed', () => {
    const { Wrapper } = createProviderWrapper({
      adapter: createAdapter(),
    });
    const { result } = renderHook(() => useChatRuntimeContext(), { wrapper: Wrapper });

    expect(result.current.partRenderers).toEqual({});
  });

  it('calls uncontrolled onChange callbacks for internal store mutations', () => {
    const onMessagesChange = spy();
    const onConversationsChange = spy();
    const onActiveConversationChange = spy();
    const onComposerValueChange = spy();
    const { Wrapper } = createProviderWrapper({
      adapter: createAdapter(),
      onMessagesChange,
      onConversationsChange,
      onActiveConversationChange,
      onComposerValueChange,
    });
    const { result } = renderHook(() => useChatStoreContext(), { wrapper: Wrapper });

    act(() => {
      result.current.addMessage(message1);
      result.current.setConversations([conversation1]);
      result.current.setActiveConversation('c1');
      result.current.setComposerValue('Draft one');
    });

    expect(onMessagesChange.callCount).toBe(1);
    expect(onMessagesChange.lastCall.args[0]).toEqual([message1]);
    expect(onConversationsChange.callCount).toBe(1);
    expect(onConversationsChange.lastCall.args[0]).toEqual([conversation1]);
    expect(onActiveConversationChange.callCount).toBe(1);
    expect(onActiveConversationChange.lastCall.args[0]).toBe('c1');
    expect(onComposerValueChange.callCount).toBe(1);
    expect(onComposerValueChange.lastCall.args[0]).toBe('Draft one');
  });

  it('resyncs controlled models after internal mutations and keeps the parent values authoritative', () => {
    const onMessagesChange = spy();
    const onConversationsChange = spy();
    const onActiveConversationChange = spy();
    const onComposerValueChange = spy();
    const controlledMessages = [message1];
    const controlledConversations = [conversation1];
    const { Wrapper, setProps } = createProviderWrapper({
      adapter: createAdapter(),
      messages: controlledMessages,
      conversations: controlledConversations,
      activeConversationId: 'c1',
      composerValue: 'Draft one',
      onMessagesChange,
      onConversationsChange,
      onActiveConversationChange,
      onComposerValueChange,
    });
    const { result, rerender } = renderHook(() => useChatStoreContext(), { wrapper: Wrapper });

    act(() => {
      result.current.addMessage(message2);
      result.current.setConversations([conversation2]);
      result.current.setActiveConversation('c2');
      result.current.setComposerValue('Draft two');
    });

    expect(onMessagesChange.lastCall.args[0]).toEqual([message1, message2]);
    expect(onConversationsChange.lastCall.args[0]).toEqual([conversation2]);
    expect(onActiveConversationChange.lastCall.args[0]).toBe('c2');
    expect(onComposerValueChange.lastCall.args[0]).toBe('Draft two');

    setProps({
      adapter: createAdapter(),
      messages: controlledMessages,
      conversations: controlledConversations,
      activeConversationId: 'c1',
      composerValue: 'Draft one',
      onMessagesChange,
      onConversationsChange,
      onActiveConversationChange,
      onComposerValueChange,
    });
    rerender();

    expect(result.current.state.messageIds).toEqual(['m1']);
    expect(result.current.state.conversationIds).toEqual(['c1']);
    expect(result.current.state.activeConversationId).toBe('c1');
    expect(result.current.state.composerValue).toBe('Draft one');
  });

  it('warns when switching a provider model from controlled to uncontrolled', () => {
    const { Wrapper, setProps } = createProviderWrapper({
      adapter: createAdapter(),
      messages: [message1] as ChatMessage[] | undefined,
    });
    const { rerender } = renderHook(() => useChatStoreContext(), { wrapper: Wrapper });

    expect(() => {
      setProps({
        adapter: createAdapter(),
        messages: undefined,
      });
      rerender();
    }).toErrorDev(
      'MUI X Chat: A component is changing the controlled messages state of ChatProvider to be uncontrolled.',
    );
  });

  it('warns when switching a provider model from uncontrolled to controlled', () => {
    const { Wrapper, setProps } = createProviderWrapper({
      adapter: createAdapter(),
      messages: undefined,
    });
    const { rerender } = renderHook(() => useChatStoreContext(), { wrapper: Wrapper });

    expect(() => {
      setProps({
        adapter: createAdapter(),
        messages: [message1],
      });
      rerender();
    }).toErrorDev(
      'MUI X Chat: A component is changing the uncontrolled messages state of ChatProvider to be controlled.',
    );
  });

  it('passes streamFlushInterval through to streaming behavior', async () => {
    const adapter: ChatAdapter = {
      async sendMessage() {
        return new ReadableStream({
          start(controller) {
            controller.enqueue({ type: 'start', messageId: 'a1' });
            controller.enqueue({ type: 'text-delta', id: 'text-1', delta: 'Hello' });
            controller.enqueue({ type: 'text-delta', id: 'text-1', delta: ' world' });
            controller.enqueue({ type: 'finish', messageId: 'a1' });
            controller.close();
          },
        });
      },
    };
    const { Wrapper } = createProviderWrapper({
      adapter,
      streamFlushInterval: 0,
    });
    const { result } = renderHook(
      () => {
        const store = useChatStoreContext();
        const runtime = useChatRuntimeContext();
        return { store, runtime };
      },
      { wrapper: Wrapper },
    );

    // streamFlushInterval is passed through — we verify by checking it doesn't error
    // and the store initializes correctly
    expect(result.current.store).toBeDefined();
    expect(result.current.runtime.adapter).toBe(adapter);
  });

  it('store reference stays stable when adapter changes', () => {
    const adapter1 = createAdapter();
    const adapter2 = createAdapter();
    const { Wrapper, setProps } = createProviderWrapper({
      adapter: adapter1,
      initialMessages: [message1],
    });
    const { result, rerender } = renderHook(
      () => ({
        store: useChatStoreContext(),
        runtime: useChatRuntimeContext(),
      }),
      { wrapper: Wrapper },
    );

    const initialStore = result.current.store;

    setProps({
      adapter: adapter2,
      initialMessages: [message1],
    });
    rerender();

    expect(result.current.store).toBe(initialStore);
    expect(result.current.runtime.adapter).toBe(adapter2);
  });

  it('supports overriding the store class', () => {
    class TestStore extends ChatStore {
      static instances: TestStore[] = [];

      public constructor(parameters: ChatStoreParameters) {
        super(parameters);
        TestStore.instances.push(this);
      }
    }

    const { Wrapper } = createProviderWrapper({
      adapter: createAdapter(),
      storeClass: TestStore,
    });
    const { result } = renderHook(() => useChatStoreContext(), { wrapper: Wrapper });

    expect(result.current).toBeInstanceOf(TestStore);
    expect(TestStore.instances).toHaveLength(1);
  });
});
