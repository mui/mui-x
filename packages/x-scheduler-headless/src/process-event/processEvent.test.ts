import { adapter } from 'test/utils/scheduler/adapters';
import { processEvent } from '@mui/x-scheduler-headless/process-event';
import { EventBuilder } from 'test/utils/scheduler/event-builder';

describe('processEvent', () => {
  it('keeps event timezone in modelInBuiltInFormat', () => {
    const event = EventBuilder.new(adapter)
      .withDataTimezone('America/New_York')
      .span('2025-01-01T10:00:00Z', '2025-01-01T12:00:00Z')
      .build();

    const processed = processEvent(event, 'Pacific/Kiritimati', adapter);

    expect(processed.modelInBuiltInFormat!.timezone).to.equal('America/New_York');
  });
  describe('displayTimezone', () => {
    it('converts start and end to the display timezone', () => {
      const event = EventBuilder.new(adapter)
        .span('2025-01-01T10:00:00Z', '2025-01-01T12:00:00Z')
        .build();

      const processed = processEvent(event, 'Pacific/Kiritimati', adapter);
      expect(adapter.getTimezone(processed.displayTimezone.start.value)).to.equal(
        'Pacific/Kiritimati',
      );
      expect(adapter.getTimezone(processed.displayTimezone.end.value)).to.equal(
        'Pacific/Kiritimati',
      );
      expect(processed.displayTimezone.start.toString()).to.not.equal(event.start.toString());
      expect(processed.displayTimezone.end.toString()).to.not.equal(event.end.toString());
    });

    it('converts exDates to the display timezone', () => {
      const event = EventBuilder.new(adapter).exDates(['2025-01-05T00:00:00Z']).build();
      const processed = processEvent(event, 'America/New_York', adapter);

      expect(processed.displayTimezone.exDates).to.have.length(1);
      expect(adapter.getTimezone(processed.displayTimezone.exDates![0])).to.equal(
        'America/New_York',
      );
    });

    it('converts rrule.until to the display timezone when rrule is an object', () => {
      const event = EventBuilder.new(adapter)
        .rrule({
          freq: 'DAILY',
          until: adapter.date('2025-01-10T23:59:00Z', 'default'),
        })
        .build();

      const processed = processEvent(event, 'Asia/Tokyo', adapter);

      expect(adapter.getTimezone(processed.displayTimezone.rrule!.until!)).to.equal('Asia/Tokyo');
    });

    it('parses rrule string and applies timezone conversion to UNTIL', () => {
      const event = EventBuilder.new(adapter).build();

      const processed = processEvent(
        {
          ...event,
          rrule: 'FREQ=DAILY;UNTIL=20250110T230000Z',
        },
        'Pacific/Kiritimati',
        adapter,
      );

      expect(adapter.getTimezone(processed.displayTimezone.rrule!.until!)).to.equal(
        'Pacific/Kiritimati',
      );
    });
  });
  describe('dataTimezone', () => {
    it('keeps original timezone in dataTimezone', () => {
      const event = EventBuilder.new(adapter)
        .withDataTimezone('America/New_York')
        .span('2025-01-01T10:00:00Z', '2025-01-01T12:00:00Z')
        .build();

      const processed = processEvent(event, 'Pacific/Kiritimati', adapter);

      expect(processed.dataTimezone.timezone).to.equal('America/New_York');
    });
  });
});
