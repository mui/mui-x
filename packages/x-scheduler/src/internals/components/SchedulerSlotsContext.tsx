'use client';
import * as React from 'react';
import { EMPTY_OBJECT } from '@base-ui/utils/empty';
import type { SchedulerSlots, SchedulerSlotProps } from '../../models/slots';

export interface SchedulerSlotsContextValue<
  TSlots extends SchedulerSlots = SchedulerSlots,
  TSlotProps extends SchedulerSlotProps = SchedulerSlotProps,
> {
  slots: TSlots;
  slotProps: TSlotProps;
}

const EMPTY_SLOTS: SchedulerSlotsContextValue = {
  slots: EMPTY_OBJECT as SchedulerSlots,
  slotProps: EMPTY_OBJECT as SchedulerSlotProps,
};

// Defaults to the empty set rather than throwing: the dialog renders its built-in content when
// mounted without a scheduler root, which is how most of the tests exercise it.
export const SchedulerSlotsContext = React.createContext<SchedulerSlotsContextValue>(EMPTY_SLOTS);

// The context holds whatever the surface received. Each consumer reads it as the slots
// interface of its own surface, like `useChartsSlots`.
export function useSchedulerSlots<
  TSlots extends SchedulerSlots = SchedulerSlots,
  TSlotProps extends SchedulerSlotProps = SchedulerSlotProps,
>(): SchedulerSlotsContextValue<TSlots, TSlotProps> {
  return React.useContext(SchedulerSlotsContext) as SchedulerSlotsContextValue<TSlots, TSlotProps>;
}

export interface SchedulerSlotsProviderProps {
  slots: SchedulerSlots | undefined;
  slotProps: SchedulerSlotProps | undefined;
  children: React.ReactNode;
}

export function SchedulerSlotsProvider(props: SchedulerSlotsProviderProps) {
  const {
    slots = EMPTY_OBJECT as SchedulerSlots,
    slotProps = EMPTY_OBJECT as SchedulerSlotProps,
    children,
  } = props;

  const value = React.useMemo(() => ({ slots, slotProps }), [slots, slotProps]);

  return <SchedulerSlotsContext.Provider value={value}>{children}</SchedulerSlotsContext.Provider>;
}
