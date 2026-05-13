import * as React from 'react';
import { createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import { Menu } from '@base-ui/react/menu';
import {
  MessageActionsMenu,
  MessageActionsMenuGroupLabel,
  MessageActionsMenuGroup,
  MessageActionsMenuItem,
  MessageActionsMenuPopup,
  MessageActionsMenuPositioner,
  MessageActionsMenuRoot,
  MessageActionsMenuTrigger,
} from './MessageActionsMenu';

const { render } = createRenderer();

describe('MessageActionsMenu', () => {
  it('exports all sub-components as namespace', () => {
    expect(MessageActionsMenu.Root).toBe(MessageActionsMenuRoot);
    expect(MessageActionsMenu.Trigger).toBe(MessageActionsMenuTrigger);
    expect(MessageActionsMenu.Positioner).toBe(MessageActionsMenuPositioner);
    expect(MessageActionsMenu.Popup).toBe(MessageActionsMenuPopup);
    expect(MessageActionsMenu.Item).toBe(MessageActionsMenuItem);
    expect(MessageActionsMenu.Group).toBe(MessageActionsMenuGroup);
    expect(MessageActionsMenu.GroupLabel).toBe(MessageActionsMenuGroupLabel);
  });

  it('renders trigger with aria-haspopup="menu"', () => {
    render(
      <MessageActionsMenu.Root>
        <MessageActionsMenu.Trigger data-testid="trigger">Actions</MessageActionsMenu.Trigger>
      </MessageActionsMenu.Root>,
    );

    const trigger = screen.getByTestId('trigger');

    expect(trigger).to.have.attribute('aria-haspopup', 'menu');
  });

  it('opens popup on trigger click with items having role="menuitem"', async () => {
    render(
      <MessageActionsMenu.Root>
        <MessageActionsMenu.Trigger>Actions</MessageActionsMenu.Trigger>
        <Menu.Portal>
          <MessageActionsMenu.Positioner>
            <MessageActionsMenu.Popup>
              <MessageActionsMenu.Item>Copy</MessageActionsMenu.Item>
              <MessageActionsMenu.Item>Delete</MessageActionsMenu.Item>
            </MessageActionsMenu.Popup>
          </MessageActionsMenu.Positioner>
        </Menu.Portal>
      </MessageActionsMenu.Root>,
    );

    fireEvent.click(screen.getByText('Actions'));

    await waitFor(() => {
      const items = screen.getAllByRole('menuitem');

      expect(items).to.have.length(2);
      expect(items[0]).to.have.text('Copy');
      expect(items[1]).to.have.text('Delete');
    });
  });

  it('supports group and group label sub-components', () => {
    render(
      <MessageActionsMenu.Root open>
        <MessageActionsMenu.Trigger>Actions</MessageActionsMenu.Trigger>
        <Menu.Portal>
          <MessageActionsMenu.Positioner>
            <MessageActionsMenu.Popup>
              <MessageActionsMenu.Group>
                <MessageActionsMenu.GroupLabel>Actions</MessageActionsMenu.GroupLabel>
                <MessageActionsMenu.Item>Copy</MessageActionsMenu.Item>
              </MessageActionsMenu.Group>
            </MessageActionsMenu.Popup>
          </MessageActionsMenu.Positioner>
        </Menu.Portal>
      </MessageActionsMenu.Root>,
    );

    expect(screen.getByRole('group')).not.to.equal(null);
    expect(screen.getByRole('menuitem')).to.have.text('Copy');
  });
});
