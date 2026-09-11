import type * as React from 'react';
import type {
  SchedulerRenderableEventOccurrence,
  SchedulerResource,
} from '@mui/x-scheduler-internals/models';
import type { SchedulerSlots, SchedulerSlotProps } from '@mui/x-scheduler/models';

/**
 * Augment this interface to type the extra props passed through
 * `slotProps.timelineEventContent`.
 */
export interface TimelineEventContentPropsOverrides {}

/**
 * Augment this interface to type the extra props passed through
 * `slotProps.timelineResourceTitle`.
 */
export interface TimelineResourceTitlePropsOverrides {}

export interface TimelineEventContentProps {
  /**
   * The occurrence rendered by this event block.
   * While an event is dragged, resized or created, a placeholder occurrence with the pending dates.
   * A creation placeholder has an empty title and an id that matches no event.
   */
  occurrence: SchedulerRenderableEventOccurrence;
  /**
   * The resource of the row the block is rendered in, without its `children`.
   * A multi-resource event renders one block per row.
   */
  resource: Omit<SchedulerResource, 'children'>;
  /**
   * `placeholder` while the block previews a drag, a resize or a creation.
   */
  variant: 'regular' | 'placeholder';
}

export interface TimelineResourceTitleProps {
  /**
   * The resource rendered by this title cell, without its `children`.
   */
  resource: Omit<SchedulerResource, 'children'>;
}

export interface EventTimelinePremiumSlots extends SchedulerSlots {
  /**
   * The content of an event block.
   * It replaces the title text and is rendered inside the block, so the block keeps its
   * geometry, its drag and resize handles, and its button semantics.
   * The content is part of the accessible name of the event.
   * @default the occurrence title
   */
  timelineEventContent?: React.ComponentType<
    TimelineEventContentProps & TimelineEventContentPropsOverrides
  >;
  /**
   * The content of a resource title cell.
   * It replaces the title text and is rendered next to the legend color and the collapse toggle.
   * The content is part of the accessible name of every event in the row.
   * @default the resource title
   */
  timelineResourceTitle?: React.ComponentType<
    TimelineResourceTitleProps & TimelineResourceTitlePropsOverrides
  >;
}

export interface EventTimelinePremiumSlotProps extends SchedulerSlotProps {
  /**
   * Props forwarded to the `timelineEventContent` slot.
   */
  timelineEventContent?: TimelineEventContentPropsOverrides;
  /**
   * Props forwarded to the `timelineResourceTitle` slot.
   */
  timelineResourceTitle?: TimelineResourceTitlePropsOverrides;
}

export interface EventTimelinePremiumSlotsAndSlotProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: EventTimelinePremiumSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: EventTimelinePremiumSlotProps;
}
