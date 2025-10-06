import { scaleBand } from '@mui/x-charts-vendor/d3-scale';
import { getTicks } from './useTicks';

const defaultOptions = {
  scale: scaleBand<number | string | Date>([1, 2, 3, 5], [0, 100]),
  tickNumber: 5,
  isInside: (value: number) => value >= 0 && value <= 100,
  continuousTickPlacement: false,
};

const numberData = Array.from({ length: 25 }, (_, i) => i + 1);
const sparseNumberData = numberData.filter((d, i) => i % 4 !== 0);

const dateData = Array.from({ length: 30 }, (_, i) => new Date(2025, 9, i + 1, 0, 0, 0));
const sparseDateData = dateData.filter((d) => d.getDay() < 6 && d.getDay() !== 0); // Remove week-ends

describe('getTicks', () => {
  describe('band scale - ordinal ticks', () => {
    it('should add an empty tick at the end of the scale', () => {
      const ticks = getTicks(defaultOptions);

      expect(ticks).to.have.length(5); // Extra tick for the end
      expect(ticks.map((tick) => tick.value)).to.deep.equal([1, 2, 3, 5, undefined]);
      expect(ticks.map((tick) => tick.offset)).to.deep.equal([0, 25, 50, 75, 100]);
      expect(ticks.map((tick) => tick.labelOffset)).to.deep.equal([12.5, 12.5, 12.5, 12.5, 0]);
    });

    it('should not add an empty tick when tickPlacement is ', () => {
      const ticks = getTicks({ ...defaultOptions, tickPlacement: 'start' });

      expect(ticks).to.have.length(4); // No extra tick
      expect(ticks.map((tick) => tick.value)).to.deep.equal([1, 2, 3, 5]);
      expect(ticks.map((tick) => tick.offset)).to.deep.equal([0, 25, 50, 75]);
      expect(ticks.map((tick) => tick.labelOffset)).to.deep.equal([12.5, 12.5, 12.5, 12.5]);
    });
  });

  describe('band scale - continuous ticks', () => {
    it('should place ticks on the next band larger than the tick number value', () => {
      const ticks = getTicks({
        ...defaultOptions,
        scale: scaleBand<number | string | Date>(
          numberData.filter((v) => v % 2 !== 0),
          [0, 100],
        ),
        tickInterval: [0, 10, 20],
        continuousTickPlacement: true,
      });

      expect(ticks.map((tick) => tick.value)).to.deep.equal([1, 11, 21]);
      expect(ticks.map((tick) => tick.formattedValue)).to.deep.equal(['0', '10', '20']);
    });

    it('should place ticks on the next band larger than the tick date value', () => {
      const ticks = getTicks({
        ...defaultOptions,
        scale: scaleBand<number | string | Date>(sparseDateData, [0, 100]),
        tickNumber: 6,
        continuousTickPlacement: true,
      });

      expect(ticks.map((tick) => tick.value)).to.deep.equal([
        new Date(2025, 9, 1, 0, 0, 0, 0),
        new Date(2025, 9, 6, 0, 0, 0, 0),
        new Date(2025, 9, 13, 0, 0, 0, 0),
        new Date(2025, 9, 20, 0, 0, 0, 0),
        new Date(2025, 9, 27, 0, 0, 0, 0),
        new Date(2025, 9, 30, 0, 0, 0, 0),
      ]);
      // Band move them to monday because sunday does not exist.
      expect(ticks.map((tick) => tick.formattedValue)).to.deep.equal([
        'Sep 28',
        'Oct 05',
        'Oct 12',
        'Oct 19',
        'Oct 26',
        'Nov 02',
      ]);
    });

    it('should place tick at the start/middle/end according to the closest position of ticks value.', () => {
      const ticks = getTicks({
        ...defaultOptions,
        scale: scaleBand<number | string | Date>(sparseNumberData, [0, 100]),
        tickNumber: 4,
        tickInterval: [0, 10, 20, 25], // Force to have ticks outside bands.
        continuousTickPlacement: true,
      });

      expect(ticks).to.have.length(4); // Extra tick for the end
      expect(ticks.map((tick) => tick.value)).to.deep.equal([2, 10, 20, 24]);
      expect(ticks.map((tick) => tick.formattedValue)).to.deep.equal(['0', '10', '20', '25']);

      expect(ticks.map((tick) => Math.floor(tick.offset))).to.deep.equal([0, 36, 80, 100]);
    });

    it('should place extra tick at the beginning/end when nice values are close.', () => {
      const ticks = getTicks({
        ...defaultOptions,
        scale: scaleBand<number | string | Date>(
          Array.from({ length: 49 }, (_, i) => i + 1),
          [0, 100],
        ),
        tickNumber: 4,
        continuousTickPlacement: true,
      });

      expect(ticks.map((tick) => tick.value)).to.deep.equal([1, 10, 20, 30, 40, 49]);
      // 0 and 50 are out of range but close enough to be added.
      expect(ticks.map((tick) => tick.formattedValue)).to.deep.equal([
        '0',
        '10',
        '20',
        '30',
        '40',
        '50',
      ]);
    });
  });

  it('should not place extra tick at the beginning/end when nice values are too far.', () => {
    const ticks = getTicks({
      ...defaultOptions,
      scale: scaleBand<number | string | Date>(
        Array.from({ length: 42 }, (_, i) => i + 4), // numbers in [4, 45]
        [0, 100],
      ),
      tickNumber: 4,
      continuousTickPlacement: true,
    });

    // 0 and 50 are not added cause too far from range [4, 45].
    expect(ticks.map((tick) => tick.value)).to.deep.equal([10, 20, 30, 40]);
    expect(ticks.map((tick) => tick.formattedValue)).to.deep.equal(['10', '20', '30', '40']);

    expect(ticks.map((tick) => Math.floor(tick.offset))).to.deep.equal([15, 39, 63, 86]);
  });
});
