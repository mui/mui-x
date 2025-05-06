'use client';
import * as React from 'react';
import { ChartsToolbarSlotProps, ChartsToolbarSlots } from '../internals/material';

type SlotProps<T extends Record<keyof T, React.ComponentType<any>>> = {
  [key in keyof T]: React.ComponentProps<T[key]>;
};

export interface ChartsSlotsContextValue<
  T extends ChartsToolbarSlots & Record<keyof T, React.ComponentType<any>> = ChartsToolbarSlots,
> {
  slots: T;
  slotProps: Partial<SlotProps<T>>;
}

export const ChartsSlotsContext = React.createContext<ChartsSlotsContextValue | null>(null);

if (process.env.NODE_ENV !== 'production') {
  ChartsSlotsContext.displayName = 'ChartsSlotsContext';
}

export function useChartToolbarSlots<
  T extends ChartsToolbarSlots & Record<keyof T, React.ComponentType<any>> = ChartsToolbarSlots,
>(): ChartsSlotsContextValue<T> {
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

  return context as ChartsSlotsContextValue<T>;
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
