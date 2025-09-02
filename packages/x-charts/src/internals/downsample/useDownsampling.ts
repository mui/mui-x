import * as React from 'react';
import type { MakeOptional } from '@mui/x-internals/types';
import type { AllSeriesType, AxisConfig } from '../../models';
import type { DownsampleProp } from './types';
import { getSamplingFunction, getTargetPoints } from './utils';

/**
 * Apply chart-level downsampling to series data and axis data
 * This ensures consistent downsampling across all series and maintains axis alignment
 */
export function useDownsampling<T extends 'line' | 'bar'>(
  series: Readonly<AllSeriesType<T>[]>,
  axes: Readonly<MakeOptional<Readonly<AxisConfig<any, any, any>>, 'id'>[]>,
  downsample: DownsampleProp<number | null>,
) {
  const samplingFn = getSamplingFunction(downsample);
  const targetPoints = getTargetPoints(downsample);

  const result = React.useMemo(() => {
    if (!samplingFn) {
      return {
        series,
        axes,
      };
    }

    const downsampledSeries = series.map((s) => ({
      ...s,
      data: s.data ? samplingFn(s.data, targetPoints, 'series') : null,
    }));

    const downsampledAxes = axes.map((a) => ({
      ...a,
      data: a.data ? samplingFn(a.data, targetPoints, 'axis') : undefined,
    }));

    return {
      series: downsampledSeries,
      axes: downsampledAxes,
    };
  }, [samplingFn, series, axes, targetPoints]);

  return result;
}
