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
import { StandaloneDayView } from '@mui/x-scheduler/day-view';

/**
 * Touch behavior is device-adaptive and not bound to the compact views: arming (driven by the
 * editing state) and pointer resize work in the normal Day View too. Pointer resize is exercised
 * here through {@link simulatePointerResize}, whose pointer events are not `mouse`, so they take the
 * pointer-resize path.
 */
describe('DayView - touch resize', () => {
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

    render(<StandaloneDayView events={[event]} resources={[]} onEventsChange={onEventsChange} />);

    // The geometry resolver maps the pointer Y to a time using the column's own bounds.
    mockElementBounds(getTimeGridColumn(), { top: 0, height: 1440, width: 200 });

    return { onEventsChange };
  }

  function getEvent(): HTMLElement {
    return screen.getByRole('button', { name: /Morning Meeting/i });
  }

  it('arms the event when it is opened for editing', () => {
    renderResizableEvent();
    const eventElement = getEvent();
    expect(eventElement).not.to.have.attribute('data-armed');
    fireEvent.click(eventElement);
    expect(eventElement).to.have.attribute('data-armed');
  });

  it('pointer-resizes the end of an event to a later time', async () => {
    const { onEventsChange } = renderResizableEvent();
    const eventElement = getEvent();
    fireEvent.click(eventElement);

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
});
