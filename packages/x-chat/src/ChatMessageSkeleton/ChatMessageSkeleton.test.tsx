import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ChatMessageSkeleton } from './ChatMessageSkeleton';

const { render } = createRenderer();

function renderSkeleton(ui: React.ReactElement) {
  return render(<ThemeProvider theme={createTheme()}>{ui}</ThemeProvider>);
}

describe('ChatMessageSkeleton', () => {
  it('renders the default assistant skeleton with an avatar and two lines', () => {
    renderSkeleton(<ChatMessageSkeleton data-testid="message-skeleton" />);

    const root = screen.getByTestId('message-skeleton');
    const avatar = root.querySelector('.MuiAvatar-root');
    const skeletons = root.querySelectorAll('.MuiSkeleton-root');

    expect(root).toBeVisible();
    expect(avatar).not.to.equal(null);
    expect(skeletons).to.have.length(3);
    expect(window.getComputedStyle(root).flexDirection).to.equal('row');
  });

  it('reverses the layout for user messages and hides the avatar for system messages', () => {
    renderSkeleton(
      <React.Fragment>
        <ChatMessageSkeleton align="user" data-testid="user-message-skeleton" />
        <ChatMessageSkeleton align="system" data-testid="system-message-skeleton" />
      </React.Fragment>,
    );

    const userRoot = screen.getByTestId('user-message-skeleton');
    const systemRoot = screen.getByTestId('system-message-skeleton');

    expect(window.getComputedStyle(userRoot).flexDirection).to.equal('row-reverse');
    expect(systemRoot.querySelector('.MuiAvatar-root')).to.equal(null);
  });

  it('caps the rendered line count to the supported skeleton widths', () => {
    renderSkeleton(<ChatMessageSkeleton data-testid="long-message-skeleton" lines={8} />);

    const skeletons = screen
      .getByTestId('long-message-skeleton')
      .querySelectorAll('.MuiSkeleton-root');

    expect(skeletons).to.have.length(4);
  });
});
