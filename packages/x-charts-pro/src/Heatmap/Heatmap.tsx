'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useThemeProps } from '@mui/material/styles';
import useId from '@mui/utils/useId';
import { MakeOptional } from '@mui/x-internals/types';
import { interpolateRgbBasis } from '@mui/x-charts-vendor/d3-interpolate';
import { ChartsAxis, ChartsAxisProps } from '@mui/x-charts/ChartsAxis';
import { ChartsTooltipProps } from '@mui/x-charts/ChartsTooltip';
import {
  ChartsAxisSlots,
  ChartsAxisSlotProps,
  ChartsXAxisProps,
  ChartsYAxisProps,
  AxisConfig,
  ChartSeriesConfig,
} from '@mui/x-charts/internals';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import {
  ChartsOverlay,
  ChartsOverlayProps,
  ChartsOverlaySlotProps,
  ChartsOverlaySlots,
} from '@mui/x-charts/ChartsOverlay';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '@mui/x-charts/constants';
import { ChartContainerPro, ChartContainerProProps } from '../ChartContainerPro';
import { HeatmapSeriesType } from '../models/seriesType/heatmap';
import { HeatmapPlot } from './HeatmapPlot';
import { seriesConfig as heatmapSeriesConfig } from './seriesConfig';
import { HeatmapTooltip, HeatmapTooltipProps } from './HeatmapTooltip';
import { HeatmapItemSlotProps, HeatmapItemSlots } from './HeatmapItem';
import { HEATMAP_PLUGINS, HeatmapPluginsSignatures } from './Heatmap.plugins';

export interface HeatmapSlots extends ChartsAxisSlots, ChartsOverlaySlots, HeatmapItemSlots {
  /**
   * Custom component for the tooltip popper.
   * @default ChartsTooltipRoot
   */
  tooltip?: React.ElementType<HeatmapTooltipProps>;
}
export interface HeatmapSlotProps
  extends ChartsAxisSlotProps,
    ChartsOverlaySlotProps,
    HeatmapItemSlotProps {
  tooltip?: Partial<HeatmapTooltipProps>;
}

export interface HeatmapProps
  extends Omit<
      ChartContainerProProps<'heatmap', HeatmapPluginsSignatures>,
      'series' | 'plugins' | 'xAxis' | 'yAxis' | 'skipAnimation'
    >,
    Omit<ChartsAxisProps, 'slots' | 'slotProps'>,
    Omit<ChartsOverlayProps, 'slots' | 'slotProps'> {
  /**
   * The configuration of the x-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  xAxis: Readonly<MakeOptional<AxisConfig<'band', any, ChartsXAxisProps>, 'id' | 'scaleType'>[]>;
  /**
   * The configuration of the y-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  yAxis: Readonly<MakeOptional<AxisConfig<'band', any, ChartsYAxisProps>, 'id' | 'scaleType'>[]>;
  /**
   * The series to display in the bar chart.
   * An array of [[HeatmapSeriesType]] objects.
   */
  series: Readonly<MakeOptional<HeatmapSeriesType, 'type'>[]>;
  /**
   * The configuration of the tooltip.
   * @see See {@link https://mui.com/x/react-charts/tooltip/ tooltip docs} for more details.
   */
  tooltip?: ChartsTooltipProps;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: HeatmapSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: HeatmapSlotProps;
}

// The GnBu: https://github.com/d3/d3-scale-chromatic/blob/main/src/sequential-multi/GnBu.js
const defaultColorMap = interpolateRgbBasis([
  '#f7fcf0',
  '#e0f3db',
  '#ccebc5',
  '#a8ddb5',
  '#7bccc4',
  '#4eb3d3',
  '#2b8cbe',
  '#0868ac',
  '#084081',
]);

const seriesConfig: ChartSeriesConfig<'heatmap'> = { heatmap: heatmapSeriesConfig };

function getDefaultDataForAxis(series: HeatmapProps['series'], dimension: number) {
  if (series?.[0]?.data === undefined || series[0].data.length === 0) {
    return [];
  }

  return Array.from(
    { length: Math.max(...series[0].data.map((dataPoint) => dataPoint[dimension])) + 1 },
    (_, index) => index,
  );
}
const getDefaultDataForXAxis = (series: HeatmapProps['series']) => getDefaultDataForAxis(series, 0);
const getDefaultDataForYAxis = (series: HeatmapProps['series']) => getDefaultDataForAxis(series, 1);

