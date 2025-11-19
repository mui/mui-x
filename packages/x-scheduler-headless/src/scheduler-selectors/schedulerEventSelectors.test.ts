import { EventBuilder, getEventCalendarStateFromParameters } from 'test/utils/scheduler';
import { schedulerEventSelectors } from './schedulerEventSelectors';
import { DEFAULT_EVENT_CREATION_CONFIG } from '../constants';

const defaultEvent = EventBuilder.new().id('event-1').build();
const readOnlyEvent = EventBuilder.new().id('event-1').readOnly().build();

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

  describe('isDraggable', () => {
    it('should return false when areEventsDraggable is not defined', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsDraggable: undefined,
      });
      expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
    });

    it('should return false when areEventsDraggable is false', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsDraggable: false,
      });
      expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
    });

    it('should return false when the event is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [readOnlyEvent],
        areEventsDraggable: true,
      });
      expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
    });

    it('should return false when the calendar is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsDraggable: true,
        readOnly: true,
      });
      expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
    });

    it('should return false when the event start property is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsDraggable: true,
        eventModelStructure: {
          start: { getter: (event) => event.start },
        },
      });
      expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
    });

    it('should return false when the event end property is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsDraggable: true,
        eventModelStructure: {
          end: { getter: (event) => event.end },
        },
      });
      expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
    });

    it('should return true when areEventsDraggable is true and the event is not read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsDraggable: true,
      });
      expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(true);
    });
  });

  describe('isResizable', () => {
    it('should return false when areEventsResizable is not defined', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        view: 'week',
        areEventsResizable: undefined,
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
    });

    it('should return false when areEventsResizable is false', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        view: 'week',
        areEventsResizable: false,
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
    });

    it('should return false when the event is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [readOnlyEvent],
        view: 'week',
        areEventsResizable: true,
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
    });

    it('should return false when the calendar is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        view: 'week',
        areEventsResizable: true,
        readOnly: true,
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
    });

    it('should return false for the "start" side when the event start property is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        view: 'week',
        areEventsResizable: true,
        eventModelStructure: {
          start: { getter: (event) => event.start },
        },
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(true);
    });

    it('should return false for the "end" side when the event end property is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        view: 'week',
        areEventsResizable: true,
        eventModelStructure: {
          end: { getter: (event) => event.end },
        },
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
    });

    it('should return true when areEventsResizable is true and the event is not read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        view: 'week',
        areEventsResizable: true,
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(true);
    });
  });
});
