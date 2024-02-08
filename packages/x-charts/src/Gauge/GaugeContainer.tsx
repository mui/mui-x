import * as React from 'react';
import PropTypes from 'prop-types';
import useForkRef from '@mui/utils/useForkRef';
import { styled } from '@mui/material/styles';
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
   * @default undefined
   */
  width?: number;
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   * @default undefined
   */
  height?: number;
  children?: React.ReactNode;
}

const ResizableContainer = styled('div', {
  name: 'MuiGauge',
  slot: 'Container',
})<{ ownerState: Pick<GaugeContainerProps, 'width' | 'height'> }>(({ ownerState }) => ({
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
  const [containerRef, width, height] = useChartContainerDimensions(inWidth, inHeight);

  const svgRef = React.useRef<SVGSVGElement>(null);
  const handleRef = useForkRef(ref, svgRef);

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
              ref={handleRef}
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

export { GaugeContainer };
