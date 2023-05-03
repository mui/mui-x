import { GridSlotsComponentsProps } from '@mui/x-data-grid/internals';
import type { GridHeaderFilterCellOverridableProps } from '../components/headerFiltering/GridHeaderFilterCell';

export interface GridProSlotProps extends GridSlotsComponentsProps {
  headerFilter?: GridHeaderFilterCellOverridableProps;
}
