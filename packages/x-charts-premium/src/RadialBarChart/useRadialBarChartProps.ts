'use client';
import * as React from 'react';
import useId from '@mui/utils/useId';
import { type ChartsClipPathProps } from '../ChartsClipPath';
import { type ChartsRadialGridProps } from '../ChartsRadialGrid';
import { type ChartsLegendSlotExtension } from '../ChartsLegend';
import { type ChartsOverlayProps } from '../ChartsOverlay';

import { type ChartsRadialDataProviderProps } from '../ChartsRadialDataProvider';
import type { RadialBarChartProps } from './RadialBarChart';
import type { ChartsWrapperProps } from '../ChartsWrapper';
import {
  RADIAL_BAR_CHART_PLUGINS,
  type RadialBarChartPluginSignatures,
} from './RadialBarChart.plugins';
import { DEFAULT_ROTATION_AXIS_KEY } from '../constants';

/**
 * A helper function that extracts RadialBarChartProps from the input props
 * and returns an object with props for the children components of RadialBarChart.
 *
 * @param props The input props for RadialBarChart
 * @returns An object with props for the children components of RadialBarChart
 */
export const useRadialBarChartProps = (props: RadialBarChartProps) => {
  const {
    rotationAxis,
    radiusAxis,
    series,
    width,
    height,
    margin,
    colors,
    dataset,
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
        type: 'radialBar' as const,
        ...s,
      })),
    [series],
  );

  const defaultRotationAxis = React.useMemo(() => {
    return [
      {
        id: DEFAULT_ROTATION_AXIS_KEY,
        scaleType: 'band' as const,
        data: Array.from(
          { length: Math.max(...series.map((s) => (s.data ?? dataset ?? []).length)) },
          (_, index) => index,
        ),
      },
    ];
  }, [series, dataset]);

  const chartsContainerProps: ChartsRadialDataProviderProps<
    'radialBar',
    RadialBarChartPluginSignatures
  > = {
    ...other,
    series: seriesWithDefault,
    width,
    height,
    margin,
    colors,
    dataset,
    rotationAxis: rotationAxis ?? defaultRotationAxis,
    radiusAxis,
    skipAnimation,
    plugins: RADIAL_BAR_CHART_PLUGINS,
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
