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
import { StandaloneCompactDayView } from '@mui/x-scheduler/compact-day-view';

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

  function renderResizableEvent(onEventsChange = spy()) {
    const event = EventBuilder.new()
      .id('event-1')
      .title('Morning Meeting')
      .singleDay('2025-07-03T10:00:00Z', 60)
      .resizable(true)
      .build();

    render(
      <StandaloneCompactDayView events={[event]} resources={[]} onEventsChange={onEventsChange} />,
    );

    // Geometry resolver maps pointer Y to a time via the column's bounds.
    mockElementBounds(getTimeGridColumn(), { top: 0, height: 1440, width: 200 });

    return { onEventsChange };
  }

  /** Taps the event to arm it, revealing its resize handles. */
  function armEvent(): HTMLElement {
    const eventElement = screen.getByRole('button', { name: /Morning Meeting/i });
    fireEvent.click(eventElement);
    return eventElement;
  }

  it('arms the event only once it is tapped', () => {
    renderResizableEvent();
    const eventElement = screen.getByRole('button', { name: /Morning Meeting/i });
    // Handles are always in the DOM; coarse-pointer CSS reveals them when armed. In JSDOM, assert via `data-armed`.
    expect(eventElement).not.to.have.attribute('data-armed');
    fireEvent.click(eventElement);
    expect(eventElement).to.have.attribute('data-armed');
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
    // Start stays at 10:00, end moves later than 11:00.
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
    // End stays at 11:00, start moves earlier than 10:00.
    expect(new Date(updatedEvents[0].start).getUTCHours()).to.equal(8);
    expect(new Date(updatedEvents[0].end).getUTCHours()).to.equal(11);
  });

  it('keeps a prior armed resize when an unrelated field is then edited from the form', async () => {
    const { onEventsChange } = renderResizableEvent();
    const eventElement = armEvent();

    const endHandle = getResizeHandle(eventElement, 'end');
    await act(async () => {
      simulatePointerResize({ handle: endHandle, to: { clientY: clientYForTime(0, 24, 16) } });
    });

    // Open the editing form from the armed toolbar and change only the title.
    fireEvent.click(screen.getByRole('button', { name: 'Edit event' }));
    fireEvent.change(screen.getByRole('textbox', { name: /Event title/i }), {
      target: { value: 'Renamed Meeting' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    const updatedEvents = onEventsChange.lastCall.args[0];
    // Saving the form must preserve the resized end time, not revert it to the pre-resize value.
    expect(updatedEvents[0].title).to.equal('Renamed Meeting');
    expect(new Date(updatedEvents[0].start).getUTCHours()).to.equal(10);
    expect(new Date(updatedEvents[0].end).getUTCHours()).to.equal(16);
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
