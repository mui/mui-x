import { getEventTimelinePremiumStateFromParameters } from 'test/utils/scheduler';
import { eventTimelinePremiumViewSelectors } from './eventTimelinePremiumViewSelectors';

describe('eventTimelinePremiumViewSelectors', () => {
  describe('view', () => {
    it('should return the view from state', () => {
      const state = getEventTimelinePremiumStateFromParameters({
        events: [],
        view: 'months',
      });
      const view = eventTimelinePremiumViewSelectors.view(state);
      expect(view).to.equal('months');
    });
  });

  describe('views', () => {
    it('should return the views from state', () => {
      const state = getEventTimelinePremiumStateFromParameters({
        events: [],
        views: ['time', 'days'],
      });
      const views = eventTimelinePremiumViewSelectors.views(state);
      expect(views).to.deep.equal(['time', 'days']);
    });
  });
});
