import type * as React from 'react';
import type {
  SchedulerRenderableEventOccurrence,
  SchedulerResource,
} from '@mui/x-scheduler-internals/models';

/**
 * Augment this interface to type the extra props passed through
 * `slotProps.eventDialogGeneralTab`.
 */
export interface EventDialogGeneralTabPropsOverrides {}

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

export interface SchedulerSlots {
  /**
   * The content of the "General" tab of the event editing surface:
   * the dialog on regular views, the compact editing drawer on compact views.
   * It is rendered inside the tab panel, so it must not render a tab panel of its own.
   * Return a fragment rather than a wrapper element to keep the spacing between the sections.
   * @default EventDialogGeneralTabContent
   */
  eventDialogGeneralTab?: React.ComponentType<EventDialogGeneralTabPropsOverrides>;
}

export interface SchedulerSlotProps {
  /**
   * Props forwarded to the `eventDialogGeneralTab` slot.
   */
  eventDialogGeneralTab?: EventDialogGeneralTabPropsOverrides;
}

export interface SchedulerSlotsAndSlotProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: SchedulerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: SchedulerSlotProps;
}

export interface EventTimelineSlots extends SchedulerSlots {
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

export interface EventTimelineSlotProps extends SchedulerSlotProps {
  /**
   * Props forwarded to the `timelineEventContent` slot.
   */
  timelineEventContent?: TimelineEventContentPropsOverrides;
  /**
   * Props forwarded to the `timelineResourceTitle` slot.
   */
  timelineResourceTitle?: TimelineResourceTitlePropsOverrides;
}

export interface EventTimelineSlotsAndSlotProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: EventTimelineSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: EventTimelineSlotProps;
}
