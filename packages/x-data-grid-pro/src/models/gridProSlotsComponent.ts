import type { GridSlotsComponent } from '@mui/x-data-grid';
import type { GridProIconSlotsComponent } from './gridProIconSlotsComponent';
import type { HeaderFilterCellPropsOverrides } from './gridProSlotProps';
import type { GridHeaderFilterCellProps } from '../components/headerFiltering/GridHeaderFilterCell';
import type { GridHeaderFilterMenuProps } from '../components/headerFiltering/GridHeaderFilterMenu';

/**
 * Grid components React prop interface containing all the overridable components
 * for Pro package
 */
export interface GridProSlotsComponent extends GridSlotsComponent, GridProIconSlotsComponent {
  /**
   * Component responsible for showing menu adornment in Header filter row
   * @default GridHeaderFilterCell
   */
  headerFilterCell: React.JSXElementConstructor<
    GridHeaderFilterCellProps & HeaderFilterCellPropsOverrides
  >;
  /**
   * Component responsible for showing menu in Header filter row
   * @default GridHeaderFilterMenu
   */
  headerFilterMenu: React.JSXElementConstructor<GridHeaderFilterMenuProps> | null;
}
