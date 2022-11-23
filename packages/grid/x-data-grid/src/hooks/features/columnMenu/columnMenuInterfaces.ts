import * as React from 'react';

export interface GridColumnMenuState {
  open: boolean;
  field?: string;
}

export interface GridColumnMenuSlot {
  component: React.JSXElementConstructor<any>;
  /**
   * Every item has a `displayOrder` based which it will be placed before or after other
   * items in the column menu, `array.prototype.sort` is applied to sort the items.
   * Note: If same `displayOrder` is applied to two or more items they will be sorted
   * based on the definition order
   */
  displayOrder: number;
}

export type GridColumnMenuValue = Array<GridColumnMenuSlot>;

export interface GridColumnMenuRootProps {
  initialItems: GridColumnMenuValue;
  // TODO: type this `key` for each package
  slots: { [key: string]: GridColumnMenuSlot };
}
