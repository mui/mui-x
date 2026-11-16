import { describe, it, expect } from 'vitest';
import type { SchedulerEventUpdatedProperties } from '../../../models';
import { processEvent } from '../../../process-event';
import { BaseTemporal } from '../base-temporal';
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
      processEvent(oldModel, 'UTC'),
    );
    expect(Object.getOwnPropertyDescriptor(updated, '__proto__')?.value).to.deep.equal({
      marker: true,
    });
    expect(Object.getPrototypeOf(updated)).to.equal(Object.prototype);
  });

  it('should keep the string of an unchanged date in a repeated hour', () => {
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
      {
        id: '1',
        start: BaseTemporal.PlainDateTime.from('2025-10-26T02:30'),
        end: BaseTemporal.PlainDateTime.from('2025-10-26T03:45'),
      },
      undefined,
      processEvent(oldModel, 'Europe/Paris'),
    );
    expect(updated.start).to.equal('2025-10-26T02:30:00+01:00');
    expect(updated.end).to.equal('2025-10-26T02:45:00.000Z');
  });
});
