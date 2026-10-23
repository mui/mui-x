import { screen, act } from '@mui/internal-test-utils';
import {
  createSchedulerRenderer,
  EventBuilder,
  simulateDragAndDrop,
  mockElementBounds,
  clientYForTime,
  getResizeHandle,
} from 'test/utils/scheduler';
import { StandaloneWeekView } from '@mui/x-scheduler/week-view';
import { vi, describe, it, expect } from 'vitest';

/**
 * Returns all time grid column drop targets (`[data-drop-target-for-element]`)
 * in DOM order (one per day of the rendered week).
 */
function getTimeGridColumns(): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      `.MuiEventCalendar-dayTimeGridGrid [data-drop-target-for-element]`,
    ),
  );
}

/**
 * Returns the day grid cell (all-day row) for a given day-of-month number.
 * E.g., `getDayGridCell(3)` returns the cell for the 3rd of the month.
 */
function getDayGridCell(dayOfMonth: number): HTMLElement {
  const header = Array.from(
    document.querySelectorAll<HTMLElement>('[role="columnheader"][aria-label]'),
  ).find((h) => h.getAttribute('aria-label')?.endsWith(` ${dayOfMonth}`));

  const cell = screen
    .getAllByRole('gridcell')
    .find((c) => c.getAttribute('aria-labelledby')?.includes(header!.id));
  if (!cell) {
    throw new Error(`Could not find day grid cell for day ${dayOfMonth}`);
  }
  return cell;
}

/**
 * Applies mock bounds to all time grid columns.
 * Uses 1440px height (= 1 pixel per minute of a 24-hour day).
 *
 * This is needed because the drag start calculation (`initialCursorPositionInEventMs`)
 * uses `offsetHeight` and `getBoundingClientRect()` on the source column.
 */
function mockAllTimeGridColumnBounds() {
  const columns = getTimeGridColumns();
  for (const column of columns) {
    mockElementBounds(column, { top: 0, height: 1440, width: 200 });
  }
}

// Week containing July 3, 2025 (Thursday): Sun Jun 29 – Sat Jul 5
// With the default locale (en-US, week starts Sunday),
// days rendered are: [29, 30, 1, 2, 3, 4, 5]
// July 3 is at index 4 in the week.
const JULY_3_COLUMN_INDEX = 4;
const JULY_4_COLUMN_INDEX = 5;

