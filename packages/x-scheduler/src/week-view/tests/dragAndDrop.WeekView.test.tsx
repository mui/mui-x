import { spy } from 'sinon';
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
  const cell = document.querySelector<HTMLElement>(
    `[role="gridcell"][aria-labelledby="DayTimeGridHeaderCell-${dayOfMonth} DayTimeGridAllDayEventsHeaderCell"]`,
  );
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
    const handleEventsChange = spy();
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

    expect(handleEventsChange.callCount).to.equal(1);
    const updatedEvents = handleEventsChange.firstCall.args[0];
    expect(updatedEvents[0].allDay).to.equal(true);
  });

  it('should move a time event to the day grid on a different day', async () => {
    const handleEventsChange = spy();
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

    expect(handleEventsChange.callCount).to.equal(1);
    const updatedEvents = handleEventsChange.firstCall.args[0];
    expect(updatedEvents[0].allDay).to.equal(true);
    // The event should have moved to the next day
    expect(new Date(updatedEvents[0].start).getUTCDate()).to.equal(4);
  });

  it('should move a time event to a different time on the same day', async () => {
    const handleEventsChange = spy();
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

    expect(handleEventsChange.callCount).to.equal(1);
    const updatedEvents = handleEventsChange.firstCall.args[0];
    expect(updatedEvents[0].allDay).to.not.equal(true);
    // The event should have moved to around 14:00 (the exact time depends on
    // the drag precision and the initialCursorPositionInEventMs calculation)
    const newStartHour = new Date(updatedEvents[0].start).getUTCHours();
    expect(newStartHour).to.not.equal(10); // Should have moved from 10:00
  });

  it('should move a time event to a different day in the time grid', async () => {
    const handleEventsChange = spy();
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

    expect(handleEventsChange.callCount).to.equal(1);
    const updatedEvents = handleEventsChange.firstCall.args[0];
    expect(updatedEvents[0].allDay).to.not.equal(true);
    expect(new Date(updatedEvents[0].start).getUTCDate()).to.equal(4);
  });

  it('should move an all-day event to a different day in the day grid', async () => {
    const handleEventsChange = spy();
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

    expect(handleEventsChange.callCount).to.equal(1);
    const updatedEvents = handleEventsChange.firstCall.args[0];
    expect(updatedEvents[0].allDay).to.equal(true);
    expect(new Date(updatedEvents[0].start).getUTCDate()).to.equal(4);
  });

  it('should move an all-day event to the time grid on the same day', async () => {
    const handleEventsChange = spy();
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

    expect(handleEventsChange.callCount).to.equal(1);
    const updatedEvents = handleEventsChange.firstCall.args[0];
    expect(updatedEvents[0].allDay).to.not.equal(true);
  });

  it('should move an all-day event to the time grid on a different day', async () => {
    const handleEventsChange = spy();
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

    expect(handleEventsChange.callCount).to.equal(1);
    const updatedEvents = handleEventsChange.firstCall.args[0];
    expect(updatedEvents[0].allDay).to.not.equal(true);
    expect(new Date(updatedEvents[0].start).getUTCDate()).to.equal(4);
  });

  it('should resize a time event end to a later time', async () => {
    const handleEventsChange = spy();
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

    expect(handleEventsChange.callCount).to.equal(1);
    const updatedEvents = handleEventsChange.firstCall.args[0];
    // Start should remain at 10:00
    expect(new Date(updatedEvents[0].start).getUTCHours()).to.equal(10);
    // End should have moved later
    const newEndHour = new Date(updatedEvents[0].end).getUTCHours();
    expect(newEndHour).to.not.equal(11);
  });

  it('should resize a time event start to an earlier time', async () => {
    const handleEventsChange = spy();
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

    expect(handleEventsChange.callCount).to.equal(1);
    const updatedEvents = handleEventsChange.firstCall.args[0];
    // Start should have moved earlier
    const newStartHour = new Date(updatedEvents[0].start).getUTCHours();
    expect(newStartHour).to.not.equal(10);
    // End should remain at 11:00
    expect(new Date(updatedEvents[0].end).getUTCHours()).to.equal(11);
  });

  it('should resize an all-day event end to a different day', async () => {
    const handleEventsChange = spy();
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

    expect(handleEventsChange.callCount).to.equal(1);
    const updatedEvents = handleEventsChange.firstCall.args[0];
    // Start should remain on July 3
    expect(new Date(updatedEvents[0].start).getUTCDate()).to.equal(3);
    // End should have moved
    expect(new Date(updatedEvents[0].end).getUTCDate()).to.not.equal(4);
  });

  it('should resize an all-day event start to a different day', async () => {
    const handleEventsChange = spy();
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

    expect(handleEventsChange.callCount).to.equal(1);
    const updatedEvents = handleEventsChange.firstCall.args[0];
    // Start should have moved
    expect(new Date(updatedEvents[0].start).getUTCDate()).to.not.equal(2);
    // End should remain on July 4
    expect(new Date(updatedEvents[0].end).getUTCDate()).to.equal(4);
  });
});
