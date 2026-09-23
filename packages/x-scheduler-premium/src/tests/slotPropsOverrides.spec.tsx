import * as React from 'react';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import type { EventTimelinePremiumSlots, PropsFromSlot } from '@mui/x-scheduler-premium/models';

declare module '@mui/x-scheduler-premium/models' {
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
}: PropsFromSlot<EventTimelinePremiumSlots['timelineEventContent']>) {
  return (
    <span data-prop={customEventContentProp} data-resource={resource.id} data-variant={variant}>
      {occurrence.title}
    </span>
  );
}

function CustomResourceTitle({
  resource,
  customResourceTitleProp,
}: PropsFromSlot<EventTimelinePremiumSlots['timelineResourceTitle']>) {
  return <span data-prop={customResourceTitleProp}>{resource.title}</span>;
}

export function AugmentedTimelineSlotsUsage() {
  return (
    <EventTimelinePremium
      events={[]}
      resources={[]}
      slots={{
        timelineEventContent: CustomEventContent,
        timelineResourceTitle: CustomResourceTitle,
      }}
      slotProps={{
        timelineEventContent: { customEventContentProp: 'a' },
        timelineResourceTitle: { customResourceTitleProp: 1 },
      }}
    />
  );
}
