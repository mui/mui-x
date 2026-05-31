import * as React from 'react';
import { createRenderer, screen, fireEvent } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import { ChatRoot, type ChatAdapter, type ChatMessage } from '@mui/x-chat-headless';
import { CopilotSuggestions } from './CopilotSuggestions';

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

function renderSuggestions(
  ui: React.ReactElement,
  render: ReturnType<typeof createRenderer>['render'],
  initialMessages?: ChatMessage[],
) {
  return render(
    <ChatRoot adapter={createAdapter()} initialMessages={initialMessages}>
      {ui}
    </ChatRoot>,
  );
}

describe('<CopilotSuggestions />', () => {
  const { render } = createRenderer();

  it('renders explicit suggestion chips', () => {
    renderSuggestions(
      <CopilotSuggestions
        suggestions={['Filter to admins', { value: 'group:region', label: 'Group by region' }]}
        onSelect={() => {}}
      />,
      render,
    );

    expect(screen.getByText('Filter to admins')).not.to.equal(null);
    expect(screen.getByText('Group by region')).not.to.equal(null);
    expect(document.querySelectorAll('.MuiChatSuggestions-item').length).to.equal(2);
  });

  it('fires onSelect with the suggestion value when a chip is clicked', () => {
    const onSelect = vi.fn();
    renderSuggestions(
      <CopilotSuggestions
        suggestions={[{ value: 'group:region', label: 'Group by region' }]}
        onSelect={onSelect}
      />,
      render,
    );

    fireEvent.click(screen.getByText('Group by region'));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('group:region');
  });

  it('limits the number of chips with max', () => {
    renderSuggestions(
      <CopilotSuggestions suggestions={['a', 'b', 'c', 'd']} max={2} onSelect={() => {}} />,
      render,
    );

    expect(document.querySelectorAll('.MuiChatSuggestions-item').length).to.equal(2);
  });

  it('renders chips from the last assistant message metadata.suggestions', () => {
    const onSelect = vi.fn();
    const messages: ChatMessage[] = [
      { id: 'u1', role: 'user', parts: [{ type: 'text', text: 'hi' }] },
      {
        id: 'a1',
        role: 'assistant',
        parts: [{ type: 'text', text: 'done' }],
        metadata: { suggestions: ['Refine the filter', 'Add a column'] },
      },
    ];
    renderSuggestions(
      <CopilotSuggestions readFromLastMessage onSelect={onSelect} />,
      render,
      messages,
    );

    expect(screen.getByText('Refine the filter')).not.to.equal(null);
    expect(screen.getByText('Add a column')).not.to.equal(null);

    fireEvent.click(screen.getByText('Add a column'));
    expect(onSelect).toHaveBeenCalledWith('Add a column');
  });

  it('renders nothing when reading from the last message and there are no suggestions', () => {
    const messages: ChatMessage[] = [
      {
        id: 'a1',
        role: 'assistant',
        parts: [{ type: 'text', text: 'done' }],
      },
    ];
    renderSuggestions(
      <CopilotSuggestions readFromLastMessage onSelect={() => {}} />,
      render,
      messages,
    );

    expect(document.querySelector('.MuiChatSuggestions-item')).to.equal(null);
  });

  it('composes ChatSuggestions (composer-driven) when no onSelect is provided', () => {
    renderSuggestions(<CopilotSuggestions suggestions={['Summarize this table']} />, render);

    expect(screen.getByText('Summarize this table')).not.to.equal(null);
    expect(document.querySelectorAll('.MuiChatSuggestions-item').length).to.equal(1);
  });
});
