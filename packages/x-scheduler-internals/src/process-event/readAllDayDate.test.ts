import { describe, it, expect } from 'vitest';
import { readAllDayBounds, readAllDayExDate } from './readAllDayDate';

describe('readAllDayBounds', () => {
  it('should read date-only bounds as plain dates', () => {
    const { start, end } = readAllDayBounds({ id: 'e', start: '2025-07-04', end: '2025-07-05' });
    expect(start).toEqualPlainDate('2025-07-04');
    expect(end).toEqualPlainDate('2025-07-05');
  });

  it.each([
    '2025-07-04T00:00:00',
    '2025-07-04T23:59:59',
    '2025-07-04T00:00:00Z',
    '2025-07-04T10:00:00+02:00',
    '2025-02-30',
    '07/04/2025',
  ])('should throw for the start %s', (start) => {
    expect(() => readAllDayBounds({ id: 'e', start, end: '2025-07-05' })).to.throw(
      /is not an existing date in the YYYY-MM-DD format/,
    );
  });

  it('should throw for an end that is not after the start', () => {
    expect(() => readAllDayBounds({ id: 'e', start: '2025-07-04', end: '2025-07-04' })).to.throw(
      /is not after its start/,
    );
    expect(() => readAllDayBounds({ id: 'e', start: '2025-07-05', end: '2025-07-04' })).to.throw(
      /is not after its start/,
    );
  });

  it('should name the event and the bound in the error', () => {
    expect(() =>
      readAllDayBounds({ id: 'trip', start: '2025-07-04', end: '2025-07-05T00:00:00' }),
    ).to.throw(/The end "2025-07-05T00:00:00" of the all-day event "trip"/);
  });
});

describe('readAllDayExDate', () => {
  it('should throw for an exception date with a time', () => {
    expect(() => readAllDayExDate('2025-07-11T00:00:00Z', 'e')).to.throw(
      /exception date "2025-07-11T00:00:00Z" of the all-day event "e"/,
    );
    expect(readAllDayExDate('2025-07-11', 'e')).toEqualPlainDate('2025-07-11');
  });
});
