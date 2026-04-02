import * as React from 'react';
import { createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { ChatAdapter, ChatMessage } from '@mui/x-chat-headless';
import { ChatRoot } from '../chat/ChatRoot';
import { SuggestionItem } from './SuggestionItem';
import type { SuggestionItemProps } from './SuggestionItem';
import { SuggestionsRoot } from './SuggestionsRoot';

const { render } = createRenderer();

function createAdapter(overrides: Partial<ChatAdapter> = {}): ChatAdapter {
  return {
    async sendMessage() {
      return new ReadableStream({
        start(controller) {
          controller.close();
        },
      });
    },
    ...overrides,
  };
}

const existingMessage: ChatMessage = {
  id: 'm1',
  role: 'assistant',
  parts: [{ type: 'text', text: 'Hello' }],
};

describe('SuggestionsRoot', () => {
  it('renders role="group" when conversation is empty', () => {
    render(
      <ChatRoot adapter={createAdapter()}>
        <SuggestionsRoot data-testid="suggestions" suggestions={['Hello', 'How are you?']} />
      </ChatRoot>,
    );

    expect(screen.getByRole('group')).not.to.equal(null);
    expect(screen.getByTestId('suggestions')).to.have.attribute('role', 'group');
  });

  it('returns null when messages exist', () => {
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[existingMessage]}>
        <SuggestionsRoot data-testid="suggestions" suggestions={['Hello']} />
      </ChatRoot>,
    );

    expect(screen.queryByTestId('suggestions')).to.equal(null);
  });

  it('normalizes string suggestions to { value } objects', () => {
    render(
      <ChatRoot adapter={createAdapter()}>
        <SuggestionsRoot suggestions={['Hello', 'World']} />
      </ChatRoot>,
    );

    expect(screen.getByText('Hello')).not.to.equal(null);
    expect(screen.getByText('World')).not.to.equal(null);
  });

  it('renders items with correct value/label/index', () => {
    render(
      <ChatRoot adapter={createAdapter()}>
        <SuggestionsRoot
          suggestions={[
            { value: 'val1', label: 'Label One' },
            { value: 'val2', label: 'Label Two' },
          ]}
        />
      </ChatRoot>,
    );

    const buttons = screen.getAllByRole('button');

    expect(buttons).to.have.length(2);
    expect(buttons[0]).to.have.text('Label One');
    expect(buttons[1]).to.have.text('Label Two');
    expect(buttons[0]).to.have.attribute('data-index', '0');
    expect(buttons[1]).to.have.attribute('data-index', '1');
  });

  it('sets data-empty and data-count', () => {
    render(
      <ChatRoot adapter={createAdapter()}>
        <SuggestionsRoot data-testid="suggestions" suggestions={['A', 'B', 'C']} />
      </ChatRoot>,
    );

    const root = screen.getByTestId('suggestions');

    expect(root).to.have.attribute('data-empty', 'true');
    expect(root).to.have.attribute('data-count', '3');
  });

  it('uses suggestionsLabel for aria-label', () => {
    render(
      <ChatRoot adapter={createAdapter()} localeText={{ suggestionsLabel: 'Vorschläge' }}>
        <SuggestionsRoot data-testid="suggestions" suggestions={['A']} />
      </ChatRoot>,
    );

    expect(screen.getByTestId('suggestions')).to.have.attribute('aria-label', 'Vorschläge');
  });

  it('supports custom root slot', () => {
    function CustomRoot(props: React.HTMLAttributes<HTMLDivElement> & { ownerState?: any }) {
      const { ownerState, ...other } = props;

      return <section data-testid="custom-root" {...other} />;
    }

    render(
      <ChatRoot adapter={createAdapter()}>
        <SuggestionsRoot slots={{ root: CustomRoot }} suggestions={['A']} />
      </ChatRoot>,
    );

    expect(screen.getByTestId('custom-root')).not.to.equal(null);
  });

  it('supports custom item slot', () => {
    function CustomItem(props: SuggestionItemProps & { ownerState?: any }) {
      const { ownerState, slots, slotProps, value, label, index, ...other } = props;

      return (
        <button data-testid={`custom-item-${index}`} type="button" {...other}>
          {label ?? value}
        </button>
      );
    }

    render(
      <ChatRoot adapter={createAdapter()}>
        <SuggestionsRoot slots={{ item: CustomItem }} suggestions={['A', 'B']} />
      </ChatRoot>,
    );

    expect(screen.getByTestId('custom-item-0')).to.have.text('A');
    expect(screen.getByTestId('custom-item-1')).to.have.text('B');
  });

  it('renders children instead of suggestions array when children provided', () => {
    render(
      <ChatRoot adapter={createAdapter()}>
        <SuggestionsRoot suggestions={['Ignored']}>
          <span data-testid="custom-child">Custom Content</span>
        </SuggestionsRoot>
      </ChatRoot>,
    );

    expect(screen.getByTestId('custom-child')).not.to.equal(null);
    expect(screen.queryByText('Ignored')).to.equal(null);
  });
});

