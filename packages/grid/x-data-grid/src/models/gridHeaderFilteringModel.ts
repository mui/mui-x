import { GridColDef } from './colDef';

export type GridHeaderFilteringState = {
  editing: GridColDef['field'] | null;
  menuOpen: GridColDef['field'] | null;
};
