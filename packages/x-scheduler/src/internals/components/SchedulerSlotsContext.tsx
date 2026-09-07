'use client';
import * as React from 'react';
import { EMPTY_OBJECT } from '@base-ui/utils/empty';
import type { SchedulerSlots, SchedulerSlotProps } from '../../models/slots';

export interface SchedulerSlotsContextValue {
  slots: SchedulerSlots;
  slotProps: SchedulerSlotProps;
}

const EMPTY_SLOTS: SchedulerSlotsContextValue = {
  slots: EMPTY_OBJECT as SchedulerSlots,
  slotProps: EMPTY_OBJECT as SchedulerSlotProps,
};

// Defaults to the empty set rather than throwing: the dialog renders its built-in content when
// mounted without a scheduler root, which is how most of the tests exercise it.
export const SchedulerSlotsContext = React.createContext<SchedulerSlotsContextValue>(EMPTY_SLOTS);

export function useSchedulerSlots(): SchedulerSlotsContextValue {
  return React.useContext(SchedulerSlotsContext);
}

export interface SchedulerSlotsProviderProps {
  slots: SchedulerSlots | undefined;
  slotProps: SchedulerSlotProps | undefined;
  children: React.ReactNode;
}

export function SchedulerSlotsProvider(props: SchedulerSlotsProviderProps) {
  const { slots, slotProps, children } = props;

  // Memoized on the individual slot references rather than on the `slots` / `slotProps`
  // containers, which are usually inline object literals with a new identity on every render.
  const eventDialogGeneralTab = slots?.eventDialogGeneralTab;
  const eventDialogGeneralTabProps = slotProps?.eventDialogGeneralTab;

  const value = React.useMemo(
    () => ({
      slots: eventDialogGeneralTab ? { eventDialogGeneralTab } : (EMPTY_OBJECT as SchedulerSlots),
      slotProps: eventDialogGeneralTabProps
        ? { eventDialogGeneralTab: eventDialogGeneralTabProps }
        : (EMPTY_OBJECT as SchedulerSlotProps),
    }),
    [eventDialogGeneralTab, eventDialogGeneralTabProps],
  );

  return <SchedulerSlotsContext.Provider value={value}>{children}</SchedulerSlotsContext.Provider>;
}
