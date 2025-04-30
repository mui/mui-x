'use client';
import * as React from 'react';
import materialSlots, { ChartsSlots, ChartsSlotProps } from '../material';

export interface ChartsToolbarSlotsContextValue {
  /**
   * The slots used by the ChartsToolbar and descendants.
   */
  slots: ChartsSlots;
  /**
   * The slot props used by the ChartsToolbar and descendants.
   */
  slotProps: Partial<ChartsSlotProps>;
}

export const ChartsToolbarSlotsContext = React.createContext<ChartsToolbarSlotsContextValue | null>(
  null,
);

if (process.env.NODE_ENV !== 'production') {
  ChartsToolbarSlotsContext.displayName = 'ChartsToolbarSlotsContext';
}

export function useChartToolbarSlots(): {
  slots: ChartsSlots;
  slotProps: Partial<ChartsSlotProps>;
} {
  const context = React.useContext(ChartsToolbarSlotsContext);

  if (context == null) {
    throw new Error(
      [
        'MUI X: Could not find the Charts Toolbar Slots context.',
        'It looks like you rendered your component outside of a Toolbar.',
        'This can also happen if you are bundling multiple versions of the library.',
      ].join('\n'),
    );
  }

  return context;
}

interface ChartsToolbarSlotsProviderProps {
  /**
   * The slots used by the ChartsToolbar and descendants.
   */
  slots?: Partial<ChartsSlots>;
  /**
   * The slot props used by the ChartsToolbar and descendants.
   */
  slotProps?: Partial<ChartsSlotProps>;
}

export function ChartsToolbarSlotsProvider(
  props: React.PropsWithChildren<ChartsToolbarSlotsProviderProps>,
) {
  const { slots, slotProps = {}, children } = props;

  const value = React.useMemo(
    () => ({ slots: { ...materialSlots, ...slots }, slotProps }),
    [slots, slotProps],
  );

  return (
    <ChartsToolbarSlotsContext.Provider value={value}>
      {children}
    </ChartsToolbarSlotsContext.Provider>
  );
}
