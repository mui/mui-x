import { adapter } from 'test/utils/scheduler/adapters';
import { processEvent } from '@mui/x-scheduler-headless/process-event';
import { EventBuilder } from 'test/utils/scheduler/event-builder';

describe('processEvent', () => {
  it('converts start and end to the display timezone', () => {
    const event = EventBuilder.new(adapter)
      .span('2025-01-01T10:00:00Z', '2025-01-01T12:00:00Z')
      .build();

    const processed = processEvent(event, 'Pacific/Kiritimati', adapter);
    expect(adapter.getTimezone(processed.start.value)).to.equal('Pacific/Kiritimati');
    expect(adapter.getTimezone(processed.end.value)).to.equal('Pacific/Kiritimati');
    expect(processed.start.toString()).to.not.equal(event.start.toString());
    expect(processed.end.toString()).to.not.equal(event.end.toString());
  });

  it('keeps original timezone in modelInBuiltInFormat', () => {
    const event = EventBuilder.new(adapter)
      .withTimezone('America/New_York')
      .span('2025-01-01T10:00:00Z', '2025-01-01T12:00:00Z')
      .build();

    const processed = processEvent(event, 'Pacific/Kiritimati', adapter);

    expect(adapter.getTimezone(processed.modelInBuiltInFormat!.start)).to.equal('America/New_York');
    expect(adapter.getTimezone(processed.modelInBuiltInFormat!.end)).to.equal('America/New_York');
  });

  it('throws if start and end have different timezones', () => {
    const event = EventBuilder.new(adapter)
      .span('2025-01-01T10:00:00Z', '2025-01-01T11:00:00Z')
      .build();
    event.end = adapter.setTimezone(event.end, 'America/New_York');

    expect(() => processEvent(event, 'Asia/Tokyo', adapter)).to.throw(/different timezones/);
  });

  it('converts exDates to the display timezone', () => {
    const event = EventBuilder.new(adapter).exDates(['2025-01-05T00:00:00Z']).build();
    const processed = processEvent(event, 'America/New_York', adapter);

    expect(processed.exDates).to.have.length(1);
    expect(adapter.getTimezone(processed.exDates![0])).to.equal('America/New_York');
  });

  it('converts rrule.until to the display timezone when rrule is an object', () => {
    const event = EventBuilder.new(adapter)
      .rrule({
        freq: 'DAILY',
        until: adapter.date('2025-01-10T23:59:00Z', 'default'),
      })
      .build();

    const processed = processEvent(event, 'Asia/Tokyo', adapter);

    expect(adapter.getTimezone(processed.rrule!.until!)).to.equal('Asia/Tokyo');
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

    expect(adapter.getTimezone(processed.rrule!.until!)).to.equal('Pacific/Kiritimati');
  });
});
