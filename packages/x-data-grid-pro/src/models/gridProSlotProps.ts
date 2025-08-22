import { GridSlotsComponentsProps } from '@mui/x-data-grid/internals';
import type { GridHeaderFilterCellProps } from '../components/headerFiltering/GridHeaderFilterCell';
import type { GridDetailPanelsToggleProps } from '../components/GridDetailPanelsToggle';

// Overrides for module augmentation
export interface HeaderFilterCellPropsOverrides {}
export interface DetailPanelsTogglePropsOverrides {}

type SlotProps<Props, Overrides> = Partial<Props & Overrides>;

export interface GridProSlotProps extends GridSlotsComponentsProps {
  headerFilterCell?: SlotProps<GridHeaderFilterCellProps, HeaderFilterCellPropsOverrides>;
  detailPanelsToggle: SlotProps<GridDetailPanelsToggleProps, DetailPanelsTogglePropsOverrides>;
}
