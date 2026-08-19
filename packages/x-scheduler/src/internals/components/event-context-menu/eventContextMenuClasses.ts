export interface EventContextMenuClasses {
  /** Styles applied to the event context menu root element. */
  eventContextMenu: string;
  /** Styles applied to the event context menu edit item element. */
  eventContextMenuEditItem: string;
  /** Styles applied to the event context menu delete item element. */
  eventContextMenuDeleteItem: string;
}

export type EventContextMenuClassKey = keyof EventContextMenuClasses;

export const eventContextMenuClassKeys: EventContextMenuClassKey[] = [
  'eventContextMenu',
  'eventContextMenuEditItem',
  'eventContextMenuDeleteItem',
];

// Create a slots object for reuse in useUtilityClasses (avoids duplication in EventCalendar.tsx and EventTimelinePremium.tsx)
export const eventContextMenuSlots: Record<EventContextMenuClassKey, [EventContextMenuClassKey]> = {
  eventContextMenu: ['eventContextMenu'],
  eventContextMenuEditItem: ['eventContextMenuEditItem'],
  eventContextMenuDeleteItem: ['eventContextMenuDeleteItem'],
};
