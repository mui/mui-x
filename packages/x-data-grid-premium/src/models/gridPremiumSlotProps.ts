import { GridProSlotProps } from '@mui/x-data-grid-pro/internals';
import type { GridChartsPanelProps } from '../components/chartsPanel/GridChartsPanel';

// Overrides for module augmentation
export interface GridChartsPanelPropsOverrides {}

type SlotProps<Props, Overrides> = Partial<Props & Overrides>;

export interface GridPremiumSlotProps extends GridProSlotProps {
  chartsPanel?: SlotProps<GridChartsPanelProps, GridChartsPanelPropsOverrides>;
}
