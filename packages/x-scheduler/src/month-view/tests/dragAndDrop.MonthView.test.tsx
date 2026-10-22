import { screen, act } from '@mui/internal-test-utils';
import {
  createSchedulerRenderer,
  EventBuilder,
  getMonthViewCell,
  simulateDragAndDrop,
  mockElementBounds,
  getResizeHandle,
  setSystemTimezone,
} from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { StandaloneMonthView } from '@mui/x-scheduler/month-view';
import { vi, describe, it, expect } from 'vitest';

describe('MonthView - Drag and Drop', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03Z') });

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

  it('should move a timed multi-day event by the day under the pointer', async () => {
    const handleEventsChange = vi.fn();
    // Monday 10:00 to Wednesday 09:00: the event covers the 3 cells of these dates.
    const event = EventBuilder.new()
      .id('event-1')
      .title('Trip')
      .span('2025-07-07T10:00:00Z', '2025-07-09T09:00:00Z')
      .draggable(true)
      .build();

    render(
      <StandaloneMonthView
        events={[event]}
        resources={[]}
        displayTimezone="UTC"
        onEventsChange={handleEventsChange}
      />,
    );

    const eventElement = screen.getAllByRole('button', { name: /Trip/i })[0];
    mockElementBounds(eventElement, { left: 0, width: 300 });

    // Grab the Wednesday part and drop it on Thursday: the event moves by one day.
    await act(async () => {
      simulateDragAndDrop({
        source: eventElement,
        target: getMonthViewCell(10),
        sourceClientX: 250,
      });
    });

    const updatedEvents = handleEventsChange.mock.calls[0][0];
    expect(updatedEvents[0].start).to.equal('2025-07-08T10:00:00.000Z');
    expect(updatedEvents[0].end).to.equal('2025-07-10T09:00:00.000Z');
  });

  // Browsers cannot change their timezone through process.env.TZ.
  it.skipIf(!isJSDOM)(
    'should move an event onto a repeated hour at its first instant, whatever the timezone of the system',
    async () => {
      // Europe/Paris falls back from 03:00 to 02:00 on October 25th, 2026: 02:30 comes twice.
      setSystemTimezone('America/New_York');
      const handleEventsChange = vi.fn();
      const event = EventBuilder.new()
        .id('event-1')
        .title('Backup')
        .span('2026-10-24T00:30:00Z', '2026-10-24T00:45:00Z') // 02:30 CEST
        .draggable(true)
        .build();

      render(
        <StandaloneMonthView
          events={[event]}
          resources={[]}
          displayTimezone="Europe/Paris"
          visibleDate={new Date('2026-10-15T12:00:00Z')}
          onEventsChange={handleEventsChange}
        />,
      );

      const eventElement = screen.getAllByRole('button', { name: /Backup/i })[0];
      mockElementBounds(eventElement, { left: 0, width: 100 });

      await act(async () => {
        simulateDragAndDrop({
          source: eventElement,
          target: getMonthViewCell(25),
          sourceClientX: 50,
        });
      });

      const updatedEvents = handleEventsChange.mock.calls[0][0];
      expect(updatedEvents[0].start).to.equal('2026-10-25T00:30:00.000Z'); // the first 02:30
    },
  );

  // Browsers cannot change their timezone through process.env.TZ.
  it.skipIf(!isJSDOM)(
    'should move an event onto a day whose midnight a DST transition skips',
    async () => {
      // America/Havana springs forward from 00:00 to 01:00 on March 8th, 2026: the day starts at 01:00.
      setSystemTimezone('UTC');
      const handleEventsChange = vi.fn();
      const event = EventBuilder.new()
        .id('event-1')
        .title('Lunch')
        .span('2026-03-09T16:00:00Z', '2026-03-09T17:00:00Z') // 12:00 to 13:00 CDT
        .draggable(true)
        .build();

      render(
        <StandaloneMonthView
          events={[event]}
          resources={[]}
          displayTimezone="America/Havana"
          visibleDate={new Date('2026-03-15T12:00:00Z')}
          onEventsChange={handleEventsChange}
        />,
      );

      const eventElement = screen.getAllByRole('button', { name: /Lunch/i })[0];
      mockElementBounds(eventElement, { left: 0, width: 100 });

      await act(async () => {
        simulateDragAndDrop({
          source: eventElement,
          target: getMonthViewCell(8),
          sourceClientX: 50,
        });
      });

      const updatedEvents = handleEventsChange.mock.calls[0][0];
      expect(updatedEvents[0].start).to.equal('2026-03-08T16:00:00.000Z');
      expect(updatedEvents[0].end).to.equal('2026-03-08T17:00:00.000Z');
    },
  );
});
