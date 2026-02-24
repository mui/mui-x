'use client';
import { styled, type SxProps, type Theme, useThemeProps } from '@mui/material/styles';
import PropTypes from 'prop-types';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import clsx from 'clsx';
import { ChartsAxesGradients } from '../internals/components/ChartsAxesGradients';
import { useSvgRef } from '../hooks/useSvgRef';
import { useChartContext } from '../context/ChartProvider';
import {
  selectorChartPropsHeight,
  selectorChartPropsWidth,
  selectorChartSvgWidth,
  selectorChartSvgHeight,
} from '../internals/plugins/corePlugins/useChartDimensions/useChartDimensions.selectors';
import { selectorChartsIsKeyboardNavigationEnabled } from '../internals/plugins/featurePlugins/useChartKeyboardNavigation';
import { useUtilityClasses } from './chartsSurfaceClasses';
import type { UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction/useChartInteraction.types';
import type { UseChartItemClickSignature } from '../internals/plugins/featurePlugins/useChartItemClick';

export interface ChartsSurfaceProps extends Omit<
  React.SVGProps<SVGSVGElement>,
  'id' | 'children' | 'className' | 'height' | 'width' | 'cx' | 'cy' | 'viewBox' | 'color' | 'ref'
> {
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
  touchAction: 'pan-y',
  userSelect: 'none',
  gridArea: 'chart',
  '&:focus': {
    outline: 'none', // By default don't show focus on the SVG container
  },
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
  const { store, instance } = useChartContext<
    [],
    [UseChartInteractionSignature, UseChartItemClickSignature]
  >();

  const svgWidth = store.use(selectorChartSvgWidth);
  const svgHeight = store.use(selectorChartSvgHeight);

  const propsWidth = store.use(selectorChartPropsWidth);
  const propsHeight = store.use(selectorChartPropsHeight);
  const isKeyboardNavigationEnabled = store.use(selectorChartsIsKeyboardNavigationEnabled);

  const svgRef = useSvgRef();
  const handleRef = useForkRef(svgRef, ref);
  const themeProps = useThemeProps({ props: inProps, name: 'MuiChartsSurface' });

  const { children, className, title, desc, ...other } = themeProps;

  const classes = useUtilityClasses();
  const hasIntrinsicSize = svgHeight > 0 && svgWidth > 0;

  return (
    <ChartsSurfaceStyles
      ownerState={{ width: propsWidth, height: propsHeight }}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className={clsx(classes.root, className)}
      tabIndex={isKeyboardNavigationEnabled ? 0 : undefined}
      {...other}
      onPointerEnter={(event) => {
        other.onPointerEnter?.(event);
        instance.handlePointerEnter?.(event);
      }}
      onPointerLeave={(event) => {
        other.onPointerLeave?.(event);
        instance.handlePointerLeave?.(event);
      }}
      onClick={(event) => {
        other.onClick?.(event);
        instance.handleClick?.(event);
      }}
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
