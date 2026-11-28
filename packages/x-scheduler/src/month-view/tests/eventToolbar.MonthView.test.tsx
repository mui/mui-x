import { act, screen, fireEvent, waitFor } from '@mui/internal-test-utils';
import { createMatchMedia, createSchedulerRenderer, EventBuilder } from 'test/utils/scheduler';
import { StandaloneMonthView } from '@mui/x-scheduler/month-view';
import { vi, describe, it, expect, afterEach } from 'vitest';

/**
 * On a coarse pointer, tapping an event arms it (toolbar) rather than opening the dialog; an outside
 * tap disarms it in every view, month included. Arming is forced here via `matchMedia`.
 */
describe('MonthView - event toolbar', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-05-01') });

  const originalMatchMedia = window.matchMedia;
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  function renderEvent(onEventsChange = vi.fn()) {
    const event = EventBuilder.new()
      .id('event-1')
      .title('Morning Meeting')
      .startAt('2025-05-01T09:00:00Z')
      .build();

    const { user } = render(
      <StandaloneMonthView events={[event]} resources={[]} onEventsChange={onEventsChange} />,
    );

    return { onEventsChange, user };
  }

  function getEvent(): HTMLElement {
    return screen.getAllByRole('button', { name: /Morning Meeting/i })[0];
  }

  it('should arm with a toolbar on a coarse pointer', () => {
    window.matchMedia = createMatchMedia(true);
    renderEvent();

    fireEvent.click(getEvent());

    expect(screen.getByRole('button', { name: 'Edit event' })).not.to.equal(null);
    expect(screen.queryByRole('textbox', { name: /Event title/i })).to.equal(null);
  });

  it('should disarm the toolbar when tapping outside of it', () => {
    window.matchMedia = createMatchMedia(true);
    renderEvent();

    fireEvent.click(getEvent());
    expect(screen.getByRole('button', { name: 'Edit event' })).not.to.equal(null);

    // A tap anywhere outside the toolbar closes it, even though the month grid has no outside-tap
    // handling of its own — the toolbar itself listens document-wide while armed.
    fireEvent.click(document.body);

    expect(screen.queryByRole('button', { name: 'Edit event' })).to.equal(null);
  });

  it('should move focus between the armed event and its toolbar with Tab', async () => {
    window.matchMedia = createMatchMedia(true);
    const { user } = renderEvent();
    const event = getEvent();

    act(() => {
      event.focus();
    });
    await user.keyboard('{Enter}');
    const editButton = screen.getByRole('button', { name: 'Edit event' });

    await user.keyboard('{Tab}');
    expect(document.activeElement).to.equal(editButton);

    await user.keyboard('{Tab}');
    expect(document.activeElement).to.equal(event);

    await user.keyboard('{Tab}');
    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(document.activeElement).to.equal(event);

    await user.keyboard('{Tab}');
    await user.keyboard('{Enter}');
    expect(screen.getByRole('textbox', { name: /Event title/i })).not.to.equal(null);
  });

  it('should move between the toolbar buttons with the arrow keys, Home and End', async () => {
    window.matchMedia = createMatchMedia(true);
    const { user } = renderEvent();
    const event = getEvent();

    act(() => {
      event.focus();
    });
    await user.keyboard('{Enter}');
    const editButton = screen.getByRole('button', { name: 'Edit event' });
    const deleteButton = screen.getByRole('button', { name: 'Delete event' });

    await user.keyboard('{Tab}');
    expect(editButton).to.have.attribute('tabindex', '0');
    expect(deleteButton).to.have.attribute('tabindex', '-1');

    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).to.equal(deleteButton);

    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).to.equal(editButton);

    await user.keyboard('{ArrowLeft}');
    expect(document.activeElement).to.equal(deleteButton);

    await user.keyboard('{Home}');
    expect(document.activeElement).to.equal(editButton);

    await user.keyboard('{End}');
    expect(document.activeElement).to.equal(deleteButton);

    // Tab comes back to the last focused button.
    await user.keyboard('{Tab}');
    expect(document.activeElement).to.equal(event);
    await user.keyboard('{Tab}');
    expect(document.activeElement).to.equal(deleteButton);
  });

  it('should move focus back to the event once the dialog opened from the toolbar Edit closes', async () => {
    window.matchMedia = createMatchMedia(true);
    const { user } = renderEvent();
    const event = getEvent();

    act(() => {
      event.focus();
    });
    await user.keyboard('{Enter}');
    await user.keyboard('{Tab}');
    await user.keyboard('{Enter}');
    expect(screen.getByRole('textbox', { name: /Event title/i })).not.to.equal(null);

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(document.activeElement).to.equal(event);
    });
  });

  it('should move focus back to the event when Escape disarms from the toolbar', async () => {
    window.matchMedia = createMatchMedia(true);
    const { user } = renderEvent();
    const event = getEvent();

    act(() => {
      event.focus();
    });
    await user.keyboard('{Enter}');
    await user.keyboard('{Tab}');
    expect(document.activeElement).to.equal(screen.getByRole('button', { name: 'Edit event' }));

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('button', { name: 'Edit event' })).to.equal(null);
    expect(document.activeElement).to.equal(event);
  });

  it('should disarm on Escape before moving focus back to the cell', () => {
    window.matchMedia = createMatchMedia(true);
    renderEvent();
    const event = getEvent();

    act(() => {
      event.focus();
    });
    fireEvent.click(event);
    expect(screen.getByRole('button', { name: 'Edit event' })).not.to.equal(null);

    fireEvent.keyDown(event, { key: 'Escape' });
    expect(screen.queryByRole('button', { name: 'Edit event' })).to.equal(null);
    expect(document.activeElement).to.equal(event);

    fireEvent.keyDown(event, { key: 'Escape' });
    expect(document.activeElement).to.equal(event.closest('[role="gridcell"]'));
  });
});
