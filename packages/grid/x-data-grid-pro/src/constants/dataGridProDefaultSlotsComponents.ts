import { DATA_GRID_DEFAULT_SLOTS_COMPONENTS } from '@mui/x-data-grid/internals';
import type { GridProSlotsComponent } from '../models';
import { GridProColumnMenu } from '../components/GridProColumnMenu';
import { GridColumnHeaders } from '../components/GridColumnHeaders';
import { GridHeaderFilterAdornment } from '../components/headerFiltering/GridHeaderFilterAdornment';
import { GridHeaderFilterMenu } from '../components/headerFiltering/GridHeaderFilterMenu';
import { GridHeaderFilterCell } from '../components/headerFiltering/GridHeaderFilterCell';
import { GridHeaderFilterClearIcon } from '../components/headerFiltering/GridHeaderFilterClearIcon';
import materialSlots from '../material';

export const DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS: GridProSlotsComponent = {
  ...DATA_GRID_DEFAULT_SLOTS_COMPONENTS,
  ...materialSlots,
  ColumnMenu: GridProColumnMenu,
  ColumnHeaders: GridColumnHeaders,
  HeaderFilterAdornment: GridHeaderFilterAdornment,
  HeaderFilterCell: GridHeaderFilterCell,
  HeaderFilterMenu: GridHeaderFilterMenu,
  HeaderFilterClearIcon: GridHeaderFilterClearIcon,
};
