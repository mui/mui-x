import { EventCalendarInstance } from '../EventCalendarInstance';
import { getAdapter } from './../../utils/adapter/getAdapter';

const DEFAULT_PARAMS = { events: [] };

const adapter = getAdapter();

describe('Preferences - EventCalendarInstance', () => {
  describe('Method: setPreferences', () => {
    it('should merge a partial: hideWeekNumber=true keeps hideWeekends=false', () => {
      const { instance, store } = EventCalendarInstance.create(DEFAULT_PARAMS, adapter);

      instance.setPreferences({ hideWeekNumber: true }, {} as any);

      expect(store.state.preferences).to.deep.equal({
        hideWeekends: false,
        hideWeekNumber: true,
      });
    });

    it('should update multiple preferences in a single call', () => {
      const { instance, store } = EventCalendarInstance.create(DEFAULT_PARAMS, adapter);

      instance.setPreferences({ hideWeekends: true, hideWeekNumber: true }, {} as any);

      expect(store.state.preferences).to.deep.equal({
        hideWeekends: true,
        hideWeekNumber: true,
      });
    });

    it('should accumulate successive partial updates', () => {
      const { instance, store } = EventCalendarInstance.create(DEFAULT_PARAMS, adapter);

      instance.setPreferences({ hideWeekends: true }, {} as any);
      instance.setPreferences({ hideWeekNumber: true }, {} as any);

      expect(store.state.preferences).to.deep.equal({
        hideWeekends: true,
        hideWeekNumber: true,
      });
    });
  });
});
