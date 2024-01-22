import * as React from 'react';
import PropTypes from 'prop-types';
import useForkRef from '@mui/utils/useForkRef';
import { DrawingProvider, DrawingProviderProps } from '../context/DrawingProvider';
import {
  SeriesContextProvider,
  SeriesContextProviderProps,
} from '../context/SeriesContextProvider';
import { InteractionProvider } from '../context/InteractionProvider';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { ChartsSurface, ChartsSurfaceProps } from '../ChartsSurface';
import {
  CartesianContextProvider,
  CartesianContextProviderProps,
} from '../context/CartesianContextProvider';
import { HighlightProvider } from '../context/HighlightProvider';

export type ChartContainerProps = Omit<
  ChartsSurfaceProps &
    SeriesContextProviderProps &
    Omit<DrawingProviderProps, 'svgRef'> &
    CartesianContextProviderProps,
  'children'
> & {
  children?: React.ReactNode;
};

const ChartContainer = React.forwardRef(function ChartContainer(props: ChartContainerProps, ref) {
  const {
    width,
    height,
    series,
    margin,
    xAxis,
    yAxis,
    colors,
    dataset,
    sx,
    title,
    desc,
    disableAxisListener,
    children,
  } = props;
  const svgRef = React.useRef<SVGSVGElement>(null);
  const handleRef = useForkRef(ref, svgRef);

  useReducedMotion(); // a11y reduce motion (see: https://react-spring.dev/docs/utilities/use-reduced-motion)

  return (
    <DrawingProvider width={width} height={height} margin={margin} svgRef={svgRef}>
      <SeriesContextProvider series={series} colors={colors} dataset={dataset}>
        <CartesianContextProvider xAxis={xAxis} yAxis={yAxis} dataset={dataset}>
          <InteractionProvider>
            <HighlightProvider>
              <ChartsSurface
                width={width}
                height={height}
                ref={handleRef}
                sx={sx}
                title={title}
                desc={desc}
                disableAxisListener={disableAxisListener}
              >
                {children}
              </ChartsSurface>
            </HighlightProvider>
          </InteractionProvider>
        </CartesianContextProvider>
      </SeriesContextProvider>
    </DrawingProvider>
  );
});

