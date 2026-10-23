import { clearWarningsCache } from '@mui/x-internals/warning';
import { describe, it, expect, beforeEach } from 'vitest';
import { getAgendaDayCount } from './getAgendaDayCount';
import { AGENDA_VIEW_DAYS_AMOUNT } from '../../constants';

describe('getAgendaDayCount', () => {
  beforeEach(() => {
    clearWarningsCache();
  });

  it('should default to AGENDA_VIEW_DAYS_AMOUNT when no value is provided', () => {
    expect(getAgendaDayCount(undefined)).to.equal(AGENDA_VIEW_DAYS_AMOUNT);
  });

  it('should return a positive whole number as is', () => {
    expect(getAgendaDayCount(1)).to.equal(1);
    expect(getAgendaDayCount(31)).to.equal(31);
  });

  it("should return 'month' as is", () => {
    expect(getAgendaDayCount('month')).to.equal('month');
  });

  [0, -3, 2.5, Number.NaN].forEach((value) => {
    it(`should fall back to AGENDA_VIEW_DAYS_AMOUNT and warn when the value is ${value}`, () => {
      let result;
      expect(() => {
        result = getAgendaDayCount(value);
      }).toWarnDev(['MUI X Scheduler: `viewConfig.agenda.dayCount` received an invalid value']);
      expect(result).to.equal(AGENDA_VIEW_DAYS_AMOUNT);
    });
  });
});
