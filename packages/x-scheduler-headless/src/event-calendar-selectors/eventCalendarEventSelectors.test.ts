import { adapter, getEventCalendarStateFromParameters } from 'test/utils/scheduler';
import { eventCalendarEventSelectors } from './eventCalendarEventSelectors';
import { CalendarEvent } from '../models';

const SINGLE_DAY_EVENT: CalendarEvent = {
  id: 'event-1',
  title: 'Event 1',
  start: adapter.date(),
  end: adapter.addHours(adapter.date(), 1),
};

const MULTI_DAY_EVENT: CalendarEvent = {
  id: 'event-2',
  title: 'Event 2',
  start: adapter.date(),
  end: adapter.addDays(adapter.date(), 1),
};

describe('eventCalendarEventSelectors', () => {
  describe('isDraggable', () => {
    it('should return false when areEventsDraggable is not defined', () => {
      const state = getEventCalendarStateFromParameters({
        events: [SINGLE_DAY_EVENT],
        areEventsDraggable: undefined,
      });
      expect(eventCalendarEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
    });

    it('should return false when areEventsDraggable is false', () => {
      const state = getEventCalendarStateFromParameters({
        events: [SINGLE_DAY_EVENT],
        areEventsDraggable: false,
      });
      expect(eventCalendarEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
    });

    it('should return false when the event is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [{ ...SINGLE_DAY_EVENT, readOnly: true }],
        areEventsDraggable: true,
      });
      expect(eventCalendarEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
    });

    it('should return false when the calendar is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [SINGLE_DAY_EVENT],
        areEventsDraggable: true,
        readOnly: true,
      });
      expect(eventCalendarEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
    });

    it('should return false when the event start property is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [SINGLE_DAY_EVENT],
        areEventsDraggable: true,
        eventModelStructure: {
          start: { getter: (event) => event.start },
        },
      });
      expect(eventCalendarEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
    });

    it('should return false when the event end property is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [SINGLE_DAY_EVENT],
        areEventsDraggable: true,
        eventModelStructure: {
          end: { getter: (event) => event.end },
        },
      });
      expect(eventCalendarEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
    });

    it('should return true when areEventsDraggable is true and the event is not read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [SINGLE_DAY_EVENT],
        areEventsDraggable: true,
      });
      expect(eventCalendarEventSelectors.isDraggable(state, 'event-1')).to.equal(true);
    });
  });

  describe('isResizable', () => {
    it('should return false when areEventsResizable is not defined', () => {
      const state = getEventCalendarStateFromParameters({
        events: [SINGLE_DAY_EVENT],
        view: 'week',
        areEventsResizable: undefined,
      });
      expect(eventCalendarEventSelectors.isResizable(state, 'event-1', 'day-grid')).to.equal(false);
    });

    it('should return false when areEventsResizable is false', () => {
      const state = getEventCalendarStateFromParameters({
        events: [SINGLE_DAY_EVENT],
        view: 'week',
        areEventsResizable: false,
      });
      expect(eventCalendarEventSelectors.isResizable(state, 'event-1', 'day-grid')).to.equal(false);
    });

    it('should return false when the event is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [{ ...SINGLE_DAY_EVENT, readOnly: true }],
        view: 'week',
        areEventsResizable: true,
      });
      expect(eventCalendarEventSelectors.isResizable(state, 'event-1', 'day-grid')).to.equal(false);
    });

    it('should return false when the calendar is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [SINGLE_DAY_EVENT],
        view: 'week',
        areEventsResizable: true,
        readOnly: true,
      });
      expect(eventCalendarEventSelectors.isResizable(state, 'event-1', 'day-grid')).to.equal(false);
    });

    it('should return false when the event start property is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [SINGLE_DAY_EVENT],
        view: 'week',
        areEventsResizable: true,
        eventModelStructure: {
          start: { getter: (event) => event.start },
        },
      });
      expect(eventCalendarEventSelectors.isResizable(state, 'event-1', 'day-grid')).to.equal(false);
    });

    it('should return false when the event end property is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [SINGLE_DAY_EVENT],
        view: 'week',
        areEventsResizable: true,
        eventModelStructure: {
          end: { getter: (event) => event.end },
        },
      });
      expect(eventCalendarEventSelectors.isResizable(state, 'event-1', 'day-grid')).to.equal(false);
    });

    it.only('should return true when areEventsResizable is true and the event is not read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [SINGLE_DAY_EVENT],
        view: 'week',
        areEventsResizable: true,
      });
      expect(eventCalendarEventSelectors.isResizable(state, 'event-1', 'day-grid')).to.equal(true);
    });

    it('should return false in day view on day-grid surface', () => {
      const state = getEventCalendarStateFromParameters({
        events: [SINGLE_DAY_EVENT],
        view: 'day',
        areEventsResizable: true,
      });
      expect(eventCalendarEventSelectors.isResizable(state, 'event-1', 'day-grid')).to.equal(false);
    });

    it('should return true in day view on time-grid surface', () => {
      const state = getEventCalendarStateFromParameters({
        events: [SINGLE_DAY_EVENT],
        view: 'day',
        areEventsResizable: true,
      });
      expect(eventCalendarEventSelectors.isResizable(state, 'event-1', 'time-grid')).to.equal(true);
    });

    it('should return false in month view on day-grid surface for single-day events', () => {
      const state = getEventCalendarStateFromParameters({
        events: [SINGLE_DAY_EVENT],
        view: 'month',
        areEventsResizable: true,
      });
      expect(eventCalendarEventSelectors.isResizable(state, 'event-1', 'day-grid')).to.equal(false);
    });

    it('should return true in month view on day-grid surface for multi-day events', () => {
      const state = getEventCalendarStateFromParameters({
        events: [MULTI_DAY_EVENT],
        view: 'month',
        areEventsResizable: true,
      });
      expect(eventCalendarEventSelectors.isResizable(state, 'event-2', 'day-grid')).to.equal(true);
    });
  });
});
