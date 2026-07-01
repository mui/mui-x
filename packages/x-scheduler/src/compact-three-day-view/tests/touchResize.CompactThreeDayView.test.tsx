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
import { StandaloneCompactThreeDayView } from '@mui/x-scheduler/compact-three-day-view';

/**
 * The compact three-day view renders several day columns, so it exercises the multi-column paths the
 * single-column day view can't: per-column pointer-to-time mapping and cross-column disarming.
 */
describe('CompactThreeDayView - touch resize & arming', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03Z') });

  function renderEvents(onEventsChange = spy()) {
    const morning = EventBuilder.new()
      .id('event-1')
      .title('Morning Meeting')
      .singleDay('2025-07-03T10:00:00Z', 60)
      .resizable(true)
      .build();

    const lunch = EventBuilder.new()
      .id('event-2')
      .title('Lunch')
      .singleDay('2025-07-04T12:00:00Z', 60)
      .resizable(true)
      .build();

    render(
      <StandaloneCompactThreeDayView
        events={[morning, lunch]}
        resources={[]}
        onEventsChange={onEventsChange}
      />,
    );

    return { onEventsChange };
  }

  it('arms only the tapped event', () => {
    renderEvents();
    const morning = screen.getByRole('button', { name: /Morning Meeting/i });
    const lunch = screen.getByRole('button', { name: /Lunch/i });

    expect(morning).not.to.have.attribute('data-armed');
    fireEvent.click(morning);

    expect(morning).to.have.attribute('data-armed');
    expect(lunch).not.to.have.attribute('data-armed');
  });

  it('resizes an armed event within its own day column', async () => {
    const { onEventsChange } = renderEvents();
    const morning = screen.getByRole('button', { name: /Morning Meeting/i });
    fireEvent.click(morning);

    // Map pointer Y to a time via the bounds of the event's own column, not a sibling day.
    const column = morning.closest<HTMLElement>('[data-drop-target-for-element]')!;
    mockElementBounds(column, { top: 0, height: 1440, width: 200 });

    const endHandle = getResizeHandle(morning, 'end');
    await act(async () => {
      simulatePointerResize({ handle: endHandle, to: { clientY: clientYForTime(0, 24, 16) } });
    });

    expect(onEventsChange.callCount).to.equal(1);
    const updated = onEventsChange.firstCall.args[0];
    expect(updated[0].id).to.equal('event-1');
    expect(new Date(updated[0].start).getUTCHours()).to.equal(10);
    expect(new Date(updated[0].end).getUTCHours()).to.equal(16);
  });

  it('disarms the current event when another event in a different column is tapped', () => {
    renderEvents();
    const morning = screen.getByRole('button', { name: /Morning Meeting/i });
    const lunch = screen.getByRole('button', { name: /Lunch/i });

    fireEvent.click(morning);
    expect(morning).to.have.attribute('data-armed');

    // Two-tap contract: tapping a second event first exits the armed state; it does not immediately
    // arm the new one (that happens on the next tap).
    fireEvent.click(lunch);
    expect(morning).not.to.have.attribute('data-armed');
    expect(lunch).not.to.have.attribute('data-armed');
  });
});
