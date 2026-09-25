import * as React from 'react';
import { screen, fireEvent, waitFor } from '@mui/internal-test-utils';
import { createMatchMedia, createSchedulerRenderer, EventBuilder } from 'test/utils/scheduler';
import { StandaloneDayView } from '@mui/x-scheduler/day-view';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('EventContextMenu', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03Z') });

  const originalMatchMedia = window.matchMedia;
  beforeEach(() => {
    // Fine pointer: clicking (or activating) an event opens the dialog directly, no armed toolbar
    // to interfere with the context menu's own click/keyboard handling.
    window.matchMedia = createMatchMedia(false);
  });
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  function renderEvent(onEventsChange = vi.fn(), extraProps: Record<string, unknown> = {}) {
    const event = EventBuilder.new()
      .id('event-1')
      .title('Morning Meeting')
      .singleDay('2025-07-03T10:00:00Z', 60)
      .build();

    render(
      <StandaloneDayView
        events={[event]}
        resources={[]}
        onEventsChange={onEventsChange}
        {...extraProps}
      />,
    );

    return { onEventsChange };
  }

  function getEvent(name: RegExp | string = /Morning Meeting/i): HTMLElement {
    return screen.getByRole('button', { name });
  }

  // `events` is a fully-controlled prop (the store warns if nothing feeds `onEventsChange` back
  // into it) — `renderEvent`'s fixed array intentionally never does, since most tests here only
  // assert on the `onEventsChange` call args. Deleting through it never actually removes the
  // event from the DOM, so it can't exercise what happens once an occurrence really unmounts.
  function renderStatefulEvent(extraProps: Record<string, unknown> = {}) {
    const initialEvent = EventBuilder.new()
      .id('event-1')
      .title('Morning Meeting')
      .singleDay('2025-07-03T10:00:00Z', 60)
      .build();

    function StatefulDayView() {
      const [events, setEvents] = React.useState<SchedulerEvent[]>([initialEvent]);
      return (
        <StandaloneDayView
          events={events}
          resources={[]}
          onEventsChange={setEvents}
          {...extraProps}
        />
      );
    }

    render(<StatefulDayView />);
  }

  it('should open the menu with Edit and Delete on right-click', () => {
    renderEvent();

    fireEvent.contextMenu(getEvent());

    expect(screen.getByRole('menu')).not.to.equal(null);
    expect(screen.getByRole('menuitem', { name: /edit/i })).not.to.equal(null);
    expect(screen.getByRole('menuitem', { name: /delete/i })).not.to.equal(null);
  });

  it('should open the menu on Space without also opening Edit', () => {
    renderEvent();
    const event = getEvent();
    event.focus();

    fireEvent.keyDown(event, { key: ' ' });
    fireEvent.keyUp(event, { key: ' ' });

    expect(screen.getByRole('menu')).not.to.equal(null);
    // Regression guard: Space must not also fall through to Base UI's default click synthesis,
    // which would open the edit dialog underneath the menu.
    expect(screen.queryByRole('textbox', { name: /Event title/i })).to.equal(null);
  });

  it('should still open Edit directly on Enter (unaffected by the Space interception)', () => {
    renderEvent();
    const event = getEvent();
    event.focus();

    fireEvent.keyDown(event, { key: 'Enter' });

    expect(screen.getByRole('textbox', { name: /Event title/i })).not.to.equal(null);
    expect(screen.queryByRole('menu')).to.equal(null);
  });

  it('should close the menu on Escape', () => {
    renderEvent();

    fireEvent.contextMenu(getEvent());
    expect(screen.getByRole('menu')).not.to.equal(null);

    // MUI's Menu auto-focuses its first item ("Edit") on open; keydown can only target the
    // actually focused element.
    fireEvent.keyDown(screen.getByRole('menuitem', { name: /edit/i }), { key: 'Escape' });

    expect(screen.queryByRole('menu')).to.equal(null);
  });

  it('should open the same editing surface as a click when Edit is clicked', () => {
    renderEvent();

    fireEvent.contextMenu(getEvent());
    fireEvent.click(screen.getByRole('menuitem', { name: /edit/i }));

    expect(screen.getByRole('textbox', { name: /Event title/i })).not.to.equal(null);
  });

  it('should open the delete confirmation dialog instead of deleting immediately when Delete is clicked', () => {
    const { onEventsChange } = renderEvent();

    fireEvent.contextMenu(getEvent());
    fireEvent.click(screen.getByRole('menuitem', { name: /delete/i }));

    // The menu itself closes right away; the confirmation dialog takes over.
    expect(screen.queryByRole('menu')).to.equal(null);
    expect(screen.getByRole('dialog', { name: /delete this event/i })).not.to.equal(null);
    expect(onEventsChange.mock.calls.length).to.equal(0);
    // The dialog leaves the background `aria-hidden`, so the event is read from the DOM's text
    // content directly rather than through a role query (which skips `aria-hidden` subtrees).
    expect(document.body.textContent).to.contain('Morning Meeting');
  });

  it('should describe the delete confirmation dialog with its message', () => {
    renderEvent();

    fireEvent.contextMenu(getEvent());
    fireEvent.click(screen.getByRole('menuitem', { name: /delete/i }));

    const dialog = screen.getByRole('dialog', { name: /delete this event/i });
    expect(screen.getDescriptionOf(dialog).textContent).to.equal(
      'This action is irreversible. Are you sure you want to proceed?',
    );
  });

  it('should delete the event once Delete event is confirmed in the dialog', async () => {
    const { onEventsChange } = renderEvent();

    fireEvent.contextMenu(getEvent());
    fireEvent.click(screen.getByRole('menuitem', { name: /delete/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));

    expect(onEventsChange.mock.calls.length).to.equal(1);
    expect(onEventsChange.mock.calls[0][0]).to.have.length(0);
    // The dialog closes through an exit transition, so it lingers in the DOM for a tick.
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /delete this event/i })).to.equal(null);
    });
    expect(screen.queryByRole('textbox', { name: /Event title/i })).to.equal(null);
  });

  it('should not delete anything when Cancel is clicked in the confirmation dialog', async () => {
    const { onEventsChange } = renderEvent();

    fireEvent.contextMenu(getEvent());
    fireEvent.click(screen.getByRole('menuitem', { name: /delete/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onEventsChange.mock.calls.length).to.equal(0);
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /delete this event/i })).to.equal(null);
    });
    expect(getEvent()).not.to.equal(null);
  });

  it('should not delete anything when Escape is pressed in the confirmation dialog', async () => {
    const { onEventsChange } = renderEvent();

    fireEvent.contextMenu(getEvent());
    fireEvent.click(screen.getByRole('menuitem', { name: /delete/i }));
    // MUI focuses the dialog paper itself, not a specific action, once it opens.
    const dialog = screen.getByRole('dialog', { name: /delete this event/i });
    fireEvent.keyDown(dialog, { key: 'Escape' });

    expect(onEventsChange.mock.calls.length).to.equal(0);
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /delete this event/i })).to.equal(null);
    });
    expect(getEvent()).not.to.equal(null);
  });

  it('should delete a non-recurring event immediately, with no confirmation, when `eventDeletion.confirmation` is `false`', () => {
    const { onEventsChange } = renderEvent(vi.fn(), { eventDeletion: { confirmation: false } });

    fireEvent.contextMenu(getEvent());
    fireEvent.click(screen.getByRole('menuitem', { name: /delete/i }));

    expect(onEventsChange.mock.calls.length).to.equal(1);
    expect(onEventsChange.mock.calls[0][0]).to.have.length(0);
    expect(screen.queryByRole('menu')).to.equal(null);
    expect(screen.queryByRole('dialog', { name: /delete this event/i })).to.equal(null);
    expect(screen.queryByRole('textbox', { name: /Event title/i })).to.equal(null);
  });

  it('should open the delete confirmation dialog for a recurring event when there is no recurring-events plugin', () => {
    const onEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Morning Meeting')
      .singleDay('2025-07-03T10:00:00Z', 60)
      .recurrent('DAILY')
      .build();

    expect(() => {
      render(<StandaloneDayView events={[event]} resources={[]} onEventsChange={onEventsChange} />);
    }).toWarnDev([
      'MUI X Scheduler: Recurring events are a premium feature. The `rrule` property will be ignored.',
    ]);

    fireEvent.contextMenu(getEvent());
    fireEvent.click(screen.getByRole('menuitem', { name: /delete/i }));

    // No recurring-events plugin, so there's no scope to ask for: this goes through the same
    // confirmation dialog as any other non-recurring delete, not straight to `deleteEvent`.
    expect(screen.getByRole('dialog', { name: /delete this event/i })).not.to.equal(null);
    expect(onEventsChange.mock.calls.length).to.equal(0);
  });

  it('should move focus to the owning grid column after a confirmed Delete', async () => {
    renderStatefulEvent();
    const column = getEvent().closest<HTMLElement>('[role="gridcell"]')!;

    fireEvent.contextMenu(getEvent());
    fireEvent.click(screen.getByRole('menuitem', { name: /delete/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));

    // Confirms the event actually unmounts here (unlike the other tests' fixed `events` array),
    // so the assertion below exercises the real focus-loss scenario, not a no-op.
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Morning Meeting/i })).to.equal(null);
    });

    // The fallback focus is deferred past the dialog's own focus trap releasing.
    await waitFor(() => {
      expect(document.activeElement).to.equal(column);
    });
  });

  it('should move focus to the owning grid column after a delete with no confirmation', async () => {
    renderStatefulEvent({ eventDeletion: { confirmation: false } });
    const column = getEvent().closest<HTMLElement>('[role="gridcell"]')!;

    fireEvent.contextMenu(getEvent());
    fireEvent.click(screen.getByRole('menuitem', { name: /delete/i }));

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Morning Meeting/i })).to.equal(null);
    });
    await waitFor(() => {
      expect(document.activeElement).to.equal(column);
    });
  });

  it('should return focus to the event after Cancel', async () => {
    renderStatefulEvent();
    const eventElement = getEvent();
    // `fireEvent.contextMenu` alone doesn't focus the target the way a real keyboard/pointer
    // interaction would; focusing it first reflects what MUI's dialog actually captures on open.
    eventElement.focus();

    fireEvent.contextMenu(eventElement);
    fireEvent.click(screen.getByRole('menuitem', { name: /delete/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    // The dialog closes through an exit transition, so it lingers in the DOM for a tick — asserting
    // before it's gone would only catch focus still sitting on the (still-mounted) Cancel button.
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /delete this event/i })).to.equal(null);
    });
    // Nothing was deleted, so MUI's own restore-on-close returns focus to the event — the element
    // that had it when the confirmation dialog opened.
    expect(document.activeElement).to.equal(eventElement);
  });

  describe('read-only events', () => {
    function renderReadOnlyEvent(onEventsChange = vi.fn()) {
      const event = EventBuilder.new()
        .id('event-1')
        .title('Read-only event')
        .singleDay('2025-07-03T10:00:00Z', 60)
        .readOnly(true)
        .build();

      render(<StandaloneDayView events={[event]} resources={[]} onEventsChange={onEventsChange} />);

      return { onEventsChange };
    }

    it('should show "Show details" instead of Edit, and no Delete item', () => {
      renderReadOnlyEvent();

      fireEvent.contextMenu(getEvent(/Read-only event/i));

      expect(screen.getByRole('menu')).not.to.equal(null);
      expect(screen.getByRole('menuitem', { name: /show details/i })).not.to.equal(null);
      expect(screen.queryByRole('menuitem', { name: /^edit/i })).to.equal(null);
      expect(screen.queryByRole('menuitem', { name: /delete/i })).to.equal(null);
    });

    it('should open the read-only view, not the edit form, when "Show details" is clicked', () => {
      renderReadOnlyEvent();

      fireEvent.contextMenu(getEvent(/Read-only event/i));
      fireEvent.click(screen.getByRole('menuitem', { name: /show details/i }));

      expect(screen.getByRole('dialog')).not.to.equal(null);
      expect(screen.queryByRole('textbox', { name: /Event title/i })).to.equal(null);
    });

    it('should not offer Delete on Space either (regression guard: the menu still gates on read-only when opened via keyboard)', () => {
      renderReadOnlyEvent();
      const event = getEvent(/Read-only event/i);
      event.focus();

      fireEvent.keyDown(event, { key: ' ' });
      fireEvent.keyUp(event, { key: ' ' });

      // Asserted first: without it, a regression that stops Space from opening the menu at all
      // would leave Delete absent for the wrong reason and this test would pass vacuously.
      expect(screen.getByRole('menuitem', { name: /show details/i })).not.to.equal(null);
      expect(screen.queryByRole('menuitem', { name: /delete/i })).to.equal(null);
    });
  });

  describe('on a coarse pointer', () => {
    beforeEach(() => {
      // Activation arms the toolbar instead of opening the dialog directly on a coarse pointer;
      // that toolbar already exposes Edit and Delete, so the context menu should stay out of the way.
      window.matchMedia = createMatchMedia(true);
    });

    it('should not open the menu on right-click', () => {
      renderEvent();

      fireEvent.contextMenu(getEvent());

      expect(screen.queryByRole('menu')).to.equal(null);
    });

    it('should arm the toolbar on Space instead of opening the menu', () => {
      renderEvent();
      const event = getEvent();
      event.focus();

      fireEvent.keyDown(event, { key: ' ' });
      fireEvent.keyUp(event, { key: ' ' });

      expect(screen.queryByRole('menu')).to.equal(null);
      expect(screen.getByRole('button', { name: 'Edit event' })).not.to.equal(null);
    });
  });
});
