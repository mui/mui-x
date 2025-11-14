import { adapter } from 'test/utils/scheduler';
import { spy } from 'sinon';
import { EventCalendarStore } from '../EventCalendarStore';

const DEFAULT_PARAMS = { events: [] };

const DEFAULT_PREFERENCES = {
  showWeekends: true,
  showWeekNumber: false,
  showEmptyDaysInAgenda: true,
  isSidePanelOpen: true,
  ampm: true,
};

describe('Preferences - EventCalendarStore', () => {
  describe('Method: setPreferences', () => {
    it('should update the store preferences and call onPreferencesChange when value changes and is uncontrolled', () => {
      const onPreferencesChange = spy();
      const store = new EventCalendarStore({ ...DEFAULT_PARAMS, onPreferencesChange }, adapter);

      store.setPreferences({ showWeekends: false }, {} as any);

      expect(store.state.preferences).to.deep.equal({
        ...DEFAULT_PREFERENCES,
        showWeekends: false,
      });
      expect(onPreferencesChange.calledOnce).to.equal(true);
      expect(onPreferencesChange.lastCall.firstArg).to.deep.equal({
        ...DEFAULT_PREFERENCES,
        showWeekends: false,
      });
    });

    it('should NOT mutate store but calls onPreferencesChange when is controlled', () => {
      const onPreferencesChange = spy();
      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          preferences: { ...DEFAULT_PREFERENCES, showWeekends: false },
          onPreferencesChange,
        },
        adapter,
      );

      store.setPreferences({ showWeekends: true }, {} as any);

      expect(store.state.preferences).to.deep.equal({
        ...DEFAULT_PREFERENCES,
        showWeekends: false,
      });
      expect(onPreferencesChange.calledOnce).to.equal(true);
      expect(onPreferencesChange.lastCall.firstArg).to.deep.equal({
        ...DEFAULT_PREFERENCES,
        showWeekends: true,
      });
    });

    it('should merge a partial: showWeekNumber=true keeps showWeekends=true', () => {
      const store = new EventCalendarStore(DEFAULT_PARAMS, adapter);
      store.setPreferences({ showWeekNumber: true }, {} as any);

      expect(store.state.preferences).to.deep.equal({
        ...DEFAULT_PREFERENCES,
        showWeekNumber: true,
      });
    });

    it('should update multiple preferences in a single call', () => {
      const store = new EventCalendarStore(DEFAULT_PARAMS, adapter);
      store.setPreferences({ showWeekends: false, showWeekNumber: true }, {} as any);

      expect(store.state.preferences).to.deep.equal({
        ...DEFAULT_PREFERENCES,
        showWeekends: false,
        showWeekNumber: true,
      });
    });

    it('should accumulate successive partial updates', () => {
      const store = new EventCalendarStore(DEFAULT_PARAMS, adapter);
      store.setPreferences({ showWeekends: false }, {} as any);
      store.setPreferences({ showWeekNumber: true }, {} as any);

      expect(store.state.preferences).to.deep.equal({
        ...DEFAULT_PREFERENCES,
        showWeekends: false,
        showWeekNumber: true,
      });
    });
  });
});
