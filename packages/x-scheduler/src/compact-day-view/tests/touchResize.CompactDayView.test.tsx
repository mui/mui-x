import { spy } from 'sinon';
import { screen, act, fireEvent } from '@mui/internal-test-utils';
import {
  createSchedulerRenderer,
  EventBuilder,
  mockElementBounds,
  clientYForTime,
  getResizeHandle,
  simulatePointerResize,
} from 'test/utils/scheduler';
import { eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import { StandaloneCompactDayView } from '@mui/x-scheduler/compact-day-view';

/**
 * Touch resize uses pointer events (`useEventPointerResizeHandler`) rather than the native
 * drag-and-drop API, so it is exercised here through {@link simulatePointerResize} on the
 * compact (touch) view.
 */
describe('CompactDayView - touch resize', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03Z') });

  function getTimeGridColumn(): HTMLElement {
    return document.querySelector<HTMLElement>(
      `.MuiEventCalendar-dayTimeGridGrid [data-drop-target-for-element]`,
    )!;
  }

  function renderResizableEvent(onEventsChange = spy()) {
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
        onEventsChange={onEventsChange}
      />,
    );

    // The geometry resolver maps the pointer Y to a time using the column's own bounds.
    mockElementBounds(getTimeGridColumn(), { top: 0, height: 1440, width: 200 });

    return { onEventsChange };
  }

  /** Taps the event to arm it (open the drawer), revealing its resize handles. */
  function armEvent(): HTMLElement {
    const eventElement = screen.getByRole('button', { name: /Morning Meeting/i });
    fireEvent.click(eventElement);
    return eventElement;
  }

  it('does not show resize handles until the event is armed', () => {
    renderResizableEvent();
    const eventElement = screen.getByRole('button', { name: /Morning Meeting/i });
    expect(eventElement.querySelector(`.${eventCalendarClasses.timeGridEventResizeHandler}`)).to.equal(
      null,
    );
  });

  it('resizes the end of an armed event to a later time', async () => {
    const { onEventsChange } = renderResizableEvent();
    const eventElement = armEvent();

    const endHandle = getResizeHandle(eventElement, 'end');

    await act(async () => {
      simulatePointerResize({ handle: endHandle, to: { clientY: clientYForTime(0, 24, 16) } });
    });

    expect(onEventsChange.callCount).to.equal(1);
    const updatedEvents = onEventsChange.firstCall.args[0];
    // Start stays at 10:00, end moves later than the original 11:00.
    expect(new Date(updatedEvents[0].start).getUTCHours()).to.equal(10);
    expect(new Date(updatedEvents[0].end).getUTCHours()).to.equal(16);
  });

  it('resizes the start of an armed event to an earlier time', async () => {
    const { onEventsChange } = renderResizableEvent();
    const eventElement = armEvent();

    const startHandle = getResizeHandle(eventElement, 'start');

    await act(async () => {
      simulatePointerResize({ handle: startHandle, to: { clientY: clientYForTime(0, 24, 8) } });
    });

    expect(onEventsChange.callCount).to.equal(1);
    const updatedEvents = onEventsChange.firstCall.args[0];
    // End stays at 11:00, start moves earlier than the original 10:00.
    expect(new Date(updatedEvents[0].start).getUTCHours()).to.equal(8);
    expect(new Date(updatedEvents[0].end).getUTCHours()).to.equal(11);
  });

  it('does not commit a resize that is cancelled', async () => {
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

    expect(onEventsChange.callCount).to.equal(0);
  });
});
