import * as React from 'react';
import { screen, fireEvent, waitFor, within } from '@mui/internal-test-utils';
import { createMatchMedia, createSchedulerRenderer, EventBuilder } from 'test/utils/scheduler';
import { StandaloneDayView } from '@mui/x-scheduler/day-view';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import { vi, describe, it, expect, afterEach } from 'vitest';

/**
 * A coarse pointer arms the event (toolbar); a fine pointer opens the dialog directly. The pointer
 * type is forced here via `matchMedia`.
 */
describe('DayView - event toolbar', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03Z') });

  const originalMatchMedia = window.matchMedia;
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

  // `renderEvent`'s fixed array never actually removes the event from the DOM on delete (the
  // store warns if nothing feeds `onEventsChange` back into it), which can't exercise what
  // happens once an occurrence really unmounts. This one is fully controlled instead.
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

  function renderEventOnEachDay() {
    const events = [
      EventBuilder.new()
        .id('event-1')
        .title('Morning Meeting')
        .singleDay('2025-07-03T10:00:00Z', 60)
        .build(),
      EventBuilder.new()
        .id('event-2')
        .title('Next Day Sync')
        .singleDay('2025-07-04T10:00:00Z', 60)
        .build(),
    ];

    const { setProps } = render(
      <StandaloneDayView
        events={events}
        resources={[]}
        onEventsChange={vi.fn()}
        visibleDate={new Date('2025-07-03T00:00:00Z')}
      />,
    );

    return { setProps };
  }

  function renderTwoEvents() {
    const events = [
      EventBuilder.new()
        .id('event-1')
        .title('Morning Meeting')
        .singleDay('2025-07-03T10:00:00Z', 60)
        .build(),
      EventBuilder.new()
        .id('event-2')
        .title('Afternoon Sync')
        .singleDay('2025-07-03T14:00:00Z', 60)
        .build(),
    ];

    render(<StandaloneDayView events={events} resources={[]} onEventsChange={vi.fn()} />);
  }

  function getEvent(name: RegExp | string = /Morning Meeting/i): HTMLElement {
    return screen.getByRole('button', { name });
  }

  it('should arm with a toolbar on a coarse pointer; Edit opens the dialog', () => {
    window.matchMedia = createMatchMedia(true);
    renderEvent();

    fireEvent.click(getEvent());

    const editButton = screen.getByRole('button', { name: 'Edit event' });
    expect(editButton).not.to.equal(null);
    expect(screen.queryByRole('textbox', { name: /Event title/i })).to.equal(null);

    fireEvent.click(editButton);

    expect(screen.getByRole('textbox', { name: /Event title/i })).not.to.equal(null);
  });

  it('should open the editing dialog directly on a fine pointer (no toolbar)', () => {
    window.matchMedia = createMatchMedia(false);
    renderEvent();

    fireEvent.click(getEvent());

    expect(screen.queryByRole('button', { name: 'Edit event' })).to.equal(null);
    expect(screen.getByRole('textbox', { name: /Event title/i })).not.to.equal(null);
  });

  it('should open the delete confirmation dialog instead of deleting immediately when the toolbar Delete is tapped', () => {
    window.matchMedia = createMatchMedia(true);
    const { onEventsChange } = renderEvent();

    fireEvent.click(getEvent());
    fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));

    expect(screen.getByRole('dialog', { name: /delete this event/i })).not.to.equal(null);
    expect(onEventsChange.mock.calls.length).to.equal(0);
    // The toolbar stays armed/mounted behind the confirmation dialog (which leaves it
    // `aria-hidden`, so it's queried by DOM presence rather than through a role query).
    expect(document.querySelector('[role="toolbar"]')).not.to.equal(null);
  });

  it('should delete the event and close the toolbar once Delete event is confirmed', async () => {
    window.matchMedia = createMatchMedia(true);
    const { onEventsChange } = renderEvent();

    fireEvent.click(getEvent());
    fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));
    // The toolbar's own delete button shares the same accessible name, so the confirm click is
    // scoped to the dialog.
    const dialog = screen.getByRole('dialog', { name: /delete this event/i });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete event' }));

    expect(onEventsChange.mock.calls.length).to.equal(1);
    expect(onEventsChange.mock.calls[0][0]).to.have.length(0);
    // The delete and edit flows are independent: deleting must not open the editing dialog.
    expect(screen.queryByRole('textbox', { name: /Event title/i })).to.equal(null);
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Edit event' })).to.equal(null);
    });
  });

  it('should keep the event and the toolbar armed when Cancel is clicked in the confirmation dialog', async () => {
    window.matchMedia = createMatchMedia(true);
    const { onEventsChange } = renderEvent();

    fireEvent.click(getEvent());
    fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onEventsChange.mock.calls.length).to.equal(0);
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /delete this event/i })).to.equal(null);
    });
    expect(screen.getByRole('button', { name: 'Edit event' })).not.to.equal(null);
  });

  it('should not lose focus to <body> after a confirmed Delete: it falls back to the owning grid column', async () => {
    window.matchMedia = createMatchMedia(true);
    renderStatefulEvent();

    fireEvent.click(getEvent());
    fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));
    const dialog = screen.getByRole('dialog', { name: /delete this event/i });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete event' }));

    // Confirms the event actually unmounts here (unlike `renderEvent`'s fixed array), so the
    // assertion below exercises the real focus-loss scenario, not a no-op.
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Morning Meeting/i })).to.equal(null);
    });

    // The fallback focus is deferred past the dialog's own focus trap releasing.
    await waitFor(() => {
      expect(document.activeElement).to.have.attribute('tabindex', '0');
    });
    expect(document.activeElement).not.to.equal(document.body);
  });

  it('should return focus to the toolbar Delete button after Cancel', async () => {
    window.matchMedia = createMatchMedia(true);
    renderEvent();

    fireEvent.click(getEvent());
    const deleteButton = screen.getByRole('button', { name: 'Delete event' });
    // `fireEvent.click` alone doesn't focus the target the way a real pointer/keyboard
    // interaction would; focusing it first reflects what MUI's dialog actually captures on open.
    deleteButton.focus();
    fireEvent.click(deleteButton);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    // Nothing was deleted, so MUI's own restore-on-close returns focus to the toolbar's Delete
    // button — the element that had it when the confirmation dialog opened.
    await waitFor(() => {
      expect(document.activeElement).to.equal(deleteButton);
    });
  });

  it('should delete the event immediately, with no confirmation, when `eventDeletion.confirmation` is `false`', () => {
    window.matchMedia = createMatchMedia(true);
    const onEventsChange = vi.fn();
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
        eventDeletion={{ confirmation: false }}
      />,
    );

    fireEvent.click(getEvent());
    fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));

    expect(onEventsChange.mock.calls.length).to.equal(1);
    expect(onEventsChange.mock.calls[0][0]).to.have.length(0);
    expect(screen.queryByRole('dialog', { name: /delete this event/i })).to.equal(null);
    expect(screen.queryByRole('textbox', { name: /Event title/i })).to.equal(null);
    expect(screen.queryByRole('button', { name: 'Edit event' })).to.equal(null);
  });

  // Navigating drops the toolbar's anchor, so it stops rendering — but the store stayed armed, which
  // left the grid's outside-pointer handler swallowing the first tap on the new day.
  it('should disarm when navigating to another day, so the next tap arms right away', () => {
    window.matchMedia = createMatchMedia(true);
    const { setProps } = renderEventOnEachDay();

    fireEvent.click(getEvent());
    expect(screen.getByRole('button', { name: 'Edit event' })).not.to.equal(null);

    setProps({ visibleDate: new Date('2025-07-04T00:00:00Z') });
    expect(screen.queryByRole('button', { name: 'Edit event' })).to.equal(null);

    fireEvent.click(getEvent(/Next Day Sync/i));

    expect(getEvent(/Next Day Sync/i)).to.have.attribute('data-armed');
    expect(screen.getByRole('button', { name: 'Edit event' })).not.to.equal(null);
  });

  // The two-tap contract: while an occurrence is armed, the next tap anywhere outside the toolbar only
  // disarms. It must not fall through and arm (or open) whatever it landed on.
  it('should disarm on a tap on another event without arming that event', () => {
    window.matchMedia = createMatchMedia(true);
    renderTwoEvents();

    fireEvent.click(getEvent());
    expect(getEvent()).to.have.attribute('data-armed');

    fireEvent.click(getEvent(/Afternoon Sync/i));

    expect(getEvent()).not.to.have.attribute('data-armed');
    expect(getEvent(/Afternoon Sync/i)).not.to.have.attribute('data-armed');
    expect(screen.queryByRole('button', { name: 'Edit event' })).to.equal(null);
    expect(screen.queryByRole('textbox', { name: /Event title/i })).to.equal(null);
  });
});
