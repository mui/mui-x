import * as chat from '@mui/x-chat';
import * as headlessBridge from '@mui/x-chat/headless';
import * as headlessDirect from '@mui/x-chat-headless';
import * as chatTypes from '@mui/x-chat/types';
import * as unstyledBridge from '@mui/x-chat/unstyled';
import * as unstyledChatBridge from '@mui/x-chat/unstyled/chat';
import * as unstyledConversationListBridge from '@mui/x-chat/unstyled/conversation-list';
import * as unstyledDirect from '@mui/x-chat-unstyled';
import * as unstyledChatDirect from '@mui/x-chat-unstyled/chat';
import * as unstyledConversationListDirect from '@mui/x-chat-unstyled/conversation-list';
import { Chat as UnstyledBridgeChat, ChatLayout as UnstyledBridgeChatLayout, ChatRoot as UnstyledBridgeChatRoot } from '@mui/x-chat/unstyled/chat';
import {
  ConversationList as UnstyledBridgeConversationList,
  ConversationListRoot as UnstyledBridgeConversationListRoot,
} from '@mui/x-chat/unstyled/conversation-list';
import { Chat as UnstyledDirectChat, ChatLayout as UnstyledDirectChatLayout, ChatRoot as UnstyledDirectChatRoot } from '@mui/x-chat-unstyled/chat';
import {
  ConversationList as UnstyledDirectConversationList,
  ConversationListRoot as UnstyledDirectConversationListRoot,
} from '@mui/x-chat-unstyled/conversation-list';
import { ChatProvider as HeadlessBridgeChatProvider } from '@mui/x-chat/headless';
import { chatSelectors as headlessBridgeSelectors } from '@mui/x-chat/headless';
import { useChat as headlessBridgeUseChat } from '@mui/x-chat/headless';
import { useChatComposer as headlessBridgeUseChatComposer } from '@mui/x-chat/headless';
import { useChatPartRenderer as headlessBridgeUseChatPartRenderer } from '@mui/x-chat/headless';
import { useChatStatus as headlessBridgeUseChatStatus } from '@mui/x-chat/headless';
import { useConversation as headlessBridgeUseConversation } from '@mui/x-chat/headless';
import { useConversations as headlessBridgeUseConversations } from '@mui/x-chat/headless';
import { useMessage as headlessBridgeUseMessage } from '@mui/x-chat/headless';
import { useMessageIds as headlessBridgeUseMessageIds } from '@mui/x-chat/headless';
import { useChatStore as headlessBridgeUseChatStore } from '@mui/x-chat/headless';
import { ChatProvider as HeadlessDirectChatProvider } from '@mui/x-chat-headless';
import { chatSelectors as headlessDirectSelectors } from '@mui/x-chat-headless';
import { useChat as headlessDirectUseChat } from '@mui/x-chat-headless';
import { useChatComposer as headlessDirectUseChatComposer } from '@mui/x-chat-headless';
import { useChatPartRenderer as headlessDirectUseChatPartRenderer } from '@mui/x-chat-headless';
import { useChatStatus as headlessDirectUseChatStatus } from '@mui/x-chat-headless';
import { useConversation as headlessDirectUseConversation } from '@mui/x-chat-headless';
import { useConversations as headlessDirectUseConversations } from '@mui/x-chat-headless';
import { useMessage as headlessDirectUseMessage } from '@mui/x-chat-headless';
import { useMessageIds as headlessDirectUseMessageIds } from '@mui/x-chat-headless';
import { useChatStore as headlessDirectUseChatStore } from '@mui/x-chat-headless';
import type {
  ChatAddToolApproveResponseInput as HeadlessAddToolApproveResponseInput,
  ChatAdapter as HeadlessAdapter,
  ChatMessage as HeadlessMessage,
  ChatMessageChunk as HeadlessMessageChunk,
  ChatMessagePart as HeadlessMessagePart,
  ChatProviderProps as HeadlessChatProviderProps,
  ChatPartRendererMap as HeadlessPartRendererMap,
  ChatPublicState as HeadlessPublicState,
  ChatRealtimeEvent as HeadlessRealtimeEvent,
  ChatToolInvocation as HeadlessToolInvocation,
} from '@mui/x-chat/headless';
import type * as Chatbox from '@mui/x-chat/types';

declare module '@mui/x-chat-headless/types' {
  interface ChatUserMetadata {
    isStaff?: boolean;
  }

  interface ChatConversationMetadata {
    workspaceId?: string;
  }

  interface ChatMessageMetadata {
    traceId?: string;
    model?: string;
  }

  interface ChatCustomMessagePartMap {
    poll: {
      type: 'poll';
      question: string;
      options: string[];
    };
  }

  interface ChatToolDefinitionMap {
    search: {
      input: {
        query: string;
      };
      output: {
        results: Array<{
          title: string;
          url: string;
        }>;
      };
    };
  }

  interface ChatDataPartMap {
    'data-weather': {
      city: string;
      temperatureC: number;
    };
  }
}

