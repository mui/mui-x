import * as React from 'react';
import { createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { describe, expect, it, vi } from 'vitest';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { useChatStore } from '@mui/x-chat-headless';
import { ChatRoot } from '@mui/x-chat-unstyled';
import {
  ChatConversationInput,
  ChatConversationInputAttachButton,
  ChatConversationInputTextArea,
  ChatConversationInputSendButton,
  ChatConversationInputToolbar,
} from './ChatConversationInput';
import { chatConversationInputClasses } from './chatConversationInputClasses';

const { render } = createRenderer();

function createStream() {
  return new ReadableStream({
    start(controller) {
      controller.close();
    },
  });
}

function createPendingStream() {
  return new ReadableStream({
    start() {},
  });
}

function createAdapter(overrides: Partial<ChatAdapter> = {}): ChatAdapter {
  return {
    async sendMessage() {
      return createStream();
    },
    ...overrides,
  };
}

function renderChatConversationInput(
  ui: React.ReactElement,
  options?: {
    adapter?: ChatAdapter;
    dark?: boolean;
    defaultComposerValue?: string;
    rtl?: boolean;
  },
) {
  const theme = createTheme({
    direction: options?.rtl ? 'rtl' : 'ltr',
    palette: {
      Chat: {
        composerBorder: '#d0d7de',
        composerFocusRing: '#1976d2',
      },
      mode: options?.dark ? 'dark' : 'light',
    },
  });

  return render(
    <ThemeProvider theme={theme}>
      <div dir={theme.direction}>
        <ChatRoot
          adapter={options?.adapter ?? createAdapter()}
          defaultActiveConversationId="c1"
          defaultComposerValue={options?.defaultComposerValue}
        >
          {ui}
        </ChatRoot>
      </div>
    </ThemeProvider>,
  );
}

function ErrorSetter() {
  const store = useChatStore();

  return (
    <button
      onClick={() => {
        store.setError({
          code: 'ERR_SEND',
          message: 'Network down',
          recoverable: true,
          source: 'send',
        });
      }}
      type="button"
    >
      set error
    </button>
  );
}

const CustomRoot = React.forwardRef(function CustomRoot(
  props: React.ComponentPropsWithoutRef<'form'> & {
    ownerState?: {
      attachmentCount: number;
      hasValue: boolean;
    };
  },
  ref: React.Ref<HTMLFormElement>,
) {
  const { children, ownerState, ...other } = props;

  return (
    <form
      data-attachment-count={String(ownerState?.attachmentCount)}
      data-has-value={String(ownerState?.hasValue)}
      data-testid="custom-chat-conversation-input-root"
      ref={ref}
      {...other}
    >
      {children}
    </form>
  );
});

const CustomInput = React.forwardRef(function CustomInput(
  props: React.ComponentPropsWithoutRef<'textarea'> & {
    ownerState?: {
      attachmentCount: number;
      hasValue: boolean;
    };
  },
  ref: React.Ref<HTMLTextAreaElement>,
) {
  const { ownerState, ...other } = props;

  return (
    <textarea
      data-attachment-count={String(ownerState?.attachmentCount)}
      data-has-value={String(ownerState?.hasValue)}
      data-testid="custom-chat-conversation-input-input"
      ref={ref}
      {...other}
    />
  );
});

const CustomSendButton = React.forwardRef(function CustomSendButton(
  props: React.ComponentPropsWithoutRef<'button'> & {
    ownerState?: {
      isStreaming: boolean;
    };
  },
  ref: React.Ref<HTMLButtonElement>,
) {
  const { children, ownerState, ...other } = props;

  return (
    <button
      data-streaming={String(ownerState?.isStreaming)}
      data-testid="custom-chat-conversation-input-send"
      ref={ref}
      {...other}
    >
      {children}
    </button>
  );
});

const CustomAttachButton = React.forwardRef(function CustomAttachButton(
  props: React.ComponentPropsWithoutRef<'button'> & {
    ownerState?: {
      attachmentCount: number;
    };
  },
  ref: React.Ref<HTMLButtonElement>,
) {
  const { children, ownerState, ...other } = props;

  return (
    <button
      data-attachment-count={String(ownerState?.attachmentCount)}
      data-testid="custom-chat-conversation-input-attach"
      ref={ref}
      {...other}
    >
      {children}
    </button>
  );
});

const CustomToolbar = React.forwardRef(function CustomToolbar(
  props: React.ComponentPropsWithoutRef<'div'> & {
    ownerState?: {
      isStreaming: boolean;
    };
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState, ...other } = props;

  return (
    <div
      data-streaming={String(ownerState?.isStreaming)}
      data-testid="custom-chat-conversation-input-toolbar"
      ref={ref}
      {...other}
    >
      {children}
    </div>
  );
});

const CustomHelperText = React.forwardRef(function CustomHelperText(
  props: React.ComponentPropsWithoutRef<'div'> & {
    ownerState?: {
      hasValue: boolean;
    };
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState, ...other } = props;

  return (
    <div
      data-has-value={String(ownerState?.hasValue)}
      data-testid="custom-chat-conversation-input-helper"
      ref={ref}
      {...other}
    >
      {children}
    </div>
  );
});

describe('ChatConversationInput', () => {
  it('renders the default styled conversation input surface and submits through the existing composer flow', async () => {
    const adapter = createAdapter({
      sendMessage: vi.fn(async () => createStream()),
    });

    renderChatConversationInput(
      <ChatConversationInput
        helperText="Helpful hint"
        toolbar={<button type="button">Tone</button>}
      />,
      {
        adapter,
      },
    );

    const input = screen.getByRole('textbox', { name: 'Message' }) as HTMLTextAreaElement;
    const sendButton = screen.getByRole('button', { name: 'Send message' });
    const attachButton = screen.getByRole('button', { name: 'Add attachment' });

    expect(sendButton).to.have.property('disabled', true);
    expect(input.className).to.contain(chatConversationInputClasses.input);
    expect(sendButton.className).to.contain(chatConversationInputClasses.sendButton);
    expect(attachButton.className).to.contain(chatConversationInputClasses.attachButton);
    expect(screen.getByText('Helpful hint')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Tone' })).toBeVisible();

    fireEvent.change(input, { target: { value: 'Hello there' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(adapter.sendMessage).toHaveBeenCalledTimes(1);
      expect(input.value).to.equal('');
    });
  });

  it('supports the flat styled subcomponents for manual composition', () => {
    renderChatConversationInput(
      <ChatConversationInput>
        <ChatConversationInputTextArea data-testid="manual-input" />
        <ChatConversationInputToolbar>
          <ChatConversationInputAttachButton />
          <ChatConversationInputSendButton />
        </ChatConversationInputToolbar>
      </ChatConversationInput>,
      {
        rtl: true,
        dark: true,
      },
    );

    expect(screen.getByTestId('manual-input')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Add attachment' })).not.to.equal(null);
    expect(screen.getByRole('button', { name: 'Send message' })).not.to.equal(null);
  });

  it('supports replacing all public slots', async () => {
    const adapter = createAdapter({
      sendMessage: vi.fn(async () => createPendingStream()),
    });

    renderChatConversationInput(
      <ChatConversationInput
        helperText="helper"
        slots={{
          attachButton: CustomAttachButton,
          helperText: CustomHelperText,
          input: CustomInput,
          root: CustomRoot,
          sendButton: CustomSendButton,
          toolbar: CustomToolbar,
        }}
        toolbar="toolbar"
      />,
      {
        adapter,
        defaultComposerValue: 'Draft',
      },
    );

    expect(screen.getByTestId('custom-chat-conversation-input-root')).to.have.attribute(
      'data-has-value',
      'true',
    );
    expect(screen.getByTestId('custom-chat-conversation-input-input')).to.have.attribute(
      'data-has-value',
      'true',
    );
    expect(screen.getByTestId('custom-chat-conversation-input-helper')).to.have.attribute(
      'data-has-value',
      'true',
    );

    fireEvent.change(screen.getByTestId('custom-chat-conversation-input-input'), {
      target: {
        value: 'Still here',
      },
    });
    fireEvent.click(screen.getByTestId('custom-chat-conversation-input-send'));

    await waitFor(() => {
      expect(screen.getByTestId('custom-chat-conversation-input-send')).to.have.attribute(
        'data-streaming',
        'true',
      );
      expect(screen.getByTestId('custom-chat-conversation-input-toolbar')).to.have.attribute(
        'data-streaming',
        'true',
      );
    });
  });

  it('opens the hidden file input and clears it after attachments are selected', async () => {
    const inputClickSpy = vi.spyOn(HTMLInputElement.prototype, 'click');

    try {
      renderChatConversationInput(
        <ChatConversationInput
          slotProps={{ attachInput: { 'data-testid': 'attach-input' } as any }}
        />,
      );

      const attachButton = screen.getByRole('button', { name: 'Add attachment' });
      const input = screen.getByTestId('attach-input') as HTMLInputElement;

      fireEvent.click(attachButton);

      expect(inputClickSpy).toHaveBeenCalledTimes(1);

      Object.defineProperty(input, 'value', {
        configurable: true,
        value: 'C:\\fakepath\\a.txt',
        writable: true,
      });

      fireEvent.change(input, {
        target: {
          files: [new File(['a'], 'a.txt', { type: 'text/plain' })],
        },
      });

      await waitFor(() => {
        expect(input.value).to.equal('');
      });
    } finally {
      inputClickSpy.mockRestore();
    }
  });

  it('falls back to the chat error message when helperText is omitted', async () => {
    renderChatConversationInput(
      <React.Fragment>
        <ErrorSetter />
        <ChatConversationInput />
      </React.Fragment>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'set error' }));

    await waitFor(() => {
      expect(screen.getByText('Network down')).toBeVisible();
    });
  });
});
