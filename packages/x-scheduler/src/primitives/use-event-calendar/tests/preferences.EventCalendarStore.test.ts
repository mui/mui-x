import { EventCalendarStore } from '../EventCalendarStore';
import { getAdapter } from '../../utils/adapter/getAdapter';

const DEFAULT_PARAMS = { events: [] };

const adapter = getAdapter();

describe('Preferences - EventCalendarStore', () => {
  describe('Method: setPreferences', () => {
    it('should merge a partial: showWeekNumber=true keeps showWeekends=true', () => {
      const store = EventCalendarStore.create(DEFAULT_PARAMS, adapter);
      store.setPreferences({ showWeekNumber: true }, {} as any);

      expect(store.state.preferences).to.deep.equal({
        showWeekends: true,
        showWeekNumber: true,
      });
    });

    it('should update multiple preferences in a single call', () => {
      const store = EventCalendarStore.create(DEFAULT_PARAMS, adapter);
      store.setPreferences({ showWeekends: false, showWeekNumber: true }, {} as any);

      expect(store.state.preferences).to.deep.equal({
        showWeekends: false,
        showWeekNumber: true,
      });
    });

    it('should accumulate successive partial updates', () => {
      const store = EventCalendarStore.create(DEFAULT_PARAMS, adapter);
      store.setPreferences({ showWeekends: false }, {} as any);
      store.setPreferences({ showWeekNumber: true }, {} as any);

      expect(store.state.preferences).to.deep.equal({
        showWeekends: false,
        showWeekNumber: true,
      });
    });
  });
});
