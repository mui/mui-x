import * as React from 'react';

export interface GridColumnMenuState {
  open: boolean;
  field?: string;
}

export interface GridColumnMenuSlot {
  component: React.JSXElementConstructor<any>;
  priority: number;
}

export type GridColumnMenuValue = Array<GridColumnMenuSlot>;

export interface GridColumnMenuRootProps {
  initialItems: GridColumnMenuValue;
  slots: { [key: string]: GridColumnMenuSlot };
}