ChartContainer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  className: PropTypes.string,
  /**
   * Color palette used to colorize multiple series.
   * @default blueberryTwilightPalette
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
   * The height of the chart in px.
   */
  height: PropTypes.number.isRequired,
  /**
   * The margin between the SVG and the drawing area.
   * It's used for leaving some space for extra information such as the x- and y-axis or legend.
   * Accepts an object with the optional properties: `top`, `bottom`, `left`, and `right`.
   * @default object Depends on the charts type.
   */
  margin: PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
  }),
  /**
   * The array of series to display.
   * Each type of series has its own specificity.
   * Please refer to the appropriate docs page to learn more about it.
   */
  series: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        color: PropTypes.string,
        data: PropTypes.arrayOf(PropTypes.number),
        dataKey: PropTypes.string,
        highlightScope: PropTypes.shape({
          faded: PropTypes.oneOf(['global', 'none', 'series']),
          highlighted: PropTypes.oneOf(['item', 'none', 'series']),
        }),
        id: PropTypes.string,
        label: PropTypes.string,
        layout: PropTypes.oneOf(['horizontal', 'vertical']),
        stack: PropTypes.string,
        stackOffset: PropTypes.oneOf(['diverging', 'expand', 'none', 'silhouette', 'wiggle']),
        stackOrder: PropTypes.oneOf([
          'appearance',
          'ascending',
          'descending',
          'insideOut',
          'none',
          'reverse',
        ]),
        type: PropTypes.oneOf(['bar']).isRequired,
        valueFormatter: PropTypes.func,
        xAxisKey: PropTypes.string,
        yAxisKey: PropTypes.string,
      }),
      PropTypes.shape({
        area: PropTypes.bool,
        color: PropTypes.string,
        connectNulls: PropTypes.bool,
        curve: PropTypes.oneOf([
          'catmullRom',
          'linear',
          'monotoneX',
          'monotoneY',
          'natural',
          'step',
          'stepAfter',
          'stepBefore',
        ]),
        data: PropTypes.arrayOf(PropTypes.number),
        dataKey: PropTypes.string,
        disableHighlight: PropTypes.bool,
        highlightScope: PropTypes.shape({
          faded: PropTypes.oneOf(['global', 'none', 'series']),
          highlighted: PropTypes.oneOf(['item', 'none', 'series']),
        }),
        id: PropTypes.string,
        label: PropTypes.string,
        showMark: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
        stack: PropTypes.string,
        stackOffset: PropTypes.oneOf(['diverging', 'expand', 'none', 'silhouette', 'wiggle']),
        stackOrder: PropTypes.oneOf([
          'appearance',
          'ascending',
          'descending',
          'insideOut',
          'none',
          'reverse',
        ]),
        type: PropTypes.oneOf(['line']).isRequired,
        valueFormatter: PropTypes.func,
        xAxisKey: PropTypes.string,
        yAxisKey: PropTypes.string,
      }),
      PropTypes.shape({
        color: PropTypes.string,
        data: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
          }),
        ).isRequired,
        disableHover: PropTypes.bool,
        highlightScope: PropTypes.shape({
          faded: PropTypes.oneOf(['global', 'none', 'series']),
          highlighted: PropTypes.oneOf(['item', 'none', 'series']),
        }),
        id: PropTypes.string,
        label: PropTypes.string,
        markerSize: PropTypes.number,
        type: PropTypes.oneOf(['scatter']).isRequired,
        valueFormatter: PropTypes.func,
        xAxisKey: PropTypes.string,
        yAxisKey: PropTypes.string,
      }),
      PropTypes.shape({
        arcLabel: PropTypes.oneOfType([
          PropTypes.oneOf(['formattedValue', 'label', 'value']),
          PropTypes.func,
        ]),
        arcLabelMinAngle: PropTypes.number,
        arcLabelRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        color: PropTypes.string,
        cornerRadius: PropTypes.number,
        cx: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        cy: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        data: PropTypes.arrayOf(
          PropTypes.shape({
            color: PropTypes.string,
            id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            label: PropTypes.string,
            value: PropTypes.number.isRequired,
          }),
        ).isRequired,
        endAngle: PropTypes.number,
        faded: PropTypes.shape({
          additionalRadius: PropTypes.number,
          arcLabelRadius: PropTypes.number,
          color: PropTypes.string,
          cornerRadius: PropTypes.number,
          innerRadius: PropTypes.number,
          outerRadius: PropTypes.number,
          paddingAngle: PropTypes.number,
        }),
        highlighted: PropTypes.shape({
          additionalRadius: PropTypes.number,
          arcLabelRadius: PropTypes.number,
          color: PropTypes.string,
          cornerRadius: PropTypes.number,
          innerRadius: PropTypes.number,
          outerRadius: PropTypes.number,
          paddingAngle: PropTypes.number,
        }),
        highlightScope: PropTypes.shape({
          faded: PropTypes.oneOf(['global', 'none', 'series']),
          highlighted: PropTypes.oneOf(['item', 'none', 'series']),
        }),
        id: PropTypes.string,
        innerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        outerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        paddingAngle: PropTypes.number,
        sortingValues: PropTypes.oneOfType([
          PropTypes.oneOf(['asc', 'desc', 'none']),
          PropTypes.func,
        ]),
        startAngle: PropTypes.number,
        type: PropTypes.oneOf(['pie']).isRequired,
        valueFormatter: PropTypes.func,
      }),
    ]).isRequired,
  ).isRequired,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  title: PropTypes.string,
  viewBox: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  /**
   * The width of the chart in px.
   */
  width: PropTypes.number.isRequired,
  /**
   * The configuration of the x-axes.
   * If not provided, a default axis config is used with id set to `DEFAULT_X_AXIS_KEY`.
   */
  xAxis: PropTypes.arrayOf(
    PropTypes.shape({
      axisId: PropTypes.string,
      classes: PropTypes.object,
      data: PropTypes.array,
      dataKey: PropTypes.string,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      hideTooltip: PropTypes.bool,
      id: PropTypes.string,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      labelStyle: PropTypes.object,
      max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      position: PropTypes.oneOf(['bottom', 'left', 'right', 'top']),
      scaleType: PropTypes.oneOf(['band', 'linear', 'log', 'point', 'pow', 'sqrt', 'time', 'utc']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickInterval: PropTypes.oneOfType([
        PropTypes.oneOf(['auto']),
        PropTypes.array,
        PropTypes.func,
      ]),
      tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number,
      tickSize: PropTypes.number,
      valueFormatter: PropTypes.func,
    }),
  ),
  /**
   * The configuration of the y-axes.
   * If not provided, a default axis config is used with id set to `DEFAULT_Y_AXIS_KEY`.
   */
  yAxis: PropTypes.arrayOf(
    PropTypes.shape({
      axisId: PropTypes.string,
      classes: PropTypes.object,
      data: PropTypes.array,
      dataKey: PropTypes.string,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      hideTooltip: PropTypes.bool,
      id: PropTypes.string,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      labelStyle: PropTypes.object,
      max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      position: PropTypes.oneOf(['bottom', 'left', 'right', 'top']),
      scaleType: PropTypes.oneOf(['band', 'linear', 'log', 'point', 'pow', 'sqrt', 'time', 'utc']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickInterval: PropTypes.oneOfType([
        PropTypes.oneOf(['auto']),
        PropTypes.array,
        PropTypes.func,
      ]),
      tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number,
      tickSize: PropTypes.number,
      valueFormatter: PropTypes.func,
    }),
  ),
} as any;

export { ChartContainer };