const Heatmap = React.forwardRef(function Heatmap(
  inProps: HeatmapProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiHeatmap' });
  const {
    xAxis,
    yAxis,
    zAxis,
    series,
    width,
    height,
    margin,
    colors,
    dataset,
    sx,
    onAxisClick,
    children,
    slots,
    slotProps,
    loading,
    highlightedItem,
    onHighlightChange,
  } = props;

  const id = useId();
  const clipPathId = `${id}-clip-path`;

  const xAxisWithDefault = React.useMemo(
    () =>
      (xAxis && xAxis.length > 0 ? xAxis : [{ id: DEFAULT_X_AXIS_KEY }]).map((axis) => ({
        scaleType: 'band' as const,
        categoryGapRatio: 0,
        ...axis,
        data: axis.data ?? getDefaultDataForXAxis(series),
      })),
    [series, xAxis],
  );

  const yAxisWithDefault = React.useMemo(
    () =>
      (yAxis && yAxis.length > 0 ? yAxis : [{ id: DEFAULT_Y_AXIS_KEY }]).map((axis) => ({
        scaleType: 'band' as const,
        categoryGapRatio: 0,
        ...axis,
        data: axis.data ?? getDefaultDataForYAxis(series),
      })),
    [series, yAxis],
  );

  const zAxisWithDefault = React.useMemo(
    () =>
      zAxis ?? [
        {
          colorMap: {
            type: 'continuous',
            min: 0,
            max: 100,
            color: defaultColorMap,
          },
        } as const,
      ],
    [zAxis],
  );

  const Tooltip = props.slots?.tooltip ?? HeatmapTooltip;

  return (
    <ChartContainerPro<'heatmap', HeatmapPluginsSignatures>
      ref={ref}
      seriesConfig={seriesConfig}
      series={series.map((s) => ({
        type: 'heatmap',
        ...s,
      }))}
      width={width}
      height={height}
      margin={margin}
      xAxis={xAxisWithDefault}
      yAxis={yAxisWithDefault}
      zAxis={zAxisWithDefault}
      colors={colors}
      dataset={dataset}
      sx={sx}
      disableAxisListener
      highlightedItem={highlightedItem}
      onHighlightChange={onHighlightChange}
      onAxisClick={onAxisClick}
      plugins={HEATMAP_PLUGINS}
    >
      <g clipPath={`url(#${clipPathId})`}>
        <HeatmapPlot slots={slots} slotProps={slotProps} />
        <ChartsOverlay loading={loading} slots={slots} slotProps={slotProps} />
      </g>
      <ChartsAxis slots={slots} slotProps={slotProps} />
      {!loading && <Tooltip {...slotProps?.tooltip} />}

      <ChartsClipPath id={clipPathId} />
      {children}
    </ChartContainerPro>
  );
});

