export interface GridColumnMenuState {
  open: boolean;
  field?: string;
}

export interface GridColumnMenuLookup {
  displayName?: string;
  component: React.ReactNode;
}

export interface GridColumnMenuValue extends Array<GridColumnMenuLookup> {}
