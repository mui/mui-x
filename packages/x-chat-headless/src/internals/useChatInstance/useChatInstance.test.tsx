import * as React from 'react';
import { act, renderHook } from '@mui/internal-test-utils';
import { clearWarningsCache } from '@mui/x-internals/warning';
import { spy } from 'sinon';
import type { ChatConversation, ChatMessage } from '../../types/chat-entities';
import { useChatInstance } from './useChatInstance';

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

describe('useChatInstance', () => {
  beforeEach(() => {
    clearWarningsCache();
  });

  it('creates the store once and reuses it across rerenders', () => {
    const { result, rerender } = renderHook(
      ({ messages }: { messages: ChatMessage[] }) => useChatInstance({ messages }),
      {
        initialProps: {
          messages: [message1],
        },
      },
    );

    const initialStore = result.current;

    rerender({
      messages: [message1, message2],
    });

    expect(result.current).toBe(initialStore);
    expect(result.current.state.messageIds).toEqual(['m1', 'm2']);
  });

  it('resyncs controlled props on rerender', () => {
    const { result, rerender } = renderHook(
      ({
        messages,
        conversations,
        activeConversationId,
        composerValue,
      }: {
        messages: ChatMessage[];
        conversations: ChatConversation[];
        activeConversationId: string;
        composerValue: string;
      }) =>
        useChatInstance({
          messages,
          conversations,
          activeConversationId,
          composerValue,
        }),
      {
        initialProps: {
          messages: [message1],
          conversations: [conversation1],
          activeConversationId: 'c1',
          composerValue: 'Draft one',
        },
      },
    );

    act(() => {
      result.current.addMessage(message2);
      result.current.setConversations([conversation2]);
      result.current.setActiveConversation('c2');
      result.current.setComposerValue('Draft two');
    });

    rerender({
      messages: [message1],
      conversations: [conversation1],
      activeConversationId: 'c1',
      composerValue: 'Draft one',
    });

    expect(result.current.state.messageIds).toEqual(['m1']);
    expect(result.current.state.conversationIds).toEqual(['c1']);
    expect(result.current.state.activeConversationId).toBe('c1');
    expect(result.current.state.composerValue).toBe('Draft one');
  });

  it('calls the matching onChange callbacks for internal store mutations', () => {
    const onMessagesChange = spy();
    const onConversationsChange = spy();
    const onActiveConversationChange = spy();
    const onComposerValueChange = spy();
    const { result } = renderHook(() =>
      useChatInstance({
        onMessagesChange,
        onConversationsChange,
        onActiveConversationChange,
        onComposerValueChange,
      }),
    );

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

  it('does not echo controlled prop sync through onChange callbacks', () => {
    const onMessagesChange = spy();
    const onConversationsChange = spy();
    const onActiveConversationChange = spy();
    const onComposerValueChange = spy();
    const { rerender } = renderHook(
      ({
        messages,
        conversations,
        activeConversationId,
        composerValue,
      }: {
        messages: ChatMessage[];
        conversations: ChatConversation[];
        activeConversationId: string;
        composerValue: string;
      }) =>
        useChatInstance({
          messages,
          conversations,
          activeConversationId,
          composerValue,
          onMessagesChange,
          onConversationsChange,
          onActiveConversationChange,
          onComposerValueChange,
        }),
      {
        initialProps: {
          messages: [message1],
          conversations: [conversation1],
          activeConversationId: 'c1',
          composerValue: 'Draft one',
        },
      },
    );

    rerender({
      messages: [message1, message2],
      conversations: [conversation1, conversation2],
      activeConversationId: 'c2',
      composerValue: 'Draft two',
    });

    expect(onMessagesChange.callCount).toBe(0);
    expect(onConversationsChange.callCount).toBe(0);
    expect(onActiveConversationChange.callCount).toBe(0);
    expect(onComposerValueChange.callCount).toBe(0);
  });

  it('warns when switching from controlled to uncontrolled', () => {
    const { rerender } = renderHook(
      ({ messages }: { messages?: ChatMessage[] }) => useChatInstance({ messages }),
      {
        initialProps: {
          messages: [message1] as ChatMessage[] | undefined,
        },
      },
    );

    expect(() => {
      rerender({ messages: undefined });
    }).toErrorDev(
      'MUI X Chat: A component is changing the controlled messages state of ChatProvider to be uncontrolled.',
    );
  });

  it('warns and ignores default model updates after initialization', () => {
    const { result, rerender } = renderHook(
      ({ initialMessages }: { initialMessages: ChatMessage[] }) =>
        useChatInstance({ initialMessages }),
      {
        initialProps: {
          initialMessages: [message1],
        },
      },
    );

    expect(() => {
      rerender({ initialMessages: [message2] });
      expect(result.current.state.messageIds).toEqual(['m1']);
    }).toErrorDev(
      'MUI X Chat: A component is changing the default messages state of an uncontrolled ChatProvider after being initialized.',
    );
  });

  it('cleans up subscriptions correctly in Strict Mode', () => {
    const onMessagesChange = spy();
    const wrapper = ({ children }: React.PropsWithChildren) => (
      <React.StrictMode>{children}</React.StrictMode>
    );
    const { result } = renderHook(() => useChatInstance({ onMessagesChange }), { wrapper });

    act(() => {
      result.current.addMessage(message1);
    });

    expect(onMessagesChange.callCount).toBe(1);
  });
});
