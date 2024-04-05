import { expect } from 'chai';
import { adapterToUse } from 'test/utils/pickers';
import { calculateRangeChange, calculateRangePreview } from './date-range-manager';
import { DateRange } from '../../models';

const start2018 = adapterToUse.date('2018-01-01');
const start2018At4PM = adapterToUse.date('2018-01-01T16:00:00');
const mid2018 = adapterToUse.date('2018-07-01');
const end2019 = adapterToUse.date('2019-01-01');

describe('date-range-manager', () => {
  [
    {
      range: [null, null],
      rangePosition: 'start' as const,
      newDate: start2018,
      expectedRange: [start2018, null],
      expectedNextSelection: 'end' as const,
    },
    {
      range: [start2018, null],
      rangePosition: 'start' as const,
      newDate: end2019,
      expectedRange: [end2019, null],
      expectedNextSelection: 'end' as const,
    },
    {
      range: [null, end2019],
      rangePosition: 'start' as const,
      newDate: mid2018,
      expectedRange: [mid2018, end2019],
      expectedNextSelection: 'end' as const,
    },
    {
      range: [null, end2019],
      rangePosition: 'end' as const,
      newDate: mid2018,
      expectedRange: [null, mid2018],
      expectedNextSelection: 'start' as const,
    },
    {
      range: [mid2018, null],
      rangePosition: 'start' as const,
      newDate: start2018,
      expectedRange: [start2018, null],
      expectedNextSelection: 'end' as const,
    },
    {
      range: [start2018, end2019],
      rangePosition: 'start' as const,
      newDate: mid2018,
      expectedRange: [mid2018, end2019],
      expectedNextSelection: 'end' as const,
    },
    {
      range: [start2018, end2019],
      rangePosition: 'end' as const,
      newDate: mid2018,
      expectedRange: [start2018, mid2018],
      expectedNextSelection: 'start' as const,
    },
    {
      range: [mid2018, end2019],
      rangePosition: 'start' as const,
      newDate: start2018,
      expectedRange: [start2018, end2019],
      expectedNextSelection: 'end' as const,
    },
    {
      range: [start2018, mid2018],
      rangePosition: 'end' as const,
      newDate: mid2018,
      expectedRange: [start2018, mid2018],
      expectedNextSelection: 'start' as const,
    },
    {
      range: [start2018, mid2018],
      rangePosition: 'start' as const,
      newDate: end2019,
      expectedRange: [mid2018, end2019],
      allowRangeFlip: true,
      expectedNextSelection: 'start' as const,
    },
    {
      range: [mid2018, end2019],
      rangePosition: 'end' as const,
      newDate: start2018,
      expectedRange: [start2018, mid2018],
      allowRangeFlip: true,
      expectedNextSelection: 'end' as const,
    },
    {
      range: [start2018At4PM, null],
      rangePosition: 'end' as const,
      newDate: start2018,
      expectedRange: [start2018At4PM, start2018],
      allowRangeFlip: false,
      expectedNextSelection: 'start' as const,
    },
  ].forEach(
    ({ range, rangePosition, newDate, expectedRange, allowRangeFlip, expectedNextSelection }) => {
      it(`calculateRangeChange should return ${expectedRange} when selecting ${rangePosition} of ${range} with user input ${newDate}`, () => {
        expect(
          calculateRangeChange({
            utils: adapterToUse,
            range: range as DateRange<Date>,
            newDate,
            rangePosition,
            allowRangeFlip,
          }),
        ).to.deep.equal({
          nextSelection: expectedNextSelection,
          newRange: expectedRange,
        });
      });
    },
  );

  [
    {
      range: [start2018, end2019],
      rangePosition: 'start' as const,
      newDate: null,
      expectedRangePreview: [null, null],
    },
    {
      range: [null, null],
      rangePosition: 'start' as const,
      newDate: start2018,
      expectedRangePreview: [start2018, null],
    },
    {
      range: [start2018, null],
      rangePosition: 'start' as const,
      newDate: end2019,
      expectedRangePreview: [end2019, null],
    },
    {
      range: [null, end2019],
      rangePosition: 'start' as const,
      newDate: mid2018,
      expectedRangePreview: [mid2018, end2019],
    },
    {
      range: [null, end2019],
      rangePosition: 'end' as const,
      newDate: mid2018,
      expectedRangePreview: [null, mid2018],
    },
    {
      range: [mid2018, null],
      rangePosition: 'start' as const,
      newDate: start2018,
      expectedRangePreview: [start2018, null],
    },
    {
      range: [mid2018, end2019],
      rangePosition: 'start' as const,
      newDate: start2018,
      expectedRangePreview: [start2018, mid2018],
    },
    {
      range: [start2018, mid2018],
      rangePosition: 'end' as const,
      newDate: end2019,
      expectedRangePreview: [mid2018, end2019],
    },
  ].forEach(({ range, rangePosition, newDate, expectedRangePreview }) => {
    it(`calculateRangePreview should return ${expectedRangePreview} when selecting ${rangePosition} of $range when user hover ${newDate}`, () => {
      expect(
        calculateRangePreview({
          utils: adapterToUse,
          range: range as DateRange<Date>,
          newDate,
          rangePosition,
        }),
      ).to.deep.equal(expectedRangePreview);
    });
  });
});
