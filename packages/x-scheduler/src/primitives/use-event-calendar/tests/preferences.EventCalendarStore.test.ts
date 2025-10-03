import { adapter } from 'test/utils/scheduler';
import { EventCalendarStore } from '../EventCalendarStore';

const DEFAULT_PARAMS = { events: [] };

describe('Preferences - EventCalendarStore', () => {
  describe('Method: setPreferences', () => {
    it('should merge a partial: showWeekNumber=true keeps showWeekends=true', () => {
      const store = new EventCalendarStore(DEFAULT_PARAMS, adapter);
      store.setPreferences({ showWeekNumber: true }, {} as any);

      expect(store.state.preferences).to.deep.equal({
        showWeekends: true,
        showWeekNumber: true,
        isSidePanelOpen: true,
        ampm: true,
      });
    });

    it('should update multiple preferences in a single call', () => {
      const store = new EventCalendarStore(DEFAULT_PARAMS, adapter);
      store.setPreferences({ showWeekends: false, showWeekNumber: true }, {} as any);

      expect(store.state.preferences).to.deep.equal({
        showWeekends: false,
        showWeekNumber: true,
        isSidePanelOpen: true,
        ampm: true,
      });
    });

    it('should accumulate successive partial updates', () => {
      const store = new EventCalendarStore(DEFAULT_PARAMS, adapter);
      store.setPreferences({ showWeekends: false }, {} as any);
      store.setPreferences({ showWeekNumber: true }, {} as any);

      expect(store.state.preferences).to.deep.equal({
        showWeekends: false,
        showWeekNumber: true,
        isSidePanelOpen: true,
        ampm: true,
      });
    });
  });
});
