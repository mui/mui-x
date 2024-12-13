'use client';
import { styled, SxProps, Theme, useThemeProps } from '@mui/material/styles';
import PropTypes from 'prop-types';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useAxisEvents } from '../hooks/useAxisEvents';
import { ChartsAxesGradients } from '../internals/components/ChartsAxesGradients';
import { useDrawingArea, useSvgRef } from '../hooks';
import { useSize } from '../context/SizeProvider';
import type { SizeContextState } from '../context/SizeProvider';

export interface ChartsSurfaceProps {
  className?: string;
  title?: string;
  desc?: string;
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
  /**
   * If `true`, the charts will not listen to the mouse move event.
   * It might break interactive features, but will improve performance.
   * @default false
   */
  disableAxisListener?: boolean;
}

const ChartsSurfaceStyles = styled('svg', {
  name: 'MuiChartsSurface',
  slot: 'Root',
})<{ ownerState: Partial<Pick<SizeContextState, 'width' | 'height'>> }>(({ ownerState }) => ({
  width: ownerState.width ?? '100%',
  height: ownerState.height ?? '100%',
  display: 'flex',
  position: 'relative',
  flexGrow: 1,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  // This prevents default touch actions when using the svg on mobile devices.
  // For example, prevent page scroll & zoom.
  touchAction: 'none',
}));

/**
 * It provides the drawing area for the chart elements.
 * It is the root `<svg>` of all the chart elements.
 *
 * It also provides the `title` and `desc` elements for the chart.
 *
 * Demos:
 *
 * - [Composition](http://localhost:3001/x/react-charts/composition/)
 *
 * API:
 *
 * - [ChartsSurface API](https://mui.com/x/api/charts/charts-surface/)
 */
const ChartsSurface = React.forwardRef<SVGSVGElement, ChartsSurfaceProps>(function ChartsSurface(
  inProps: ChartsSurfaceProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const { width, height, left, right, top, bottom } = useDrawingArea();
  const { hasIntrinsicSize, svgRef: containerRef, inHeight, inWidth } = useSize();
  const svgRef = useSvgRef();
  const handleRef = useForkRef(containerRef, svgRef, ref);
  const themeProps = useThemeProps({ props: inProps, name: 'MuiChartsSurface' });

  const { children, disableAxisListener = false, className, title, desc, ...other } = themeProps;

  const svgWidth = width + left + right;
  const svgHeight = height + top + bottom;

  const svgView = {
    width: svgWidth,
    height: svgHeight,
    x: 0,
    y: 0,
  };

  useAxisEvents(disableAxisListener);

  return (
    <ChartsSurfaceStyles
      ownerState={{ width: inWidth, height: inHeight }}
      viewBox={`${svgView.x} ${svgView.y} ${svgView.width} ${svgView.height}`}
      className={className}
      {...other}
      ref={handleRef}
    >
      {title && <title>{title}</title>}
      {desc && <desc>{desc}</desc>}
      <ChartsAxesGradients />
      {hasIntrinsicSize && children}
    </ChartsSurfaceStyles>
  );
});

ChartsSurface.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  className: PropTypes.string,
  desc: PropTypes.string,
  /**
   * If `true`, the charts will not listen to the mouse move event.
   * It might break interactive features, but will improve performance.
   * @default false
   */
  disableAxisListener: PropTypes.bool,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  title: PropTypes.string,
} as any;

export { ChartsSurface };
