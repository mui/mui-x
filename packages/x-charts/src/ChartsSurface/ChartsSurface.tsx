'use client';
import { styled, SxProps, Theme, useThemeProps } from '@mui/material/styles';
import PropTypes from 'prop-types';
import * as React from 'react';
import resolveProps from '@mui/utils/resolveProps';
import { useAxisEvents } from '../hooks/useAxisEvents';
import { ChartsAxesGradients } from '../internals/components/ChartsAxesGradients';
import { useSurfaceProps } from '../context/SurfacePropsProvider';

type ViewBox = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};
export interface ChartsSurfaceProps {
  /**
   * The width of the chart in px.
   */
  width?: number;
  /**
   * The height of the chart in px.
   */
  height?: number;
  viewBox?: ViewBox;
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
  // What to do with ref coming from forwardRef and Context?
  ref: React.Ref<SVGSVGElement>,
) {
  const contextProps = useSurfaceProps();
  const resolvedProps = resolveProps(inProps as any, contextProps) as ChartsSurfaceProps;

  const themeProps = useThemeProps({ props: resolvedProps, name: 'MuiChartsSurface' });

  const {
    children,
    width,
    height,
    viewBox,
    disableAxisListener = false,
    className,
    title,
    desc,
    ...other
  } = themeProps;
  const svgView = { width, height, x: 0, y: 0, ...viewBox };

  useAxisEvents(disableAxisListener);

  return (
    <ChartsSurfaceStyles
      width={width}
      height={height}
      viewBox={`${svgView.x} ${svgView.y} ${svgView.width} ${svgView.height}`}
      ref={ref}
      className={className}
      {...other}
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
