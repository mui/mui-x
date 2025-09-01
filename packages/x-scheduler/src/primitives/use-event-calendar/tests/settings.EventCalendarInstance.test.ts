import { getAdapter } from '@mui/x-scheduler/primitives/utils/adapter/getAdapter';
import { EventCalendarInstance } from '@mui/x-scheduler/primitives/use-event-calendar/EventCalendarInstance';

const DEFAULT_PARAMS = { events: [] };

const adapter = getAdapter();

describe('Settings - EventCalendarInstance', () => {
  describe('Method: setSettings', () => {
    it('should toggle hideWeekends correctly', () => {
      const { instance, store } = EventCalendarInstance.create(DEFAULT_PARAMS, adapter);

      instance.setSettings({ hideWeekends: true }, {} as any);
      expect(store.state.settings).to.deep.equal({ hideWeekends: true });

      instance.setSettings({ hideWeekends: false }, {} as any);
      expect(store.state.settings).to.deep.equal({ hideWeekends: false });
    });
  });
});
