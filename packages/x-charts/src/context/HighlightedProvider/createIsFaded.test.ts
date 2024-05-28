import { expect } from 'chai';
import { createIsFaded } from './createIsFaded';

const itemData = {
  seriesId: '1s',
  dataIndex: 1,
  value: '1v',
};

describe('createIsFaded', () => {
  it('should return false when no options are set', () => {
    expect(createIsFaded(null, null)(itemData)).to.equal(false);
  });

  describe('faded=series', () => {
    const isFadedSameSeries = createIsFaded({ fade: 'series' }, itemData);

    it('should return true when input series is same as highlighted', () => {
      expect(isFadedSameSeries({ ...itemData, dataIndex: 2 })).to.equal(true);
    });

    it('should return false when input series is different than highlighted', () => {
      expect(isFadedSameSeries({ ...itemData, seriesId: '2' })).to.equal(false);
    });
  });

  describe('faded=global', () => {
    const isFadedGlobal = createIsFaded({ fade: 'global' }, itemData);

    it('should return false when item is same as highlighted', () => {
      expect(isFadedGlobal(itemData)).to.equal(false);
    });

    it('should return true when item is different than highlighted', () => {
      expect(isFadedGlobal({ ...itemData, dataIndex: 2 })).to.equal(true);
    });

    it('should return true when series is different than highlighted', () => {
      expect(isFadedGlobal({ ...itemData, seriesId: '2' })).to.equal(true);
    });
  });

  describe('faded=none', () => {
    const isFadedNone = createIsFaded({ fade: 'none' }, itemData);

    it('should return false when item is same as highlighted', () => {
      expect(isFadedNone(itemData)).to.equal(false);
    });
  });
});
