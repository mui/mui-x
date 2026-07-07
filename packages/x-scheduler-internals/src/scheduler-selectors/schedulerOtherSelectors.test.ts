import { adapter, ResourceBuilder, storeClasses } from 'test/utils/scheduler';
import { schedulerOtherSelectors } from './schedulerOtherSelectors';

const BASE_PARAMS = { events: [], resources: [ResourceBuilder.new().build()] };

storeClasses.forEach((storeClass) => {
  describe(`schedulerOtherSelectors - ${storeClass.name}`, () => {
    describe('isEditedOccurrence', () => {
      it('should return false when no occurrence is active', () => {
        const store = new storeClass.Value({ ...BASE_PARAMS }, adapter);
        expect(schedulerOtherSelectors.isEditedOccurrence(store.state, 'event-1')).to.equal(false);
      });

      it('should return true when the given occurrence key matches the active occurrence', () => {
        const store = new storeClass.Value({ ...BASE_PARAMS }, adapter);
        store.setEditedOccurrenceKey('event-1');
        expect(schedulerOtherSelectors.isEditedOccurrence(store.state, 'event-1')).to.equal(true);
      });

      it('should return false when a different occurrence is active', () => {
        const store = new storeClass.Value({ ...BASE_PARAMS }, adapter);
        store.setEditedOccurrenceKey('event-2');
        expect(schedulerOtherSelectors.isEditedOccurrence(store.state, 'event-1')).to.equal(false);
      });

      it('should distinguish occurrences of the same recurring event', () => {
        const store = new storeClass.Value({ ...BASE_PARAMS }, adapter);
        store.setEditedOccurrenceKey('standup::2025-07-07');
        expect(
          schedulerOtherSelectors.isEditedOccurrence(store.state, 'standup::2025-07-07'),
        ).to.equal(true);
        expect(
          schedulerOtherSelectors.isEditedOccurrence(store.state, 'standup::2025-07-08'),
        ).to.equal(false);
      });

      it('should return false after the active occurrence is cleared', () => {
        const store = new storeClass.Value({ ...BASE_PARAMS }, adapter);
        store.setEditedOccurrenceKey('event-1');
        expect(schedulerOtherSelectors.isEditedOccurrence(store.state, 'event-1')).to.equal(true);

        store.setEditedOccurrenceKey(null);
        expect(schedulerOtherSelectors.isEditedOccurrence(store.state, 'event-1')).to.equal(false);
      });
    });

    describe('visibleDate', () => {
      it('should return the visibleDate with the default display timezone applied', () => {
        const visibleDate = adapter.date('2025-07-03T00:00:00Z', 'default');
        const state = new storeClass.Value({ ...BASE_PARAMS, visibleDate }, adapter).state;
        const result = schedulerOtherSelectors.visibleDate(state);

        expect(result).toEqualDateTime(visibleDate);
      });

      it('should apply the configured display timezone to the visibleDate', () => {
        const visibleDate = adapter.date('2025-07-03T12:00:00Z', 'default');
        const state = new storeClass.Value(
          { ...BASE_PARAMS, visibleDate, displayTimezone: 'America/New_York' },
          adapter,
        ).state;
        const result = schedulerOtherSelectors.visibleDate(state);

        // The result should have the timezone applied
        expect(adapter.getTimezone(result)).to.equal('America/New_York');
      });

      it('should return same reference when inputs have not changed', () => {
        const visibleDate = adapter.date('2025-07-03T00:00:00Z', 'default');
        const state = new storeClass.Value({ ...BASE_PARAMS, visibleDate }, adapter).state;
        const result1 = schedulerOtherSelectors.visibleDate(state);
        const result2 = schedulerOtherSelectors.visibleDate(state);

        expect(result1).to.equal(result2);
      });

      it('should return a new reference when visibleDate changes', () => {
        const visibleDate = adapter.date('2025-07-03T00:00:00Z', 'default');
        const store = new storeClass.Value({ ...BASE_PARAMS, visibleDate }, adapter);
        const result1 = schedulerOtherSelectors.visibleDate(store.state);

        const newVisibleDate = adapter.date('2025-07-04T00:00:00Z', 'default');
        store.updateStateFromParameters({ ...BASE_PARAMS, visibleDate: newVisibleDate }, adapter);
        const result2 = schedulerOtherSelectors.visibleDate(store.state);

        expect(result1).to.not.equal(result2);
        expect(result2).toEqualDateTime(newVisibleDate);
      });

      it('should return a new reference when display timezone changes', () => {
        const visibleDate = adapter.date('2025-07-03T12:00:00Z', 'default');
        const store = new storeClass.Value(
          { ...BASE_PARAMS, visibleDate, displayTimezone: 'default' },
          adapter,
        );
        const result1 = schedulerOtherSelectors.visibleDate(store.state);

        store.updateStateFromParameters(
          { ...BASE_PARAMS, visibleDate, displayTimezone: 'America/New_York' },
          adapter,
        );
        const result2 = schedulerOtherSelectors.visibleDate(store.state);

        expect(result1).to.not.equal(result2);
        expect(adapter.getTimezone(result2)).to.equal('America/New_York');
      });
    });
  });
});
