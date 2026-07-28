import { clearWarningsCache } from '@mui/x-internals/warning';
import { getTimeGridHourRange } from './getTimeGridHourRange';

describe('getTimeGridHourRange', () => {
  beforeEach(() => {
    clearWarningsCache();
  });

  it('should default to the full day when no value is provided', () => {
    expect(getTimeGridHourRange()).to.deep.equal({ startTime: 0, endTime: 24 });
  });

  it('should return the provided range when it is valid', () => {
    expect(getTimeGridHourRange(8, 20)).to.deep.equal({ startTime: 8, endTime: 20 });
  });

  it('should accept the full-day bounds', () => {
    expect(getTimeGridHourRange(0, 24)).to.deep.equal({ startTime: 0, endTime: 24 });
  });

  it('should fall back to the full day and warn when startTime is not lower than endTime', () => {
    let result;
    expect(() => {
      result = getTimeGridHourRange(20, 8);
    }).toWarnDev(['MUI X Scheduler: The time-grid view received an invalid hour range']);
    expect(result).to.deep.equal({ startTime: 0, endTime: 24 });
  });

  it('should fall back to the full day and warn when startTime equals endTime', () => {
    let result;
    expect(() => {
      result = getTimeGridHourRange(8, 8);
    }).toWarnDev(['MUI X Scheduler: The time-grid view received an invalid hour range']);
    expect(result).to.deep.equal({ startTime: 0, endTime: 24 });
  });

  it('should fall back to the full day and warn for non-integer values', () => {
    let result;
    expect(() => {
      result = getTimeGridHourRange(8.5, 20);
    }).toWarnDev(['MUI X Scheduler: The time-grid view received an invalid hour range']);
    expect(result).to.deep.equal({ startTime: 0, endTime: 24 });
  });

  it('should fall back to the full day and warn for out-of-bounds values', () => {
    let result;
    expect(() => {
      result = getTimeGridHourRange(-1, 26);
    }).toWarnDev(['MUI X Scheduler: The time-grid view received an invalid hour range']);
    expect(result).to.deep.equal({ startTime: 0, endTime: 24 });
  });
});
