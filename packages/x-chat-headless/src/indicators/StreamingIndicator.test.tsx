import * as React from 'react';
import { act, createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { ChatAdapter } from '../adapters/chatAdapter';
import type { ChatMessage } from '../types/chat-entities';
import type { ChatMessageChunk } from '../types/chat-stream';
import { ChatRoot } from '../chat/ChatRoot';
import { useChat } from '../hooks/useChat';
import { useChatStatus } from '../hooks/useChatStatus';
import { StreamingIndicator } from './StreamingIndicator';

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

const IndicatorRoot = React.forwardRef(function IndicatorRoot(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & {
    ownerState?: { phase: 'waiting' | 'streaming' | null };
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState, ...other } = props;
  return (
    <div data-testid="streaming-indicator" data-test-phase={ownerState?.phase} ref={ref} {...other}>
      {children}
    </div>
  );
});

const indicatorSlots = { root: IndicatorRoot };

describe('StreamingIndicator', () => {
  describe('waiting phase (no assistant message yet)', () => {
    it('shows while a response is in flight in an assistant-backed chat (auto)', async () => {
      const { adapter } = createControllableAdapter();
      render(
        <ChatRoot
          adapter={adapter}
          initialMessages={[createMessage('m1', 'user'), createMessage('a1', 'assistant')]}
        >
          <SendButton />
          <StreamingIndicator slots={indicatorSlots} />
        </ChatRoot>,
      );

      expect(screen.queryByTestId('streaming-indicator')).toBeNull();

      fireEvent.click(screen.getByText('send'));

      await waitFor(() => {
        expect(screen.getByTestId('streaming-indicator')).to.have.attribute(
          'data-test-phase',
          'waiting',
        );
      });
    });

    it('detects assistant-backed chats from configured members (auto)', async () => {
      const { adapter } = createControllableAdapter();
      render(
        <ChatRoot adapter={adapter} members={[{ id: 'bot', role: 'assistant' }]}>
          <SendButton />
          <StreamingIndicator slots={indicatorSlots} />
        </ChatRoot>,
      );

      fireEvent.click(screen.getByText('send'));

      await waitFor(() => {
        expect(screen.getByTestId('streaming-indicator')).not.to.equal(null);
      });
    });

    it('stays hidden in a chat with no assistant signal (auto)', async () => {
      const { adapter, end } = createControllableAdapter();
      render(
        <ChatRoot adapter={adapter} initialMessages={[createMessage('m1', 'user')]}>
          <SendButton />
          <StreamingProbe />
          <StreamingIndicator slots={indicatorSlots} />
        </ChatRoot>,
      );

      fireEvent.click(screen.getByText('send'));

      // The send pipeline is in flight (isStreaming), yet auto-detection blocks it.
      await waitForStreaming();
      expect(screen.queryByTestId('streaming-indicator')).toBeNull();
      await act(async () => end());
    });

    it('mode=true forces the indicator in non-assistant chats', async () => {
      const { adapter } = createControllableAdapter();
      render(
        <ChatRoot adapter={adapter} initialMessages={[createMessage('m1', 'user')]}>
          <SendButton />
          <StreamingIndicator mode slots={indicatorSlots} />
        </ChatRoot>,
      );

      fireEvent.click(screen.getByText('send'));

      await waitFor(() => {
        expect(screen.getByTestId('streaming-indicator')).not.to.equal(null);
      });
    });

    it('mode=false suppresses the indicator in assistant-backed chats', async () => {
      const { adapter, end } = createControllableAdapter();
      render(
        <ChatRoot adapter={adapter} initialMessages={[createMessage('a1', 'assistant')]}>
          <SendButton />
          <StreamingProbe />
          <StreamingIndicator mode={false} slots={indicatorSlots} />
        </ChatRoot>,
      );

      fireEvent.click(screen.getByText('send'));

      await waitForStreaming();
      expect(screen.queryByTestId('streaming-indicator')).toBeNull();
      await act(async () => end());
    });

    it('hands over to the in-message indicator once the assistant message starts', async () => {
      const { adapter, emit } = createControllableAdapter();
      render(
        <ChatRoot
          adapter={adapter}
          streamFlushInterval={0}
          initialMessages={[createMessage('a0', 'assistant')]}
        >
          <SendButton />
          <StreamingIndicator slots={indicatorSlots} />
        </ChatRoot>,
      );

      fireEvent.click(screen.getByText('send'));

      await waitFor(() => {
        expect(screen.getByTestId('streaming-indicator')).not.to.equal(null);
      });

      emit({ type: 'start', messageId: 'a1' });

      // The standalone (waiting) indicator hides — the streaming assistant
      // message now exists and hosts its own indicator.
      await waitFor(() => {
        expect(screen.queryByTestId('streaming-indicator')).toBeNull();
      });
    });

    it('hides again when the stream finishes', async () => {
      const { adapter, emit, end } = createControllableAdapter();
      render(
        <ChatRoot
          adapter={adapter}
          streamFlushInterval={0}
          initialMessages={[createMessage('a0', 'assistant')]}
        >
          <SendButton />
          <StreamingIndicator slots={indicatorSlots} />
        </ChatRoot>,
      );

      fireEvent.click(screen.getByText('send'));
      await waitFor(() => {
        expect(screen.getByTestId('streaming-indicator')).not.to.equal(null);
      });

      emit({ type: 'finish', messageId: 'a1' });
      end();

      await waitFor(() => {
        expect(screen.queryByTestId('streaming-indicator')).toBeNull();
      });
    });
  });

  describe('in-message phase', () => {
    it('renders while the given assistant message is streaming', () => {
      const message: ChatMessage = {
        id: 'a1',
        role: 'assistant',
        status: 'streaming',
        parts: [{ type: 'text', text: 'partial', state: 'streaming' }],
      };
      render(
        <ChatRoot adapter={createControllableAdapter().adapter} initialMessages={[message]}>
          <StreamingIndicator message={message} slots={indicatorSlots} />
        </ChatRoot>,
      );

      expect(screen.getByTestId('streaming-indicator')).to.have.attribute(
        'data-test-phase',
        'streaming',
      );
    });

    it('does not render for a completed assistant message', () => {
      const message = createMessage('a1', 'assistant');
      render(
        <ChatRoot adapter={createControllableAdapter().adapter} initialMessages={[message]}>
          <StreamingIndicator message={message} slots={indicatorSlots} />
        </ChatRoot>,
      );

      expect(screen.queryByTestId('streaming-indicator')).toBeNull();
    });

    it('does not render for a streaming non-assistant message', () => {
      const message: ChatMessage = {
        id: 'm1',
        role: 'user',
        status: 'streaming',
        parts: [{ type: 'text', text: 'hello' }],
      };
      render(
        <ChatRoot adapter={createControllableAdapter().adapter} initialMessages={[message]}>
          <StreamingIndicator message={message} slots={indicatorSlots} />
        </ChatRoot>,
      );

      expect(screen.queryByTestId('streaming-indicator')).toBeNull();
    });
  });

  describe('row contract', () => {
    it('self-suppresses on every row except the last one', async () => {
      const { adapter, end } = createControllableAdapter();
      render(
        <ChatRoot adapter={adapter} initialMessages={[createMessage('a1', 'assistant')]}>
          <SendButton />
          <StreamingProbe />
          <StreamingIndicator index={0} items={['a1', 'm2']} slots={indicatorSlots} />
        </ChatRoot>,
      );

      fireEvent.click(screen.getByText('send'));

      await waitForStreaming();
      expect(screen.queryByTestId('streaming-indicator')).toBeNull();
      await act(async () => end());
    });
  });

  it('marks the indicator as decorative (aria-hidden)', async () => {
    const { adapter } = createControllableAdapter();
    render(
      <ChatRoot adapter={adapter} initialMessages={[createMessage('a1', 'assistant')]}>
        <SendButton />
        <StreamingIndicator slots={indicatorSlots} />
      </ChatRoot>,
    );

    fireEvent.click(screen.getByText('send'));

    await waitFor(() => {
      expect(screen.getByTestId('streaming-indicator')).to.have.attribute('aria-hidden', 'true');
    });
  });
});
