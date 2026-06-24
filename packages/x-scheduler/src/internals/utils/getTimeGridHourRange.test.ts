import { clearWarningsCache } from '@mui/x-internals/warning';
import { getTimeGridHourRange } from './getTimeGridHourRange';

describe('getTimeGridHourRange', () => {
  beforeEach(() => {
    clearWarningsCache();
  });

  it('defaults to the full day when no value is provided', () => {
    expect(getTimeGridHourRange()).to.deep.equal({ startTime: 0, endTime: 24 });
  });

  it('returns the provided range when it is valid', () => {
    expect(getTimeGridHourRange(8, 20)).to.deep.equal({ startTime: 8, endTime: 20 });
  });

  it('accepts the full-day bounds', () => {
    expect(getTimeGridHourRange(0, 24)).to.deep.equal({ startTime: 0, endTime: 24 });
  });

  it('falls back to the full day and warns when startTime is not lower than endTime', () => {
    let result;
    expect(() => {
      result = getTimeGridHourRange(20, 8);
    }).toWarnDev(['MUI X Scheduler: The time-grid view received an invalid hour range']);
    expect(result).to.deep.equal({ startTime: 0, endTime: 24 });
  });

  it('falls back to the full day and warns for non-integer values', () => {
    let result;
    expect(() => {
      result = getTimeGridHourRange(8.5, 20);
    }).toWarnDev(['MUI X Scheduler: The time-grid view received an invalid hour range']);
    expect(result).to.deep.equal({ startTime: 0, endTime: 24 });
  });

  it('falls back to the full day and warns for out-of-bounds values', () => {
    let result;
    expect(() => {
      result = getTimeGridHourRange(-1, 26);
    }).toWarnDev(['MUI X Scheduler: The time-grid view received an invalid hour range']);
    expect(result).to.deep.equal({ startTime: 0, endTime: 24 });
  });
});