describe('SuggestionItem', () => {
  it('clicking sets composer value', async () => {
    const adapter = createAdapter({
      sendMessage: vi.fn(
        async () =>
          new ReadableStream({
            start(controller) {
              controller.close();
            },
          }),
      ),
    });

    render(
      <ChatRoot adapter={adapter} initialActiveConversationId="c1">
        <SuggestionsRoot suggestions={['Hello World']} />
      </ChatRoot>,
    );

    fireEvent.click(screen.getByText('Hello World'));

    // After clicking a suggestion, the adapter should NOT have been called
    // because autoSubmit defaults to false. The value should be set in the composer.
    expect(adapter.sendMessage).not.toHaveBeenCalled();
  });

  it('autoSubmit defers submit via Promise.resolve()', async () => {
    const adapter = createAdapter({
      sendMessage: vi.fn(
        async () =>
          new ReadableStream({
            start(controller) {
              controller.close();
            },
          }),
      ),
    });

    render(
      <ChatRoot adapter={adapter} initialActiveConversationId="c1">
        <SuggestionsRoot autoSubmit suggestions={['Send me']} />
      </ChatRoot>,
    );

    fireEvent.click(screen.getByText('Send me'));

    await waitFor(() => {
      expect(adapter.sendMessage).toHaveBeenCalledTimes(1);
    });
  });

  it('defaultPrevented in onClick blocks onSelect', () => {
    const adapter = createAdapter({
      sendMessage: vi.fn(
        async () =>
          new ReadableStream({
            start(controller) {
              controller.close();
            },
          }),
      ),
    });

    render(
      <ChatRoot adapter={adapter} initialActiveConversationId="c1">
        <SuggestionsRoot>
          <SuggestionItem onClick={(event) => event.preventDefault()} value="blocked">
            Blocked
          </SuggestionItem>
        </SuggestionsRoot>
      </ChatRoot>,
    );

    fireEvent.click(screen.getByText('Blocked'));

    // onSelect should NOT have been called because onClick prevented default
    expect(adapter.sendMessage).not.toHaveBeenCalled();
  });

  it('custom onClick is called before onSelect', () => {
    const calls: string[] = [];
    const handleClick = vi.fn(() => calls.push('custom'));

    render(
      <ChatRoot adapter={createAdapter()}>
        <SuggestionsRoot>
          <SuggestionItem onClick={handleClick} value="test">
            Click me
          </SuggestionItem>
        </SuggestionsRoot>
      </ChatRoot>,
    );

    fireEvent.click(screen.getByText('Click me'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('sets data-index', () => {
    render(
      <ChatRoot adapter={createAdapter()}>
        <SuggestionsRoot suggestions={['A', 'B']} />
      </ChatRoot>,
    );

    const buttons = screen.getAllByRole('button');

    expect(buttons[0]).to.have.attribute('data-index', '0');
    expect(buttons[1]).to.have.attribute('data-index', '1');
  });

  it('displays label when provided, else value', () => {
    render(
      <ChatRoot adapter={createAdapter()}>
        <SuggestionsRoot
          suggestions={[{ value: 'val1', label: 'Fancy Label' }, { value: 'plain-value' }]}
        />
      </ChatRoot>,
    );

    expect(screen.getByText('Fancy Label')).not.to.equal(null);
    expect(screen.getByText('plain-value')).not.to.equal(null);
  });
});