describe('x-chat package scaffold', () => {
  it('resolves the root, bridge, and type entry points', () => {
    const expectedHeadlessRuntimeExports = [
      'ChatProvider',
      'chatSelectors',
      'useChat',
      'useChatComposer',
      'useChatPartRenderer',
      'useChatStatus',
      'useChatStore',
      'useConversation',
      'useConversations',
      'useMessage',
      'useMessageIds',
    ];
    const headlessBridgeRuntime = headlessBridge as Record<string, unknown>;
    const headlessDirectRuntime = headlessDirect as Record<string, unknown>;

    expect(chat).toBeDefined();
    expect(chatTypes).toBeDefined();
    expect(headlessBridge).toBeDefined();
    expect(unstyledBridge).toBeDefined();
    expect(Object.keys(headlessBridge).sort()).toEqual(expectedHeadlessRuntimeExports);
    expect(Object.keys(headlessDirect).sort()).toEqual(expectedHeadlessRuntimeExports);
    expect(Object.keys(unstyledBridge)).toEqual(Object.keys(unstyledDirect));
    expect(Object.keys(unstyledChatBridge).sort()).toEqual(Object.keys(unstyledChatDirect).sort());
    expect(Object.keys(unstyledConversationListBridge).sort()).toEqual(
      Object.keys(unstyledConversationListDirect).sort(),
    );
    expect(headlessBridgeSelectors).toBe(headlessDirectSelectors);
    expect(HeadlessBridgeChatProvider).toBe(HeadlessDirectChatProvider);
    expect(headlessBridgeUseChatStore).toBe(headlessDirectUseChatStore);
    expect(headlessBridgeUseChat).toBe(headlessDirectUseChat);
    expect(headlessBridgeUseChatComposer).toBe(headlessDirectUseChatComposer);
    expect(headlessBridgeUseChatPartRenderer).toBe(headlessDirectUseChatPartRenderer);
    expect(headlessBridgeUseMessageIds).toBe(headlessDirectUseMessageIds);
    expect(headlessBridgeUseMessage).toBe(headlessDirectUseMessage);
    expect(headlessBridgeUseConversations).toBe(headlessDirectUseConversations);
    expect(headlessBridgeUseConversation).toBe(headlessDirectUseConversation);
    expect(headlessBridgeUseChatStatus).toBe(headlessDirectUseChatStatus);
    expect(headlessBridgeRuntime.ChatStore).toBeUndefined();
    expect(headlessBridgeRuntime.processStream).toBeUndefined();
    expect(headlessBridgeRuntime.useChatStoreContext).toBeUndefined();
    expect(headlessDirectRuntime.ChatStore).toBeUndefined();
    expect(headlessDirectRuntime.processStream).toBeUndefined();
    expect(headlessDirectRuntime.useChatStoreContext).toBeUndefined();
    expect(UnstyledBridgeChat).toBe(UnstyledDirectChat);
    expect(UnstyledBridgeChatRoot).toBe(UnstyledDirectChatRoot);
    expect(UnstyledBridgeChatLayout).toBe(UnstyledDirectChatLayout);
    expect(UnstyledBridgeChat.Root).toBe(UnstyledBridgeChatRoot);
    expect(UnstyledBridgeChat.Layout).toBe(UnstyledBridgeChatLayout);
    expect(UnstyledBridgeConversationList).toBe(UnstyledDirectConversationList);
    expect(UnstyledBridgeConversationListRoot).toBe(UnstyledDirectConversationListRoot);
    expect(UnstyledBridgeConversationList.Root).toBe(UnstyledBridgeConversationListRoot);
  });

  it('type-checks the public Chatbox namespace facade', () => {
    const customPart: Extract<Chatbox.MessagePart, { type: 'poll' }> = {
      type: 'poll',
      question: 'Pick one',
      options: ['A', 'B'],
    };

    const textPart: Chatbox.TextMessagePart = {
      type: 'text',
      text: 'Hello',
      state: 'done',
    };

    const toolPart: Chatbox.ToolMessagePart<'search'> = {
      type: 'tool',
      toolInvocation: {
        toolCallId: 'tool-1',
        toolName: 'search',
        state: 'output-available',
        input: {
          query: 'weather',
        },
        output: {
          results: [{ title: 'Forecast', url: 'https://example.com' }],
        },
      },
    };

    const dataPart: Extract<Chatbox.MessagePart, { type: 'data-weather' }> = {
      type: 'data-weather',
      data: {
        city: 'Prague',
        temperatureC: 12,
      },
    };

    const message: Chatbox.Message = {
      id: 'm1',
      role: 'assistant',
      metadata: {
        traceId: 'trace-1',
        model: 'gpt-test',
      },
      author: {
        id: 'u1',
        metadata: {
          isStaff: true,
        },
      },
      parts: [textPart, toolPart, dataPart, customPart],
    };

    const conversation: Chatbox.Conversation = {
      id: 'c1',
      metadata: {
        workspaceId: 'workspace-1',
      },
    };

    const inputChunk: Chatbox.ToolInputAvailableChunk<'search'> = {
      type: 'tool-input-available',
      toolCallId: 'tool-1',
      toolName: 'search',
      input: {
        query: 'weather',
      },
    };

    const outputChunk: Chatbox.ToolOutputAvailableChunk<'search'> = {
      type: 'tool-output-available',
      toolCallId: 'tool-1',
      output: {
        results: [{ title: 'Forecast', url: 'https://example.com' }],
      },
    };

    const weatherChunk: Extract<Chatbox.MessageChunk, { type: 'data-weather' }> = {
      type: 'data-weather',
      data: {
        city: 'Prague',
        temperatureC: 12,
      },
    };

    const metadataChunk: Chatbox.MessageMetadataChunk = {
      type: 'message-metadata',
      metadata: {
        traceId: 'trace-2',
      },
    };

    const envelope: Chatbox.StreamEnvelope = {
      eventId: 'evt-1',
      sequence: 1,
      chunk: inputChunk,
    };

    const adapter: HeadlessAdapter<number> = {
      async listConversations({ cursor, query } = {}) {
        expect(cursor).toBeUndefined();
        expect(query).toBeUndefined();

        return {
          conversations: [conversation],
          cursor: 2,
          hasMore: true,
        };
      },
      async listMessages({ conversationId, cursor, direction }) {
        expect(conversationId).toBe('c1');
        expect(cursor).toBe(2);
        expect(direction).toBe('backward');

        return {
          messages: [message],
          cursor: 1,
          hasMore: false,
        };
      },
      async sendMessage({ conversationId, message: currentMessage, messages, signal }) {
        expect(conversationId).toBe('c1');
        expect(currentMessage.id).toBe('m1');
        expect(messages).toHaveLength(1);
        expect(signal).toBeInstanceOf(AbortSignal);

        return new ReadableStream<Chatbox.MessageChunk>({
          start(controller) {
            controller.enqueue({
              type: 'start',
              messageId: currentMessage.id,
            });
            controller.close();
          },
        });
      },
      subscribe({ onEvent }) {
        onEvent({
          type: 'message-added',
          message,
        });

        return () => {};
      },
    };

    const rendererMap: HeadlessPartRendererMap = {
      text: ({ part: currentPart }) => currentPart.text,
      poll: ({ part: currentPart }) => currentPart.question,
      tool: ({ part: currentPart }) => currentPart.toolInvocation.toolName,
    };

    const rendererAliasMap: Chatbox.PartRendererMap = rendererMap;
    const approvalResponseInput: HeadlessAddToolApproveResponseInput = {
      id: 'approval-1',
      approved: true,
    };
    const messageAlias: HeadlessMessage = message;
    const messagePartAlias: HeadlessMessagePart = textPart;
    const toolInvocationAlias: HeadlessToolInvocation<'search'> = toolPart.toolInvocation;
    const messageChunkAlias: HeadlessMessageChunk = outputChunk;
    const providerProps: HeadlessChatProviderProps<number> = {
      adapter,
      children: null,
    };

    const publicState: Chatbox.PublicState<number> = {
      conversations: [conversation],
      activeConversationId: 'c1',
      messages: [message],
      messageCount: 1,
      isStreaming: false,
      hasMoreHistory: true,
      historyCursor: 2,
      error: null,
    };
    const publicStateAlias: HeadlessPublicState<number> = publicState;

    const realtimeEvent: Chatbox.RealtimeEvent = {
      type: 'typing',
      conversationId: 'c1',
      userId: 'u1',
      isTyping: true,
    };
    const realtimeEventAlias: HeadlessRealtimeEvent = realtimeEvent;

    const onFinish: Chatbox.ChatOnFinish = ({ finishReason, isError }) => {
      expect(isError).toBe(false);
      expect(finishReason).toBe('stop');
    };

    expect(message.metadata?.traceId).toBe('trace-1');
    expect(message.author?.metadata?.isStaff).toBe(true);
    expect(toolPart.toolInvocation.input?.query).toBe('weather');
    expect(dataPart.data.city).toBe('Prague');
    expect(conversation.metadata?.workspaceId).toBe('workspace-1');
    expect(outputChunk.output.results[0].title).toBe('Forecast');
    expect(approvalResponseInput.approved).toBe(true);
    expect(messageAlias.id).toBe('m1');
    expect(messagePartAlias.type).toBe('text');
    expect(toolInvocationAlias.toolName).toBe('search');
    expect(messageChunkAlias.type).toBe('tool-output-available');
    expect(providerProps.adapter).toBe(adapter);
    expect(weatherChunk.data.temperatureC).toBe(12);
    expect(metadataChunk.metadata.traceId).toBe('trace-2');
    expect(envelope.chunk.type).toBe('tool-input-available');
    expect(rendererAliasMap.text?.({ part: textPart, message, index: 0 })).toBe('Hello');
    expect(publicStateAlias.historyCursor).toBe(2);
    expect(realtimeEventAlias.type).toBe('typing');
    expect(adapter.subscribe).toBeDefined();

    onFinish({
      message,
      messages: [message],
      isAbort: false,
      isDisconnect: false,
      isError: false,
      finishReason: 'stop',
    });
  });
});
