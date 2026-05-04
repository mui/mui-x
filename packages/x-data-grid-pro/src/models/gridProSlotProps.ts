import type { WithDataAttributes } from '@mui/x-internals/types';
import type { GridSlotsComponentsProps } from '@mui/x-data-grid/internals';
import type { GridHeaderFilterCellProps } from '../components/headerFiltering/GridHeaderFilterCell';

// Overrides for module augmentation
export interface HeaderFilterCellPropsOverrides {}

type SlotProps<Props, Overrides> = WithDataAttributes<Partial<Props & Overrides>>;

export interface GridProSlotProps extends GridSlotsComponentsProps {
  headerFilterCell?: SlotProps<GridHeaderFilterCellProps, HeaderFilterCellPropsOverrides>;
}
