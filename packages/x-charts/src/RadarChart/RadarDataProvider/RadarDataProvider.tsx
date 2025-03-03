'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { MakeOptional } from '@mui/x-internals/types';
import { ChartContainerProps } from '../../ChartContainer';
import { RadarSeriesType } from '../../models/seriesType/radar';
import { AxisConfig, ChartsRadiusAxisProps, ChartsRotationAxisProps } from '../../models/axis';
import { ChartDataProvider } from '../../ChartDataProvider';
import { defaultizeMargin } from '../../internals/defaultizeMargin';
import {
  useChartPolarAxis,
  UseChartPolarAxisSignature,
} from '../../internals/plugins/featurePlugins/useChartPolarAxis';
import {
  useChartHighlight,
  UseChartHighlightSignature,
} from '../../internals/plugins/featurePlugins/useChartHighlight';
import { radarSeriesConfig } from '../seriesConfig';
import { DEFAULT_MARGINS } from '../../constants';
import { RadarConfig } from './radar.types';

const RADAR_SERIES_CONFIG = { radar: radarSeriesConfig };
const RADAR_PLUGINS = [useChartPolarAxis, useChartHighlight] as const;

type RadarPluginSignatures = [UseChartPolarAxisSignature, UseChartHighlightSignature];

export interface RadarDataProviderProps
  extends Omit<
    ChartContainerProps<'radar', RadarPluginSignatures>,
    'series' | 'plugins' | 'rotationAxis' | 'radiusAxis' | 'dataset'
  > {
  /**
   * The series to display in the bar chart.
   * An array of [[RadarSeriesType]] objects.
   */
  series: MakeOptional<RadarSeriesType, 'type'>[];
  /**
   * The configuration of the radar scales.
   */
  radar: RadarConfig;
}

function RadarDataProvider(props: RadarDataProviderProps) {
  const {
    series,
    children,
    width,
    height,
    colors,
    highlightedItem,
    onHighlightChange,
    className,
    skipAnimation,
    margin,
    radar,
    ...other
  } = props;

  const rotationAxes: AxisConfig<'point', number | string, ChartsRotationAxisProps>[] =
    React.useMemo(
      () =>
        [
          {
            id: 'radar-rotation-axis',
            scaleType: 'point',
            data: radar.metrics.map((metric) =>
              typeof metric === 'string' ? metric : metric.name,
            ),
            startAngle: radar.startAngle,
            endAngle: radar.startAngle !== undefined ? radar.startAngle + 360 : undefined,
          },
        ] as const,
      [radar],
    );

  const radiusAxis: AxisConfig<'linear', any, ChartsRadiusAxisProps>[] = React.useMemo(
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
        ...s,
      })),
    [series],
  );

  const defaultizedMargin = React.useMemo(
    () => defaultizeMargin(margin, DEFAULT_MARGINS),
    [margin],
  );

  return (
    <ChartDataProvider<'radar', RadarPluginSignatures>
      {...other}
      series={defaultizedSeries}
      width={width}
      height={height}
      margin={defaultizedMargin}
      colors={colors}
      highlightedItem={highlightedItem}
      onHighlightChange={onHighlightChange}
      skipAnimation={skipAnimation}
      plugins={RADAR_PLUGINS}
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
  apiRef: PropTypes.shape({
    current: PropTypes.object,
  }),
  children: PropTypes.node,
  className: PropTypes.string,
  /**
   * Color palette used to colorize multiple series.
   * @default rainbowSurgePalette
   */
  colors: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.func]),
  desc: PropTypes.string,
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   */
  height: PropTypes.number,
  /**
   * The highlighted item.
   * Used when the highlight is controlled.
   */
  highlightedItem: PropTypes.shape({
    dataIndex: PropTypes.number,
    seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  }),
  /**
   * This prop is used to help implement the accessibility logic.
   * If you don't provide this prop. It falls back to a randomly generated id.
   */
  id: PropTypes.string,
  /**
   * The margin between the SVG and the drawing area.
   * It's used for leaving some space for extra information such as the x- and y-axis or legend.
   *
   * Accepts a `number` to be used on all sides or an object with the optional properties: `top`, `bottom`, `left`, and `right`.
   */
  margin: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      bottom: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number,
      top: PropTypes.number,
    }),
  ]),
  /**
   * The callback fired when the highlighted item changes.
   *
   * @param {HighlightItemData | null} highlightedItem  The newly highlighted item.
   */
  onHighlightChange: PropTypes.func,
  /**
   * The configuration of the radar scales.
   */
  radar: PropTypes.shape({
    divisionNumber: PropTypes.number,
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
   * The configuration helpers used to compute attributes according to the serries type.
   * @ignore Unstable props for internal usage.
   */
  seriesConfig: PropTypes.object,
  /**
   * If `true`, animations are skipped.
   * If unset or `false`, the animations respects the user's `prefers-reduced-motion` setting.
   */
  skipAnimation: PropTypes.bool,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  theme: PropTypes.oneOf(['dark', 'light']),
  title: PropTypes.string,
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width: PropTypes.number,
} as any;

export { RadarDataProvider };
