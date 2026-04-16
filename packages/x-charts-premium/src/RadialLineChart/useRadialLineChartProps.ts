'use client';
import * as React from 'react';
import useId from '@mui/utils/useId';
import { type ChartsClipPathProps } from '../ChartsClipPath';
import { type ChartsRadialGridProps } from '../ChartsRadialGrid';
import { type ChartsLegendSlotExtension } from '../ChartsLegend';
import { type ChartsOverlayProps } from '../ChartsOverlay';

import { type ChartsRadialDataProviderProps } from '../ChartsRadialDataProvider';
import type { RadialLineChartProps } from './RadialLineChart';
import type { ChartsWrapperProps } from '../ChartsWrapper';
import {
  RADIAL_LINE_CHART_PLUGINS,
  type RadialLineChartPluginSignatures,
} from './RadialLineChart.plugins';
import { DEFAULT_ROTATION_AXIS_KEY } from '../constants';

/**
 * A helper function that extracts RadialLineChartProps from the input props
 * and returns an object with props for the children components of RadialLineChart.
 *
 * @param props The input props for RadialLineChart
 * @returns An object with props for the children components of RadialLineChart
 */
export const useRadialLineChartProps = (props: RadialLineChartProps) => {
  const {
    rotationAxis,
    radiusAxis,
    series,
    width,
    height,
    margin,
    colors,
    dataset,
    disableLineItemHighlight,
    hideLegend,
    grid,
    children,
    slots,
    slotProps,
    skipAnimation,
    loading,
    showToolbar,
    ...other
  } = props;

  const id = useId();
  const clipPathId = `${id}-clip-path`;

  const seriesWithDefault = React.useMemo(
    () =>
      series.map((s) => ({
        disableHighlight: !!disableLineItemHighlight,
        type: 'radialLine' as const,
        ...s,
      })),
    [disableLineItemHighlight, series],
  );

  const chartsContainerProps: ChartsRadialDataProviderProps<
    'radialLine',
    RadialLineChartPluginSignatures
  > = {
    ...other,
    series: seriesWithDefault,
    width,
    height,
    margin,
    colors,
    dataset,
    rotationAxis: rotationAxis ?? [
      {
        id: DEFAULT_ROTATION_AXIS_KEY,
        scaleType: 'point',
        data: Array.from(
          { length: Math.max(...series.map((s) => (s.data ?? dataset ?? []).length)) },
          (_, index) => index,
        ),
      },
    ],
    radiusAxis,
    skipAnimation,
    plugins: RADIAL_LINE_CHART_PLUGINS,
  };

  const gridProps: ChartsRadialGridProps | undefined = grid;

  const clipPathGroupProps = {
    clipPath: `url(#${clipPathId})`,
  };

  const clipPathProps: ChartsClipPathProps = {
    id: clipPathId,
  };

  const overlayProps: ChartsOverlayProps = {
    slots,
    slotProps,
    loading,
  };

  const legendProps: ChartsLegendSlotExtension = {
    slots,
    slotProps,
  };

  const chartsWrapperProps: Omit<ChartsWrapperProps, 'children'> = {
    legendPosition: props.slotProps?.legend?.position,
    legendDirection: props.slotProps?.legend?.direction,
    hideLegend: props.hideLegend ?? false,
  };

  return {
    chartsWrapperProps,
    chartsContainerProps,
    gridProps,
    clipPathProps,
    clipPathGroupProps,
    overlayProps,
    legendProps,
    children,
  };
};