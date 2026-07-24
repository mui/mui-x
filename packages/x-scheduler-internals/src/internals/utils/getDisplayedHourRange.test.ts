import { clearWarningsCache } from '@mui/x-internals/warning';
import { getDisplayedHourRange } from './getDisplayedHourRange';

describe('getDisplayedHourRange', () => {
  beforeEach(() => {
    clearWarningsCache();
  });

  it('should default to the full day when no value is provided', () => {
    expect(getDisplayedHourRange()).to.deep.equal({ startTime: 0, endTime: 24 });
  });

  it('should return the provided range when it is valid', () => {
    expect(getDisplayedHourRange(8, 20)).to.deep.equal({ startTime: 8, endTime: 20 });
  });

  it('should accept the full-day bounds', () => {
    expect(getDisplayedHourRange(0, 24)).to.deep.equal({ startTime: 0, endTime: 24 });
  });

  it('should fall back to the full day and warn when startTime is not lower than endTime', () => {
    let result;
    expect(() => {
      result = getDisplayedHourRange(20, 8);
    }).toWarnDev(['MUI X Scheduler: Received an invalid hour range']);
    expect(result).to.deep.equal({ startTime: 0, endTime: 24 });
  });

  it('should fall back to the full day and warn when startTime equals endTime', () => {
    let result;
    expect(() => {
      result = getDisplayedHourRange(8, 8);
    }).toWarnDev(['MUI X Scheduler: Received an invalid hour range']);
    expect(result).to.deep.equal({ startTime: 0, endTime: 24 });
  });

  it('should fall back to the full day and warn for non-integer values', () => {
    let result;
    expect(() => {
      result = getDisplayedHourRange(8.5, 20);
    }).toWarnDev(['MUI X Scheduler: Received an invalid hour range']);
    expect(result).to.deep.equal({ startTime: 0, endTime: 24 });
  });

  it('should fall back to the full day and warn for out-of-bounds values', () => {
    let result;
    expect(() => {
      result = getDisplayedHourRange(-1, 26);
    }).toWarnDev(['MUI X Scheduler: Received an invalid hour range']);
    expect(result).to.deep.equal({ startTime: 0, endTime: 24 });
  });
});
