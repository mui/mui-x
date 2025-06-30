import { GridProSlotProps } from '@mui/x-data-grid-pro/internals';
import type { GridChartsConfigurationPanelProps } from '../components/chartsPanel/GridChartsConfigurationPanel';

// Overrides for module augmentation
export interface GridChartsConfigurationPanelPropsOverrides {}

type SlotProps<Props, Overrides> = Partial<Props & Overrides>;

export interface GridPremiumSlotProps extends GridProSlotProps {
  chartsConfigurationPanel?: SlotProps<
    GridChartsConfigurationPanelProps,
    GridChartsConfigurationPanelPropsOverrides
  >;
}
