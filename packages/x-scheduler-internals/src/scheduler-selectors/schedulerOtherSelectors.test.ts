import { adapter, ResourceBuilder, storeClasses } from 'test/utils/scheduler';
import { schedulerOtherSelectors } from './schedulerOtherSelectors';

const BASE_PARAMS = { events: [], resources: [ResourceBuilder.new().build()] };

// The selector only reads `occurrence.id` / `occurrence.key`, so a minimal occurrence is enough.
const occurrence = (id: string) => ({ id, key: id }) as any;

storeClasses.forEach((storeClass) => {
  describe(`schedulerOtherSelectors - ${storeClass.name}`, () => {
    describe('isEditedEvent', () => {
      it('should return false when no event is active', () => {
        const store = new storeClass.Value({ ...BASE_PARAMS }, adapter);
        expect(schedulerOtherSelectors.isEditedEvent(store.state, 'event-1')).to.equal(false);
      });

      it('should return true when the given event ID matches the active event', () => {
        const store = new storeClass.Value({ ...BASE_PARAMS }, adapter);
        store.startEditing(occurrence('event-1'));
        expect(schedulerOtherSelectors.isEditedEvent(store.state, 'event-1')).to.equal(true);
      });

      it('should return false when a different event is active', () => {
        const store = new storeClass.Value({ ...BASE_PARAMS }, adapter);
        store.startEditing(occurrence('event-2'));
        expect(schedulerOtherSelectors.isEditedEvent(store.state, 'event-1')).to.equal(false);
      });

      it('should return false after the active event is cleared', () => {
        const store = new storeClass.Value({ ...BASE_PARAMS }, adapter);
        store.startEditing(occurrence('event-1'));
        expect(schedulerOtherSelectors.isEditedEvent(store.state, 'event-1')).to.equal(true);

        store.stopEditing();
        expect(schedulerOtherSelectors.isEditedEvent(store.state, 'event-1')).to.equal(false);
      });
    });

    describe('editingOccurrenceWithResizePreview', () => {
      const start = adapter.date('2025-07-03T09:00:00Z', 'default');
      const end = adapter.date('2025-07-03T10:00:00Z', 'default');

      // The selector reads `occurrence.key` and spreads `occurrence.displayTimezone`, so a minimal
      // occurrence carrying those is enough.
      const editedOccurrence = {
        id: 'event-1',
        key: 'event-1',
        displayTimezone: { start, end, timezone: 'default' },
      } as any;

      it('should return null when nothing is being edited', () => {
        const store = new storeClass.Value({ ...BASE_PARAMS }, adapter);
        expect(schedulerOtherSelectors.editingOccurrenceWithResizePreview(store.state)).to.equal(
          null,
        );
      });

      it('should return the edited occurrence unchanged when no resize is in progress', () => {
        const store = new storeClass.Value({ ...BASE_PARAMS }, adapter);
        store.startEditing(editedOccurrence);
        expect(schedulerOtherSelectors.editingOccurrenceWithResizePreview(store.state)).to.equal(
          editedOccurrence,
        );
      });

      it('should apply the resize placeholder times when resizing the edited occurrence', () => {
        const store = new storeClass.Value({ ...BASE_PARAMS }, adapter);
        store.startEditing(editedOccurrence);

        const newEnd = adapter.date('2025-07-03T11:30:00Z', 'default');
        store.setOccurrencePlaceholder({
          type: 'internal-resize',
          surfaceType: 'time-grid',
          start,
          end: newEnd,
          eventId: 'event-1',
          occurrenceKey: 'event-1',
          originalOccurrence: editedOccurrence,
          resourceId: null,
        });

        const result = schedulerOtherSelectors.editingOccurrenceWithResizePreview(store.state);
        expect(result).to.not.equal(editedOccurrence);
        expect(result!.displayTimezone.start.value).toEqualDateTime(start);
        expect(result!.displayTimezone.end.value).toEqualDateTime(newEnd);
      });

      it('should ignore a resize placeholder targeting a different occurrence', () => {
        const store = new storeClass.Value({ ...BASE_PARAMS }, adapter);
        store.startEditing(editedOccurrence);

        store.setOccurrencePlaceholder({
          type: 'internal-resize',
          surfaceType: 'time-grid',
          start,
          end: adapter.date('2025-07-03T11:30:00Z', 'default'),
          eventId: 'event-2',
          occurrenceKey: 'event-2',
          originalOccurrence: editedOccurrence,
          resourceId: null,
        });

        expect(schedulerOtherSelectors.editingOccurrenceWithResizePreview(store.state)).to.equal(
          editedOccurrence,
        );
      });

      it('should ignore a non-resize placeholder (e.g. an internal drag)', () => {
        const store = new storeClass.Value({ ...BASE_PARAMS }, adapter);
        store.startEditing(editedOccurrence);

        store.setOccurrencePlaceholder({
          type: 'internal-drag',
          surfaceType: 'time-grid',
          start: adapter.date('2025-07-03T12:00:00Z', 'default'),
          end: adapter.date('2025-07-03T13:00:00Z', 'default'),
          eventId: 'event-1',
          occurrenceKey: 'event-1',
          originalOccurrence: editedOccurrence,
          resourceId: null,
        });

        expect(schedulerOtherSelectors.editingOccurrenceWithResizePreview(store.state)).to.equal(
          editedOccurrence,
        );
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
