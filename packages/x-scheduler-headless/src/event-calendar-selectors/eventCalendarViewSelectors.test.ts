import { getEventCalendarStateFromParameters } from 'test/utils/scheduler';
import { eventCalendarViewSelectors } from './eventCalendarViewSelectors';

describe('eventCalendarViewSelectors', () => {
  describe('view', () => {
    it('should return the view from state', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        view: 'month',
      });
      const view = eventCalendarViewSelectors.view(state);
      expect(view).toBe('month');
    });
  });

  describe('views', () => {
    it('should return the views from state', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        views: ['day', 'week', 'month'],
      });
      const views = eventCalendarViewSelectors.views(state);
      expect(views).toEqual(['day', 'week', 'month']);
    });
  });

  describe('hasDayView', () => {
    it('should return true if views include day', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        views: ['day', 'week', 'month'],
      });
      const hasDayView = eventCalendarViewSelectors.hasDayView(state);
      expect(hasDayView).toBe(true);
    });

    it('should return false if views do not include day', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        views: ['week', 'month'],
      });
      const hasDayView = eventCalendarViewSelectors.hasDayView(state);
      expect(hasDayView).toBe(false);
    });
  });
});
