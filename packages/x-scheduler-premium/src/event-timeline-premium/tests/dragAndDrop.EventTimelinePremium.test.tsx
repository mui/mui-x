import { spy } from 'sinon';
import { screen, act } from '@mui/internal-test-utils';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  simulateDragAndDrop,
  mockElementBounds,
  getResizeHandle,
} from 'test/utils/scheduler';
import { SchedulerResource } from '@mui/x-scheduler-headless/models';

const resources: SchedulerResource[] = [
  { id: 'r1', title: 'Engineering' },
  { id: 'r2', title: 'Design' },
];

/**
 * Returns the timeline event row for a given resource id.
 */
function getEventRow(resourceId: string): HTMLElement {
  const row = document.querySelector<HTMLElement>(
    `.MuiEventTimeline-eventsSubGridRow[data-resource-id="${resourceId}"]`,
  );
  if (!row) {
    throw new Error(`Could not find event row for resource "${resourceId}"`);
  }
  return row;
}

/**
 * Applies mock bounds to all timeline event rows.
 */
function mockAllEventRowBounds() {
  const rows = document.querySelectorAll<HTMLElement>(
    `.MuiEventTimeline-eventsSubGridRow[data-drop-target-for-element]`,
  );
  for (const row of rows) {
    mockElementBounds(row, { left: 0, width: 6720, height: 40 });
  }
}

describe('EventTimelinePremium - Drag and Drop', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  it('should move an event to a different resource', async () => {
    const handleEventsChange = spy();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Team Standup')
      .singleDay('2025-07-03T09:00:00Z', 60)
      .resource('r1')
      .draggable(true)
      .build();

    render(
      <EventTimelinePremium
        resources={resources}
        events={[event]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        view="days"
        views={['days']}
        onEventsChange={handleEventsChange}
      />,
    );

    mockAllEventRowBounds();

    const eventElement = screen.getByText('Team Standup');
    mockElementBounds(eventElement, { left: 100, width: 120, height: 30 });

    const designRow = getEventRow('r2');

    await act(async () => {
      simulateDragAndDrop({
        source: eventElement,
        target: designRow,
        sourceClientX: 160,
        targetClientX: 160,
      });
    });

    expect(handleEventsChange.callCount).to.equal(1);
    const updatedEvents = handleEventsChange.firstCall.args[0];
    expect(updatedEvents[0].resource).to.equal('r2');
  });

  it('should move an event to a different position on the same resource', async () => {
    const handleEventsChange = spy();
    const event = EventBuilder.new()
      .id('event-2')
      .title('Design Review')
      .singleDay('2025-07-03T09:00:00Z', 60)
      .resource('r1')
      .draggable(true)
      .build();

    render(
      <EventTimelinePremium
        resources={resources}
        events={[event]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        view="days"
        views={['days']}
        onEventsChange={handleEventsChange}
      />,
    );

    mockAllEventRowBounds();

    const eventElement = screen.getByText('Design Review');
    mockElementBounds(eventElement, { left: 100, width: 120, height: 30 });

    const sameRow = getEventRow('r1');

    // Drop at a significantly different X position to move the event
    await act(async () => {
      simulateDragAndDrop({
        source: eventElement,
        target: sameRow,
        sourceClientX: 160,
        targetClientX: 1000,
      });
    });

    expect(handleEventsChange.callCount).to.equal(1);
    const updatedEvents = handleEventsChange.firstCall.args[0];
    // The event should have moved to a different time
    const newStart = new Date(updatedEvents[0].start);
    expect(newStart.getUTCDate()).to.not.equal(3);
  });

  it('should resize an event end to a later time', async () => {
    const handleEventsChange = spy();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Team Standup')
      .singleDay('2025-07-03T09:00:00Z', 60)
      .resource('r1')
      .resizable(true)
      .build();

    render(
      <EventTimelinePremium
        resources={resources}
        events={[event]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        view="days"
        views={['days']}
        onEventsChange={handleEventsChange}
      />,
    );

    mockAllEventRowBounds();

    const eventElement = screen
      .getByText('Team Standup')
      .closest('.MuiEventTimeline-event') as HTMLElement;
    mockElementBounds(eventElement, { left: 100, width: 120, height: 30 });

    const endHandle = getResizeHandle(eventElement, 'end');
    const sameRow = getEventRow('r1');

    await act(async () => {
      simulateDragAndDrop({
        source: endHandle,
        target: sameRow,
        sourceClientX: 220,
        targetClientX: 1000,
      });
    });

    expect(handleEventsChange.callCount).to.equal(1);
    const updatedEvents = handleEventsChange.firstCall.args[0];
    // Start should remain unchanged
    expect(new Date(updatedEvents[0].start).getUTCHours()).to.equal(9);
    // End should have moved later
    const newEnd = new Date(updatedEvents[0].end);
    expect(newEnd.getUTCHours()).to.not.equal(10);
  });

  it('should resize an event start to an earlier time', async () => {
    const handleEventsChange = spy();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Team Standup')
      .singleDay('2025-07-03T09:00:00Z', 60)
      .resource('r1')
      .resizable(true)
      .build();

    render(
      <EventTimelinePremium
        resources={resources}
        events={[event]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        view="days"
        views={['days']}
        onEventsChange={handleEventsChange}
      />,
    );

    mockAllEventRowBounds();

    const eventElement = screen
      .getByText('Team Standup')
      .closest('.MuiEventTimeline-event') as HTMLElement;
    mockElementBounds(eventElement, { left: 100, width: 120, height: 30 });

    const startHandle = getResizeHandle(eventElement, 'start');
    const sameRow = getEventRow('r1');

    // Drag the start handle to an earlier position on the timeline.
    // The "days" view shows 56 days in 6720px (≈5px per hour).
    // The event at 09:00 is at ~pixel 45. Use targetClientX=20 (~04:00).
    await act(async () => {
      simulateDragAndDrop({
        source: startHandle,
        target: sameRow,
        sourceClientX: 100,
        targetClientX: 20,
      });
    });

    expect(handleEventsChange.callCount).to.equal(1);
    const updatedEvents = handleEventsChange.firstCall.args[0];
    // Start should have moved earlier
    expect(new Date(updatedEvents[0].start).getUTCHours()).to.not.equal(9);
    // End should remain unchanged
    expect(new Date(updatedEvents[0].end).getUTCHours()).to.equal(10);
  });
});
