'use client';
import * as React from 'react';
import { ChartsToolbarSlotProps, ChartsToolbarSlots } from '../material';

export interface ChartsSlotsContextValue {
  slots: ChartsToolbarSlots;
  slotProps: Partial<ChartsToolbarSlotProps>;
}

export const ChartsSlotsContext = React.createContext<ChartsSlotsContextValue | null>(null);

if (process.env.NODE_ENV !== 'production') {
  ChartsSlotsContext.displayName = 'ChartsSlotsContext';
}

export function useChartToolbarSlots(): ChartsSlotsContextValue {
  const context = React.useContext(ChartsSlotsContext);

  if (context == null) {
    throw new Error(
      [
        'MUI X Charts: Could not find the Charts Slots context.',
        'It looks like you rendered your component outside of a ChartDataProvider.',
        'This can also happen if you are bundling multiple versions of the library.',
      ].join('\n'),
    );
  }

  return context;
}

interface ChartsSlotsProviderProps {
  slots?: Partial<ChartsToolbarSlots>;
  slotProps?: Partial<ChartsToolbarSlotProps>;
  defaultSlots: ChartsToolbarSlots;
}

export function ChartsSlotsProvider(props: React.PropsWithChildren<ChartsSlotsProviderProps>) {
  const { slots, slotProps = {}, defaultSlots, children } = props;

  const value = React.useMemo(
    () => ({ slots: { ...defaultSlots, ...slots }, slotProps }),
    [defaultSlots, slots, slotProps],
  );

  return <ChartsSlotsContext.Provider value={value}>{children}</ChartsSlotsContext.Provider>;
}
