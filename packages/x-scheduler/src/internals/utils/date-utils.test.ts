import { adapterPl } from 'test/utils/scheduler';
import { formatDayOfMonthAndMonthFullLetter, formatMonthFullLetterAndYear } from './date-utils';

describe('scheduler date-utils', () => {
  it('formats month and year with the standalone month token', () => {
    const june = adapterPl.date('2026-06-01T12:00:00Z', 'default');
    const f = adapterPl.formats;

    expect(formatMonthFullLetterAndYear(june, adapterPl)).to.equal(
      adapterPl.formatByString(june, `${f.monthFullLetterStandalone} ${f.yearPadded}`),
    );
  });

  it('formats day and month with the formatting month token', () => {
    const june13 = adapterPl.date('2026-06-13T12:00:00Z', 'default');
    const f = adapterPl.formats;

    expect(formatDayOfMonthAndMonthFullLetter(june13, adapterPl)).to.equal(
      adapterPl.formatByString(june13, `${f.dayOfMonth} ${f.monthFullLetter}`),
    );
  });
});
