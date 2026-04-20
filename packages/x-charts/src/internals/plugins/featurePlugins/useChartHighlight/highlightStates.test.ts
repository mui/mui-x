import type { MakeOptional } from '@mui/x-internals/types';
import {
  isSeriesHighlighted,
  isSeriesFaded,
  getSeriesHighlightedDataIndex,
  getSeriesUnfadedDataIndex,
} from './highlightStates';
import type { SeriesId, SeriesItemIdentifierWithType } from '../../../../models/seriesType';
import type { CommonHighlightScope } from './highlightConfig.types';

describe('highlightStates', () => {
  const s1: SeriesId = 's1';
  const s2: SeriesId = 's2';
  const dataIndex = 5;

  const itemData1: SeriesItemIdentifierWithType<'bar'> = {
    type: 'bar',
    seriesId: s1,
    dataIndex,
  };

  describe('isSeriesHighlighted', () => {
    const seriesHighlightScope: Partial<CommonHighlightScope> = { highlight: 'series' };
    const itemHighlightScope: Partial<CommonHighlightScope> = { highlight: 'item' };
    const noHighlightScope: Partial<CommonHighlightScope> = { highlight: 'none' };

    it('should only return true when scope.highlight is "series" and item.seriesId matches', () => {
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
        const scope: Partial<CommonHighlightScope> = { highlight: 'series', fade: 'global' };
        expect(isSeriesFaded(scope, itemData1, s1)).to.equal(false);
      });
    });

    describe('when scope.fade is "global"', () => {
      const globalFadeScope: Partial<CommonHighlightScope> = { fade: 'global' };

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
      const seriesFadeScope: Partial<CommonHighlightScope> = { fade: 'series' };

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
      const scope: Partial<CommonHighlightScope> = { fade: 'none' };
      expect(isSeriesFaded(scope, itemData1, s1)).to.equal(false);
      expect(isSeriesFaded(scope, itemData1, s2)).to.equal(false);

      expect(isSeriesFaded({}, itemData1, s1)).to.equal(false);
      expect(isSeriesFaded({}, itemData1, s2)).to.equal(false);

      expect(isSeriesFaded(null, itemData1, s1)).to.equal(false);
      expect(isSeriesFaded(null, itemData1, s2)).to.equal(false);
    });

    it('should return false when scope or item are null', () => {
      const scope: Partial<CommonHighlightScope> = { fade: 'none' };
      expect(isSeriesFaded(scope, null, s1)).to.equal(false);
      expect(isSeriesFaded(scope, null, s2)).to.equal(false);
    });
  });

  describe('getSeriesHighlightedDataIndex', () => {
    describe('when scope.highlight is "item"', () => {
      const highlightItemScope: Partial<CommonHighlightScope> = { highlight: 'item' };
      it('should only return item.dataIndex when item.seriesId matches', () => {
        expect(getSeriesHighlightedDataIndex(highlightItemScope, itemData1, s1)).to.equal(
          itemData1.dataIndex,
        );
        expect(getSeriesHighlightedDataIndex(highlightItemScope, itemData1, s2)).to.equal(null);

        expect(getSeriesHighlightedDataIndex(highlightItemScope, null, s1)).to.equal(null);
        expect(getSeriesHighlightedDataIndex(highlightItemScope, null, s2)).to.equal(null);
      });

      it('should handle undefined dataIndex', () => {
        const itemWithoutDataIndex: MakeOptional<
          SeriesItemIdentifierWithType<'bar'>,
          'dataIndex'
        > = {
          type: 'bar',
          seriesId: s1,
        };
        expect(
          getSeriesHighlightedDataIndex(highlightItemScope, itemWithoutDataIndex, s1),
        ).to.equal(undefined);
      });
    });

    describe('when scope.highlight is not "item"', () => {
      it('should return null when scope.highlight is "series"', () => {
        const scope: Partial<CommonHighlightScope> = { highlight: 'series' };
        expect(getSeriesHighlightedDataIndex(scope, itemData1, s1)).to.equal(null);
        expect(getSeriesHighlightedDataIndex(scope, itemData1, s2)).to.equal(null);
      });

      it('should return null when scope.highlight is "none"', () => {
        const scope: Partial<CommonHighlightScope> = { highlight: 'none' };
        expect(getSeriesHighlightedDataIndex(scope, itemData1, s1)).to.equal(null);
        expect(getSeriesHighlightedDataIndex(scope, itemData1, s2)).to.equal(null);
      });
    });

    describe('when scope is null', () => {
      it('should return null when scope or item are null', () => {
        expect(getSeriesHighlightedDataIndex(null, itemData1, s1)).to.equal(null);
        expect(getSeriesHighlightedDataIndex(null, itemData1, s2)).to.equal(null);

        expect(getSeriesHighlightedDataIndex({ highlight: 'series' }, null, s1)).to.equal(null);
        expect(getSeriesHighlightedDataIndex({ highlight: 'series' }, null, s2)).to.equal(null);

        expect(getSeriesHighlightedDataIndex(null, null, s1)).to.equal(null);
        expect(getSeriesHighlightedDataIndex(null, null, s2)).to.equal(null);
      });
    });

    describe('when scope has no highlight property', () => {
      it('should return null', () => {
        const scope: Partial<CommonHighlightScope> = { fade: 'global' };
        expect(getSeriesHighlightedDataIndex(scope, itemData1, s1)).to.equal(null);
        expect(getSeriesHighlightedDataIndex(scope, itemData1, s2)).to.equal(null);
      });
    });
  });

  describe('getSeriesUnfadedDataIndex', () => {
    describe('when scope.fade is not "none"', () => {
      it('should only return item.dataIndex when scope.fade is "global" and item.seriesId matches', () => {
        const scope: Partial<CommonHighlightScope> = { fade: 'global' };
        expect(getSeriesUnfadedDataIndex(scope, itemData1, s1)).to.equal(dataIndex);
        expect(getSeriesUnfadedDataIndex(scope, itemData1, s2)).to.equal(null);
      });

      it('should return item.dataIndex when scope.fade is "series" and item.seriesId matches', () => {
        const scope: Partial<CommonHighlightScope> = { fade: 'series' };
        expect(getSeriesUnfadedDataIndex(scope, itemData1, s1)).to.equal(dataIndex);
        expect(getSeriesUnfadedDataIndex(scope, itemData1, s2)).to.equal(null);
      });

      it('should return null when item is null', () => {
        const scope: Partial<CommonHighlightScope> = { fade: 'global' };
        expect(getSeriesUnfadedDataIndex(scope, null, s1)).to.equal(null);
        expect(getSeriesUnfadedDataIndex(scope, null, s2)).to.equal(null);
      });

      it('should handle undefined dataIndex', () => {
        const scope: Partial<CommonHighlightScope> = { fade: 'global' };
        const itemWithoutDataIndex: MakeOptional<
          SeriesItemIdentifierWithType<'bar'>,
          'dataIndex'
        > = {
          type: 'bar',
          seriesId: s1,
        };
        expect(getSeriesUnfadedDataIndex(scope, itemWithoutDataIndex, s1)).to.equal(undefined);
      });
    });

    it('should return null when scope.fade is "none"', () => {
      const scope: Partial<CommonHighlightScope> = { fade: 'none' };
      expect(getSeriesUnfadedDataIndex(scope, itemData1, s1)).to.equal(null);
    });

    it('should return null when scope.fade is "series", but an item is highlighted', () => {
      const highlightSeriesScope: Partial<CommonHighlightScope> = {
        highlight: 'series',
        fade: 'series',
      };
      expect(getSeriesUnfadedDataIndex(highlightSeriesScope, itemData1, s1)).to.equal(null);

      const highlightItemScope: Partial<CommonHighlightScope> = {
        highlight: 'item',
        fade: 'series',
      };
      expect(getSeriesUnfadedDataIndex(highlightItemScope, itemData1, s1)).to.equal(null);
    });

    it('should return null when scope or item are null', () => {
      expect(getSeriesUnfadedDataIndex(null, itemData1, s1)).to.equal(null);
      expect(getSeriesUnfadedDataIndex(null, itemData1, s2)).to.equal(null);

      expect(getSeriesUnfadedDataIndex(null, null, s2)).to.equal(null);
      expect(getSeriesUnfadedDataIndex(null, null, s2)).to.equal(null);
    });

    it('should return null when scope has no fade property', () => {
      const scope: Partial<CommonHighlightScope> = { highlight: 'series' };
      expect(getSeriesUnfadedDataIndex(scope, itemData1, s1)).to.equal(null);
    });
  });
});
