import { spy } from 'sinon';
import { screen, act } from '@mui/internal-test-utils';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  ResourceBuilder,
  simulateDragAndDrop,
  mockElementBounds,
  getResizeHandle,
} from 'test/utils/scheduler';
import type { SchedulerResource } from '@mui/x-scheduler-internals/models';

const engineering = ResourceBuilder.new().build();
const design = ResourceBuilder.new().build();

const resources: SchedulerResource[] = [engineering, design];

/**
 * Returns the timeline event row for a given resource id.
 */
function getEventRow(resourceId: string): HTMLElement {
  const row = document.querySelector<HTMLElement>(
    `.MuiEventTimeline-eventsCell[data-resource-id="${resourceId}"]`,
  );
  if (!row) {
    throw new Error(`Could not find event row for resource "${resourceId}"`);
  }
  return row;
}

/**
 * Applies mock bounds to all timeline event rows.
 */
function mockAllEventRowBounds(width = 6720) {
  const rows = document.querySelectorAll<HTMLElement>(
    `.MuiEventTimeline-eventsCell[data-drop-target-for-element]`,
  );
  for (const row of rows) {
    mockElementBounds(row, { left: 0, width, height: 40 });
  }
}

describe('EventTimelinePremium - Drag and Drop', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  it('should move an event to a different resource', async () => {
    const handleEventsChange = spy();
    const event = EventBuilder.new()
      .title('Team Standup')
      .singleDay('2025-07-03T09:00:00Z', 60)
      .resource(engineering)
      .draggable(true)
      .build();

    render(
      <EventTimelinePremium
        resources={resources}
        events={[event]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        preset="dayAndMonth"
        presets={['dayAndMonth']}
        onEventsChange={handleEventsChange}
      />,
    );

    mockAllEventRowBounds();

    const eventElement = screen.getByText('Team Standup');
    mockElementBounds(eventElement, { left: 100, width: 120, height: 30 });

    const designRow = getEventRow(design.id);

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
    expect(updatedEvents[0].resource).to.equal(design.id);
  });

  it('should move an event to a different position on the same resource', async () => {
    const handleEventsChange = spy();
    const event = EventBuilder.new()
      .title('Design Review')
      .singleDay('2025-07-03T09:00:00Z', 60)
      .resource(engineering)
      .draggable(true)
      .build();

    render(
      <EventTimelinePremium
        resources={resources}
        events={[event]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        preset="dayAndMonth"
        presets={['dayAndMonth']}
        onEventsChange={handleEventsChange}
      />,
    );

    mockAllEventRowBounds();

    const eventElement = screen.getByText('Design Review');
    mockElementBounds(eventElement, { left: 100, width: 120, height: 30 });

    const sameRow = getEventRow(engineering.id);

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
      .title('Team Standup')
      .singleDay('2025-07-03T09:00:00Z', 60)
      .resource(engineering)
      .resizable(true)
      .build();

    render(
      <EventTimelinePremium
        resources={resources}
        events={[event]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        preset="dayAndMonth"
        presets={['dayAndMonth']}
        onEventsChange={handleEventsChange}
      />,
    );

    mockAllEventRowBounds();

    const eventElement = screen
      .getByText('Team Standup')
      .closest('.MuiEventTimeline-event') as HTMLElement;
    mockElementBounds(eventElement, { left: 100, width: 120, height: 30 });

    const endHandle = getResizeHandle(eventElement, 'end');
    const sameRow = getEventRow(engineering.id);

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
      .title('Team Standup')
      .singleDay('2025-07-03T09:00:00Z', 60)
      .resource(engineering)
      .resizable(true)
      .build();

    render(
      <EventTimelinePremium
        resources={resources}
        events={[event]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        preset="dayAndMonth"
        presets={['dayAndMonth']}
        onEventsChange={handleEventsChange}
      />,
    );

    mockAllEventRowBounds();

    const eventElement = screen
      .getByText('Team Standup')
      .closest('.MuiEventTimeline-event') as HTMLElement;
    mockElementBounds(eventElement, { left: 100, width: 120, height: 30 });

    const startHandle = getResizeHandle(eventElement, 'start');
    const sameRow = getEventRow(engineering.id);

    // Drag the start handle to an earlier position on the timeline.
    // The "dayAndMonth" preset shows 56 days in 6720px (≈5px per hour).
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

  describe('trimmed hour window (presetConfig)', () => {
    // dayAndHour trimmed to 8:00 → 20:00: 4 days × 720 visible minutes = 2880 axis
    // minutes. Rows are mocked at 2880px so 1px = 1 axis minute.
    const AXIS_WIDTH = 2880;

    function renderTimeline(event: ReturnType<typeof EventBuilder.prototype.build>, spyFn: any) {
      render(
        <EventTimelinePremium
          resources={resources}
          events={[event]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          preset="dayAndHour"
          presets={['dayAndHour']}
          presetConfig={{ dayAndHour: { startTime: 8, endTime: 20 } }}
          onEventsChange={spyFn}
        />,
      );
      mockAllEventRowBounds(AXIS_WIDTH);
    }

    it('should map a drop across the day seam through the compressed axis', async () => {
      const handleEventsChange = spy();
      const event = EventBuilder.new()
        .title('Team Standup')
        .singleDay('2025-07-03T10:00:00Z', 60)
        .resource(engineering)
        .draggable(true)
        .build();

      renderTimeline(event, handleEventsChange);

      // 10:00 sits 120 axis minutes after the first visible hour (8:00).
      const eventElement = screen
        .getByText('Team Standup')
        .closest('.MuiEventTimeline-event') as HTMLElement;
      mockElementBounds(eventElement, { left: 120, width: 60, height: 30 });

      const sameRow = getEventRow(engineering.id);

      // Grab 10 axis minutes into the event, drop at axis minute 850 → the event
      // starts at axis minute 840 = one full visible day (720) + 120 → July 4, 10:00.
      // A real-milliseconds mapping would land on July 3, 14:00 instead.
      await act(async () => {
        simulateDragAndDrop({
          source: eventElement,
          target: sameRow,
          sourceClientX: 130,
          targetClientX: 850,
        });
      });

      expect(handleEventsChange.callCount).to.equal(1);
      const updatedEvents = handleEventsChange.firstCall.args[0];
      const newStart = new Date(updatedEvents[0].start);
      expect(newStart.getUTCDate()).to.equal(4);
      expect(newStart.getUTCHours()).to.equal(10);
    });

    it('should resize the end of an event spanning the hidden gap without jumping', async () => {
      const handleEventsChange = spy();
      const event = EventBuilder.new()
        .title('Overnight Job')
        .span('2025-07-03T18:00:00Z', '2025-07-04T10:00:00Z')
        .resource(engineering)
        .resizable(true)
        .build();

      renderTimeline(event, handleEventsChange);

      // Rendered from axis minute 600 (18:00) with a 240 axis-minute span
      // (2h before the gap + 2h after it).
      const eventElement = screen
        .getByText('Overnight Job')
        .closest('.MuiEventTimeline-event') as HTMLElement;
      mockElementBounds(eventElement, { left: 600, width: 240, height: 30 });

      const endHandle = getResizeHandle(eventElement, 'end');
      const sameRow = getEventRow(engineering.id);

      // Drag the end handle 60 axis minutes to the right: the end moves from
      // 10:00 to 11:00 on July 4. Using the real 16h duration instead of the
      // axis span would push the end a full hidden gap further.
      await act(async () => {
        simulateDragAndDrop({
          source: endHandle,
          target: sameRow,
          sourceClientX: 825,
          targetClientX: 885,
        });
      });

      expect(handleEventsChange.callCount).to.equal(1);
      const updatedEvents = handleEventsChange.firstCall.args[0];
      expect(new Date(updatedEvents[0].start).getUTCHours()).to.equal(18);
      const newEnd = new Date(updatedEvents[0].end);
      expect(newEnd.getUTCDate()).to.equal(4);
      expect(newEnd.getUTCHours()).to.equal(11);
    });
  });
});
