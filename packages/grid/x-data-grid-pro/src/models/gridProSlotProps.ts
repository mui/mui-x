import { GridSlotsComponentsProps } from '@mui/x-data-grid/internals';
import type { GridHeaderFilterItemOverridableProps } from '../components/headerFiltering/GridHeaderFilterItem';

export interface GridProSlotProps extends GridSlotsComponentsProps {
  headerFilter?: GridHeaderFilterItemOverridableProps;
}
