import * as React from 'react';
import { screen, fireEvent, waitFor } from '@mui/internal-test-utils';
import { createMatchMedia, createSchedulerRenderer, EventBuilder } from 'test/utils/scheduler';
import { StandaloneDayView } from '@mui/x-scheduler/day-view';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

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

  function renderEvent(onEventsChange = vi.fn()) {
    const event = EventBuilder.new()
      .id('event-1')
      .title('Morning Meeting')
      .singleDay('2025-07-03T10:00:00Z', 60)
      .build();

    render(<StandaloneDayView events={[event]} resources={[]} onEventsChange={onEventsChange} />);

    return { onEventsChange };
  }

  function getEvent(name: RegExp | string = /Morning Meeting/i): HTMLElement {
    return screen.getByRole('button', { name });
  }

  // `events` is a fully-controlled prop (the store warns if nothing feeds `onEventsChange` back
  // into it) — `renderEvent`'s fixed array intentionally never does, since most tests here only
  // assert on the `onEventsChange` call args. Deleting through it never actually removes the
  // event from the DOM, so it can't exercise what happens once an occurrence really unmounts.
  function renderStatefulEvent() {
    const initialEvent = EventBuilder.new()
      .id('event-1')
      .title('Morning Meeting')
      .singleDay('2025-07-03T10:00:00Z', 60)
      .build();

    function StatefulDayView() {
      const [events, setEvents] = React.useState<SchedulerEvent[]>([initialEvent]);
      return <StandaloneDayView events={events} resources={[]} onEventsChange={setEvents} />;
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

  it('should delete a non-recurring event immediately, with no confirmation, when Delete is clicked', () => {
    const { onEventsChange } = renderEvent();

    fireEvent.contextMenu(getEvent());
    fireEvent.click(screen.getByRole('menuitem', { name: /delete/i }));

    expect(onEventsChange.mock.calls.length).to.equal(1);
    expect(onEventsChange.mock.calls[0][0]).to.have.length(0);
    expect(screen.queryByRole('menu')).to.equal(null);
    expect(screen.queryByRole('textbox', { name: /Event title/i })).to.equal(null);
  });

  it('should not lose focus to <body> after Delete: it falls back to the owning grid column', async () => {
    renderStatefulEvent();

    fireEvent.contextMenu(getEvent());
    fireEvent.click(screen.getByRole('menuitem', { name: /delete/i }));

    // Confirms the event actually unmounts here (unlike the other tests' fixed `events` array),
    // so the assertion below exercises the real focus-loss scenario, not a no-op.
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Morning Meeting/i })).to.equal(null);
    });

    expect(document.activeElement).not.to.equal(document.body);
    expect(document.activeElement).to.have.attribute('tabindex', '0');
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
