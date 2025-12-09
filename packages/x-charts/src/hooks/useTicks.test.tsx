import { scaleBand } from '@mui/x-charts-vendor/d3-scale';
import { getTicks } from './useTicks';
import type { D3Scale } from '../models/axis';

const defaultOptions = {
  scale: scaleBand([1, 2, 3, 5], [0, 100]) as unknown as any,
  tickNumber: 5,
  isInside: (value: number) => value >= 0 && value <= 100,
};

const startDate = new Date(2025, 0, 6);

const weeks = Array.from({ length: 20 }, (_, i) => {
  const date = new Date(startDate);
  if (i !== 5) {
    date.setDate(startDate.getDate() + i * 7);
  } else {
    // Move one week to Wednesday for edge cases
    date.setDate(startDate.getDate() + i * 7 + 2);
  }
  return date;
});

describe('getTicks', () => {
  describe('band scale - ordinal ticks', () => {
    it('should add an empty tick at the end of the scale', () => {
      const ticks = getTicks(defaultOptions);

      expect(ticks).to.have.length(5); // Extra tick for the end
      expect(ticks.map((tick) => tick.value)).to.deep.equal([1, 2, 3, 5, undefined]);
      expect(ticks.map((tick) => tick.offset)).to.deep.equal([0, 25, 50, 75, 100]);
      expect(ticks.map((tick) => tick.labelOffset)).to.deep.equal([12.5, 12.5, 12.5, 12.5, 0]);
    });

    it('should not add an empty tick when tickPlacement is start', () => {
      const ticks = getTicks({ ...defaultOptions, tickPlacement: 'start' });

      expect(ticks).to.have.length(4); // No extra tick
      expect(ticks.map((tick) => tick.value)).to.deep.equal([1, 2, 3, 5]);
      expect(ticks.map((tick) => tick.offset)).to.deep.equal([0, 25, 50, 75]);
      expect(ticks.map((tick) => tick.labelOffset)).to.deep.equal([12.5, 12.5, 12.5, 12.5]);
    });
  });

  describe('band scale - time values', () => {
    it('should return no ticks if the ordinalTimeTicks array is empty', () => {
      const ticks = getTicks({
        ...defaultOptions,
        scale: scaleBand<Date>(weeks, [0, 100]) as unknown as D3Scale,
        tickNumber: 4,
        ordinalTimeTicks: [],
      });

      expect(ticks).to.deep.equal([]);
    });

    it('should place one tick per months', () => {
      const ticks = getTicks({
        ...defaultOptions,
        scale: scaleBand(weeks, [0, 100]) as unknown as D3Scale,
        tickNumber: 4,
        ordinalTimeTicks: ['months'],
      });

      expect(ticks.map(({ value }) => value.getMonth())).to.deep.equal([1, 2, 3, 4]);
    });

    it('should not place too many ticks', () => {
      const ticks = getTicks({
        ...defaultOptions,
        scale: scaleBand(weeks, [0, 100]) as unknown as D3Scale,
        tickNumber: 4,
        ordinalTimeTicks: ['years', 'quarterly', 'months', 'weeks', 'days'],
      });

      expect(ticks.map(({ value }) => value.getMonth())).to.deep.equal([1, 2, 3, 4]);
    });

    it('should place ticks when feasible even if it exceed the targeted ticks number', () => {
      const ticks = getTicks({
        ...defaultOptions,
        scale: scaleBand(weeks, [0, 100]) as unknown as D3Scale,
        tickNumber: 4,
        ordinalTimeTicks: ['years', 'weeks', 'days'],
      });

      // Since there is no year ticks to display we have to display weeks ticks even if it exceed the tickNumber
      expect(ticks.map(({ value }) => value.getMonth())).to.deep.equal([
        0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4,
      ]);
    });

    it('should support scale without value', () => {
      const ticks = getTicks({
        ...defaultOptions,
        scale: scaleBand([], [0, 100]) as unknown as D3Scale,
        tickNumber: 4,
        ordinalTimeTicks: ['months'],
      });

      expect(ticks).to.deep.equal([]);
    });

    it('should support scale with single value', () => {
      const ticks = getTicks({
        ...defaultOptions,
        scale: scaleBand([new Date(2025, 0, 1)], [0, 100]) as unknown as D3Scale,
        tickNumber: 4,
        ordinalTimeTicks: ['months'],
      });

      expect(ticks).to.deep.equal([]);
    });

    it('should ignore non Date values', () => {
      const weeksWithString = [...weeks.slice(0, 9), 'not a date', ...weeks.slice(9)];
      const ticks = getTicks({
        ...defaultOptions,
        scale: scaleBand(weeksWithString, [0, 100]) as unknown as D3Scale,
        tickNumber: 4,
        ordinalTimeTicks: ['months'],
      });

      expect(ticks.map(({ value }) => value.getMonth())).to.deep.equal([1, 2, 3, 4]);
    });
  });
});
