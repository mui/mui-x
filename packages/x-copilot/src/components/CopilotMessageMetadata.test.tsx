import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { ChatMessage } from '@mui/x-chat-headless';
import { CopilotMessageMetadata } from './CopilotMessageMetadata';

const FIXTURE: ChatMessage = {
  id: 'm1',
  role: 'assistant',
  parts: [{ type: 'text', text: 'Done.' }],
  status: 'sent',
  metadata: {
    modelId: 'claude-sonnet-4',
    costUsd: 0.0123,
    elapsedTime: '1.2s',
    suggestionsModelId: 'claude-haiku-4',
    suggestionsCostUsd: 0,
    suggestions: ['Filter to last week', { label: 'Group by region', value: 'group:region' }],
  },
};

describe('<CopilotMessageMetadata />', () => {
  const { render } = createRenderer();

  let originalUrl: string;
  beforeEach(() => {
    originalUrl = window.location.href;
  });
  afterEach(() => {
    window.history.pushState(null, '', originalUrl);
  });

  function setExposeFlag(value: boolean) {
    window.history.pushState(null, '', value ? '/?expose-metadata=1' : '/');
  }

  it('renders the model / cost / latency / suggestions rows when the flag is set', () => {
    setExposeFlag(true);
    render(<CopilotMessageMetadata message={FIXTURE} />);

    expect(screen.getByText('claude-sonnet-4')).not.to.equal(null);
    expect(screen.getByText('$0.0123')).not.to.equal(null);
    expect(screen.getByText('1.2s')).not.to.equal(null);
    expect(screen.getByText('claude-haiku-4')).not.to.equal(null);
    // Suggestions cost of 0 formats as $0.00.
    expect(screen.getByText('$0.00')).not.to.equal(null);
    expect(screen.getByText('Filter to last week')).not.to.equal(null);
    expect(screen.getByText('Group by region')).not.to.equal(null);
  });

  it('renders nothing when the expose-metadata flag is absent', () => {
    setExposeFlag(false);
    const { container } = render(<CopilotMessageMetadata message={FIXTURE} />);
    expect(container.firstChild).to.equal(null);
  });

  it('renders nothing for a non-assistant message', () => {
    setExposeFlag(true);
    const userMessage: ChatMessage = { ...FIXTURE, role: 'user' };
    const { container } = render(<CopilotMessageMetadata message={userMessage} />);
    expect(container.firstChild).to.equal(null);
  });

  it('renders nothing when there is no metadata to show', () => {
    setExposeFlag(true);
    const bare: ChatMessage = { id: 'm2', role: 'assistant', parts: [], status: 'sent' };
    const { container } = render(<CopilotMessageMetadata message={bare} />);
    expect(container.firstChild).to.equal(null);
  });
});
