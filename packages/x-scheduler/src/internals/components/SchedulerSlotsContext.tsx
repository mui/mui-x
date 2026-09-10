'use client';
import * as React from 'react';
import { EMPTY_OBJECT } from '@base-ui/utils/empty';
import type { EventTimelineSlots, EventTimelineSlotProps } from '../../models/slots';

// The context carries the superset of every surface's slots; each public component
// narrows what it accepts through its own props type.
export interface SchedulerSlotsContextValue {
  slots: EventTimelineSlots;
  slotProps: EventTimelineSlotProps;
}

const EMPTY_SLOTS: SchedulerSlotsContextValue = {
  slots: EMPTY_OBJECT as EventTimelineSlots,
  slotProps: EMPTY_OBJECT as EventTimelineSlotProps,
};

// Defaults to the empty set rather than throwing: the dialog renders its built-in content when
// mounted without a scheduler root, which is how most of the tests exercise it.
export const SchedulerSlotsContext = React.createContext<SchedulerSlotsContextValue>(EMPTY_SLOTS);

export function useSchedulerSlots(): SchedulerSlotsContextValue {
  return React.useContext(SchedulerSlotsContext);
}

export interface SchedulerSlotsProviderProps {
  slots: EventTimelineSlots | undefined;
  slotProps: EventTimelineSlotProps | undefined;
  children: React.ReactNode;
}

export function SchedulerSlotsProvider(props: SchedulerSlotsProviderProps) {
  const { slots, slotProps, children } = props;

  // Memoized on the individual slot references rather than on the `slots` / `slotProps`
  // containers, which are usually inline object literals with a new identity on every render.
  const eventDialogGeneralTab = slots?.eventDialogGeneralTab;
  const timelineEventContent = slots?.timelineEventContent;
  const timelineResourceTitle = slots?.timelineResourceTitle;
  const eventDialogGeneralTabProps = slotProps?.eventDialogGeneralTab;
  const timelineEventContentProps = slotProps?.timelineEventContent;
  const timelineResourceTitleProps = slotProps?.timelineResourceTitle;

  const value = React.useMemo(
    () => ({
      slots: { eventDialogGeneralTab, timelineEventContent, timelineResourceTitle },
      slotProps: {
        eventDialogGeneralTab: eventDialogGeneralTabProps,
        timelineEventContent: timelineEventContentProps,
        timelineResourceTitle: timelineResourceTitleProps,
      },
    }),
    [
      eventDialogGeneralTab,
      timelineEventContent,
      timelineResourceTitle,
      eventDialogGeneralTabProps,
      timelineEventContentProps,
      timelineResourceTitleProps,
    ],
  );

  return <SchedulerSlotsContext.Provider value={value}>{children}</SchedulerSlotsContext.Provider>;
}
