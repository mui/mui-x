'use client';
import { styled, SxProps, Theme, useThemeProps } from '@mui/material/styles';
import PropTypes from 'prop-types';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useAxisEvents } from '../hooks/useAxisEvents';
import { ChartsAxesGradients } from '../internals/components/ChartsAxesGradients';
import { useDrawingArea } from '../hooks';
import { useSurfaceRef } from '../context/SvgRefProvider';
import { useSize } from '../context/SizeProvider';

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
  const { width, height, left, right, top, bottom } = useDrawingArea();
  const { hasIntrinsicSize } = useSize();
  const surfaceRef = useSurfaceRef();
  const handleRef = useForkRef(surfaceRef, ref);
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