describe('WeekView - Drag and Drop', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03Z') });

  it('should move a time event to the day grid on the same day', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Morning Meeting')
      .singleDay('2025-07-03T10:00:00Z', 60)
      .draggable(true)
      .build();

    render(
      <StandaloneWeekView events={[event]} resources={[]} onEventsChange={handleEventsChange} />,
    );

    mockAllTimeGridColumnBounds();

    const eventElement = screen.getByRole('button', { name: /Morning Meeting/i });
    const dayGridCell = getDayGridCell(3); // July 3

    await act(async () => {
      simulateDragAndDrop({ source: eventElement, target: dayGridCell });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    expect(updatedEvents[0].allDay).to.equal(true);
  });

  it('should move a time event to the day grid on a different day', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Morning Meeting')
      .singleDay('2025-07-03T10:00:00Z', 60)
      .draggable(true)
      .build();

    render(
      <StandaloneWeekView events={[event]} resources={[]} onEventsChange={handleEventsChange} />,
    );

    mockAllTimeGridColumnBounds();

    const eventElement = screen.getByRole('button', { name: /Morning Meeting/i });
    const dayGridCell = getDayGridCell(4); // July 4

    await act(async () => {
      simulateDragAndDrop({ source: eventElement, target: dayGridCell });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    expect(updatedEvents[0].allDay).to.equal(true);
    // The event should have moved to the next day
    expect(new Date(updatedEvents[0].start).getUTCDate()).to.equal(4);
  });

  it('should move a time event to a different time on the same day', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Morning Meeting')
      .singleDay('2025-07-03T10:00:00Z', 60)
      .draggable(true)
      .build();

    render(
      <StandaloneWeekView events={[event]} resources={[]} onEventsChange={handleEventsChange} />,
    );

    mockAllTimeGridColumnBounds();

    const eventElement = screen.getByRole('button', { name: /Morning Meeting/i });
    const columns = getTimeGridColumns();
    const sameColumn = columns[JULY_3_COLUMN_INDEX];

    // Target 14:00 (2 PM). With 1440px height for 24h, clientY = 840 for 14:00
    const targetClientY = clientYForTime(0, 24, 14);

    await act(async () => {
      simulateDragAndDrop({
        source: eventElement,
        target: sameColumn,
        targetClientY,
      });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    expect(updatedEvents[0].allDay).to.not.equal(true);
    // The event should have moved to around 14:00 (the exact time depends on
    // the drag precision and the initialCursorPositionInEventMs calculation)
    const newStartHour = new Date(updatedEvents[0].start).getUTCHours();
    expect(newStartHour).to.not.equal(10); // Should have moved from 10:00
  });

  it('should move a time event to a different day in the time grid', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Morning Meeting')
      .singleDay('2025-07-03T10:00:00Z', 60)
      .draggable(true)
      .build();

    render(
      <StandaloneWeekView events={[event]} resources={[]} onEventsChange={handleEventsChange} />,
    );

    mockAllTimeGridColumnBounds();

    const eventElement = screen.getByRole('button', { name: /Morning Meeting/i });
    const columns = getTimeGridColumns();
    const nextDayColumn = columns[JULY_4_COLUMN_INDEX];

    // Drop at 10:00 on July 4 (same time, different day)
    const targetClientY = clientYForTime(0, 24, 10);

    await act(async () => {
      simulateDragAndDrop({
        source: eventElement,
        target: nextDayColumn,
        targetClientY,
      });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    expect(updatedEvents[0].allDay).to.not.equal(true);
    expect(new Date(updatedEvents[0].start).getUTCDate()).to.equal(4);
  });

  it('should keep a same-day time event within its day when moved', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Morning Meeting')
      .singleDay('2025-07-03T10:00:00Z', 60)
      .draggable(true)
      .build();

    render(
      <StandaloneWeekView events={[event]} resources={[]} onEventsChange={handleEventsChange} />,
    );

    mockAllTimeGridColumnBounds();

    const eventElement = screen.getByRole('button', { name: /Morning Meeting/i });
    const columns = getTimeGridColumns();

    await act(async () => {
      simulateDragAndDrop({
        source: eventElement,
        target: columns[JULY_3_COLUMN_INDEX],
        targetClientY: clientYForTime(0, 24, 23.5),
      });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    expect(new Date(updatedEvents[0].end).getUTCDate()).to.equal(3);
  });

  it('should move a time event crossing midnight without clamping it to a single day', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Night shift')
      .span('2025-07-03T22:00:00Z', '2025-07-04T06:00:00Z')
      .draggable(true)
      .build();

    render(
      <StandaloneWeekView events={[event]} resources={[]} onEventsChange={handleEventsChange} />,
    );

    mockAllTimeGridColumnBounds();

    const parts = screen.getAllByRole('button', { name: /Night shift/i });
    expect(parts).to.have.length(2);
    const columns = getTimeGridColumns();

    await act(async () => {
      simulateDragAndDrop({
        source: parts[0],
        target: columns[JULY_3_COLUMN_INDEX],
        targetClientY: clientYForTime(0, 24, 23),
      });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    expect(new Date(updatedEvents[0].start).toISOString()).to.equal('2025-07-03T23:00:00.000Z');
    expect(new Date(updatedEvents[0].end).toISOString()).to.equal('2025-07-04T07:00:00.000Z');
  });

  it('should move a time event crossing midnight from the part on its second day', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Night shift')
      .span('2025-07-03T22:00:00Z', '2025-07-04T06:00:00Z')
      .draggable(true)
      .build();

    render(
      <StandaloneWeekView events={[event]} resources={[]} onEventsChange={handleEventsChange} />,
    );

    mockAllTimeGridColumnBounds();

    const parts = screen.getAllByRole('button', { name: /Night shift/i });
    expect(parts).to.have.length(2);
    const columns = getTimeGridColumns();

    // The part is grabbed at its top edge, 2 hours after the event start.
    await act(async () => {
      simulateDragAndDrop({
        source: parts[1],
        target: columns[JULY_4_COLUMN_INDEX],
        targetClientY: clientYForTime(0, 24, 1),
      });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    expect(new Date(updatedEvents[0].start).toISOString()).to.equal('2025-07-03T23:00:00.000Z');
    expect(new Date(updatedEvents[0].end).toISOString()).to.equal('2025-07-04T07:00:00.000Z');
  });

  it('should move a part of a time event crossing midnight to the day grid', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Night shift')
      .span('2025-07-03T22:00:00Z', '2025-07-04T06:00:00Z')
      .draggable(true)
      .build();

    render(
      <StandaloneWeekView events={[event]} resources={[]} onEventsChange={handleEventsChange} />,
    );

    mockAllTimeGridColumnBounds();

    const parts = screen.getAllByRole('button', { name: /Night shift/i });
    expect(parts).to.have.length(2);

    // The July 4 part is dropped on July 5: the event moves by one day.
    await act(async () => {
      simulateDragAndDrop({ source: parts[1], target: getDayGridCell(5) });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    expect(updatedEvents[0].allDay).to.equal(true);
    expect(new Date(updatedEvents[0].start).toISOString()).to.equal('2025-07-04T22:00:00.000Z');
    expect(new Date(updatedEvents[0].end).toISOString()).to.equal('2025-07-05T06:00:00.000Z');
  });

  it('should resize the end of the part of a time event crossing midnight on its end day', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Night shift')
      .span('2025-07-03T22:00:00Z', '2025-07-04T06:00:00Z')
      .resizable(true)
      .build();

    render(
      <StandaloneWeekView events={[event]} resources={[]} onEventsChange={handleEventsChange} />,
    );

    mockAllTimeGridColumnBounds();

    const parts = screen.getAllByRole('button', { name: /Night shift/i });
    expect(parts).to.have.length(2);
    const columns = getTimeGridColumns();
    // The July 4 part covers 00:00 to 06:00, its end handle is grabbed at 06:00.
    mockElementBounds(parts[1], { top: 0, height: clientYForTime(0, 24, 6) });

    await act(async () => {
      simulateDragAndDrop({
        source: getResizeHandle(parts[1], 'end'),
        target: columns[JULY_4_COLUMN_INDEX],
        sourceClientY: clientYForTime(0, 24, 6),
        targetClientY: clientYForTime(0, 24, 8),
      });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    expect(new Date(updatedEvents[0].start).toISOString()).to.equal('2025-07-03T22:00:00.000Z');
    expect(new Date(updatedEvents[0].end).toISOString()).to.equal('2025-07-04T08:00:00.000Z');
  });

  it('should resize the start of the part of a time event crossing midnight on its start day', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Night shift')
      .span('2025-07-03T22:00:00Z', '2025-07-04T06:00:00Z')
      .resizable(true)
      .build();

    render(
      <StandaloneWeekView events={[event]} resources={[]} onEventsChange={handleEventsChange} />,
    );

    mockAllTimeGridColumnBounds();

    const parts = screen.getAllByRole('button', { name: /Night shift/i });
    expect(parts).to.have.length(2);
    const columns = getTimeGridColumns();
    // The July 3 part covers 22:00 to 24:00, its start handle is grabbed at 22:00.
    mockElementBounds(parts[0], {
      top: clientYForTime(0, 24, 22),
      height: clientYForTime(0, 24, 2),
    });

    await act(async () => {
      simulateDragAndDrop({
        source: getResizeHandle(parts[0], 'start'),
        target: columns[JULY_3_COLUMN_INDEX],
        sourceClientY: clientYForTime(0, 24, 22),
        targetClientY: clientYForTime(0, 24, 20),
      });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    expect(new Date(updatedEvents[0].start).toISOString()).to.equal('2025-07-03T20:00:00.000Z');
    expect(new Date(updatedEvents[0].end).toISOString()).to.equal('2025-07-04T06:00:00.000Z');
  });

  it('should keep the span of a time event crossing midnight that the visible hours also clip', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Night shift')
      .span('2025-07-03T18:00:00Z', '2025-07-04T06:00:00Z')
      .draggable(true)
      .resizable(true)
      .build();

    render(
      <StandaloneWeekView
        events={[event]}
        resources={[]}
        onEventsChange={handleEventsChange}
        viewConfig={{ week: { startTime: 0, endTime: 20 } }}
      />,
    );

    // 1px per minute of the 00:00 to 20:00 window.
    const columns = getTimeGridColumns();
    for (const column of columns) {
      mockElementBounds(column, { top: 0, height: clientYForTime(0, 20, 20), width: 200 });
    }

    const parts = screen.getAllByRole('button', { name: /Night shift/i });
    expect(parts).to.have.length(2);

    // The July 3 part stops at the 20:00 window edge, so its end can't be resized from there.
    expect(parts[0].querySelector('[data-start]')).not.to.equal(null);
    expect(parts[0].querySelector('[data-end]')).to.equal(null);

    mockElementBounds(parts[0], {
      top: clientYForTime(0, 20, 18),
      height: clientYForTime(0, 20, 2),
    });

    await act(async () => {
      simulateDragAndDrop({
        source: parts[0],
        target: columns[JULY_3_COLUMN_INDEX],
        sourceClientY: clientYForTime(0, 20, 18),
        targetClientY: clientYForTime(0, 20, 19),
      });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    expect(new Date(updatedEvents[0].start).toISOString()).to.equal('2025-07-03T19:00:00.000Z');
    expect(new Date(updatedEvents[0].end).toISOString()).to.equal('2025-07-04T07:00:00.000Z');
  });

  it('should keep the time elapsed between the event start and the cursor when moving an event across a DST transition', async () => {
    // America/New_York springs forward from 02:00 to 03:00 on March 8th, 2026: the column keeps
    // 24 hour rows, so the event, from 01:00 EST to 05:00 EDT, spans 4 rows for 3 hours.
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Night shift')
      .span('2026-03-08T06:00:00Z', '2026-03-08T09:00:00Z')
      .draggable(true)
      .build();

    render(
      <StandaloneWeekView
        events={[event]}
        resources={[]}
        displayTimezone="America/New_York"
        visibleDate={new Date('2026-03-08T12:00:00Z')}
        onEventsChange={handleEventsChange}
      />,
    );

    mockAllTimeGridColumnBounds();
    const eventElement = screen.getByRole('button', { name: /Night shift/i });
    mockElementBounds(eventElement, {
      top: clientYForTime(0, 24, 1),
      height: clientYForTime(0, 24, 4),
    });

    // Grabbed on the 04:00 row, 2 hours after the event start, and dropped on the 10:00 row of
    // the same day, the first column of the week.
    await act(async () => {
      simulateDragAndDrop({
        source: eventElement,
        target: getTimeGridColumns()[0],
        sourceClientY: clientYForTime(0, 24, 4),
        targetClientY: clientYForTime(0, 24, 10),
      });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    expect(new Date(updatedEvents[0].start).toISOString()).to.equal('2026-03-08T12:00:00.000Z'); // 08:00 EDT
    expect(new Date(updatedEvents[0].end).toISOString()).to.equal('2026-03-08T15:00:00.000Z'); // 11:00 EDT
  });

  it('should keep the time elapsed between the event start and the cursor when moving an event starting in the hour repeated by a DST transition', async () => {
    // America/New_York falls back from 02:00 to 01:00 on November 1st, 2026: the event starts in
    // the second 01:00, EST, which renders on the same row as the first one.
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Night shift')
      .span('2026-11-01T06:00:00Z', '2026-11-01T08:00:00Z')
      .draggable(true)
      .build();

    render(
      <StandaloneWeekView
        events={[event]}
        resources={[]}
        displayTimezone="America/New_York"
        visibleDate={new Date('2026-11-01T12:00:00Z')}
        onEventsChange={handleEventsChange}
      />,
    );

    mockAllTimeGridColumnBounds();
    const eventElement = screen.getByRole('button', { name: /Night shift/i });
    // `TimeGridEvent` renders 1px below the start of the event.
    mockElementBounds(eventElement, {
      top: clientYForTime(0, 24, 1) + 1,
      height: clientYForTime(0, 24, 2),
    });

    // Grabbed on the 02:00 row, 1 hour after the event start, and dropped on the 10:00 row of
    // the same day, the first column of the week.
    await act(async () => {
      simulateDragAndDrop({
        source: eventElement,
        target: getTimeGridColumns()[0],
        sourceClientY: clientYForTime(0, 24, 2),
        targetClientY: clientYForTime(0, 24, 10),
      });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    expect(new Date(updatedEvents[0].start).toISOString()).to.equal('2026-11-01T14:00:00.000Z'); // 09:00 EST
    expect(new Date(updatedEvents[0].end).toISOString()).to.equal('2026-11-01T16:00:00.000Z'); // 11:00 EST
  });

  it('should keep the time elapsed between the event start and the cursor when grabbing an event inside the hour repeated by a DST transition', async () => {
    // America/New_York falls back from 02:00 to 01:00 on November 1st, 2026: the event starts in
    // the second 01:00, EST, and is grabbed in that hour, which renders on the same row as the
    // first one.
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Night shift')
      .span('2026-11-01T06:00:00Z', '2026-11-01T08:00:00Z')
      .draggable(true)
      .build();

    render(
      <StandaloneWeekView
        events={[event]}
        resources={[]}
        displayTimezone="America/New_York"
        visibleDate={new Date('2026-11-01T12:00:00Z')}
        onEventsChange={handleEventsChange}
      />,
    );

    mockAllTimeGridColumnBounds();
    const eventElement = screen.getByRole('button', { name: /Night shift/i });
    // `TimeGridEvent` renders 1px below the start of the event.
    mockElementBounds(eventElement, {
      top: clientYForTime(0, 24, 1) + 1,
      height: clientYForTime(0, 24, 2),
    });

    // Grabbed at 01:30 EST, 30 minutes after the event start, and dropped on the 10:00 row of the
    // same day, the first column of the week.
    await act(async () => {
      simulateDragAndDrop({
        source: eventElement,
        target: getTimeGridColumns()[0],
        sourceClientY: clientYForTime(0, 24, 1.5),
        targetClientY: clientYForTime(0, 24, 10),
      });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    expect(new Date(updatedEvents[0].start).toISOString()).to.equal('2026-11-01T14:30:00.000Z'); // 09:30 EST
    expect(new Date(updatedEvents[0].end).toISOString()).to.equal('2026-11-01T16:30:00.000Z'); // 11:30 EST
  });

  it('should drop an event on the row under the cursor when the day starts in the hour repeated by a DST transition', async () => {
    // Europe/Paris falls back from 03:00 to 02:00 on October 25th, 2026: the window starts at the
    // first 02:00, CEST, like the rows of the column.
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Meeting')
      .span('2026-10-25T07:00:00Z', '2026-10-25T08:00:00Z') // 08:00 to 09:00 CET
      .draggable(true)
      .build();

    render(
      <StandaloneWeekView
        events={[event]}
        resources={[]}
        displayTimezone="Europe/Paris"
        visibleDate={new Date('2026-10-25T12:00:00Z')}
        onEventsChange={handleEventsChange}
        viewConfig={{ week: { startTime: 2, endTime: 24 } }}
      />,
    );

    // 1px per minute of the 02:00 to 24:00 window.
    const columns = getTimeGridColumns();
    for (const column of columns) {
      mockElementBounds(column, { top: 0, height: clientYForTime(2, 24, 24), width: 200 });
    }
    const eventElement = screen.getByRole('button', { name: /Meeting/i });
    mockElementBounds(eventElement, {
      top: clientYForTime(2, 24, 8),
      height: clientYForTime(2, 24, 3),
    });

    // Grabbed at its start and dropped on the 10:00 row of the same day, the first column of the
    // week.
    await act(async () => {
      simulateDragAndDrop({
        source: eventElement,
        target: columns[0],
        sourceClientY: clientYForTime(2, 24, 8),
        targetClientY: clientYForTime(2, 24, 10),
      });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    expect(new Date(updatedEvents[0].start).toISOString()).to.equal('2026-10-25T09:00:00.000Z'); // 10:00 CET
    expect(new Date(updatedEvents[0].end).toISOString()).to.equal('2026-10-25T10:00:00.000Z'); // 11:00 CET
  });

  it('should move an all-day event to a different day in the day grid', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('All Day Event')
      .fullDay('2025-07-03')
      .draggable(true)
      .build();

    render(
      <StandaloneWeekView events={[event]} resources={[]} onEventsChange={handleEventsChange} />,
    );

    mockAllTimeGridColumnBounds();

    const eventElement = screen.getByRole('button', { name: /All Day Event/i });
    mockElementBounds(eventElement, { left: 0, width: 100 });
    const dayGridCell = getDayGridCell(4); // July 4

    await act(async () => {
      simulateDragAndDrop({ source: eventElement, target: dayGridCell, sourceClientX: 50 });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    expect(updatedEvents[0].allDay).to.equal(true);
    expect(new Date(updatedEvents[0].start).getUTCDate()).to.equal(4);
  });

  it('should move an all-day event to the time grid on the same day', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('All Day Event')
      .fullDay('2025-07-03')
      .draggable(true)
      .build();

    render(
      <StandaloneWeekView events={[event]} resources={[]} onEventsChange={handleEventsChange} />,
    );

    mockAllTimeGridColumnBounds();

    const eventElement = screen.getByRole('button', { name: /All Day Event/i });
    mockElementBounds(eventElement, { left: 0, width: 100 });
    const columns = getTimeGridColumns();
    const july3Column = columns[JULY_3_COLUMN_INDEX];

    const targetClientY = clientYForTime(0, 24, 14);

    await act(async () => {
      simulateDragAndDrop({
        source: eventElement,
        target: july3Column,
        sourceClientX: 50,
        targetClientY,
      });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    expect(updatedEvents[0].allDay).to.not.equal(true);
  });

  it('should move an all-day event to the time grid on a different day', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('All Day Event')
      .fullDay('2025-07-03')
      .draggable(true)
      .build();

    render(
      <StandaloneWeekView events={[event]} resources={[]} onEventsChange={handleEventsChange} />,
    );

    mockAllTimeGridColumnBounds();

    const eventElement = screen.getByRole('button', { name: /All Day Event/i });
    mockElementBounds(eventElement, { left: 0, width: 100 });
    const columns = getTimeGridColumns();
    const july4Column = columns[JULY_4_COLUMN_INDEX];

    const targetClientY = clientYForTime(0, 24, 14);

    await act(async () => {
      simulateDragAndDrop({
        source: eventElement,
        target: july4Column,
        sourceClientX: 50,
        targetClientY,
      });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    expect(updatedEvents[0].allDay).to.not.equal(true);
    expect(new Date(updatedEvents[0].start).getUTCDate()).to.equal(4);
  });

  it('should resize a time event end to a later time', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Morning Meeting')
      .singleDay('2025-07-03T10:00:00Z', 60)
      .resizable(true)
      .build();

    render(
      <StandaloneWeekView events={[event]} resources={[]} onEventsChange={handleEventsChange} />,
    );

    mockAllTimeGridColumnBounds();

    const eventElement = screen.getByRole('button', { name: /Morning Meeting/i });
    const endHandle = getResizeHandle(eventElement, 'end');
    const columns = getTimeGridColumns();
    const sameColumn = columns[JULY_3_COLUMN_INDEX];

    const targetClientY = clientYForTime(0, 24, 16);

    await act(async () => {
      simulateDragAndDrop({
        source: endHandle,
        target: sameColumn,
        targetClientY,
      });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    // Start should remain at 10:00
    expect(new Date(updatedEvents[0].start).getUTCHours()).to.equal(10);
    // End should have moved later
    const newEndHour = new Date(updatedEvents[0].end).getUTCHours();
    expect(newEndHour).to.not.equal(11);
  });

  it('should resize a time event start to an earlier time', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Morning Meeting')
      .singleDay('2025-07-03T10:00:00Z', 60)
      .resizable(true)
      .build();

    render(
      <StandaloneWeekView events={[event]} resources={[]} onEventsChange={handleEventsChange} />,
    );

    mockAllTimeGridColumnBounds();

    const eventElement = screen.getByRole('button', { name: /Morning Meeting/i });
    const startHandle = getResizeHandle(eventElement, 'start');
    const columns = getTimeGridColumns();
    const sameColumn = columns[JULY_3_COLUMN_INDEX];

    const targetClientY = clientYForTime(0, 24, 8);

    await act(async () => {
      simulateDragAndDrop({
        source: startHandle,
        target: sameColumn,
        targetClientY,
      });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    // Start should have moved earlier
    const newStartHour = new Date(updatedEvents[0].start).getUTCHours();
    expect(newStartHour).to.not.equal(10);
    // End should remain at 11:00
    expect(new Date(updatedEvents[0].end).getUTCHours()).to.equal(11);
  });

  it('should resize an all-day event end to a different day', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Multi Day Event')
      .span('2025-07-03T00:00:00Z', '2025-07-04T23:59:59Z', { allDay: true })
      .resizable(true)
      .build();

    render(
      <StandaloneWeekView events={[event]} resources={[]} onEventsChange={handleEventsChange} />,
    );

    mockAllTimeGridColumnBounds();

    const eventElement = screen.getByRole('button', { name: /Multi Day Event/i });
    mockElementBounds(eventElement, { left: 0, width: 100 });
    const endHandle = getResizeHandle(eventElement, 'end');
    const dayGridCell = getDayGridCell(5); // July 5

    await act(async () => {
      simulateDragAndDrop({ source: endHandle, target: dayGridCell });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    // Start should remain on July 3
    expect(new Date(updatedEvents[0].start).getUTCDate()).to.equal(3);
    // End should have moved
    expect(new Date(updatedEvents[0].end).getUTCDate()).to.not.equal(4);
  });

  it('should resize an all-day event start to a different day', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Multi Day Event')
      .span('2025-07-02T00:00:00Z', '2025-07-04T23:59:59Z', { allDay: true })
      .resizable(true)
      .build();

    render(
      <StandaloneWeekView events={[event]} resources={[]} onEventsChange={handleEventsChange} />,
    );

    mockAllTimeGridColumnBounds();

    const eventElement = screen.getByRole('button', { name: /Multi Day Event/i });
    mockElementBounds(eventElement, { left: 0, width: 100 });
    const startHandle = getResizeHandle(eventElement, 'start');
    const dayGridCell = getDayGridCell(1); // July 1

    await act(async () => {
      simulateDragAndDrop({ source: startHandle, target: dayGridCell });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    // Start should have moved
    expect(new Date(updatedEvents[0].start).getUTCDate()).to.not.equal(2);
    // End should remain on July 4
    expect(new Date(updatedEvents[0].end).getUTCDate()).to.equal(4);
  });
});
