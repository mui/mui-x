import {
  type HeatmapItemProps,
  type HeatmapItemSlotProps,
  type HeatmapItemSlots,
} from './HeatmapItem';

export interface HeatmapPlotSlots extends HeatmapItemSlots {}

export interface HeatmapPlotSlotProps extends HeatmapItemSlotProps {}

export interface HeatmapRendererPlotProps extends Pick<HeatmapItemProps, 'slots' | 'slotProps'> {
  /**
   * The border radius of the heatmap cells in pixels.
   */
  borderRadius?: number;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: HeatmapPlotSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: HeatmapPlotSlotProps;
}
