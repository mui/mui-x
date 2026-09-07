import type * as React from 'react';

/**
 * Augment this interface to type the extra props passed through
 * `slotProps.eventDialogGeneralTab`.
 */
export interface EventDialogGeneralTabPropsOverrides {}

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
