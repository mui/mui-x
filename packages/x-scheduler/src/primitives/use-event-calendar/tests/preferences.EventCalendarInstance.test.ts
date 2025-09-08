import { EventCalendarInstance } from '../EventCalendarInstance';
import { getAdapter } from './../../utils/adapter/getAdapter';

const DEFAULT_PARAMS = { events: [] };

const adapter = getAdapter();

describe('Preferences - EventCalendarInstance', () => {
  describe('Method: setPreferences', () => {
    it('should merge a partial: showWeekNumber=true keeps showWeekends=true', () => {
      const { instance, store } = EventCalendarInstance.create(DEFAULT_PARAMS, adapter);

      instance.setPreferences({ showWeekNumber: true }, {} as any);

      expect(store.state.preferences).to.deep.equal({
        showWeekends: true,
        showWeekNumber: true,
      });
    });

    it('should update multiple preferences in a single call', () => {
      const { instance, store } = EventCalendarInstance.create(DEFAULT_PARAMS, adapter);

      instance.setPreferences({ showWeekends: false, showWeekNumber: true }, {} as any);

      expect(store.state.preferences).to.deep.equal({
        showWeekends: false,
        showWeekNumber: true,
      });
    });

    it('should accumulate successive partial updates', () => {
      const { instance, store } = EventCalendarInstance.create(DEFAULT_PARAMS, adapter);

      instance.setPreferences({ showWeekends: false }, {} as any);
      instance.setPreferences({ showWeekNumber: true }, {} as any);

      expect(store.state.preferences).to.deep.equal({
        showWeekends: false,
        showWeekNumber: true,
      });
    });
  });
});
