import * as React from 'react';
import { createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { useChatComposer, useChatStore } from '@mui/x-chat-headless';
import { ChatRoot } from '../chat/ChatRoot';
import type { ComposerAttachButtonProps } from './ComposerAttachButton';
import { ComposerAttachButton } from './ComposerAttachButton';
import { ComposerHelperText } from './ComposerHelperText';
import type { ComposerHelperTextProps } from './ComposerHelperText';
import { ComposerLabel } from './ComposerLabel';
import { ComposerTextArea } from './ComposerTextArea';
import type { ComposerTextAreaProps } from './ComposerTextArea';
import type { ComposerRootProps } from './ComposerRoot';
import { ComposerRoot } from './ComposerRoot';
import type { ComposerSendButtonProps } from './ComposerSendButton';
import { ComposerSendButton } from './ComposerSendButton';
import type { ComposerToolbarProps } from './ComposerToolbar';
import { ComposerToolbar } from './ComposerToolbar';

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

function AttachmentCountIndicator() {
  const composer = useChatComposer();

  return <div data-testid="attachment-count">{composer.attachments.length}</div>;
}

function ErrorSetter() {
  const store = useChatStore();

  return (
    <button
      onClick={() => {
        store.setError({
          code: 'SEND_ERROR',
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
  props: ComposerRootProps & {
    ownerState?: {
      hasValue: boolean;
      attachmentCount: number;
    };
  },
  ref: React.Ref<HTMLFormElement>,
) {
  const { children, ownerState, slotProps, slots, ...other } = props;
  void slotProps;
  void slots;

  return (
    <form
      data-attachment-count={String(ownerState?.attachmentCount)}
      data-has-value={String(ownerState?.hasValue)}
      data-testid="custom-composer-root"
      ref={ref}
      {...other}
    >
      {children}
    </form>
  );
});

const CustomInput = React.forwardRef(function CustomInput(
  props: ComposerTextAreaProps & {
    ownerState?: {
      hasValue: boolean;
      attachmentCount: number;
    };
  },
  ref: React.Ref<HTMLTextAreaElement>,
) {
  const { ownerState, slotProps, slots, ...other } = props;
  void slotProps;
  void slots;

  return (
    <textarea
      data-attachment-count={String(ownerState?.attachmentCount)}
      data-has-value={String(ownerState?.hasValue)}
      data-testid="custom-composer-input"
      ref={ref}
      {...other}
    />
  );
});

const CustomSendButton = React.forwardRef(function CustomSendButton(
  props: ComposerSendButtonProps & {
    ownerState?: {
      isSubmitting: boolean;
      isStreaming: boolean;
    };
  },
  ref: React.Ref<HTMLButtonElement>,
) {
  const { children, ownerState, slotProps, slots, ...other } = props;
  void slotProps;
  void slots;

  return (
    <button
      data-streaming={String(ownerState?.isStreaming)}
      data-submitting={String(ownerState?.isSubmitting)}
      data-testid="custom-send-button"
      ref={ref}
      {...other}
    >
      {children}
    </button>
  );
});

const CustomAttachButton = React.forwardRef(function CustomAttachButton(
  props: ComposerAttachButtonProps & {
    ownerState?: {
      attachmentCount: number;
    };
  },
  ref: React.Ref<HTMLButtonElement>,
) {
  const { children, ownerState, slotProps, slots, ...other } = props;
  void slotProps;
  void slots;

  return (
    <button
      data-attachment-count={String(ownerState?.attachmentCount)}
      data-testid="custom-attach-button"
      ref={ref}
      {...other}
    >
      {children}
    </button>
  );
});

const CustomAttachInput = React.forwardRef(function CustomAttachInput(
  props: React.ComponentPropsWithoutRef<'input'> & {
    ownerState?: {
      attachmentCount: number;
    };
  },
  ref: React.Ref<HTMLInputElement>,
) {
  const { ownerState, ...other } = props;

  return (
    <input
      data-attachment-count={String(ownerState?.attachmentCount)}
      data-testid="custom-attach-input"
      ref={ref}
      {...other}
    />
  );
});

const CustomToolbar = React.forwardRef(function CustomToolbar(
  props: ComposerToolbarProps & {
    ownerState?: {
      isSubmitting: boolean;
    };
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState, slotProps, slots, ...other } = props;
  void slotProps;
  void slots;

  return (
    <div
      data-submitting={String(ownerState?.isSubmitting)}
      data-testid="custom-toolbar"
      ref={ref}
      {...other}
    >
      {children}
    </div>
  );
});

const CustomHelperText = React.forwardRef(function CustomHelperText(
  props: ComposerHelperTextProps & {
    ownerState?: {
      attachmentCount: number;
      hasValue: boolean;
    };
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState, slotProps, slots, ...other } = props;
  void slotProps;
  void slots;

  return (
    <div
      data-attachment-count={String(ownerState?.attachmentCount)}
      data-has-value={String(ownerState?.hasValue)}
      data-testid="custom-helper-text"
      ref={ref}
      {...other}
    >
      {children}
    </div>
  );
});

describe('ComposerRoot', () => {
  it('mirrors draft value and submits on Enter and form submit', async () => {
    const adapter = createAdapter({
      sendMessage: vi.fn(async () => createStream()),
    });

    render(
      <ChatRoot adapter={adapter} initialActiveConversationId="c1">
        <ComposerRoot data-testid="composer-root">
          <ComposerTextArea data-testid="composer-input" />
          <ComposerSendButton />
        </ComposerRoot>
      </ChatRoot>,
    );

    const input = screen.getByRole('textbox', { name: 'Message' });
    const form = screen.getByTestId('composer-root');
    const sendButton = screen.getByRole('button', { name: 'Send message' });

    expect(sendButton).to.have.property('disabled', true);

    fireEvent.change(input, { target: { value: 'Hello there' } });
    input.focus();

    expect(sendButton).to.have.property('disabled', false);

    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(adapter.sendMessage).toHaveBeenCalledTimes(1);
      expect((input as HTMLTextAreaElement).value).to.equal('');
    });

    fireEvent.change(input, { target: { value: 'Second message' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(adapter.sendMessage).toHaveBeenCalledTimes(2);
      expect((input as HTMLTextAreaElement).value).to.equal('');
    });
  });

  it('does not submit on Shift+Enter and respects IME composition boundaries', async () => {
    const adapter = createAdapter({
      sendMessage: vi.fn(async () => createStream()),
    });

    render(
      <ChatRoot adapter={adapter} initialActiveConversationId="c1">
        <ComposerRoot>
          <ComposerTextArea />
        </ComposerRoot>
      </ChatRoot>,
    );

    const input = screen.getByRole('textbox', { name: 'Message' });

    fireEvent.change(input, { target: { value: 'Hello there' } });
    input.focus();
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });

    expect(adapter.sendMessage).not.toHaveBeenCalled();

    fireEvent.compositionStart(input);
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(adapter.sendMessage).not.toHaveBeenCalled();

    fireEvent.compositionEnd(input);
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(adapter.sendMessage).toHaveBeenCalledTimes(1);
    });
  });

  it('auto-grows the textarea as the draft changes', () => {
    render(
      <ChatRoot adapter={createAdapter()}>
        <ComposerRoot>
          <ComposerTextArea />
        </ComposerRoot>
      </ChatRoot>,
    );

    const input = screen.getByRole('textbox', { name: 'Message' }) as HTMLTextAreaElement;

    Object.defineProperty(input, 'scrollHeight', {
      configurable: true,
      value: 88,
    });

    fireEvent.change(input, { target: { value: 'Line 1\nLine 2' } });

    expect(input.style.height).to.equal('88px');
  });

  it('opens the file picker and adds selected attachments', async () => {
    const inputClickSpy = vi.spyOn(HTMLInputElement.prototype, 'click');

    try {
      render(
        <ChatRoot adapter={createAdapter()}>
          <ComposerRoot>
            <ComposerAttachButton
              slotProps={{ attachInput: { 'data-testid': 'attach-input' } as any }}
            >
              Attach
            </ComposerAttachButton>
            <AttachmentCountIndicator />
          </ComposerRoot>
        </ChatRoot>,
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
          files: [
            new File(['a'], 'a.txt', { type: 'text/plain' }),
            new File(['b'], 'b.txt', { type: 'text/plain' }),
          ],
        },
      });

      await waitFor(() => {
        expect(screen.getByTestId('attachment-count')).to.have.text('2');
        expect(input.value).to.equal('');
      });
    } finally {
      inputClickSpy.mockRestore();
    }
  });

  it('disables the send button while streaming', async () => {
    const adapter = createAdapter({
      sendMessage: vi.fn(async () => createPendingStream()),
    });

    render(
      <ChatRoot adapter={adapter} initialActiveConversationId="c1">
        <ComposerRoot>
          <ComposerTextArea />
          <ComposerSendButton />
        </ComposerRoot>
      </ChatRoot>,
    );

    const input = screen.getByRole('textbox', { name: 'Message' });
    const sendButton = screen.getByRole('button', { name: 'Send message' });

    fireEvent.change(input, { target: { value: 'Hello there' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(sendButton).to.have.property('disabled', true);
    });
  });

  it('renders helper text children first and falls back to the chat error message', async () => {
    const view = render(
      <ChatRoot adapter={createAdapter()}>
        <ComposerRoot>
          <ComposerHelperText data-testid="helper-text">Hint text</ComposerHelperText>
        </ComposerRoot>
      </ChatRoot>,
    );

    expect(screen.getByTestId('helper-text')).to.have.text('Hint text');

    view.unmount();

    render(
      <ChatRoot adapter={createAdapter()}>
        <ErrorSetter />
        <ComposerRoot>
          <ComposerHelperText data-testid="error-helper-text" />
        </ComposerRoot>
      </ChatRoot>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'set error' }));

    await waitFor(() => {
      expect(screen.getByTestId('error-helper-text')).to.have.text('Network down');
    });
  });

  it('uses localeText for the default composer placeholder and accessible labels', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        localeText={{
          composerInputPlaceholder: 'Nachricht eingeben',
          composerInputAriaLabel: 'Nachricht',
          composerSendButtonLabel: 'Senden',
          composerAttachButtonLabel: 'Datei anhaengen',
        }}
      >
        <ComposerRoot>
          <ComposerTextArea />
          <ComposerSendButton />
          <ComposerAttachButton />
        </ComposerRoot>
      </ChatRoot>,
    );

    expect(screen.getByRole('textbox', { name: 'Nachricht' })).to.have.attribute(
      'placeholder',
      'Nachricht eingeben',
    );
    expect(screen.getByRole('button', { name: 'Senden' })).not.to.equal(null);
    expect(screen.getByRole('button', { name: 'Datei anhaengen' })).not.to.equal(null);
  });

  it('supports replacing all slots and passes ownerState to custom components', async () => {
    const adapter = createAdapter({
      sendMessage: vi.fn(async () => createPendingStream()),
    });

    render(
      <ChatRoot adapter={adapter} initialActiveConversationId="c1" initialComposerValue="Draft">
        <ComposerRoot slots={{ root: CustomRoot }}>
          <ComposerTextArea slots={{ input: CustomInput }} />
          <ComposerAttachButton
            slots={{ attachButton: CustomAttachButton, attachInput: CustomAttachInput }}
          >
            Attach
          </ComposerAttachButton>
          <ComposerSendButton slots={{ sendButton: CustomSendButton }}>Send</ComposerSendButton>
          <ComposerToolbar slots={{ toolbar: CustomToolbar }}>toolbar</ComposerToolbar>
          <ComposerHelperText slots={{ helperText: CustomHelperText }}>helper</ComposerHelperText>
        </ComposerRoot>
      </ChatRoot>,
    );

    expect(screen.getByTestId('custom-composer-root')).to.have.attribute('data-has-value', 'true');
    expect(screen.getByTestId('custom-composer-input')).to.have.attribute('data-has-value', 'true');
    expect(screen.getByTestId('custom-helper-text')).to.have.attribute('data-has-value', 'true');
    expect(screen.getByTestId('custom-attach-input')).to.have.attribute(
      'data-attachment-count',
      '0',
    );

    fireEvent.change(screen.getByTestId('custom-attach-input'), {
      target: {
        files: [new File(['a'], 'a.txt', { type: 'text/plain' })],
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId('custom-composer-root')).to.have.attribute(
        'data-attachment-count',
        '1',
      );
      expect(screen.getByTestId('custom-attach-button')).to.have.attribute(
        'data-attachment-count',
        '1',
      );
      expect(screen.getByTestId('custom-helper-text')).to.have.attribute(
        'data-attachment-count',
        '1',
      );
    });

    fireEvent.click(screen.getByTestId('custom-send-button'));

    await waitFor(() => {
      expect(screen.getByTestId('custom-send-button')).to.have.attribute('data-submitting', 'true');
      expect(screen.getByTestId('custom-send-button')).to.have.attribute('data-streaming', 'true');
      expect(screen.getByTestId('custom-toolbar')).to.have.attribute('data-submitting', 'true');
    });
  });
});

