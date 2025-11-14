import * as React from 'react';
import { renderHook } from '@mui/internal-test-utils';
import { adapter } from 'test/utils/scheduler';
import { CalendarGridTimeColumnContext } from '../time-column/CalendarGridTimeColumnContext';
import { useCalendarGridGetDateFromPositionInColumn } from './useCalendarGridDateFromPositionInTimeColumn';

describe('useCalendarGridDateFromPositionInTimeColumn', () => {
  const START = adapter.date('2024-01-15T00:00:00', 'default');

  function Wrapper({ children }: { children: React.ReactNode }) {
    const value: CalendarGridTimeColumnContext = React.useMemo(
      () => ({
        index: 0,
        start: START,
        end: adapter.addHours(START, 12),
        getCursorPositionInElementMs: ({ input }: any) => {
          const y = 'clientY' in input ? input.clientY : 0;
          return y * 60_000;
        },
      }),
      [],
    );

    return (
      <CalendarGridTimeColumnContext.Provider value={value}>
        {children}
      </CalendarGridTimeColumnContext.Provider>
    );
  }

  it('should return the initial hour when clientY = 0', () => {
    const { result } = renderHook(
      () =>
        useCalendarGridGetDateFromPositionInColumn({
          elementRef: { current: null },
          snapMinutes: 30,
        }),
      { wrapper: Wrapper },
    );
    const toDate = result.current(0);
    expect(toDate).to.toEqualDateTime(START);
  });

  it('should floor to the nearest snapMinutes (30) when falling between marks', () => {
    const { result } = renderHook(
      () =>
        useCalendarGridGetDateFromPositionInColumn({
          elementRef: { current: null },
          snapMinutes: 30,
        }),
      { wrapper: Wrapper },
    );

    const toDate = result.current(41); // 41 min -> floors to 30
    const expected = adapter.addMinutes(START, 30);
    expect(toDate).to.toEqualDateTime(expected);
  });

  it('should respect the exact multiple of snap (60 min with snap 30)', () => {
    const { result } = renderHook(
      () =>
        useCalendarGridGetDateFromPositionInColumn({
          elementRef: { current: null },
          snapMinutes: 30,
        }),
      { wrapper: Wrapper },
    );

    const toDate = result.current(60);
    const expected = adapter.addMinutes(START, 60);
    expect(toDate).to.toEqualDateTime(expected);
  });

  it('should work with another snap (15 min)', () => {
    const { result } = renderHook(
      () =>
        useCalendarGridGetDateFromPositionInColumn({
          elementRef: { current: null },
          snapMinutes: 15,
        }),
      { wrapper: Wrapper },
    );

    const toDate = result.current(22); // 22 -> floors to 15
    const expected = adapter.addMinutes(START, 15);
    expect(toDate).to.toEqualDateTime(expected);
  });
});
