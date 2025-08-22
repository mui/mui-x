import { GridSlotsComponent } from '@mui/x-data-grid';
import { GridProIconSlotsComponent } from './gridProIconSlotsComponent';
import type { GridProSlotProps } from './gridProSlotProps';

/**
 * Grid components React prop interface containing all the overridable components
 * for Pro package
 */
export interface GridProSlotsComponent extends GridSlotsComponent, GridProIconSlotsComponent {
  /**
   * Component responsible for showing menu adornment in Header filter row
   * @default GridHeaderFilterCell
   */
  headerFilterCell: React.JSXElementConstructor<any>;
  /**
   * Component responsible for showing menu in Header filter row
   * @default GridHeaderFilterMenu
   */
  headerFilterMenu: React.JSXElementConstructor<any> | null;
  /**
   * Component responsible for rendering the detail panels toggle.
   * @default GridDetailPanelsToggle
   */
  detailPanelsToggle: React.JSXElementConstructor<GridProSlotProps['detailPanelsToggle']>;
}
