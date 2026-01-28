'use client';
import * as React from 'react';
import { type MakeOptional } from '@mui/x-internals/types';
import { RADAR_PLUGINS, type RadarChartPluginSignatures } from '../RadarChart.plugins';
import { type RadarSeriesType } from '../../models/seriesType/radar';
import {
  type ChartsRadiusAxisProps,
  type ChartsRotationAxisProps,
  type PolarAxisConfig,
} from '../../models/axis';
import { ChartDataProvider, type ChartDataProviderProps } from '../../ChartDataProvider';
import { defaultizeMargin } from '../../internals/defaultizeMargin';
import { radarSeriesConfig } from '../seriesConfig';
import { type RadarConfig } from './radar.types';
import { type ChartAnyPluginSignature } from '../../internals/plugins/models/plugin';

const RADAR_SERIES_CONFIG = { radar: radarSeriesConfig };
const DEFAULT_RADAR_MARGIN = { top: 30, bottom: 30, left: 50, right: 50 };

export type RadarSeries = MakeOptional<RadarSeriesType, 'type'>;
export type RadarDataProviderProps<
  TSignatures extends readonly ChartAnyPluginSignature[] = RadarChartPluginSignatures,
> = Omit<
  ChartDataProviderProps<'radar', TSignatures>,
  'series' | 'rotationAxis' | 'radiusAxis' | 'dataset' | 'experimentalFeatures'
> & {
  /**
   * The series to display in the bar chart.
   * An array of [[RadarSeries]] objects.
   */
  series: Readonly<RadarSeries>[];
  /**
   * The configuration of the radar scales.
   */
  radar: RadarConfig;
  /**
   * Indicates if the chart should highlight items per axis or per series.
   * @default 'axis'
   */
  highlight?: 'axis' | 'series' | 'none';
};

function RadarDataProvider<
  TSignatures extends readonly ChartAnyPluginSignature[] = RadarChartPluginSignatures,
>(props: RadarDataProviderProps<TSignatures>) {
  const {
    series,
    children,
    width,
    height,
    colors,
    skipAnimation,
    margin,
    radar,
    highlight,
    plugins,
    ...other
  } = props;

  const rotationAxes: PolarAxisConfig<'point', string, ChartsRotationAxisProps>[] = React.useMemo(
    () => [
      {
        id: 'radar-rotation-axis',
        scaleType: 'point',
        data: radar.metrics.map((metric) => (typeof metric === 'string' ? metric : metric.name)),
        startAngle: radar.startAngle,
        endAngle: radar.startAngle !== undefined ? radar.startAngle + 360 : undefined,
        labelGap: radar.labelGap,
        valueFormatter: (name, { location }) =>
          radar.labelFormatter?.(name, { location: location as 'tick' | 'tooltip' }) ?? name,
      },
    ],
    [radar],
  );

  const radiusAxis: PolarAxisConfig<'linear', any, ChartsRadiusAxisProps>[] = React.useMemo(
    () =>
      radar.metrics.map((m) => {
        const { name, min = 0, max = radar.max } = typeof m === 'string' ? { name: m } : m;

        return {
          id: name,
          label: name,
          scaleType: 'linear' as const,
          min,
          max,
        };
      }),
    [radar],
  );

  const defaultizedSeries = React.useMemo(
    () =>
      series.map((s) => ({
        type: 'radar' as const,
        highlightScope:
          s.highlightScope ??
          (highlight === 'series' ? { highlight: 'series', fade: 'global' } : undefined),
        ...s,
      })),
    [series, highlight],
  );

  const defaultizedMargin = React.useMemo(
    () => defaultizeMargin(margin, DEFAULT_RADAR_MARGIN),
    [margin],
  );

  return (
    <ChartDataProvider<'radar', TSignatures>
      {...(other as unknown as ChartDataProviderProps<'radar', TSignatures>)}
      series={defaultizedSeries}
      width={width}
      height={height}
      margin={defaultizedMargin}
      colors={colors}
      skipAnimation={skipAnimation}
      plugins={plugins ?? RADAR_PLUGINS}
      rotationAxis={rotationAxes}
      radiusAxis={radiusAxis}
      seriesConfig={RADAR_SERIES_CONFIG}
    >
      {children}
    </ChartDataProvider>
  );
}

export { RadarDataProvider };
