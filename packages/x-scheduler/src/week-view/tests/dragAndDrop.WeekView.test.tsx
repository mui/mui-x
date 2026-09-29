import { screen, act } from '@mui/internal-test-utils';
import {
  createSchedulerRenderer,
  cancelDrag,
  EventBuilder,
  simulateDragAndDrop,
  mockElementBounds,
  clientYForTime,
  getResizeHandle,
} from 'test/utils/scheduler';
import { StandaloneWeekView } from '@mui/x-scheduler/week-view';
import { vi, describe, it, expect, afterEach } from 'vitest';

/**
 * Returns all time grid column drop targets (`[data-drop-target]`)
 * in DOM order (one per day of the rendered week).
 */
function getTimeGridColumns(): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>(`.MuiEventCalendar-dayTimeGridGrid [data-drop-target]`),
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
  afterEach(cancelDrag);
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03Z') });

  it('should discard the event move when the pointer gesture is canceled', async () => {
    const onEventsChange = vi.fn();
    const event = EventBuilder.new()
      .title('Canceled meeting')
      .singleDay('2025-07-03T10:00:00Z', 60)
      .draggable(true)
      .build();
    render(<StandaloneWeekView events={[event]} resources={[]} onEventsChange={onEventsChange} />);
    mockAllTimeGridColumnBounds();
    await act(async () => {
      simulateDragAndDrop({
        source: screen.getByRole('button', { name: /Canceled meeting/i }),
        target: getDayGridCell(4),
        hold: true,
      });
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
    });
    expect(document.querySelector('.MuiEventCalendar-dayGridEventPlaceholder')).not.toBe(null);
    cancelDrag();
    expect(document.querySelector('.MuiEventCalendar-dayGridEventPlaceholder')).toBe(null);
    expect(onEventsChange).not.toHaveBeenCalled();
    expect(
      screen.getByRole('button', { name: /Canceled meeting/i }).hasAttribute('data-dragging'),
    ).toBe(false);
  });

  it('should discard the resize placeholder when the pointer gesture is canceled', async () => {
    const onEventsChange = vi.fn();
    const event = EventBuilder.new()
      .title('Canceled resize')
      .singleDay('2025-07-03T10:00:00Z', 60)
      .resizable(true)
      .build();
    render(<StandaloneWeekView events={[event]} resources={[]} onEventsChange={onEventsChange} />);
    mockAllTimeGridColumnBounds();
    const eventElement = screen.getByRole('button', { name: /Canceled resize/i });
    await act(async () => {
      simulateDragAndDrop({
        source: getResizeHandle(eventElement, 'end'),
        target: getTimeGridColumns()[JULY_3_COLUMN_INDEX],
        targetClientY: clientYForTime(0, 24, 16),
        hold: true,
      });
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
    });
    expect(document.querySelector('.MuiEventCalendar-timeGridEventPlaceholder')).not.toBe(null);
    await act(async () => cancelDrag());
    expect(onEventsChange).not.toHaveBeenCalled();
    expect(document.querySelector('.MuiEventCalendar-timeGridEventPlaceholder')).toBe(null);
    expect(
      screen.getByRole('button', { name: /Canceled resize/i }).hasAttribute('data-resizing'),
    ).toBe(false);
  });

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

  it('should give an all-day event dropped in the time grid the default event duration', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('All Day Event')
      .fullDay('2025-07-03')
      .draggable(true)
      .build();

    render(
      <StandaloneWeekView
        events={[event]}
        resources={[]}
        eventCreation={{ duration: 90 }}
        onEventsChange={handleEventsChange}
      />,
    );

    mockAllTimeGridColumnBounds();

    const eventElement = screen.getByRole('button', { name: /All Day Event/i });
    mockElementBounds(eventElement, { left: 0, width: 100 });

    await act(async () => {
      simulateDragAndDrop({
        source: eventElement,
        target: getTimeGridColumns()[JULY_3_COLUMN_INDEX],
        sourceClientX: 50,
        targetClientY: clientYForTime(0, 24, 14),
      });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvent = handleEventsChange.mock.calls[0][0][0];
    expect(new Date(updatedEvent.start).toISOString()).to.equal('2025-07-03T14:00:00.000Z');
    expect(new Date(updatedEvent.end).toISOString()).to.equal('2025-07-03T15:30:00.000Z');
  });

  it('should start an all-day event dropped at the end of a day one slot before the day ends', async () => {
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

    await act(async () => {
      simulateDragAndDrop({
        source: eventElement,
        target: getTimeGridColumns()[JULY_3_COLUMN_INDEX],
        sourceClientX: 50,
        targetClientY: 1440,
      });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    // The last quarter of the day: the event starts where the grid still renders it.
    expect(new Date(handleEventsChange.mock.calls[0][0][0].start).toISOString()).to.equal(
      '2025-07-03T23:45:00.000Z',
    );
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

  it('should commit a mouse resize that ends within a few pixels of where it started', async () => {
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

    // Ten minutes per pixel: a few pixels are half an hour.
    for (const column of getTimeGridColumns()) {
      mockElementBounds(column, { top: 0, height: 144, width: 200 });
    }

    // The event spans 10:00 to 11:00, and the pointer grabs its bottom edge.
    const eventElement = screen.getByRole('button', { name: /Morning Meeting/i });
    mockElementBounds(eventElement, { top: 60, height: 6, width: 100 });

    await act(async () => {
      simulateDragAndDrop({
        source: getResizeHandle(eventElement, 'end'),
        target: getTimeGridColumns()[JULY_3_COLUMN_INDEX],
        sourceClientY: 66,
        targetClientY: 69,
      });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    expect(new Date(handleEventsChange.mock.calls[0][0][0].end).toISOString()).to.equal(
      '2025-07-03T11:30:00.000Z',
    );
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
