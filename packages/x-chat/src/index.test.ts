import * as chat from '@mui/x-chat';
import * as headlessBridge from '@mui/x-chat/headless';
import * as headlessDirect from '@mui/x-chat-headless';
import * as chatTypes from '@mui/x-chat/types';
import * as unstyledBridge from '@mui/x-chat/unstyled';
import * as unstyledDirect from '@mui/x-chat-unstyled';
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
    expect(chat).toBeDefined();
    expect(chatTypes).toBeDefined();
    expect(headlessBridge).toBeDefined();
    expect(unstyledBridge).toBeDefined();
    expect(Object.keys(headlessBridge)).toEqual(Object.keys(headlessDirect));
    expect(Object.keys(unstyledBridge)).toEqual(Object.keys(unstyledDirect));
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

    expect(message.metadata?.traceId).toBe('trace-1');
    expect(message.author?.metadata?.isStaff).toBe(true);
    expect(toolPart.toolInvocation.input?.query).toBe('weather');
    expect(dataPart.data.city).toBe('Prague');
    expect(conversation.metadata?.workspaceId).toBe('workspace-1');
  });
});
