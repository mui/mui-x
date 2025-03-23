'use client';
import { styled, SxProps, Theme, useThemeProps } from '@mui/material/styles';
import PropTypes from 'prop-types';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { ChartsAxesGradients } from '../internals/components/ChartsAxesGradients';
import { useSvgRef } from '../hooks/useSvgRef';
import { useSelector } from '../internals/store/useSelector';
import { useStore } from '../internals/store/useStore';
import {
  selectorChartContainerSize,
  selectorChartPropsSize,
} from '../internals/plugins/corePlugins/useChartDimensions/useChartDimensions.selectors';

export interface ChartsSurfaceProps {
  className?: string;
  title?: string;
  desc?: string;
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
}

const ChartsSurfaceStyles = styled('svg', {
  name: 'MuiChartsSurface',
  slot: 'Root',
})<{ ownerState: { width?: number; height?: number } }>(({ ownerState }) => ({
  width: ownerState.width ?? '100%',
  height: ownerState.height ?? '100%',
  display: 'flex',
  position: 'relative',
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
 * - [Composition](https://mui.com/x/api/charts/composition/)
 *
 * API:
 *
 * - [ChartsSurface API](https://mui.com/x/api/charts/charts-surface/)
 */
const ChartsSurface = React.forwardRef<SVGSVGElement, ChartsSurfaceProps>(function ChartsSurface(
  inProps: ChartsSurfaceProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const store = useStore();
  const { width: svgWidth, height: svgHeight } = useSelector(store, selectorChartContainerSize);
  const { width: propsWidth, height: propsHeight } = useSelector(store, selectorChartPropsSize);
  const svgRef = useSvgRef();
  const handleRef = useForkRef(svgRef, ref);
  const themeProps = useThemeProps({ props: inProps, name: 'MuiChartsSurface' });

  const { children, className, title, desc, ...other } = themeProps;

  const hasIntrinsicSize = svgHeight > 0 && svgWidth > 0;

  return (
    <ChartsSurfaceStyles
      ownerState={{ width: propsWidth, height: propsHeight }}
      viewBox={`${0} ${0} ${svgWidth} ${svgHeight}`}
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
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  title: PropTypes.string,
} as any;

export { ChartsSurface };
