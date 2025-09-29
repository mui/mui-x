import * as React from 'react';
import { renderHook } from '@mui/internal-test-utils';
import { useGetDateFromPositionInColumn } from './useGetDateFromPositionInColumn';
import { getAdapter } from '../../utils/adapter/getAdapter';
import { TimeGridColumnContext } from './TimeGridColumnContext';

describe('useGetDateFromPositionInColumn', () => {
  const adapter = getAdapter();
  const START = adapter.date('2024-01-15T00:00:00');

  function Wrapper({ children }: { children: React.ReactNode }) {
    const value = React.useMemo(
      () => ({
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
      <TimeGridColumnContext.Provider value={value}>{children}</TimeGridColumnContext.Provider>
    );
  }

  it('should return the initial hour when clientY = 0', () => {
    const { result } = renderHook(
      () => useGetDateFromPositionInColumn({ elementRef: { current: null }, snapMinutes: 30 }),
      { wrapper: Wrapper },
    );
    const toDate = result.current(0);
    expect(toDate).to.toEqualDateTime(START);
  });

  it('should floor to the nearest snapMinutes (30) when falling between marks', () => {
    const { result } = renderHook(
      () => useGetDateFromPositionInColumn({ elementRef: { current: null }, snapMinutes: 30 }),
      { wrapper: Wrapper },
    );

    const toDate = result.current(41); // 41 min -> floors to 30
    const expected = adapter.addMinutes(START, 30);
    expect(toDate).to.toEqualDateTime(expected);
  });

  it('should respect the exact multiple of snap (60 min with snap 30)', () => {
    const { result } = renderHook(
      () => useGetDateFromPositionInColumn({ elementRef: { current: null }, snapMinutes: 30 }),
      { wrapper: Wrapper },
    );

    const toDate = result.current(60);
    const expected = adapter.addMinutes(START, 60);
    expect(toDate).to.toEqualDateTime(expected);
  });

  it('should work with another snap (15 min)', () => {
    const { result } = renderHook(
      () => useGetDateFromPositionInColumn({ elementRef: { current: null }, snapMinutes: 15 }),
      { wrapper: Wrapper },
    );

    const toDate = result.current(22); // 22 -> floors to 15
    const expected = adapter.addMinutes(START, 15);
    expect(toDate).to.toEqualDateTime(expected);
  });
});
