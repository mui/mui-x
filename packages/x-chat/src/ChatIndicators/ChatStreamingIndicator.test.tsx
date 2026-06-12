import * as React from 'react';
import { act, createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { ChatAdapter, ChatMessage, ChatMessageChunk } from '@mui/x-chat-headless';
import { useChat, useChatStatus } from '@mui/x-chat-headless';
import { ChatBox } from '../ChatBox/ChatBox';

const { render } = createRenderer();

function createControllableAdapter() {
  let controller: ReadableStreamDefaultController<ChatMessageChunk> | null = null;
  const adapter: ChatAdapter = {
    async sendMessage() {
      return new ReadableStream<ChatMessageChunk>({
        start(streamController) {
          controller = streamController;
        },
      });
    },
  };

  return {
    adapter,
    emit(chunk: ChatMessageChunk) {
      controller!.enqueue(chunk);
    },
    end() {
      controller!.close();
    },
  };
}

function createMessage(id: string, role: ChatMessage['role'], text = id): ChatMessage {
  return {
    id,
    role,
    status: 'sent',
    parts: [{ type: 'text', text }],
  };
}

const agentMessages = [createMessage('m1', 'user', 'question'), createMessage('a1', 'assistant')];

function SendButton() {
  const { sendMessage } = useChat();
  return (
    <button onClick={() => sendMessage({ parts: [{ type: 'text', text: 'hi' }] })}>send</button>
  );
}

function StreamingProbe() {
  const { isStreaming } = useChatStatus();
  return <span data-testid="streaming-probe">{String(isStreaming)}</span>;
}

async function waitForStreaming() {
  await waitFor(() => {
    expect(screen.getByTestId('streaming-probe')).to.have.text('true');
  });
}

function queryIndicator() {
  return document.querySelector('.MuiChatStreamingIndicator-root');
}

describe('ChatStreamingIndicator', () => {
  it('shows the waiting row after sending in an assistant-backed chat, then hides on finish', async () => {
    const { adapter, emit, end } = createControllableAdapter();
    render(
      <ChatBox adapter={adapter} streamFlushInterval={0} initialMessages={agentMessages}>
        <SendButton />
      </ChatBox>,
    );

    expect(queryIndicator()).to.equal(null);

    fireEvent.click(screen.getByText('send'));

    await waitFor(() => {
      expect(queryIndicator()).not.to.equal(null);
    });
    expect(queryIndicator()).to.have.attribute('data-phase', 'waiting');
    expect(queryIndicator()).to.have.attribute('aria-hidden', 'true');

    emit({ type: 'finish', messageId: 'a2' });
    end();

    await waitFor(() => {
      expect(queryIndicator()).to.equal(null);
    });
  });

  it('moves into the assistant bubble while the response streams', async () => {
    const { adapter, emit } = createControllableAdapter();
    render(
      <ChatBox adapter={adapter} streamFlushInterval={0} initialMessages={agentMessages}>
        <SendButton />
      </ChatBox>,
    );

    fireEvent.click(screen.getByText('send'));

    await waitFor(() => {
      expect(queryIndicator()).to.have.attribute('data-phase', 'waiting');
    });

    emit({ type: 'start', messageId: 'a2' });
    emit({ type: 'text-start', id: 't1' });
    emit({ type: 'text-delta', id: 't1', delta: 'Hello' });

    await waitFor(() => {
      expect(queryIndicator()).to.have.attribute('data-phase', 'streaming');
    });

    // Exactly one indicator: the waiting row handed over to the in-bubble one,
    // which renders inside the streaming assistant message.
    expect(document.querySelectorAll('.MuiChatStreamingIndicator-root').length).to.equal(1);
    const streamingMessage = document.querySelector('.MuiChatMessage-streaming');
    expect(streamingMessage!.contains(queryIndicator())).to.equal(true);
  });

  it('renders inside an assistant message that is already streaming', () => {
    render(
      <ChatBox
        adapter={createControllableAdapter().adapter}
        initialMessages={[
          createMessage('m1', 'user'),
          {
            id: 'a1',
            role: 'assistant',
            status: 'streaming',
            parts: [{ type: 'text', text: 'partial', state: 'streaming' }],
          },
        ]}
      >
        {null}
      </ChatBox>,
    );

    expect(queryIndicator()).to.have.attribute('data-phase', 'streaming');
  });

  it('does not show in a chat with no assistant signal (auto)', async () => {
    const { adapter, end } = createControllableAdapter();
    render(
      <ChatBox
        adapter={adapter}
        initialMessages={[createMessage('m1', 'user'), createMessage('m2', 'user')]}
      >
        <SendButton />
        <StreamingProbe />
      </ChatBox>,
    );

    fireEvent.click(screen.getByText('send'));

    await waitForStreaming();
    expect(queryIndicator()).to.equal(null);
    await act(async () => end());
  });

  it('features.streamingIndicator=true forces it in non-assistant chats', async () => {
    const { adapter } = createControllableAdapter();
    render(
      <ChatBox
        adapter={adapter}
        initialMessages={[createMessage('m1', 'user')]}
        features={{ streamingIndicator: true }}
      >
        <SendButton />
      </ChatBox>,
    );

    fireEvent.click(screen.getByText('send'));

    await waitFor(() => {
      expect(queryIndicator()).not.to.equal(null);
    });
  });

  it('features.streamingIndicator=false disables it entirely', async () => {
    const { adapter, end } = createControllableAdapter();
    render(
      <ChatBox
        adapter={adapter}
        initialMessages={agentMessages}
        features={{ streamingIndicator: false }}
      >
        <SendButton />
        <StreamingProbe />
      </ChatBox>,
    );

    fireEvent.click(screen.getByText('send'));

    await waitForStreaming();
    expect(queryIndicator()).to.equal(null);
    await act(async () => end());
  });

  it('features.streamingIndicator=false also hides the in-bubble indicator', () => {
    render(
      <ChatBox
        adapter={createControllableAdapter().adapter}
        features={{ streamingIndicator: false }}
        initialMessages={[
          {
            id: 'a1',
            role: 'assistant',
            status: 'streaming',
            parts: [{ type: 'text', text: 'partial', state: 'streaming' }],
          },
        ]}
      >
        {null}
      </ChatBox>,
    );

    expect(queryIndicator()).to.equal(null);
  });

  it('slots.streamingIndicator=null hides it', async () => {
    const { adapter, end } = createControllableAdapter();
    render(
      <ChatBox
        adapter={adapter}
        initialMessages={agentMessages}
        slots={{ streamingIndicator: null }}
      >
        <SendButton />
        <StreamingProbe />
      </ChatBox>,
    );

    fireEvent.click(screen.getByText('send'));

    await waitForStreaming();
    expect(queryIndicator()).to.equal(null);
    await act(async () => end());
  });

  it('renders a custom slot component instead of the default dots', async () => {
    const { adapter } = createControllableAdapter();
    function CustomIndicator(props: { mode?: boolean | 'auto' }) {
      return <div data-testid="custom-indicator" data-mode={String(props.mode)} />;
    }
    render(
      <ChatBox
        adapter={adapter}
        initialMessages={agentMessages}
        slots={{ streamingIndicator: CustomIndicator }}
      >
        <SendButton />
      </ChatBox>,
    );

    fireEvent.click(screen.getByText('send'));

    await waitFor(() => {
      expect(screen.getByTestId('custom-indicator')).to.have.attribute('data-mode', 'auto');
    });
  });
});
