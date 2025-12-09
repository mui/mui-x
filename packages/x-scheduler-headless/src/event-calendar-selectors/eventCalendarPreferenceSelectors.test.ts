import {
  DEFAULT_EVENT_CALENDAR_STATE,
  getEventCalendarStateFromParameters,
} from 'test/utils/scheduler';
import { eventCalendarPreferenceSelectors } from './eventCalendarPreferenceSelectors';
import {
  DEFAULT_EVENT_CALENDAR_PREFERENCES,
  DEFAULT_PREFERENCES_MENU_CONFIG,
} from '../use-event-calendar';

describe('eventCalendarPreferenceSelectors', () => {
  describe('all', () => {
    it('should return default preferences when none are set in the state', () => {
      const state = DEFAULT_EVENT_CALENDAR_STATE;
      const preferences = eventCalendarPreferenceSelectors.all(state);
      expect(preferences).to.deep.equal(DEFAULT_EVENT_CALENDAR_PREFERENCES);
    });

    it('should return custom preferences when they are set in the state', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        preferences: { ampm: false },
      });
      const preferences = eventCalendarPreferenceSelectors.all(state);
      expect(preferences).to.deep.equal({ ...DEFAULT_EVENT_CALENDAR_PREFERENCES, ampm: false });
    });
  });

  describe('ampm', () => {
    it('should return the default ampm preference when none is set in the state', () => {
      const state = getEventCalendarStateFromParameters({ events: [] });
      const ampm = eventCalendarPreferenceSelectors.ampm(state);
      expect(ampm).to.equal(DEFAULT_EVENT_CALENDAR_PREFERENCES.ampm);
    });

    it('should return the custom ampm preference when it is set in the state (false)', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        preferences: { ampm: false },
      });
      const ampm = eventCalendarPreferenceSelectors.ampm(state);
      expect(ampm).to.equal(false);
    });

    it('should return the custom ampm preference when it is set in the state (true)', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        preferences: { ampm: true },
      });
      const ampm = eventCalendarPreferenceSelectors.ampm(state);
      expect(ampm).to.equal(true);
    });
  });

  describe('showWeekends', () => {
    it('should return the default showWeekends preference when none is set in the state', () => {
      const state = getEventCalendarStateFromParameters({ events: [] });
      const showWeekends = eventCalendarPreferenceSelectors.showWeekends(state);
      expect(showWeekends).to.equal(DEFAULT_EVENT_CALENDAR_PREFERENCES.showWeekends);
    });

    it('should return the custom showWeekends preference when it is set in the state (false)', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        preferences: { showWeekends: false },
      });
      const showWeekends = eventCalendarPreferenceSelectors.showWeekends(state);
      expect(showWeekends).to.equal(false);
    });

    it('should return the custom showWeekends preference when it is set in the state (true)', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        preferences: { showWeekends: true },
      });
      const showWeekends = eventCalendarPreferenceSelectors.showWeekends(state);
      expect(showWeekends).to.equal(true);
    });
  });

  describe('showWeekNumber', () => {
    it('should return the default showWeekNumber preference when none is set in the state', () => {
      const state = getEventCalendarStateFromParameters({ events: [] });
      const showWeekNumber = eventCalendarPreferenceSelectors.showWeekNumber(state);
      expect(showWeekNumber).to.equal(DEFAULT_EVENT_CALENDAR_PREFERENCES.showWeekNumber);
    });

    it('should return the custom showWeekNumber preference when it is set in the state (true)', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        preferences: { showWeekNumber: true },
      });
      const showWeekNumber = eventCalendarPreferenceSelectors.showWeekNumber(state);
      expect(showWeekNumber).to.equal(true);
    });

    it('should return the custom showWeekNumber preference when it is set in the state (false)', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        preferences: { showWeekNumber: false },
      });
      const showWeekNumber = eventCalendarPreferenceSelectors.showWeekNumber(state);
      expect(showWeekNumber).to.equal(false);
    });
  });

  describe('showEmptyDaysInAgenda', () => {
    it('should return the default showEmptyDaysInAgenda preference when none is set in the state', () => {
      const state = getEventCalendarStateFromParameters({ events: [] });
      const showEmptyDaysInAgenda = eventCalendarPreferenceSelectors.showEmptyDaysInAgenda(state);
      expect(showEmptyDaysInAgenda).to.equal(
        DEFAULT_EVENT_CALENDAR_PREFERENCES.showEmptyDaysInAgenda,
      );
    });

    it('should return the custom showEmptyDaysInAgenda preference when it is set in the state (false)', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        preferences: { showEmptyDaysInAgenda: false },
      });
      const showEmptyDaysInAgenda = eventCalendarPreferenceSelectors.showEmptyDaysInAgenda(state);
      expect(showEmptyDaysInAgenda).to.equal(false);
    });

    it('should return the custom showEmptyDaysInAgenda preference when it is set in the state (true)', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        preferences: { showEmptyDaysInAgenda: true },
      });
      const showEmptyDaysInAgenda = eventCalendarPreferenceSelectors.showEmptyDaysInAgenda(state);
      expect(showEmptyDaysInAgenda).to.equal(true);
    });
  });

  describe('isSidePanelOpen', () => {
    it('should return the default isSidePanelOpen preference when none is set in the state', () => {
      const state = getEventCalendarStateFromParameters({ events: [] });
      const isSidePanelOpen = eventCalendarPreferenceSelectors.isSidePanelOpen(state);
      expect(isSidePanelOpen).to.equal(DEFAULT_EVENT_CALENDAR_PREFERENCES.isSidePanelOpen);
    });

    it('should return the custom isSidePanelOpen preference when it is set in the state (false)', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        preferences: { isSidePanelOpen: false },
      });
      const isSidePanelOpen = eventCalendarPreferenceSelectors.isSidePanelOpen(state);
      expect(isSidePanelOpen).to.equal(false);
    });

    it('should return the custom isSidePanelOpen preference when it is set in the state (true)', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        preferences: { isSidePanelOpen: true },
      });
      const isSidePanelOpen = eventCalendarPreferenceSelectors.isSidePanelOpen(state);
      expect(isSidePanelOpen).to.equal(true);
    });
  });

  describe('menuConfig', () => {
    it('should return the default preferences menu config when none is set in the state', () => {
      const state = getEventCalendarStateFromParameters({ events: [] });
      const menuConfig = eventCalendarPreferenceSelectors.menuConfig(state);
      expect(menuConfig).to.deep.equal(DEFAULT_PREFERENCES_MENU_CONFIG);
    });

    it('should return the custom preferences menu config when it is set in the state', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        preferencesMenuConfig: {
          toggleAmpm: false,
        },
      });
      const menuConfig = eventCalendarPreferenceSelectors.menuConfig(state);
      expect(menuConfig).to.deep.equal({
        ...DEFAULT_PREFERENCES_MENU_CONFIG,
        toggleAmpm: false,
      });
    });
  });
});
