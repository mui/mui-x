import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import useForkRef from '@mui/utils/useForkRef';
import { useChartContainerDimensions } from '../ResponsiveChartContainer/useChartContainerDimensions';
import { ChartsSurface, ChartsSurfaceProps } from '../ChartsSurface';
import { DrawingProvider, DrawingProviderProps } from '../context/DrawingProvider';
import { GaugeProvider, GaugeProviderProps } from './GaugeProvider';

export interface GaugeContainerProps
  extends Omit<ChartsSurfaceProps, 'width' | 'height' | 'children'>,
    Omit<DrawingProviderProps, 'svgRef' | 'width' | 'height' | 'children'>,
    Omit<GaugeProviderProps, 'children'> {
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width?: number;
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   */
  height?: number;
  children?: React.ReactNode;
}

const ResizableContainer = styled('div', {
  name: 'MuiGauge',
  slot: 'Container',
})<{ ownerState: Pick<GaugeContainerProps, 'width' | 'height'> }>(({ ownerState, theme }) => ({
  width: ownerState.width ?? '100%',
  height: ownerState.height ?? '100%',
  display: 'flex',
  position: 'relative',
  flexGrow: 1,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  '&>svg': {
    width: '100%',
    height: '100%',
  },
  '& text': {
    fill: (theme.vars || theme).palette.text.primary,
  },
}));

const GaugeContainer = React.forwardRef(function GaugeContainer(props: GaugeContainerProps, ref) {
  const {
    width: inWidth,
    height: inHeight,
    margin,
    title,
    desc,
    value,
    valueMin = 0,
    valueMax = 100,
    startAngle,
    endAngle,
    outerRadius,
    innerRadius,
    cornerRadius,
    cx,
    cy,
    children,
    ...other
  } = props;
  const { containerRef, width, height } = useChartContainerDimensions(inWidth, inHeight);

  const svgRef = React.useRef<SVGSVGElement>(null);
  const chartSurfaceRef = useForkRef(ref, svgRef);

  return (
    <ResizableContainer
      ref={containerRef}
      ownerState={{ width: inWidth, height: inHeight }}
      role="meter"
      aria-valuenow={value === null ? undefined : value}
      aria-valuemin={valueMin}
      aria-valuemax={valueMax}
      {...other}
    >
      {width && height ? (
        <DrawingProvider
          width={width}
          height={height}
          margin={{ left: 10, right: 10, top: 10, bottom: 10, ...margin }}
          svgRef={svgRef}
        >
          <GaugeProvider
            value={value}
            valueMin={valueMin}
            valueMax={valueMax}
            startAngle={startAngle}
            endAngle={endAngle}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            cornerRadius={cornerRadius}
            cx={cx}
            cy={cy}
          >
            <ChartsSurface
              width={width}
              height={height}
              ref={chartSurfaceRef}
              title={title}
              desc={desc}
              disableAxisListener
              aria-hidden="true"
            >
              {children}
            </ChartsSurface>
          </GaugeProvider>
        </DrawingProvider>
      ) : null}
    </ResizableContainer>
  );
});

GaugeContainer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  className: PropTypes.string,
  /**
   * The radius applied to arc corners (similar to border radius).
   * Set it to '50%' to get rounded arc.
   * @default 0
   */
  cornerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * The x coordinate of the arc center.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the width the drawing area.
   */
  cx: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * The y coordinate of the arc center.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the height the drawing area.
   */
  cy: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  desc: PropTypes.string,
  /**
   * If `true`, the charts will not listen to the mouse move event.
   * It might break interactive features, but will improve performance.
   * @default false
   */
  disableAxisListener: PropTypes.bool,
  /**
   * The end angle (deg).
   * @default 360
   */
  endAngle: PropTypes.number,
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   */
  height: PropTypes.number,
  /**
   * The radius between circle center and the beginning of the arc.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the maximal radius that fit into the drawing area.
   * @default '80%'
   */
  innerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
   * The radius between circle center and the end of the arc.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the maximal radius that fit into the drawing area.
   * @default '100%'
   */
  outerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * The start angle (deg).
   * @default 0
   */
  startAngle: PropTypes.number,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  title: PropTypes.string,
  /**
   * The value of the gauge.
   * Set to `null` to not display a value.
   */
  value: PropTypes.number,
  /**
   * The maximal value of the gauge.
   * @default 100
   */
  valueMax: PropTypes.number,
  /**
   * The minimal value of the gauge.
   * @default 0
   */
  valueMin: PropTypes.number,
  viewBox: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width: PropTypes.number,
} as any;

export { GaugeContainer };
