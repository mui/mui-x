import { GridProSlotsComponent } from '@mui/x-data-grid-pro';
import { GridPremiumIconSlotsComponent } from './gridPremiumIconSlotsComponent';

/**
 * Grid components React prop interface containing all the overridable components
 * for Premium package
 */
export interface GridPremiumSlotsComponent
  extends GridProSlotsComponent,
    GridPremiumIconSlotsComponent {
  /**
   * Component rendered when pivot mode is enabled but no rows are defined.
   * @default GridEmptyPivotOverlay
   */
  emptyPivotOverlay: React.JSXElementConstructor<any>;
}
