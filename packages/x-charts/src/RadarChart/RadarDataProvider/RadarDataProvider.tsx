'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { MakeOptional } from '@mui/x-internals/types';
import { ChartProviderProps } from '../../context/ChartProvider/ChartProvider.types';
import { AllPluginSignatures } from '../../internals/plugins/allPlugins';
import { RADAR_PLUGINS } from '../RadarChart.plugins';
import { RadarSeriesType } from '../../models/seriesType/radar';
import { ChartsRadiusAxisProps, ChartsRotationAxisProps, PolarAxisConfig } from '../../models/axis';
import { ChartDataProvider, ChartDataProviderProps } from '../../ChartDataProvider';
import { defaultizeMargin } from '../../internals/defaultizeMargin';
import { radarSeriesConfig } from '../seriesConfig';
import { RadarConfig } from './radar.types';
import { ChartAnyPluginSignature } from '../../internals/plugins/models/plugin';

const RADAR_SERIES_CONFIG = { radar: radarSeriesConfig };
const DEFAULT_RADAR_MARGIN = { top: 30, bottom: 30, left: 50, right: 50 };

export type RadarDataProviderProps<
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<'radar'>,
> = Omit<
  ChartDataProviderProps<'radar', TSignatures>,
  'series' | 'rotationAxis' | 'radiusAxis' | 'dataset'
> & {
  /**
   * The series to display in the bar chart.
   * An array of [[RadarSeriesType]] objects.
   */
  series: Readonly<MakeOptional<RadarSeriesType, 'type'>>[];
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

function RadarDataProvider<TSignatures extends readonly ChartAnyPluginSignature[] = []>(
  props: RadarDataProviderProps<TSignatures>,
) {
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
      plugins={(plugins ?? RADAR_PLUGINS) as ChartProviderProps<'radar', TSignatures>['plugins']}
      rotationAxis={rotationAxes}
      radiusAxis={radiusAxis}
      seriesConfig={RADAR_SERIES_CONFIG}
    >
      {children}
    </ChartDataProvider>
  );
}

RadarDataProvider.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.any,
  /**
   * Color palette used to colorize multiple series.
   * @default rainbowSurgePalette
   */
  colors: PropTypes.any,
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   */
  height: PropTypes.any,
  /**
   * Indicates if the chart should highlight items per axis or per series.
   * @default 'axis'
   */
  highlight: PropTypes.oneOf(['axis', 'none', 'series']),
  /**
   * This prop is used to help implement the accessibility logic.
   * If you don't provide this prop. It falls back to a randomly generated id.
   */
  id: PropTypes.any,
  /**
   * Localized text for chart components.
   */
  localeText: PropTypes.any,
  /**
   * The margin between the SVG and the drawing area.
   * It's used for leaving some space for extra information such as the x- and y-axis or legend.
   *
   * Accepts a `number` to be used on all sides or an object with the optional properties: `top`, `bottom`, `left`, and `right`.
   */
  margin: PropTypes.any,
  /**
   * Array of plugins used to add features to the chart.
   */
  plugins: PropTypes.any,
  /**
   * The configuration of the radar scales.
   */
  radar: PropTypes.shape({
    labelFormatter: PropTypes.func,
    labelGap: PropTypes.number,
    max: PropTypes.number,
    metrics: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.arrayOf(
        PropTypes.shape({
          max: PropTypes.number,
          min: PropTypes.number,
          name: PropTypes.string.isRequired,
        }),
      ),
    ]).isRequired,
    startAngle: PropTypes.number,
  }).isRequired,
  /**
   * The series to display in the bar chart.
   * An array of [[RadarSeriesType]] objects.
   */
  series: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * The configuration helpers used to compute attributes according to the series type.
   * @ignore Unstable props for internal usage.
   */
  seriesConfig: PropTypes.any,
  /**
   * If `true`, animations are skipped.
   * If unset or `false`, the animations respects the user's `prefers-reduced-motion` setting.
   */
  skipAnimation: PropTypes.any,
  /**
   * The props for the slots.
   */
  slotProps: PropTypes.any,
  /**
   * Slots to customize charts' components.
   */
  slots: PropTypes.any,
  theme: PropTypes.any,
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width: PropTypes.any,
} as any;

export { RadarDataProvider };
