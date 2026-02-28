import { adapter, storeClasses } from 'test/utils/scheduler';
import { schedulerOtherSelectors } from './schedulerOtherSelectors';

storeClasses.forEach((storeClass) => {
  describe(`schedulerOtherSelectors - ${storeClass.name}`, () => {
    describe('visibleDate', () => {
      it('should return the visibleDate with the default display timezone applied', () => {
        const visibleDate = adapter.date('2025-07-03T00:00:00Z', 'default');
        const state = new storeClass.Value({ events: [], visibleDate }, adapter).state;
        const result = schedulerOtherSelectors.visibleDate(state);

        expect(result).toEqualDateTime(visibleDate);
      });

      it('should apply the configured display timezone to the visibleDate', () => {
        const visibleDate = adapter.date('2025-07-03T12:00:00Z', 'default');
        const state = new storeClass.Value(
          { events: [], visibleDate, displayTimezone: 'America/New_York' },
          adapter,
        ).state;
        const result = schedulerOtherSelectors.visibleDate(state);

        // The result should have the timezone applied
        expect(adapter.getTimezone(result)).to.equal('America/New_York');
      });

      it('should return same reference when inputs have not changed', () => {
        const visibleDate = adapter.date('2025-07-03T00:00:00Z', 'default');
        const state = new storeClass.Value({ events: [], visibleDate }, adapter).state;
        const result1 = schedulerOtherSelectors.visibleDate(state);
        const result2 = schedulerOtherSelectors.visibleDate(state);

        expect(result1).to.equal(result2);
      });

      it('should return a new reference when visibleDate changes', () => {
        const visibleDate = adapter.date('2025-07-03T00:00:00Z', 'default');
        const store = new storeClass.Value({ events: [], visibleDate }, adapter);
        const result1 = schedulerOtherSelectors.visibleDate(store.state);

        const newVisibleDate = adapter.date('2025-07-04T00:00:00Z', 'default');
        store.updateStateFromParameters({ events: [], visibleDate: newVisibleDate }, adapter);
        const result2 = schedulerOtherSelectors.visibleDate(store.state);

        expect(result1).to.not.equal(result2);
        expect(result2).toEqualDateTime(newVisibleDate);
      });

      it('should return a new reference when display timezone changes', () => {
        const visibleDate = adapter.date('2025-07-03T12:00:00Z', 'default');
        const store = new storeClass.Value(
          { events: [], visibleDate, displayTimezone: 'default' },
          adapter,
        );
        const result1 = schedulerOtherSelectors.visibleDate(store.state);

        store.updateStateFromParameters(
          { events: [], visibleDate, displayTimezone: 'America/New_York' },
          adapter,
        );
        const result2 = schedulerOtherSelectors.visibleDate(store.state);

        expect(result1).to.not.equal(result2);
        expect(adapter.getTimezone(result2)).to.equal('America/New_York');
      });
    });
  });
});