Heatmap.propTypes = {
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
  /**
   * An array of objects that can be used to populate series and axes data using their `dataKey` property.
   */
  dataset: PropTypes.arrayOf(PropTypes.object),
  desc: PropTypes.string,
  /**
   * If `true`, the charts will not listen to the mouse move event.
   * It might break interactive features, but will improve performance.
   * @default false
   */
  disableAxisListener: PropTypes.bool,
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
   * If `true`, a loading overlay is displayed.
   * @default false
   */
  loading: PropTypes.bool,
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
   * The function called for onClick events.
   * The second argument contains information about all line/bar elements at the current mouse position.
   * @param {MouseEvent} event The mouse event recorded on the `<svg/>` element.
   * @param {null | AxisData} data The data about the clicked axis and items associated with it.
   */
  onAxisClick: PropTypes.func,
  /**
   * The callback fired when the highlighted item changes.
   *
   * @param {HighlightItemData | null} highlightedItem  The newly highlighted item.
   */
  onHighlightChange: PropTypes.func,
  /**
   * The series to display in the bar chart.
   * An array of [[HeatmapSeriesType]] objects.
   */
  series: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * The configuration helpers used to compute attributes according to the serries type.
   * @ignore Unstable props for internal usage.
   */
  seriesConfig: PropTypes.object,
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
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  theme: PropTypes.oneOf(['dark', 'light']),
  title: PropTypes.string,
  /**
   * The configuration of the tooltip.
   * @see See {@link https://mui.com/x/react-charts/tooltip/ tooltip docs} for more details.
   */
  tooltip: PropTypes.object,
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width: PropTypes.number,
  /**
   * The configuration of the x-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  xAxis: PropTypes.arrayOf(
    PropTypes.shape({
      axis: PropTypes.oneOf(['x']),
      barGapRatio: PropTypes.number,
      categoryGapRatio: PropTypes.number,
      classes: PropTypes.object,
      colorMap: PropTypes.oneOfType([
        PropTypes.shape({
          colors: PropTypes.arrayOf(PropTypes.string).isRequired,
          type: PropTypes.oneOf(['ordinal']).isRequired,
          unknownColor: PropTypes.string,
          values: PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string])
              .isRequired,
          ),
        }),
        PropTypes.shape({
          color: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.string.isRequired),
            PropTypes.func,
          ]).isRequired,
          max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
          min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
          type: PropTypes.oneOf(['continuous']).isRequired,
        }),
        PropTypes.shape({
          colors: PropTypes.arrayOf(PropTypes.string).isRequired,
          thresholds: PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]).isRequired,
          ).isRequired,
          type: PropTypes.oneOf(['piecewise']).isRequired,
        }),
      ]),
      data: PropTypes.array,
      dataKey: PropTypes.string,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      domainLimit: PropTypes.oneOfType([PropTypes.oneOf(['nice', 'strict']), PropTypes.func]),
      fill: PropTypes.string,
      height: PropTypes.number,
      hideTooltip: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      label: PropTypes.string,
      labelStyle: PropTypes.object,
      max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      offset: PropTypes.number,
      position: PropTypes.oneOf(['bottom', 'none', 'top']),
      reverse: PropTypes.bool,
      scaleType: PropTypes.oneOf(['band']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      sx: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
        PropTypes.func,
        PropTypes.object,
      ]),
      tickInterval: PropTypes.oneOfType([
        PropTypes.oneOf(['auto']),
        PropTypes.array,
        PropTypes.func,
      ]),
      tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
      tickLabelMinGap: PropTypes.number,
      tickLabelPlacement: PropTypes.oneOf(['middle', 'tick']),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number,
      tickPlacement: PropTypes.oneOf(['end', 'extremities', 'middle', 'start']),
      tickSize: PropTypes.number,
      valueFormatter: PropTypes.func,
      zoom: PropTypes.oneOfType([
        PropTypes.shape({
          filterMode: PropTypes.oneOf(['discard', 'keep']),
          maxEnd: PropTypes.number,
          maxSpan: PropTypes.number,
          minSpan: PropTypes.number,
          minStart: PropTypes.number,
          panning: PropTypes.bool,
          step: PropTypes.number,
        }),
        PropTypes.bool,
      ]),
    }),
  ).isRequired,
  /**
   * The configuration of the y-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  yAxis: PropTypes.arrayOf(
    PropTypes.shape({
      axis: PropTypes.oneOf(['y']),
      barGapRatio: PropTypes.number,
      categoryGapRatio: PropTypes.number,
      classes: PropTypes.object,
      colorMap: PropTypes.oneOfType([
        PropTypes.shape({
          colors: PropTypes.arrayOf(PropTypes.string).isRequired,
          type: PropTypes.oneOf(['ordinal']).isRequired,
          unknownColor: PropTypes.string,
          values: PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string])
              .isRequired,
          ),
        }),
        PropTypes.shape({
          color: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.string.isRequired),
            PropTypes.func,
          ]).isRequired,
          max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
          min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
          type: PropTypes.oneOf(['continuous']).isRequired,
        }),
        PropTypes.shape({
          colors: PropTypes.arrayOf(PropTypes.string).isRequired,
          thresholds: PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]).isRequired,
          ).isRequired,
          type: PropTypes.oneOf(['piecewise']).isRequired,
        }),
      ]),
      data: PropTypes.array,
      dataKey: PropTypes.string,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      domainLimit: PropTypes.oneOfType([PropTypes.oneOf(['nice', 'strict']), PropTypes.func]),
      fill: PropTypes.string,
      hideTooltip: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      label: PropTypes.string,
      labelStyle: PropTypes.object,
      max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      offset: PropTypes.number,
      position: PropTypes.oneOf(['left', 'none', 'right']),
      reverse: PropTypes.bool,
      scaleType: PropTypes.oneOf(['band']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      sx: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
        PropTypes.func,
        PropTypes.object,
      ]),
      tickInterval: PropTypes.oneOfType([
        PropTypes.oneOf(['auto']),
        PropTypes.array,
        PropTypes.func,
      ]),
      tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
      tickLabelPlacement: PropTypes.oneOf(['middle', 'tick']),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number,
      tickPlacement: PropTypes.oneOf(['end', 'extremities', 'middle', 'start']),
      tickSize: PropTypes.number,
      valueFormatter: PropTypes.func,
      width: PropTypes.number,
      zoom: PropTypes.oneOfType([
        PropTypes.shape({
          filterMode: PropTypes.oneOf(['discard', 'keep']),
          maxEnd: PropTypes.number,
          maxSpan: PropTypes.number,
          minSpan: PropTypes.number,
          minStart: PropTypes.number,
          panning: PropTypes.bool,
          step: PropTypes.number,
        }),
        PropTypes.bool,
      ]),
    }),
  ).isRequired,
  /**
   * The configuration of the z-axes.
   */
  zAxis: PropTypes.arrayOf(
    PropTypes.shape({
      colorMap: PropTypes.oneOfType([
        PropTypes.shape({
          colors: PropTypes.arrayOf(PropTypes.string).isRequired,
          type: PropTypes.oneOf(['ordinal']).isRequired,
          unknownColor: PropTypes.string,
          values: PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string])
              .isRequired,
          ),
        }),
        PropTypes.shape({
          color: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.string.isRequired),
            PropTypes.func,
          ]).isRequired,
          max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
          min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
          type: PropTypes.oneOf(['continuous']).isRequired,
        }),
        PropTypes.shape({
          colors: PropTypes.arrayOf(PropTypes.string).isRequired,
          thresholds: PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]).isRequired,
          ).isRequired,
          type: PropTypes.oneOf(['piecewise']).isRequired,
        }),
      ]),
      data: PropTypes.array,
      dataKey: PropTypes.string,
      id: PropTypes.string,
      max: PropTypes.number,
      min: PropTypes.number,
    }),
  ),
} as any;

export { Heatmap };
