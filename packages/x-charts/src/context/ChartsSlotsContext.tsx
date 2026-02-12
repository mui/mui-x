'use client';
import * as React from 'react';
import { type ChartsSlotProps, type ChartsSlots } from '../internals/material';

type SlotProps<T extends Record<keyof T, React.ComponentType<any>>> = {
  [key in keyof T]: React.ComponentProps<T[key]>;
};

export interface ChartsSlotsContextValue<
  T extends ChartsSlots & Record<keyof T, React.ComponentType<any>> = ChartsSlots,
> {
  slots: T;
  slotProps: Partial<SlotProps<T>>;
}

export const ChartsSlotsContext = React.createContext<ChartsSlotsContextValue | null>(null);

/**
 * Get the slots and slotProps from the nearest `ChartsDataProvider` or `ChartsDataProviderPro`.
 * @returns {ChartsSlotsContextValue} The slots and slotProps from the context.
 */
export function useChartsSlots<
  T extends ChartsSlots & Record<keyof T, React.ComponentType<any>> = ChartsSlots,
>(): ChartsSlotsContextValue<T> {
  const context = React.useContext(ChartsSlotsContext);

  if (context == null) {
    throw new Error(
      [
        'MUI X Charts: Could not find the Charts Slots context.',
        'It looks like you rendered your component outside of a ChartsDataProvider.',
        'This can also happen if you are bundling multiple versions of the library.',
      ].join('\n'),
    );
  }

  return context as ChartsSlotsContextValue<T>;
}

interface ChartsSlotsProviderProps {
  slots?: Partial<ChartsSlots>;
  slotProps?: Partial<ChartsSlotProps>;
  defaultSlots: ChartsSlots;
}

export function ChartsSlotsProvider(props: React.PropsWithChildren<ChartsSlotsProviderProps>) {
  const { slots, slotProps = {}, defaultSlots, children } = props;

  const value = React.useMemo(
    () => ({ slots: { ...defaultSlots, ...slots }, slotProps }),
    [defaultSlots, slots, slotProps],
  );

  return <ChartsSlotsContext.Provider value={value}>{children}</ChartsSlotsContext.Provider>;
}
