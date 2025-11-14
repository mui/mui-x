import { getEventCalendarStateFromParameters } from 'test/utils/scheduler';
import { schedulerEventSelectors } from './schedulerEventSelectors';
import { DEFAULT_EVENT_CREATION_CONFIG } from '../constants';

describe('schedulerEventSelectors', () => {
  describe('creationConfig', () => {
    it('should return the default config when props.eventCreation is not defined', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
      });
      expect(schedulerEventSelectors.creationConfig(state)).to.deep.equal(
        DEFAULT_EVENT_CREATION_CONFIG,
      );
    });

    it('should return false when props.eventCreation is false', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        eventCreation: false,
      });
      expect(schedulerEventSelectors.creationConfig(state)).to.equal(false);
    });

    it('should return the default config when props.eventCreation is true', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        eventCreation: true,
      });
      expect(schedulerEventSelectors.creationConfig(state)).to.deep.equal(
        DEFAULT_EVENT_CREATION_CONFIG,
      );
    });

    it('should merge the default config with props.eventCreation when it is an object', () => {
      const customConfig = {
        duration: 60,
      };
      const state = getEventCalendarStateFromParameters({
        events: [],
        eventCreation: customConfig,
      });
      expect(schedulerEventSelectors.creationConfig(state)).to.deep.equal({
        ...DEFAULT_EVENT_CREATION_CONFIG,
        ...customConfig,
      });
    });

    it('should return false when the scheduler is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        readOnly: true,
        eventCreation: true,
      });
      expect(schedulerEventSelectors.creationConfig(state)).to.equal(false);
    });
  });
});
