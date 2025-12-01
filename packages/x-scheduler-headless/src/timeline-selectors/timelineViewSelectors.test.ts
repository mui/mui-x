import { getTimelineStateFromParameters } from 'test/utils/scheduler';
import { timelineViewSelectors } from './timelineViewSelectors';

describe('timelineViewSelectors', () => {
  describe('view', () => {
    it('should return the view from state', () => {
      const state = getTimelineStateFromParameters({
        events: [],
        view: 'months',
      });
      const view = timelineViewSelectors.view(state);
      expect(view).to.equal('months');
    });
  });

  describe('views', () => {
    it('should return the views from state', () => {
      const state = getTimelineStateFromParameters({
        events: [],
        views: ['time', 'days'],
      });
      const views = timelineViewSelectors.views(state);
      expect(views).to.deep.equal(['time', 'days']);
    });
  });
});
