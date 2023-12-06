import { DATA_GRID_DEFAULT_SLOTS_COMPONENTS } from '@mui/x-data-grid/internals';
import type { GridProSlotsComponent } from '../models';
import { GridProColumnMenu } from '../components/GridProColumnMenu';
import { GridColumnHeaders } from '../components/GridColumnHeaders';
import { GridHeaderFilterMenu } from '../components/headerFiltering/GridHeaderFilterMenu';
import { GridHeaderFilterCell } from '../components/headerFiltering/GridHeaderFilterCell';
import materialSlots from '../material';

export const DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS: GridProSlotsComponent = {
  ...DATA_GRID_DEFAULT_SLOTS_COMPONENTS,
  ...materialSlots,
  columnMenu: GridProColumnMenu,
  columnHeaders: GridColumnHeaders,
  headerFilterCell: GridHeaderFilterCell,
  headerFilterMenu: GridHeaderFilterMenu,
};
