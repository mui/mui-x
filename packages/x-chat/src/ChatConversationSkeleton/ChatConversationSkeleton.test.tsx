import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ChatConversationSkeleton } from './ChatConversationSkeleton';

const { render } = createRenderer();

function renderSkeleton(ui: React.ReactElement) {
  return render(<ThemeProvider theme={createTheme()}>{ui}</ThemeProvider>);
}

describe('ChatConversationSkeleton', () => {
  it('renders the default skeleton row shape', () => {
    renderSkeleton(<ChatConversationSkeleton data-testid="conversation-skeleton" />);

    const root = screen.getByTestId('conversation-skeleton');
    const avatar = root.querySelector('.MuiAvatar-root') as HTMLElement;
    const skeletons = root.querySelectorAll('.MuiSkeleton-root');

    expect(root).toBeVisible();
    expect(skeletons).to.have.length(5);
    expect(window.getComputedStyle(avatar).width).to.equal('40px');
    expect(window.getComputedStyle(avatar).height).to.equal('40px');
  });

  it('uses the compact avatar sizing in dense mode', () => {
    renderSkeleton(<ChatConversationSkeleton data-testid="conversation-skeleton-dense" dense />);

    const avatar = screen
      .getByTestId('conversation-skeleton-dense')
      .querySelector('.MuiAvatar-root') as HTMLElement;

    expect(window.getComputedStyle(avatar).width).to.equal('32px');
    expect(window.getComputedStyle(avatar).height).to.equal('32px');
  });
});