describe('ComposerLabel', () => {
  it('renders <label> with locale fallback text', () => {
    render(
      <ChatRoot adapter={createAdapter()}>
        <ComposerRoot>
          <ComposerLabel data-testid="composer-label" />
        </ComposerRoot>
      </ChatRoot>,
    );

    // Default locale: composerInputAriaLabel → 'Message'
    expect(screen.getByTestId('composer-label')).to.have.text('Message');
    expect(screen.getByTestId('composer-label').tagName).to.equal('LABEL');
  });

  it('renders custom children', () => {
    render(
      <ChatRoot adapter={createAdapter()}>
        <ComposerRoot>
          <ComposerLabel data-testid="composer-label">Ask anything</ComposerLabel>
        </ComposerRoot>
      </ChatRoot>,
    );

    expect(screen.getByTestId('composer-label')).to.have.text('Ask anything');
  });

  it('sets htmlFor', () => {
    render(
      <ChatRoot adapter={createAdapter()}>
        <ComposerRoot>
          <ComposerLabel data-testid="composer-label" htmlFor="my-textarea">
            Label
          </ComposerLabel>
        </ComposerRoot>
      </ChatRoot>,
    );

    expect(screen.getByTestId('composer-label')).to.have.attribute('for', 'my-textarea');
  });

  it('passes ownerState to custom slot', () => {
    function CustomLabel(
      props: React.LabelHTMLAttributes<HTMLLabelElement> & {
        ownerState?: { hasValue: boolean; disabled: boolean };
      },
    ) {
      const { ownerState, ...other } = props;

      return (
        <label
          data-disabled={String(ownerState?.disabled)}
          data-has-value={String(ownerState?.hasValue)}
          data-testid="custom-label"
          {...other}
        />
      );
    }

    render(
      <ChatRoot adapter={createAdapter()} initialComposerValue="Draft">
        <ComposerRoot>
          <ComposerLabel slots={{ label: CustomLabel }}>Label</ComposerLabel>
        </ComposerRoot>
      </ChatRoot>,
    );

    expect(screen.getByTestId('custom-label')).to.have.attribute('data-has-value', 'true');
    expect(screen.getByTestId('custom-label')).to.have.attribute('data-disabled', 'false');
  });
});

