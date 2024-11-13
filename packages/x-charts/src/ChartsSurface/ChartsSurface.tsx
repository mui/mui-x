'use client';
import { styled, SxProps, Theme, useThemeProps } from '@mui/material/styles';
import PropTypes from 'prop-types';
import * as React from 'react';
import resolveProps from '@mui/utils/resolveProps';
import useForkRef from '@mui/utils/useForkRef';
import { useAxisEvents } from '../hooks/useAxisEvents';
import { ChartsAxesGradients } from '../internals/components/ChartsAxesGradients';
import { useSurfaceProps } from '../context/SurfacePropsProvider';
import { useDrawingArea } from '../hooks';

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
})(() => ({
  // This prevents default touch actions when using the svg on mobile devices.
  // For example, prevent page scroll & zoom.
  touchAction: 'none',
}));

const ChartsSurface = React.forwardRef<SVGSVGElement, ChartsSurfaceProps>(function ChartsSurface(
  inProps: ChartsSurfaceProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const contextProps = useSurfaceProps();
  const { width, height } = useDrawingArea();
  const resolvedProps = resolveProps(inProps as any, contextProps) as ChartsSurfaceProps;

  const themeProps = useThemeProps({ props: resolvedProps, name: 'MuiChartsSurface' });
  const surfaceRef = useForkRef(ref, contextProps.ref);

  const { children, disableAxisListener = false, className, title, desc, ...other } = themeProps;
  const svgView = { width, height, x: 0, y: 0 };

  useAxisEvents(disableAxisListener);

  return (
    <ChartsSurfaceStyles
      width={width}
      height={height}
      viewBox={`${svgView.x} ${svgView.y} ${svgView.width} ${svgView.height}`}
      className={className}
      {...other}
      ref={surfaceRef}
    >
      {title && <title>{title}</title>}
      {desc && <desc>{desc}</desc>}
      <ChartsAxesGradients />
      {children}
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
  /**
   * The height of the chart in px.
   */
  height: PropTypes.number,
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
  width: PropTypes.number,
} as any;

export { ChartsSurface };
