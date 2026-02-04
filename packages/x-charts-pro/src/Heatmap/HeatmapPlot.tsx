'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { HeatmapSVGPlot } from './HeatmapSVGPlot';
import { type HeatmapRendererPlotProps } from './Heatmap.types';

export interface HeatmapPlotProps extends HeatmapRendererPlotProps {}

function HeatmapPlot({ borderRadius, ...props }: HeatmapPlotProps): React.ReactNode {
  return <HeatmapSVGPlot borderRadius={borderRadius} {...props} />;
}

HeatmapPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The border radius of the heatmap cells in pixels.
   */
  borderRadius: PropTypes.number,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
} as any;

export { HeatmapPlot };
