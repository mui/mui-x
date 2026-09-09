import type * as React from 'react';
import type {
  SchedulerRenderableEventOccurrence,
  SchedulerResource,
  SchedulerResourceId,
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
   * A placeholder occurrence while the block is being dragged or resized.
   */
  occurrence: SchedulerRenderableEventOccurrence;
  /**
   * The id of the resource row the block is rendered in.
   * A multi-resource event renders one block per row.
   */
  resourceId: SchedulerResourceId;
}

export interface TimelineResourceTitleProps {
  /**
   * The resource rendered by this title cell.
   */
  resource: SchedulerResource;
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
   * geometry, drag and resize handles and button semantics.
   * @default the occurrence title
   */
  timelineEventContent?: React.ComponentType<
    TimelineEventContentProps & TimelineEventContentPropsOverrides
  >;
  /**
   * The content of a resource title cell.
   * It replaces the title text and is rendered next to the legend color and the collapse toggle.
   * On a collapsible resource the whole cell toggles the collapse, so interactive content must stop propagation.
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
