export interface GridContextMenuClasses {
  /** Styles applied to the grid context menu root element. */
  gridContextMenu: string;
  /** Styles applied to the grid context menu new event item element. */
  gridContextMenuNewEventItem: string;
}

export type GridContextMenuClassKey = keyof GridContextMenuClasses;

export const gridContextMenuClassKeys: GridContextMenuClassKey[] = [
  'gridContextMenu',
  'gridContextMenuNewEventItem',
];

// Create a slots object for reuse in useUtilityClasses (avoids duplication in EventCalendar.tsx and EventTimelinePremium.tsx)
export const gridContextMenuSlots: Record<GridContextMenuClassKey, [GridContextMenuClassKey]> = {
  gridContextMenu: ['gridContextMenu'],
  gridContextMenuNewEventItem: ['gridContextMenuNewEventItem'],
};
