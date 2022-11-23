import * as React from 'react';

export interface GridColumnMenuState {
  open: boolean;
  field?: string;
}

export interface GridColumnMenuSlotProps {
  /**
   * Every item has a `displayOrder` based which it will be placed before or after other
   * items in the column menu, `array.prototype.sort` is applied to sort the items.
   * Note: If same `displayOrder` is applied to two or more items they will be sorted
   * based on the definition order
   */
  displayOrder: number;
}

export type GridColumnMenuValue = Array<React.JSXElementConstructor<any>>;

export interface GridColumnMenuRootProps {
  /**
   * Initial `slots` - it is internal, to be overrriden by Pro or Premium packages
   * @ignore - do not document.
   */
  defaultSlots: { [key: string]: React.JSXElementConstructor<any> };
  /**
   * Initial `slotsProps` - it is internal, to be overrriden by Pro or Premium packages
   * @ignore - do not document.
   */
  defaultSlotsProps: { [key: string]: GridColumnMenuSlotProps };
  /**
   * `slots` could be used to override default column menu slots
   */
  slots?: { [key: string]: React.JSXElementConstructor<any> | null };
  /**
   * Could be used to override props specific to a column menu slot
   * e.g. `displayOrder`
   */
  slotsProps?: { [key: string]: GridColumnMenuSlotProps };
}
