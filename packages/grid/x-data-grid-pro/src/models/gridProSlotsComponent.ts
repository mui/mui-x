import { GridSlotsComponent } from '@mui/x-data-grid';
import { UncapitalizeObjectKeys } from '@mui/x-data-grid/internals';
import { GridProIconSlotsComponent } from './gridProIconSlotsComponent';

/**
 * Grid components React prop interface containing all the overridable components
 * for Pro package
 */
export interface GridProSlotsComponent extends GridSlotsComponent, GridProIconSlotsComponent {
  /**
   * Component responsible for showing menu adornment in Header filter row
   * @default GridHeaderFilterCell
   */
  HeaderFilterCell: React.JSXElementConstructor<any>;
  /**
   * Component responsible for showing menu in Header filter row
   * @default GridHeaderFilterMenu
   */
  HeaderFilterMenu: React.JSXElementConstructor<any> | null;
}

// TODO: remove in v7
export interface UncapitalizedGridProSlotsComponent
  extends UncapitalizeObjectKeys<GridProSlotsComponent> {}
