import { clearWarningsCache } from '@mui/x-internals/warning';
import { describe, it, expect, beforeEach } from 'vitest';
import { getVisibleStartTime } from './getVisibleStartTime';

const SOURCE = 'viewConfig.week';
const FULL_DAY = { startTime: 0, endTime: 24 };

describe('getVisibleStartTime', () => {
  beforeEach(() => {
    clearWarningsCache();
  });

  it('should default to 7 AM on the full day', () => {
    expect(getVisibleStartTime(undefined, FULL_DAY, SOURCE)).to.equal(7);
  });

  it('should clamp the default to startTime when the range starts later', () => {
    expect(getVisibleStartTime(undefined, { startTime: 8, endTime: 20 }, SOURCE)).to.equal(8);
  });

  it('should clamp the default to the top when the range ends before 7 AM', () => {
    expect(getVisibleStartTime(undefined, { startTime: 0, endTime: 6 }, SOURCE)).to.equal(0);
  });

  it('should return the provided value when it is inside the range', () => {
    expect(getVisibleStartTime(10, { startTime: 8, endTime: 20 }, SOURCE)).to.equal(10);
  });

  it('should accept fractional hours', () => {
    expect(getVisibleStartTime(7.5, FULL_DAY, SOURCE)).to.equal(7.5);
  });

  it('should accept the range bounds', () => {
    expect(getVisibleStartTime(8, { startTime: 8, endTime: 20 }, SOURCE)).to.equal(8);
    expect(getVisibleStartTime(20, { startTime: 8, endTime: 20 }, SOURCE)).to.equal(20);
  });

  it('should fall back to startTime and warn when the value is before the range', () => {
    let result;
    expect(() => {
      result = getVisibleStartTime(6, { startTime: 8, endTime: 20 }, SOURCE);
    }).toWarnDev(['MUI X Scheduler: `viewConfig.week` received an invalid `visibleStartTime`']);
    expect(result).to.equal(8);
  });

  it('should fall back to startTime and warn when the value is after the range', () => {
    let result;
    expect(() => {
      result = getVisibleStartTime(22, { startTime: 8, endTime: 20 }, SOURCE);
    }).toWarnDev(['MUI X Scheduler: `viewConfig.week` received an invalid `visibleStartTime`']);
    expect(result).to.equal(8);
  });

  it('should fall back to startTime and warn for non-finite values', () => {
    let result;
    expect(() => {
      result = getVisibleStartTime(Number.NaN, FULL_DAY, SOURCE);
    }).toWarnDev(['MUI X Scheduler: `viewConfig.week` received an invalid `visibleStartTime`']);
    expect(result).to.equal(0);
  });

  it('should warn once per source so one surface cannot mask another', () => {
    expect(() => {
      getVisibleStartTime(30, FULL_DAY, 'viewConfig.week');
      getVisibleStartTime(30, FULL_DAY, 'viewConfig.day');
      // The repeated source must not warn a second time.
      getVisibleStartTime(30, FULL_DAY, 'viewConfig.week');
    }).toWarnDev([
      'MUI X Scheduler: `viewConfig.week` received an invalid `visibleStartTime`',
      'MUI X Scheduler: `viewConfig.day` received an invalid `visibleStartTime`',
    ]);
  });
});
