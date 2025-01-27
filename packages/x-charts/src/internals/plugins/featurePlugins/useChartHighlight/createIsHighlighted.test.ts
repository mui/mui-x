import { expect } from 'chai';
import { createIsHighlighted } from './createIsHighlighted';

const seriesId = 'id1';
const dataIndex = 1;

const itemData = {
  seriesId,
  dataIndex,
};

describe('createIsHighlighted', () => {
  it('should return false when no options are set', () => {
    expect(createIsHighlighted(null, null)(itemData)).to.equal(false);
  });

  describe('highlighted=series', () => {
    const isHighlightedSameSeries = createIsHighlighted({ highlight: 'series' }, itemData);

    it('should return true when input series is same as highlighted', () => {
      expect(isHighlightedSameSeries(itemData)).to.equal(true);
    });

    it('should return false when input series is different than highlighted', () => {
      expect(isHighlightedSameSeries({ ...itemData, seriesId: 'id2' })).to.equal(false);
    });

    it('should return true when input item is different than highlighted', () => {
      expect(isHighlightedSameSeries({ ...itemData, dataIndex: 2 })).to.equal(true);
    });
  });

  describe('highlighted=item', () => {
    const isHighlightedItem = createIsHighlighted({ highlight: 'item' }, itemData);

    it('should return true when input item is same as highlighted', () => {
      expect(isHighlightedItem(itemData)).to.equal(true);
    });

    it('should return false when input item is different than highlighted', () => {
      expect(isHighlightedItem({ ...itemData, dataIndex: 2 })).to.equal(false);
    });

    it('should return false when input series is different than highlighted', () => {
      expect(isHighlightedItem({ ...itemData, seriesId: 'id2' })).to.equal(false);
    });
  });

  describe('highlighted=none', () => {
    const isHighlightedNone = createIsHighlighted({ highlight: 'none' }, itemData);

    it('should return false', () => {
      expect(isHighlightedNone(itemData)).to.equal(false);
    });
  });
});
