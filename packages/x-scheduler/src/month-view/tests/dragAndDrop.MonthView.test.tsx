import { screen, act } from '@mui/internal-test-utils';
import {
  createSchedulerRenderer,
  cancelDrag,
  EventBuilder,
  getMonthViewCell,
  simulateDragAndDrop,
  mockElementBounds,
  getResizeHandle,
} from 'test/utils/scheduler';
import { StandaloneMonthView } from '@mui/x-scheduler/month-view';
import { vi, describe, it, expect, afterEach } from 'vitest';

describe('MonthView - Drag and Drop', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03Z') });
  afterEach(cancelDrag);

  it('keeps multi-day previews in each week crossed by the dragged occurrence', async () => {
    const event = EventBuilder.new()
      .title('Multi-week preview')
      .span('2025-07-03T00:00:00Z', '2025-07-05T23:59:59Z', { allDay: true })
      .draggable(true)
      .build();
    render(<StandaloneMonthView events={[event]} resources={[]} canDropEventsToTheOutside />);
    const source = screen.getByRole('button', { name: /Multi-week preview/i });
    mockElementBounds(source, { left: 0, width: 300 });
    await act(async () => {
      simulateDragAndDrop({ source, target: getMonthViewCell(5), sourceClientX: 50, hold: true });
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
    });
    const placeholders = document.querySelectorAll('.MuiEventCalendar-dayGridEventPlaceholder');
    expect(placeholders).toHaveLength(2);
    expect(placeholders[0].closest('[role="row"]')).not.toBe(
      placeholders[1].closest('[role="row"]'),
    );
    for (const placeholder of placeholders) {
      expect(placeholder.textContent).toContain('Multi-week preview');
    }
    cancelDrag();
    expect(document.querySelectorAll('.MuiEventCalendar-dayGridEventPlaceholder')).toHaveLength(0);
  });

  it('should move an all-day event to a different day', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Conference')
      .fullDay('2025-07-03')
      .draggable(true)
      .build();

    render(
      <StandaloneMonthView events={[event]} resources={[]} onEventsChange={handleEventsChange} />,
    );

    const eventElement = screen.getByRole('button', { name: /Conference/i });
    mockElementBounds(eventElement, { left: 0, width: 100 });
    const targetCell = getMonthViewCell(5); // July 5

    await act(async () => {
      simulateDragAndDrop({ source: eventElement, target: targetCell, sourceClientX: 50 });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    expect(new Date(updatedEvents[0].start).getUTCDate()).to.equal(5);
  });

  it('should move a multi-day event to a different day', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Multi Day Conference')
      .span('2025-07-03T00:00:00Z', '2025-07-05T23:59:59Z', { allDay: true })
      .draggable(true)
      .build();

    render(
      <StandaloneMonthView events={[event]} resources={[]} onEventsChange={handleEventsChange} />,
    );

    const eventElement = screen.getByRole('button', { name: /Multi Day Conference/i });
    mockElementBounds(eventElement, { left: 0, width: 100 });
    const targetCell = getMonthViewCell(7); // July 7

    await act(async () => {
      simulateDragAndDrop({ source: eventElement, target: targetCell, sourceClientX: 50 });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    // The event should have shifted forward by the offset
    const newStart = new Date(updatedEvents[0].start);
    const newEnd = new Date(updatedEvents[0].end);
    expect(newStart.getUTCDate()).to.not.equal(3);
    // Duration should be preserved (3 days)
    const durationDays = Math.round(
      (newEnd.getTime() - newStart.getTime()) / (1000 * 60 * 60 * 24),
    );
    expect(durationDays).to.be.greaterThanOrEqual(2); // ~3 day span
  });

  it('should resize a multi-day event end to a later day', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Multi Day Conference')
      .span('2025-07-03T00:00:00Z', '2025-07-05T23:59:59Z', { allDay: true })
      .resizable(true)
      .build();

    render(
      <StandaloneMonthView events={[event]} resources={[]} onEventsChange={handleEventsChange} />,
    );

    const eventElement = screen.getByRole('button', { name: /Multi Day Conference/i });
    mockElementBounds(eventElement, { left: 0, width: 100 });
    const endHandle = getResizeHandle(eventElement, 'end');
    const targetCell = getMonthViewCell(7); // July 7

    await act(async () => {
      simulateDragAndDrop({ source: endHandle, target: targetCell });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    // Start should remain on July 3
    expect(new Date(updatedEvents[0].start).getUTCDate()).to.equal(3);
    // End should have moved later
    expect(new Date(updatedEvents[0].end).getUTCDate()).to.not.equal(5);
  });

  it('should resize a multi-day event start to an earlier day', async () => {
    const handleEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Multi Day Conference')
      .span('2025-07-03T00:00:00Z', '2025-07-05T23:59:59Z', { allDay: true })
      .resizable(true)
      .build();

    render(
      <StandaloneMonthView events={[event]} resources={[]} onEventsChange={handleEventsChange} />,
    );

    const eventElement = screen.getByRole('button', { name: /Multi Day Conference/i });
    mockElementBounds(eventElement, { left: 0, width: 100 });
    const startHandle = getResizeHandle(eventElement, 'start');
    const targetCell = getMonthViewCell(2); // July 2

    await act(async () => {
      simulateDragAndDrop({ source: startHandle, target: targetCell });
    });

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = handleEventsChange.mock.calls[0][0];
    // Start should have moved earlier
    expect(new Date(updatedEvents[0].start).getUTCDate()).to.not.equal(3);
    // End should remain on July 5
    expect(new Date(updatedEvents[0].end).getUTCDate()).to.equal(5);
  });
});