describe('ComposerRoot disabled', () => {
  it('does not submit when disabled via form submit', async () => {
    const adapter = createAdapter({
      sendMessage: vi.fn(async () => createStream()),
    });

    render(
      <ChatRoot adapter={adapter} initialActiveConversationId="c1" initialComposerValue="Should not send">
        <ComposerRoot data-testid="composer-form" disabled>
          <ComposerTextArea />
          <ComposerSendButton />
        </ComposerRoot>
      </ChatRoot>,
    );

    const form = screen.getByTestId('composer-form');

    fireEvent.submit(form);

    expect(adapter.sendMessage).not.toHaveBeenCalled();
  });

  it('sets data-disabled="true" on the root', () => {
    render(
      <ChatRoot adapter={createAdapter()}>
        <ComposerRoot data-testid="composer-root" disabled>
          <ComposerTextArea />
        </ComposerRoot>
      </ChatRoot>,
    );

    expect(screen.getByTestId('composer-root')).to.have.attribute('data-disabled', 'true');
  });
});

describe('ComposerAttachButton', () => {
  it('button disabled when composer disabled', () => {
    render(
      <ChatRoot adapter={createAdapter()}>
        <ComposerRoot disabled>
          <ComposerAttachButton>Attach</ComposerAttachButton>
        </ComposerRoot>
      </ChatRoot>,
    );

    expect(screen.getByRole('button', { name: 'Add attachment' })).to.have.property(
      'disabled',
      true,
    );
  });

  it('defaultPrevented stops file picker', () => {
    const inputClickSpy = vi.spyOn(HTMLInputElement.prototype, 'click');

    try {
      render(
        <ChatRoot adapter={createAdapter()}>
          <ComposerRoot>
            <ComposerAttachButton onClick={(event) => event.preventDefault()}>Attach</ComposerAttachButton>
          </ComposerRoot>
        </ChatRoot>,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Add attachment' }));

      expect(inputClickSpy).not.toHaveBeenCalled();
    } finally {
      inputClickSpy.mockRestore();
    }
  });
});

describe('ComposerTextArea', () => {
  it('textarea is disabled when composer is disabled', () => {
    render(
      <ChatRoot adapter={createAdapter()} initialActiveConversationId="c1">
        <ComposerRoot disabled>
          <ComposerTextArea />
        </ComposerRoot>
      </ChatRoot>,
    );

    const input = screen.getByRole('textbox', { name: 'Message' });

    expect(input).to.have.property('disabled', true);
  });

  it('uses locale text for placeholder and aria-label', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        localeText={{
          composerInputPlaceholder: 'Custom placeholder',
          composerInputAriaLabel: 'Custom label',
        }}
      >
        <ComposerRoot>
          <ComposerTextArea />
        </ComposerRoot>
      </ChatRoot>,
    );

    const input = screen.getByRole('textbox', { name: 'Custom label' });

    expect(input).to.have.attribute('placeholder', 'Custom placeholder');
  });
});
