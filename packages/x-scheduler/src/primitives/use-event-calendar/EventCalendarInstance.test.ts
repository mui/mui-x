import { spy } from 'sinon';
import { getAdapter } from '../utils/adapter/getAdapter';
import { EventCalendarInstance } from './EventCalendarInstance';

const DEFAULT_PARAMS = { events: [] };

describe('EventCalendarInstance', () => {
  const adapter = getAdapter();

  describe('Method: goToPreviousVisibleDate', () => {
    it('should respect the date returned by setSiblingVisibleDateGetter', () => {
      const onVisibleDateChange = spy();
      const targetDate = adapter.date('2025-07-03T00:00:00Z');
      const siblingVisibleDateGetter = spy(() => targetDate);

      const { instance } = EventCalendarInstance.create(
        {
          ...DEFAULT_PARAMS,
          view: 'day',
          visibleDate: adapter.date('2025-07-01T00:00:00Z'),
          onVisibleDateChange,
        },
        adapter,
      );

      instance.setViewConfig({ siblingVisibleDateGetter });
      instance.goToPreviousVisibleDate({} as any);
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(targetDate);
      expect(siblingVisibleDateGetter.lastCall.lastArg).toEqual(-1);
    });
  });

  describe('Method: goToNextVisibleDate', () => {
    it('should respect the date returned by setSiblingVisibleDateGetter', () => {
      const onVisibleDateChange = spy();
      const targetDate = adapter.date('2025-07-03T00:00:00Z');
      const siblingVisibleDateGetter = spy(() => targetDate);

      const { instance } = EventCalendarInstance.create(
        {
          ...DEFAULT_PARAMS,
          view: 'day',
          visibleDate: adapter.date('2025-07-01T00:00:00Z'),
          onVisibleDateChange,
        },
        adapter,
      );

      instance.setViewConfig({ siblingVisibleDateGetter });
      instance.goToNextVisibleDate({} as any);
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(targetDate);
      expect(siblingVisibleDateGetter.lastCall.lastArg).toEqual(1);
    });
  });
});
