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
      parts: [customPart],
    };

    const conversation: Chatbox.Conversation = {
      id: 'c1',
      metadata: {
        workspaceId: 'workspace-1',
      },
    };

    expect(message.metadata?.traceId).toBe('trace-1');
    expect(message.author?.metadata?.isStaff).toBe(true);
    expect(conversation.metadata?.workspaceId).toBe('workspace-1');
  });
});
