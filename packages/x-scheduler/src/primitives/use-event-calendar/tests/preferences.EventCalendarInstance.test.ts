import { EventCalendarInstance } from '../EventCalendarInstance';
import { getAdapter } from './../../utils/adapter/getAdapter';

const DEFAULT_PARAMS = { events: [] };

const adapter = getAdapter();

describe('Preferences - EventCalendarInstance', () => {
  describe('Method: setPreferences', () => {
    it('should toggle hideWeekends correctly', () => {
      const { instance, store } = EventCalendarInstance.create(DEFAULT_PARAMS, adapter);

      instance.setPreferences({ hideWeekends: true }, {} as any);
      expect(store.state.preferences).to.deep.equal({ hideWeekends: true });

      instance.setPreferences({ hideWeekends: false }, {} as any);
      expect(store.state.preferences).to.deep.equal({ hideWeekends: false });
    });
  });
});
