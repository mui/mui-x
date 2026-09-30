import { clearWarningsCache } from '@mui/x-internals/warning';
import { describe, it, expect, beforeEach } from 'vitest';
import { getDisplayedHourRange } from './getDisplayedHourRange';

const SOURCE = 'viewConfig.week';

describe('getDisplayedHourRange', () => {
  beforeEach(() => {
    clearWarningsCache();
  });

  it('should default to the full day when no value is provided', () => {
    expect(getDisplayedHourRange(undefined, undefined, SOURCE)).to.deep.equal({
      startTime: 0,
      endTime: 24,
    });
  });

  it('should return the provided range when it is valid', () => {
    expect(getDisplayedHourRange(8, 20, SOURCE)).to.deep.equal({ startTime: 8, endTime: 20 });
  });

  it('should accept the full-day bounds', () => {
    expect(getDisplayedHourRange(0, 24, SOURCE)).to.deep.equal({ startTime: 0, endTime: 24 });
  });

  it('should default the missing bound of a one-sided range', () => {
    expect(getDisplayedHourRange(8, undefined, SOURCE)).to.deep.equal({
      startTime: 8,
      endTime: 24,
    });
    expect(getDisplayedHourRange(undefined, 20, SOURCE)).to.deep.equal({
      startTime: 0,
      endTime: 20,
    });
  });

  it('should fall back to the full day and warn when startTime is not lower than endTime', () => {
    let result;
    expect(() => {
      result = getDisplayedHourRange(20, 8, SOURCE);
    }).toWarnDev(['MUI X Scheduler: `viewConfig.week` received an invalid hour range']);
    expect(result).to.deep.equal({ startTime: 0, endTime: 24 });
  });

  it('should fall back to the full day and warn when startTime equals endTime', () => {
    let result;
    expect(() => {
      result = getDisplayedHourRange(8, 8, SOURCE);
    }).toWarnDev(['MUI X Scheduler: `viewConfig.week` received an invalid hour range']);
    expect(result).to.deep.equal({ startTime: 0, endTime: 24 });
  });

  it('should fall back to the full day and warn when a one-sided startTime leaves an empty range', () => {
    // `{ startTime: 24 }` resolves against the default endTime (24) and is invalid.
    let result;
    expect(() => {
      result = getDisplayedHourRange(24, undefined, SOURCE);
    }).toWarnDev(['MUI X Scheduler: `viewConfig.week` received an invalid hour range']);
    expect(result).to.deep.equal({ startTime: 0, endTime: 24 });
  });

  it('should fall back to the full day and warn for non-integer values', () => {
    let result;
    expect(() => {
      result = getDisplayedHourRange(8.5, 20, SOURCE);
    }).toWarnDev(['MUI X Scheduler: `viewConfig.week` received an invalid hour range']);
    expect(result).to.deep.equal({ startTime: 0, endTime: 24 });
  });

  it('should fall back to the full day and warn for out-of-bounds values', () => {
    let result;
    expect(() => {
      result = getDisplayedHourRange(-1, 26, SOURCE);
    }).toWarnDev(['MUI X Scheduler: `viewConfig.week` received an invalid hour range']);
    expect(result).to.deep.equal({ startTime: 0, endTime: 24 });
  });

  it('should warn once per source so one surface cannot mask another', () => {
    expect(() => {
      getDisplayedHourRange(20, 8, 'viewConfig.week');
      getDisplayedHourRange(20, 8, 'presetConfig.dayAndHour');
      // The repeated source must not warn a second time.
      getDisplayedHourRange(20, 8, 'viewConfig.week');
    }).toWarnDev([
      'MUI X Scheduler: `viewConfig.week` received an invalid hour range',
      'MUI X Scheduler: `presetConfig.dayAndHour` received an invalid hour range',
    ]);
  });
});
