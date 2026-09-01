import { screen, within, act } from '@mui/internal-test-utils';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { StandaloneEvent } from '@mui/x-scheduler-internals/standalone-event';
import {
  adapter,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  utcJuly4AllDayBuilder,
  ResourceBuilder,
  simulateDragAndDrop,
  mockElementBounds,
  getResizeHandle,
} from 'test/utils/scheduler';
import type { SchedulerResource } from '@mui/x-scheduler-internals/models';
import { vi, describe, it, expect } from 'vitest';

const engineering = ResourceBuilder.new().build();
const design = ResourceBuilder.new().build();
const marketing = ResourceBuilder.new().build();

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
  const { renderSettled } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  it('should move an event to a different resource', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .title('Team Standup')
      .singleDay('2025-07-03T09:00:00Z', 60)
      .resource(engineering)
      .draggable(true)
      .build();

    await renderSettled(
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

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    expect(updatedEvents[0].resource).to.equal(design.id);
  });

  it('should replace only the source resource when moving a multi-resource event to a different row', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .title('All Hands')
      .singleDay('2025-07-03T09:00:00Z', 60)
      .resources([engineering, design])
      .draggable(true)
      .build();

    await renderSettled(
      <EventTimelinePremium
        resources={[engineering, design, marketing]}
        events={[event]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        preset="dayAndMonth"
        presets={['dayAndMonth']}
        onEventsChange={handleEventsChange}
      />,
    );

    mockAllEventRowBounds();

    const engineeringRow = getEventRow(engineering.id);
    const eventElement = within(engineeringRow).getByText('All Hands');
    mockElementBounds(eventElement, { left: 100, width: 120, height: 30 });

    const marketingRow = getEventRow(marketing.id);

    await act(async () => {
      simulateDragAndDrop({
        source: eventElement,
        target: marketingRow,
        sourceClientX: 160,
        targetClientX: 160,
      });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    // The engineering row was replaced by marketing; design is untouched.
    expect(updatedEvents[0].resource).to.deep.equal([marketing.id, design.id]);
  });

  it('should dedupe instead of duplicating the resource id when dropping onto a row the event already occupies', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .title('All Hands')
      .singleDay('2025-07-03T09:00:00Z', 60)
      .resources([engineering, design])
      .draggable(true)
      .build();

    await renderSettled(
      <EventTimelinePremium
        resources={[engineering, design]}
        events={[event]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        preset="dayAndMonth"
        presets={['dayAndMonth']}
        onEventsChange={handleEventsChange}
      />,
    );

    mockAllEventRowBounds();

    const engineeringRow = getEventRow(engineering.id);
    const eventElement = within(engineeringRow).getByText('All Hands');
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

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    // Engineering is dropped and design was already present: no duplicate entry.
    expect(updatedEvents[0].resource).to.deep.equal([design.id]);
  });

  it('should move an event to a different position on the same resource', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .title('Design Review')
      .singleDay('2025-07-03T09:00:00Z', 60)
      .resource(engineering)
      .draggable(true)
      .build();

    await renderSettled(
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

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    // The event should have moved to a different time
    const newStart = new Date(updatedEvents[0].start);
    expect(newStart.getUTCDate()).to.not.equal(3);
  });

  it('should exclude the dragged occurrence of its own day when moved from another timezone', async () => {
    const handleEventsChange = vi.fn();
    // A UTC all-day weekly series whose display bounds normalize to New York July 3rd.
    const event = utcJuly4AllDayBuilder()
      .title('Weekly sync')
      .recurrent('WEEKLY')
      .resource(engineering)
      .draggable(true)
      .build();

    const { user } = await renderSettled(
      <EventTimelinePremium
        resources={resources}
        events={[event]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        displayTimezone="America/New_York"
        preset="dayAndMonth"
        presets={['dayAndMonth']}
        onEventsChange={handleEventsChange}
      />,
    );

    mockAllEventRowBounds();
    const eventElement = screen.getAllByText('Weekly sync')[0];
    mockElementBounds(eventElement, { left: 100, width: 120, height: 30 });

    await act(async () => {
      simulateDragAndDrop({
        source: eventElement,
        target: getEventRow(engineering.id),
        sourceClientX: 160,
        targetClientX: 1000,
      });
    });

    // A recurring drop opens the scope dialog.
    await user.click(await screen.findByText(/Only this event/i));
    await user.click(screen.getByRole('button', { name: /Confirm/i }));

    // The exception lands on the occurrence's own July 4th, not the displayed July 3rd.
    const updatedEvents = handleEventsChange.mock.lastCall?.[0];
    const series = updatedEvents.find((item: { id: string }) => item.id === event.id)!;
    expect(series.exDates).to.have.length(1);
    expect(
      adapter.formatByString(adapter.date(String(series.exDates[0]), 'UTC'), 'yyyy-MM-dd'),
    ).to.equal('2025-07-04');

    // The dragged occurrence materializes as a detached one-off on the drop day.
    // The detached one-off lands on the day it was dropped on as the user saw it,
    // not on a day shifted by re-reading the display bounds as the base.
    const detached = updatedEvents.find((item: { id: string }) => item.id !== event.id)!;
    expect(detached.rrule).to.equal(undefined);
    expect(
      adapter.formatByString(
        adapter.setTimezone(adapter.date(String(detached.start), 'UTC'), 'America/New_York'),
        'yyyy-MM-dd',
      ),
    ).to.equal('2025-07-10');
  });

  it('should exclude the dragged occurrence of its own day when dragged from a secondary resource row', async () => {
    const handleEventsChange = vi.fn();
    // The same cross-timezone weekly occurrence renders once per resource row; the
    // appearance does not change which occurrence identity the drag carries.
    const event = utcJuly4AllDayBuilder()
      .title('Weekly sync')
      .recurrent('WEEKLY')
      .resources([engineering, design])
      .draggable(true)
      .build();

    const { user } = await renderSettled(
      <EventTimelinePremium
        resources={resources}
        events={[event]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        displayTimezone="America/New_York"
        preset="dayAndMonth"
        presets={['dayAndMonth']}
        onEventsChange={handleEventsChange}
      />,
    );

    mockAllEventRowBounds();
    const eventElement = within(getEventRow(design.id)).getAllByText('Weekly sync')[0];
    mockElementBounds(eventElement, { left: 100, width: 120, height: 30 });

    await act(async () => {
      simulateDragAndDrop({
        source: eventElement,
        target: getEventRow(design.id),
        sourceClientX: 160,
        targetClientX: 1000,
      });
    });

    await user.click(await screen.findByText(/Only this event/i));
    await user.click(screen.getByRole('button', { name: /Confirm/i }));

    const updatedEvents = handleEventsChange.mock.lastCall?.[0];
    const series = updatedEvents.find((item: { id: string }) => item.id === event.id)!;
    expect(series.exDates).to.have.length(1);
    expect(
      adapter.formatByString(adapter.date(String(series.exDates[0]), 'UTC'), 'yyyy-MM-dd'),
    ).to.equal('2025-07-04');

    // Dragging a secondary appearance detaches the occurrence without dropping the
    // resources it belongs to: the key does not identify which row it was dragged from.
    const detached = updatedEvents.find((item: { id: string }) => item.id !== event.id)!;
    expect(detached.rrule).to.equal(undefined);
    expect(detached.resource).to.deep.equal([engineering.id, design.id]);
  });

  it('should resize an event end to a later time', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .title('Team Standup')
      .singleDay('2025-07-03T09:00:00Z', 60)
      .resource(engineering)
      .resizable(true)
      .build();

    await renderSettled(
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

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    // Start should remain unchanged
    expect(new Date(updatedEvents[0].start).getUTCHours()).to.equal(9);
    // End should have moved later
    const newEnd = new Date(updatedEvents[0].end);
    expect(newEnd.getUTCHours()).to.not.equal(10);
  });

  it('should resize an event start to an earlier time', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .title('Team Standup')
      .singleDay('2025-07-03T09:00:00Z', 60)
      .resource(engineering)
      .resizable(true)
      .build();

    await renderSettled(
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

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    // Start should have moved earlier
    expect(new Date(updatedEvents[0].start).getUTCHours()).to.not.equal(9);
    // End should remain unchanged
    expect(new Date(updatedEvents[0].end).getUTCHours()).to.equal(10);
  });

  describe('trimmed hour window (presetConfig)', () => {
    // dayAndHour trimmed to 8:00 → 20:00: 4 days × 720 visible minutes = 2880 axis
    // minutes. Rows are mocked at 2880px so 1px = 1 axis minute.
    const AXIS_WIDTH = 2880;

    async function renderTimeline(
      event: ReturnType<typeof EventBuilder.prototype.build>,
      spyFn: any,
    ) {
      const view = await renderSettled(
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
      return view;
    }

    /**
     * Mocks the event bounds from the position the component actually rendered, so a
     * render↔drag mismatch cannot slip through hard-coded coordinates.
     */
    function mockEventBoundsFromRender(title: string): { element: HTMLElement; left: number } {
      const element = screen.getByText(title).closest('.MuiEventTimeline-event') as HTMLElement;
      const xPosition = parseFloat(element.style.getPropertyValue('--x-position'));
      const width = parseFloat(element.style.getPropertyValue('--width'));
      expect(Number.isNaN(xPosition), '--x-position must be set on the event').to.equal(false);
      const left = (xPosition / 100) * AXIS_WIDTH;
      mockElementBounds(element, {
        left,
        width: (width / 100) * AXIS_WIDTH,
        height: 30,
      });
      return { element, left };
    }

    it('should map a drop across the day seam through the compressed axis', async () => {
      const handleEventsChange = vi.fn();
      const event = EventBuilder.new()
        .title('Team Standup')
        .singleDay('2025-07-03T10:00:00Z', 60)
        .resource(engineering)
        .draggable(true)
        .build();

      await renderTimeline(event, handleEventsChange);

      // 10:00 sits 120 axis minutes after the first visible hour (8:00).
      const { element: eventElement, left } = mockEventBoundsFromRender('Team Standup');
      expect(left).to.be.closeTo(120, 0.001);

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

      expect(handleEventsChange.mock.calls.length).to.equal(1);
      const updatedEvents = handleEventsChange.mock.calls[0][0];
      const newStart = new Date(updatedEvents[0].start);
      expect(newStart.getUTCDate()).to.equal(4);
      expect(newStart.getUTCHours()).to.equal(10);
    });

    it('should resize the end of an event spanning the hidden gap without jumping', async () => {
      const handleEventsChange = vi.fn();
      const event = EventBuilder.new()
        .title('Overnight Job')
        .span('2025-07-03T18:00:00Z', '2025-07-04T10:00:00Z')
        .resource(engineering)
        .resizable(true)
        .build();

      await renderTimeline(event, handleEventsChange);

      // Rendered from axis minute 600 (18:00) with a 240 axis-minute span
      // (2h before the gap + 2h after it).
      const { element: eventElement, left } = mockEventBoundsFromRender('Overnight Job');
      expect(left).to.be.closeTo(600, 0.001);

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

      expect(handleEventsChange.mock.calls.length).to.equal(1);
      const updatedEvents = handleEventsChange.mock.calls[0][0];
      expect(new Date(updatedEvents[0].start).getUTCHours()).to.equal(18);
      const newEnd = new Date(updatedEvents[0].end);
      expect(newEnd.getUTCDate()).to.equal(4);
      expect(newEnd.getUTCHours()).to.equal(11);
    });

    it('should shift a window-clipped start by the dragged amount instead of snapping it to the window edge', async () => {
      const handleEventsChange = vi.fn();
      const event = EventBuilder.new()
        .title('Early Shift')
        .span('2025-07-03T07:00:00Z', '2025-07-03T18:00:00Z')
        .resource(engineering)
        .draggable(true)
        .build();

      await renderTimeline(event, handleEventsChange);

      // The 07:00 start hides inside the hidden hours: the event renders clamped
      // to the window edge (axis minute 0).
      const { element: eventElement, left } = mockEventBoundsFromRender('Early Shift');
      expect(left).to.be.closeTo(0, 0.001);

      const sameRow = getEventRow(engineering.id);

      // Drag one hour to the right: the real dates shift by one hour.
      await act(async () => {
        simulateDragAndDrop({
          source: eventElement,
          target: sameRow,
          sourceClientX: 10,
          targetClientX: 70,
        });
      });

      expect(handleEventsChange.mock.calls.length).to.equal(1);
      const updatedEvents = handleEventsChange.mock.calls[0][0];
      expect(new Date(updatedEvents[0].start).getUTCHours()).to.equal(8);
      expect(new Date(updatedEvents[0].end).getUTCHours()).to.equal(19);
    });

    it('should not emit a change when the drag of a window-clipped event returns to its origin', async () => {
      const handleEventsChange = vi.fn();
      const event = EventBuilder.new()
        .title('Early Shift')
        .span('2025-07-03T07:00:00Z', '2025-07-03T18:00:00Z')
        .resource(engineering)
        .draggable(true)
        .build();

      await renderTimeline(event, handleEventsChange);

      const { element: eventElement } = mockEventBoundsFromRender('Early Shift');
      const sameRow = getEventRow(engineering.id);

      await act(async () => {
        simulateDragAndDrop({
          source: eventElement,
          target: sameRow,
          sourceClientX: 10,
          targetClientX: 10,
        });
      });

      // The reconstructed dates equal the original ones, so the drop is a no-op
      // (the buggy clamped reconstruction used to commit 07:00 → 08:00 here).
      expect(handleEventsChange.mock.calls.length).to.equal(0);
    });

    it('should move an event spanning the hidden gap by the dragged amount and keep its real duration', async () => {
      const handleEventsChange = vi.fn();
      const event = EventBuilder.new()
        .title('Overnight Job')
        .span('2025-07-03T18:00:00Z', '2025-07-04T10:00:00Z')
        .resource(engineering)
        .draggable(true)
        .build();

      await renderTimeline(event, handleEventsChange);

      const { element: eventElement, left } = mockEventBoundsFromRender('Overnight Job');
      expect(left).to.be.closeTo(600, 0.001);

      const sameRow = getEventRow(engineering.id);

      // +60 axis minutes: 16h real duration is preserved across the hidden gap.
      await act(async () => {
        simulateDragAndDrop({
          source: eventElement,
          target: sameRow,
          sourceClientX: 610,
          targetClientX: 670,
        });
      });

      expect(handleEventsChange.mock.calls.length).to.equal(1);
      const updatedEvents = handleEventsChange.mock.calls[0][0];
      const newStart = new Date(updatedEvents[0].start);
      expect(newStart.getUTCDate()).to.equal(3);
      expect(newStart.getUTCHours()).to.equal(19);
      const newEnd = new Date(updatedEvents[0].end);
      expect(newEnd.getUTCDate()).to.equal(4);
      expect(newEnd.getUTCHours()).to.equal(11);
    });

    it('should move an event starting before the collection without shifting it by the hidden hours', async () => {
      const handleEventsChange = vi.fn();
      const event = EventBuilder.new()
        .title('Long Job')
        .span('2025-07-02T10:00:00Z', '2025-07-03T12:00:00Z')
        .resource(engineering)
        .draggable(true)
        .build();

      await renderTimeline(event, handleEventsChange);

      // Starts before the collection: rendered from the row start.
      const { element: eventElement, left } = mockEventBoundsFromRender('Long Job');
      expect(left).to.be.closeTo(0, 0.001);

      const sameRow = getEventRow(engineering.id);

      await act(async () => {
        simulateDragAndDrop({
          source: eventElement,
          target: sameRow,
          sourceClientX: 10,
          targetClientX: 70,
        });
      });

      expect(handleEventsChange.mock.calls.length).to.equal(1);
      const updatedEvents = handleEventsChange.mock.calls[0][0];
      const newStart = new Date(updatedEvents[0].start);
      expect(newStart.getUTCDate()).to.equal(2);
      expect(newStart.getUTCHours()).to.equal(11);
      const newEnd = new Date(updatedEvents[0].end);
      expect(newEnd.getUTCDate()).to.equal(3);
      expect(newEnd.getUTCHours()).to.equal(13);
    });

    it('should resize the start of an event through the axis instead of real milliseconds', async () => {
      const handleEventsChange = vi.fn();
      const event = EventBuilder.new()
        .title('Overnight Job')
        .span('2025-07-03T18:00:00Z', '2025-07-04T10:00:00Z')
        .resource(engineering)
        .resizable(true)
        .build();

      await renderTimeline(event, handleEventsChange);

      const { element: eventElement, left } = mockEventBoundsFromRender('Overnight Job');
      expect(left).to.be.closeTo(600, 0.001);

      const startHandle = getResizeHandle(eventElement, 'start');
      const sameRow = getEventRow(engineering.id);

      // 60 axis minutes to the left: 18:00 → 17:00. A real-milliseconds mapping
      // would land at 09:00.
      await act(async () => {
        simulateDragAndDrop({
          source: startHandle,
          target: sameRow,
          sourceClientX: 600,
          targetClientX: 540,
        });
      });

      expect(handleEventsChange.mock.calls.length).to.equal(1);
      const updatedEvents = handleEventsChange.mock.calls[0][0];
      const newStart = new Date(updatedEvents[0].start);
      expect(newStart.getUTCDate()).to.equal(3);
      expect(newStart.getUTCHours()).to.equal(17);
      const newEnd = new Date(updatedEvents[0].end);
      expect(newEnd.getUTCDate()).to.equal(4);
      expect(newEnd.getUTCHours()).to.equal(10);
    });

    it('should not offer a resize handle on a bound hidden by the hour window', async () => {
      const handleEventsChange = vi.fn();
      const event = EventBuilder.new()
        .title('Early Shift')
        .span('2025-07-03T06:00:00Z', '2025-07-03T12:00:00Z')
        .resource(engineering)
        .resizable(true)
        .build();

      await renderTimeline(event, handleEventsChange);

      const eventElement = screen
        .getByText('Early Shift')
        .closest('.MuiEventTimeline-event') as HTMLElement;

      // The 06:00 start renders clamped to the window edge, so its handle would
      // resize from a position that is not the real start.
      expect(eventElement.querySelector('[data-start]')).to.equal(null);
      expect(eventElement.querySelector('[data-end]')).not.to.equal(null);
    });

    it('should drop a standalone event into a trimmed row through the axis', async () => {
      const handleEventsChange = vi.fn();
      await renderSettled(
        <div>
          <StandaloneEvent
            data={{ id: 'external-1', title: 'External Job', duration: 60 }}
            renderDragPreview={() => null}
          >
            External Job
          </StandaloneEvent>
          <EventTimelinePremium
            resources={resources}
            events={[]}
            visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
            preset="dayAndHour"
            presets={['dayAndHour']}
            presetConfig={{ dayAndHour: { startTime: 8, endTime: 20 } }}
            canDragEventsFromTheOutside
            onEventsChange={handleEventsChange}
          />
        </div>,
      );
      mockAllEventRowBounds(AXIS_WIDTH);

      const standaloneElement = screen.getByText('External Job');
      const row = getEventRow(engineering.id);

      // Axis minute 840 = one full visible day (720) + 120 → July 4, 10:00.
      await act(async () => {
        simulateDragAndDrop({
          source: standaloneElement,
          target: row,
          targetClientX: 840,
        });
      });

      expect(handleEventsChange.mock.calls.length).to.equal(1);
      const updatedEvents = handleEventsChange.mock.calls[0][0];
      expect(updatedEvents.length).to.equal(1);
      const newStart = new Date(updatedEvents[0].start);
      expect(newStart.getUTCDate()).to.equal(4);
      expect(newStart.getUTCHours()).to.equal(10);
      expect(new Date(updatedEvents[0].end).getUTCHours()).to.equal(11);
    });

    it('should keep a drop on the exact right edge of the axis inside the collection', async () => {
      const handleEventsChange = vi.fn();
      await renderSettled(
        <div>
          <StandaloneEvent
            data={{ id: 'external-1', title: 'External Job', duration: 60 }}
            renderDragPreview={() => null}
          >
            External Job
          </StandaloneEvent>
          <EventTimelinePremium
            resources={resources}
            events={[]}
            visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
            preset="dayAndHour"
            presets={['dayAndHour']}
            presetConfig={{ dayAndHour: { startTime: 8, endTime: 20 } }}
            canDragEventsFromTheOutside
            onEventsChange={handleEventsChange}
          />
        </div>,
      );
      mockAllEventRowBounds(AXIS_WIDTH);

      const standaloneElement = screen.getByText('External Job');
      const row = getEventRow(engineering.id);

      // Axis minute 2880 is the seam after the last visible day: unclamped it maps
      // to July 7 (outside the collection) and the created event would vanish.
      await act(async () => {
        simulateDragAndDrop({
          source: standaloneElement,
          target: row,
          targetClientX: AXIS_WIDTH,
        });
      });

      expect(handleEventsChange.mock.calls.length).to.equal(1);
      const updatedEvents = handleEventsChange.mock.calls[0][0];
      const newStart = new Date(updatedEvents[0].start);
      expect(newStart.getUTCDate()).to.equal(6);
      expect(newStart.getUTCHours()).to.equal(19);
      expect(newStart.getUTCMinutes()).to.equal(45);
    });

    it('should keep a drop past the left edge of the axis inside the collection', async () => {
      const handleEventsChange = vi.fn();
      await renderSettled(
        <div>
          <StandaloneEvent
            data={{ id: 'external-1', title: 'External Job', duration: 60 }}
            renderDragPreview={() => null}
          >
            External Job
          </StandaloneEvent>
          <EventTimelinePremium
            resources={resources}
            events={[]}
            visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
            preset="dayAndHour"
            presets={['dayAndHour']}
            presetConfig={{ dayAndHour: { startTime: 8, endTime: 20 } }}
            canDragEventsFromTheOutside
            onEventsChange={handleEventsChange}
          />
        </div>,
      );
      mockAllEventRowBounds(AXIS_WIDTH);

      const standaloneElement = screen.getByText('External Job');
      const row = getEventRow(engineering.id);

      // A negative axis offset would resolve into the day before the collection,
      // where the created event would not be rendered at all.
      await act(async () => {
        simulateDragAndDrop({
          source: standaloneElement,
          target: row,
          targetClientX: -10,
        });
      });

      expect(handleEventsChange.mock.calls.length).to.equal(1);
      const updatedEvents = handleEventsChange.mock.calls[0][0];
      const newStart = new Date(updatedEvents[0].start);
      expect(newStart.getUTCDate()).to.equal(3);
      expect(newStart.getUTCHours()).to.equal(8);
      expect(newStart.getUTCMinutes()).to.equal(0);
    });
  });
});
