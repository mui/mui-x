import {
  isSeriesHighlighted,
  isSeriesFaded,
  getSeriesHighlightedItem,
  getSeriesUnfadedItem,
} from './highlightStates';
import { HighlightItemData } from './useChartHighlight.types';
import { HighlightScope } from './highlightConfig.types';
import { SeriesId } from '../../../../models/seriesType/common';

describe('highlightStates', () => {
  const s1: SeriesId = 's1';
  const s2: SeriesId = 's2';
  const dataIndex = 5;

  const itemData1: HighlightItemData = {
    seriesId: s1,
    dataIndex,
  };

  describe('isSeriesHighlighted', () => {
    const seriesHighlightScope: Partial<HighlightScope> = { highlight: 'series' };
    const itemHighlightScope: Partial<HighlightScope> = { highlight: 'item' };
    const noHighlightScope: Partial<HighlightScope> = { highlight: 'none' };

    it('should only  return true when scope.highlight is "series" and item.seriesId matches', () => {
      expect(isSeriesHighlighted(seriesHighlightScope, itemData1, s1)).to.equal(true);
      expect(isSeriesHighlighted(seriesHighlightScope, itemData1, s2)).to.equal(false);
    });

    it('should return false when scope.highlight is not "series"', () => {
      expect(isSeriesHighlighted(itemHighlightScope, itemData1, s1)).to.equal(false);
      expect(isSeriesHighlighted(noHighlightScope, itemData1, s1)).to.equal(false);
      expect(isSeriesHighlighted(null, itemData1, s1)).to.equal(false);
    });

    it('should return false when item is null', () => {
      expect(isSeriesHighlighted(seriesHighlightScope, null, s1)).to.equal(false);
      expect(isSeriesHighlighted(null, null, s1)).to.equal(false);
    });

    it('should return false when scope has no highlight property', () => {
      expect(isSeriesHighlighted({ fade: 'global' }, itemData1, s1)).to.equal(false);
    });
  });

  describe('isSeriesFaded', () => {
    describe('when series is highlighted', () => {
      it('should return false even if fade conditions are met', () => {
        const scope: Partial<HighlightScope> = { highlight: 'series', fade: 'global' };
        expect(isSeriesFaded(scope, itemData1, s1)).to.equal(false);
      });
    });

    describe('when scope.fade is "global"', () => {
      const globalFadeScope: Partial<HighlightScope> = { fade: 'global' };

      it('should return true when item is not null', () => {
        expect(isSeriesFaded(globalFadeScope, itemData1, s1)).to.equal(true);
        expect(isSeriesFaded(globalFadeScope, itemData1, s2)).to.equal(true);
      });

      it('should return false when item is null', () => {
        expect(isSeriesFaded(globalFadeScope, null, s1)).to.equal(false);
        expect(isSeriesFaded(globalFadeScope, null, s2)).to.equal(false);
      });
    });

    describe('when scope.fade is "series"', () => {
      const seriesFadeScope: Partial<HighlightScope> = { fade: 'series' };

      it('should only return true when item.seriesId matches seriesId', () => {
        expect(isSeriesFaded(seriesFadeScope, itemData1, s1)).to.equal(true);
        expect(isSeriesFaded(seriesFadeScope, itemData1, s2)).to.equal(false);
      });

      it('should return false when item is null', () => {
        expect(isSeriesFaded(seriesFadeScope, null, s1)).to.equal(false);
        expect(isSeriesFaded(seriesFadeScope, null, s2)).to.equal(false);
      });
    });

    it('should return false when scope.fade is "none" or is missing', () => {
      const scope: Partial<HighlightScope> = { fade: 'none' };
      expect(isSeriesFaded(scope, itemData1, s1)).to.equal(false);
      expect(isSeriesFaded(scope, itemData1, s2)).to.equal(false);

      expect(isSeriesFaded({}, itemData1, s1)).to.equal(false);
      expect(isSeriesFaded({}, itemData1, s2)).to.equal(false);

      expect(isSeriesFaded(null, itemData1, s1)).to.equal(false);
      expect(isSeriesFaded(null, itemData1, s2)).to.equal(false);
    });

    it('should return false when scope or item are null', () => {
      const scope: Partial<HighlightScope> = { fade: 'none' };
      expect(isSeriesFaded(scope, null, s1)).to.equal(false);
      expect(isSeriesFaded(scope, null, s2)).to.equal(false);
    });
  });

  describe('getSeriesHighlightedItem', () => {
    describe('when scope.highlight is "item"', () => {
      const highlightItemScope: Partial<HighlightScope> = { highlight: 'item' };
      it('should only return item.dataIndex when item.seriesId matches', () => {
        expect(getSeriesHighlightedItem(highlightItemScope, itemData1, s1)).to.equal(
          itemData1.dataIndex,
        );
        expect(getSeriesHighlightedItem(highlightItemScope, itemData1, s2)).to.equal(null);

        expect(getSeriesHighlightedItem(highlightItemScope, null, s1)).to.equal(null);
        expect(getSeriesHighlightedItem(highlightItemScope, null, s2)).to.equal(null);
      });

      it('should handle undefined dataIndex', () => {
        const itemWithoutDataIndex: HighlightItemData = { seriesId: s1 };
        expect(getSeriesHighlightedItem(highlightItemScope, itemWithoutDataIndex, s1)).to.equal(
          undefined,
        );
      });
    });

    describe('when scope.highlight is not "item"', () => {
      it('should return null when scope.highlight is "series"', () => {
        const scope: Partial<HighlightScope> = { highlight: 'series' };
        expect(getSeriesHighlightedItem(scope, itemData1, s1)).to.equal(null);
        expect(getSeriesHighlightedItem(scope, itemData1, s2)).to.equal(null);
      });

      it('should return null when scope.highlight is "none"', () => {
        const scope: Partial<HighlightScope> = { highlight: 'none' };
        expect(getSeriesHighlightedItem(scope, itemData1, s1)).to.equal(null);
        expect(getSeriesHighlightedItem(scope, itemData1, s2)).to.equal(null);
      });
    });

    describe('when scope is null', () => {
      it('should return null when scope or item are null', () => {
        expect(getSeriesHighlightedItem(null, itemData1, s1)).to.equal(null);
        expect(getSeriesHighlightedItem(null, itemData1, s2)).to.equal(null);

        expect(getSeriesHighlightedItem({ highlight: 'series' }, null, s1)).to.equal(null);
        expect(getSeriesHighlightedItem({ highlight: 'series' }, null, s2)).to.equal(null);

        expect(getSeriesHighlightedItem(null, null, s1)).to.equal(null);
        expect(getSeriesHighlightedItem(null, null, s2)).to.equal(null);
      });
    });

    describe('when scope has no highlight property', () => {
      it('should return null', () => {
        const scope: Partial<HighlightScope> = { fade: 'global' };
        expect(getSeriesHighlightedItem(scope, itemData1, s1)).to.equal(null);
        expect(getSeriesHighlightedItem(scope, itemData1, s2)).to.equal(null);
      });
    });
  });

  describe('getSeriesUnfadedItem', () => {
    describe('when scope.fade is not "none"', () => {
      it('should only return item.dataIndex when scope.fade is "global" and item.seriesId matches', () => {
        const scope: Partial<HighlightScope> = { fade: 'global' };
        expect(getSeriesUnfadedItem(scope, itemData1, s1)).to.equal(dataIndex);
        expect(getSeriesUnfadedItem(scope, itemData1, s2)).to.equal(null);
      });

      it('should return item.dataIndex when scope.fade is "series" and item.seriesId matches', () => {
        const scope: Partial<HighlightScope> = { fade: 'series' };
        expect(getSeriesUnfadedItem(scope, itemData1, s1)).to.equal(dataIndex);
        expect(getSeriesUnfadedItem(scope, itemData1, s2)).to.equal(null);
      });

      it('should return null when item is null', () => {
        const scope: Partial<HighlightScope> = { fade: 'global' };
        expect(getSeriesUnfadedItem(scope, null, s1)).to.equal(null);
        expect(getSeriesUnfadedItem(scope, null, s2)).to.equal(null);
      });

      it('should handle undefined dataIndex', () => {
        const scope: Partial<HighlightScope> = { fade: 'global' };
        const itemWithoutDataIndex: HighlightItemData = { seriesId: s1 };
        expect(getSeriesUnfadedItem(scope, itemWithoutDataIndex, s1)).to.equal(undefined);
      });
    });

    it('should return null when scope.fade is "none"', () => {
      const scope: Partial<HighlightScope> = { fade: 'none' };
      expect(getSeriesUnfadedItem(scope, itemData1, s1)).to.equal(null);
    });

    it('should return null when scope or item are null', () => {
      expect(getSeriesUnfadedItem(null, itemData1, s1)).to.equal(null);
      expect(getSeriesUnfadedItem(null, itemData1, s2)).to.equal(null);

      expect(getSeriesUnfadedItem(null, null, s2)).to.equal(null);
      expect(getSeriesUnfadedItem(null, null, s2)).to.equal(null);
    });

    it('should return null when scope has no fade property', () => {
      const scope: Partial<HighlightScope> = { highlight: 'series' };
      expect(getSeriesUnfadedItem(scope, itemData1, s1)).to.equal(null);
    });
  });
});
