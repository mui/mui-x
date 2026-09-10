import * as React from 'react';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { useEventDialogOccurrence } from '@mui/x-scheduler/event-dialog';
import type {
  EventTimelineSlotProps,
  EventTimelineSlots,
  PropsFromSlot,
  SchedulerSlots,
} from '@mui/x-scheduler/models';

declare module '@mui/x-scheduler/models' {
  interface EventDialogGeneralTabPropsOverrides {
    customGeneralTabProp?: string;
  }
}

function CustomGeneralTab({
  customGeneralTabProp,
}: PropsFromSlot<SchedulerSlots['eventDialogGeneralTab']>) {
  const occurrence = useEventDialogOccurrence();
  return <div data-prop={customGeneralTabProp}>{occurrence.title}</div>;
}

export function AugmentedGeneralTabUsage() {
  return (
    <EventCalendar
      events={[]}
      slots={{ eventDialogGeneralTab: CustomGeneralTab }}
      slotProps={{ eventDialogGeneralTab: { customGeneralTabProp: 'a' } }}
    />
  );
}

declare module '@mui/x-scheduler/models' {
  interface TimelineEventContentPropsOverrides {
    customEventContentProp?: string;
  }
  interface TimelineResourceTitlePropsOverrides {
    customResourceTitleProp?: number;
  }
}

function CustomEventContent({
  occurrence,
  resource,
  variant,
  customEventContentProp,
}: PropsFromSlot<EventTimelineSlots['timelineEventContent']>) {
  return (
    <span data-prop={customEventContentProp} data-resource={resource.id} data-variant={variant}>
      {occurrence.title}
    </span>
  );
}

function CustomResourceTitle({
  resource,
  customResourceTitleProp,
}: PropsFromSlot<EventTimelineSlots['timelineResourceTitle']>) {
  return <span data-prop={customResourceTitleProp}>{resource.title}</span>;
}

// The Event Timeline lives in the premium package, so only the types are exercised here.
export const augmentedTimelineSlots: EventTimelineSlots = {
  timelineEventContent: CustomEventContent,
  timelineResourceTitle: CustomResourceTitle,
};
export const augmentedTimelineSlotProps: EventTimelineSlotProps = {
  timelineEventContent: { customEventContentProp: 'a' },
  timelineResourceTitle: { customResourceTitleProp: 1 },
};
