import { describe, it, expect } from 'vitest';
import { createDate } from 'test/utils/scheduler';
import type { SchedulerEvent, SchedulerEventUpdatedProperties } from '../../../models';
import { getCustomEventProperties, getUpdatedEventModelFromChanges } from './SchedulerStore.utils';

describe('getCustomEventProperties', () => {
  it('should return only the properties that are not part of the built-in event shape', () => {
    const model = {
      id: '1',
      title: 'Meeting',
      start: '2025-07-03T09:00:00Z',
      end: '2025-07-03T10:00:00Z',
      priority: 'high',
      tags: ['a', 'b'],
    };
    expect(getCustomEventProperties(model)).to.deep.equal({ priority: 'high', tags: ['a', 'b'] });
  });

  it('should return an empty object when the model only has built-in properties', () => {
    const model = {
      id: '1',
      title: 'Meeting',
      start: '2025-07-03T09:00:00Z',
      end: '2025-07-03T10:00:00Z',
    };
    expect(getCustomEventProperties(model)).to.deep.equal({});
  });

  it('should keep a custom property named __proto__ as an own key', () => {
    // Only JSON.parse produces an own `__proto__` property; a literal would set the prototype.
    const model = JSON.parse('{"id":"1","title":"Meeting","__proto__":{"marker":true}}');
    const custom = getCustomEventProperties(model);
    expect(Object.getOwnPropertyDescriptor(custom, '__proto__')?.value).to.deep.equal({
      marker: true,
    });
    expect(Object.getPrototypeOf(custom)).to.equal(Object.prototype);
  });
});

describe('getUpdatedEventModelFromChanges', () => {
  it('should persist a custom property named __proto__ without touching the prototype', () => {
    const oldModel = {
      id: '1',
      title: 'Meeting',
      start: '2025-07-03T09:00:00Z',
      end: '2025-07-03T10:00:00Z',
    };
    const changes = JSON.parse(
      '{"id":"1","__proto__":{"marker":true}}',
    ) as SchedulerEventUpdatedProperties;
    const updated = getUpdatedEventModelFromChanges(
      oldModel,
      changes,
      undefined,
      oldModel as SchedulerEvent,
      'default',
    );
    expect(Object.getOwnPropertyDescriptor(updated, '__proto__')?.value).to.deep.equal({
      marker: true,
    });
    expect(Object.getPrototypeOf(updated)).to.equal(Object.prototype);
  });

  it('should keep the instant of a date with an offset in a repeated hour', () => {
    // 02:30+01:00 is the second 02:30 of the DST transition in Paris.
    const oldModel = {
      id: '1',
      title: 'Meeting',
      start: '2025-10-26T02:30:00+01:00',
      end: '2025-10-26T03:30:00+01:00',
      timezone: 'Europe/Paris',
    };
    const updated = getUpdatedEventModelFromChanges(
      oldModel,
      { id: '1', start: new Date('2025-10-26T02:45:00+01:00') },
      undefined,
      oldModel as SchedulerEvent,
      'default',
    );
    expect(updated.start).to.equal('2025-10-26T01:45:00.000Z');
  });

  it('should keep the days of its timezone for a timed event made all-day without bounds', () => {
    // 23:00 in New York on July 4th is 12:00 in Tokyo on July 5th: the event stays on July 4th.
    const oldModel: SchedulerEvent = {
      id: '1',
      title: 'Meeting',
      start: '2025-07-04T23:00:00',
      end: '2025-07-05T00:00:00',
      timezone: 'America/New_York',
    };
    const updated = getUpdatedEventModelFromChanges(
      oldModel,
      { id: '1', allDay: true },
      undefined,
      oldModel as SchedulerEvent,
      'Asia/Tokyo',
    );
    expect(updated.allDay).to.equal(true);
    expect(updated.start).to.equal('2025-07-04');
    expect(updated.end).to.equal('2025-07-05');
  });

  it('should keep the timezone given with the changes of an all-day event made timed', () => {
    const oldModel: SchedulerEvent = {
      id: '1',
      title: 'Trip',
      start: '2025-07-04',
      end: '2025-07-05',
      allDay: true,
      timezone: 'America/New_York',
    };
    const updated = getUpdatedEventModelFromChanges(
      oldModel,
      {
        id: '1',
        allDay: false,
        timezone: 'Europe/Paris',
        start: createDate('2025-07-04T09:00:00', 'Asia/Tokyo'),
        end: createDate('2025-07-04T10:00:00', 'Asia/Tokyo'),
      },
      undefined,
      oldModel as SchedulerEvent,
      'Asia/Tokyo',
    );
    // The wall times are written in the display timezone and read in the given one.
    expect(updated.timezone).to.equal('Europe/Paris');
    expect(updated.start).to.equal('2025-07-04T09:00:00');
  });

  it('should write the UNTIL of an RRULE string of an all-day event made timed as its date', () => {
    // 03:00 UTC on July 9th is July 8th in New York, the last day of the series.
    const oldModel: SchedulerEvent = {
      id: '1',
      title: 'Trip',
      start: '2025-07-04',
      end: '2025-07-05',
      allDay: true,
      timezone: 'America/New_York',
      rrule: 'FREQ=DAILY;UNTIL=20250709T030000Z',
    };
    const updated = getUpdatedEventModelFromChanges(
      oldModel,
      { id: '1', allDay: false },
      undefined,
      oldModel as SchedulerEvent,
      'Asia/Tokyo',
    );
    expect(updated.rrule).to.equal('FREQ=DAILY;UNTIL=20250708');
  });

  it('should snap the missing bound of a timed event made all-day with only its start', () => {
    // 23:00 in New York on July 4th is 12:00 in Tokyo on July 5th.
    const oldModel: SchedulerEvent = {
      id: '1',
      title: 'Meeting',
      start: '2025-07-04T23:00:00',
      end: '2025-07-04T23:30:00',
      timezone: 'America/New_York',
    };
    const updated = getUpdatedEventModelFromChanges(
      oldModel,
      { id: '1', allDay: true, start: createDate('2025-07-05T00:00:00', 'Asia/Tokyo') },
      undefined,
      oldModel as SchedulerEvent,
      'Asia/Tokyo',
    );
    expect(updated.start).to.equal('2025-07-05');
    expect(updated.end).to.equal('2025-07-06');
  });

  it('should keep the days of the exceptions of a timed series made all-day in its timezone', () => {
    const oldModel: SchedulerEvent = {
      id: '1',
      title: 'Standup',
      start: '2025-07-04T23:00:00',
      end: '2025-07-05T00:00:00',
      timezone: 'America/New_York',
      rrule: { freq: 'DAILY' as const },
      exDates: ['2025-07-06T23:00:00'],
    };
    const updated = getUpdatedEventModelFromChanges(
      oldModel,
      { id: '1', allDay: true },
      undefined,
      oldModel as SchedulerEvent,
      'Asia/Tokyo',
    );
    // The excluded July 6th at 23:00 in New York (July 7th in Tokyo) stays July 6th.
    expect(updated.exDates).to.deep.equal(['2025-07-06']);
  });
});
