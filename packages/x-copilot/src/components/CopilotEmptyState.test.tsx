import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import { ChatRoot, type ChatAdapter } from '@mui/x-chat-headless';
import { CopilotEmptyState } from './CopilotEmptyState';

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

function renderEmptyState(ui: React.ReactElement, render: ReturnType<typeof createRenderer>['render']) {
  return render(<ChatRoot adapter={createAdapter()}>{ui}</ChatRoot>);
}

describe('<CopilotEmptyState />', () => {
  const { render } = createRenderer();

  it('renders the default title and helper when none are provided', () => {
    renderEmptyState(<CopilotEmptyState />, render);

    expect(screen.getByText('How can I help?')).not.to.equal(null);
    expect(screen.getByText('Ask a question or pick a suggestion to get started.')).not.to.equal(
      null,
    );
  });

  it('renders title and helper from localeText', () => {
    renderEmptyState(
      <CopilotEmptyState
        localeText={{ emptyStateTitle: 'Ask the assistant', emptyStateHelper: 'Type below' }}
      />,
      render,
    );

    expect(screen.getByText('Ask the assistant')).not.to.equal(null);
    expect(screen.getByText('Type below')).not.to.equal(null);
  });

  it('prefers explicit title / helper props over localeText', () => {
    renderEmptyState(
      <CopilotEmptyState
        title="Explicit title"
        helper="Explicit helper"
        localeText={{ emptyStateTitle: 'ignored', emptyStateHelper: 'ignored' }}
      />,
      render,
    );

    expect(screen.getByText('Explicit title')).not.to.equal(null);
    expect(screen.getByText('Explicit helper')).not.to.equal(null);
    expect(screen.queryByText('ignored')).to.equal(null);
  });

  it('renders suggestion chips from props', () => {
    renderEmptyState(
      <CopilotEmptyState
        suggestions={['Filter to last week', { value: 'group:region', label: 'Group by region' }]}
      />,
      render,
    );

    expect(screen.getByText('Filter to last week')).not.to.equal(null);
    expect(screen.getByText('Group by region')).not.to.equal(null);
    expect(document.querySelectorAll('.MuiChatSuggestions-item').length).to.equal(2);
  });
});
