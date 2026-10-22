import * as React from 'react';
import { screen, act, fireEvent } from '@mui/internal-test-utils';
import {
  createSchedulerRenderer,
  EventBuilder,
  mockElementBounds,
  clientYForTime,
  getResizeHandle,
  simulatePointerResize,
} from 'test/utils/scheduler';
import { StandaloneCompactDayView } from '@mui/x-scheduler/compact-day-view';
import { vi, describe, it, expect } from 'vitest';

/**
 * Touch resize uses pointer events, not native drag-and-drop, so it is driven here via
 * {@link simulatePointerResize} on the compact (touch) view.
 */
describe('CompactDayView - touch resize', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03Z') });

  function getTimeGridColumn(): HTMLElement {
    return document.querySelector<HTMLElement>(
      `.MuiEventCalendar-dayTimeGridGrid [data-drop-target-for-element]`,
    )!;
  }

  function renderResizableEvent({ onEventsChange = vi.fn(), controlled = false } = {}) {
    const event = EventBuilder.new()
      .id('event-1')
      .title('Morning Meeting')
      .singleDay('2025-07-03T10:00:00Z', 60)
      .resizable(true)
      .build();

    // Feeds the changes back into the `events` prop, like a real host does.
    function ControlledHost() {
      const [events, setEvents] = React.useState([event]);
      return (
        <StandaloneCompactDayView
          events={events}
          resources={[]}
          onEventsChange={(next: typeof events) => {
            onEventsChange(next);
            setEvents(next);
          }}
        />
      );
    }

    const { user } = render(
      controlled ? (
        <ControlledHost />
      ) : (
        <StandaloneCompactDayView events={[event]} resources={[]} onEventsChange={onEventsChange} />
      ),
    );

    // Geometry resolver maps pointer Y to a time via the column's bounds.
    mockElementBounds(getTimeGridColumn(), { top: 0, height: 1440, width: 200 });

    return { onEventsChange, user };
  }

  /** Taps the event to arm it, revealing its resize handles. */
  function armEvent(): HTMLElement {
    const eventElement = screen.getByRole('button', { name: /Morning Meeting/i });
    fireEvent.click(eventElement);
    return eventElement;
  }

  it('should arm the event only once it is tapped', () => {
    renderResizableEvent();
    const eventElement = screen.getByRole('button', { name: /Morning Meeting/i });
    // Handles are always in the DOM; coarse-pointer CSS reveals them when armed. In JSDOM, assert via `data-armed`.
    expect(eventElement).not.to.have.attribute('data-armed');
    fireEvent.click(eventElement);
    expect(eventElement).to.have.attribute('data-armed');
  });

  it('should resize the end of an armed event to a later time', async () => {
    const { onEventsChange } = renderResizableEvent();
    const eventElement = armEvent();

    const endHandle = getResizeHandle(eventElement, 'end');

    await act(async () => {
      simulatePointerResize({ handle: endHandle, to: { clientY: clientYForTime(0, 24, 16) } });
    });

    expect(onEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = onEventsChange.mock.calls[0][0];
    // Start stays at 10:00, end moves later than 11:00.
    expect(new Date(updatedEvents[0].start).getUTCHours()).to.equal(10);
    expect(new Date(updatedEvents[0].end).getUTCHours()).to.equal(16);
  });

  it('should resize to the hour under the pointer on a DST day', async () => {
    // America/New_York springs forward from 02:00 to 03:00 on March 8th, 2026: the column keeps
    // 24 hour rows for a day of 23 hours.
    const onEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Morning Meeting')
      .singleDay('2026-03-08T14:00:00Z', 60) // 10:00 EDT
      .resizable(true)
      .build();
    render(
      <StandaloneCompactDayView
        events={[event]}
        resources={[]}
        displayTimezone="America/New_York"
        visibleDate={new Date('2026-03-08T12:00:00Z')}
        onEventsChange={onEventsChange}
      />,
    );
    mockElementBounds(getTimeGridColumn(), { top: 0, height: 1440, width: 200 });
    const endHandle = getResizeHandle(armEvent(), 'end');

    await act(async () => {
      simulatePointerResize({ handle: endHandle, to: { clientY: clientYForTime(0, 24, 16) } });
    });

    expect(onEventsChange.mock.calls[0][0][0].end).to.equal('2026-03-08T20:00:00.000Z'); // 16:00 EDT
  });

  it('should resize to the end of a trimmed hour range at the bottom edge of the column', async () => {
    const onEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Morning Meeting')
      .singleDay('2025-07-03T10:00:00Z', 60)
      .resizable(true)
      .build();
    render(
      <StandaloneCompactDayView
        events={[event]}
        resources={[]}
        viewConfig={{ day: { startTime: 8, endTime: 20 } }}
        onEventsChange={onEventsChange}
      />,
    );
    mockElementBounds(getTimeGridColumn(), { top: 0, height: 720, width: 200 });
    const endHandle = getResizeHandle(armEvent(), 'end');

    await act(async () => {
      simulatePointerResize({ handle: endHandle, to: { clientY: 720 } });
    });

    expect(onEventsChange.mock.calls[0][0][0].end).to.equal('2025-07-03T20:00:00.000Z');
  });

  it('should resize the start of an armed event to an earlier time', async () => {
    const { onEventsChange } = renderResizableEvent();
    const eventElement = armEvent();

    const startHandle = getResizeHandle(eventElement, 'start');

    await act(async () => {
      simulatePointerResize({ handle: startHandle, to: { clientY: clientYForTime(0, 24, 8) } });
    });

    expect(onEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = onEventsChange.mock.calls[0][0];
    // End stays at 11:00, start moves earlier than 10:00.
    expect(new Date(updatedEvents[0].start).getUTCHours()).to.equal(8);
    expect(new Date(updatedEvents[0].end).getUTCHours()).to.equal(11);
  });

  // Controlled, the resized end survives through the model; uncontrolled (the host has not
  // fed the change back yet), the form resends the bound the snapshot is ahead on.
  [true, false].forEach((controlled) => {
    it(`should keep a prior armed resize when an unrelated field is then edited from the form (${controlled ? 'controlled' : 'uncontrolled'})`, async () => {
      const { onEventsChange, user } = renderResizableEvent({ controlled });
      const eventElement = armEvent();

      const endHandle = getResizeHandle(eventElement, 'end');
      await act(async () => {
        simulatePointerResize({ handle: endHandle, to: { clientY: clientYForTime(0, 24, 16) } });
      });

      // Open the editing form from the armed toolbar and change only the title.
      fireEvent.click(screen.getByRole('button', { name: 'Edit event' }));
      // The form must be seeded with the resized end, not the pre-resize model value.
      expect(screen.getByLabelText(/end time/i)).to.have.value('16:00');
      fireEvent.change(screen.getByRole('textbox', { name: /Event title/i }), {
        target: { value: 'Renamed Meeting' },
      });
      // The form validates asynchronously before submitting, so let the submit settle.
      await user.click(screen.getByRole('button', { name: 'Save' }));

      const updatedEvents = onEventsChange.mock.lastCall?.[0];
      // Saving the form must preserve the resized end time, not revert it to the pre-resize value.
      expect(updatedEvents[0].title).to.equal('Renamed Meeting');
      expect(new Date(updatedEvents[0].start).getUTCHours()).to.equal(10);
      expect(new Date(updatedEvents[0].end).getUTCHours()).to.equal(16);
    });
  });

  it('should remove the resize handles once the armed event is opened in the editing form', () => {
    renderResizableEvent();
    const eventElement = armEvent();
    // Armed: the pointer-resize handles are present.
    expect(getResizeHandle(eventElement, 'start')).not.to.equal(null);
    expect(getResizeHandle(eventElement, 'end')).not.to.equal(null);

    // Opening the form hands time control to the form, so resizing must be disabled to prevent a
    // pointer resize and a form submit from fighting over the same times.
    fireEvent.click(screen.getByRole('button', { name: 'Edit event' }));

    expect(eventElement).not.to.have.attribute('data-armed');
    expect(eventElement).to.have.attribute('data-editing');
    expect(eventElement.querySelector('[data-start]')).to.equal(null);
    expect(eventElement.querySelector('[data-end]')).to.equal(null);
  });

  it('should not commit a resize that is cancelled', async () => {
    const { onEventsChange } = renderResizableEvent();
    const eventElement = armEvent();

    const endHandle = getResizeHandle(eventElement, 'end');

    await act(async () => {
      simulatePointerResize({
        handle: endHandle,
        to: { clientY: clientYForTime(0, 24, 16) },
        cancel: true,
      });
    });

    expect(onEventsChange.mock.calls.length).to.equal(0);
  });
});
