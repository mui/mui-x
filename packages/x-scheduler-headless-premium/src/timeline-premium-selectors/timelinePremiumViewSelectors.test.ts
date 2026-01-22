import { getTimelinePremiumStateFromParameters } from 'test/utils/scheduler';
import { timelinePremiumViewSelectors } from './timelinePremiumViewSelectors';

describe('timelinePremiumViewSelectors', () => {
  describe('view', () => {
    it('should return the view from state', () => {
      const state = getTimelinePremiumStateFromParameters({
        events: [],
        view: 'months',
      });
      const view = timelinePremiumViewSelectors.view(state);
      expect(view).to.equal('months');
    });
  });

  describe('views', () => {
    it('should return the views from state', () => {
      const state = getTimelinePremiumStateFromParameters({
        events: [],
        views: ['time', 'days'],
      });
      const views = timelinePremiumViewSelectors.views(state);
      expect(views).to.deep.equal(['time', 'days']);
    });
  });
});
