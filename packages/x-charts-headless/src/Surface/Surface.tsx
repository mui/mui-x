'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useSvgRef } from '@mui/x-charts';
import {
  selectorChartSvgWidth,
  selectorChartSvgHeight,
  selectorChartPropsWidth,
  selectorChartPropsHeight,
} from '@mui/x-charts/internals/plugins/corePlugins/useChartDimensions';
import {
  selectorChartsIsKeyboardNavigationEnabled,
  selectorChartsHasFocusedItem,
} from '@mui/x-charts/internals/plugins/featurePlugins/useChartKeyboardNavigation';
import { useStore } from '@mui/x-charts/internals/store/useStore';

export interface SurfaceProps extends Omit<
  React.SVGProps<SVGSVGElement>,
  'id' | 'children' | 'className' | 'height' | 'width' | 'cx' | 'cy' | 'viewBox' | 'color' | 'ref'
> {
  className?: string;
  children?: React.ReactNode;
}

/**
 * The `Surface` component is used to render the SVG surface for charts.
 * It handles sizing, keyboard navigation, and focused item state.
 */
const Surface = React.forwardRef<SVGSVGElement, SurfaceProps>(function Surface(
  inProps: SurfaceProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const store = useStore();

  const svgWidth = store.use(selectorChartSvgWidth);
  const svgHeight = store.use(selectorChartSvgHeight);

  const propsWidth = store.use(selectorChartPropsWidth);
  const propsHeight = store.use(selectorChartPropsHeight);
  const isKeyboardNavigationEnabled = store.use(selectorChartsIsKeyboardNavigationEnabled);
  const hasFocusedItem = store.use(selectorChartsHasFocusedItem);
  const svgRef = useSvgRef();
  const handleRef = useForkRef(svgRef, ref);

  const { children, style, ...other } = inProps;

  const hasIntrinsicSize = svgHeight > 0 && svgWidth > 0;

  const styles = {
    height: propsWidth ? `${propsHeight}px` : '100%',
    width: propsWidth ? `${propsWidth}px` : '100%',
    userSelect: 'none',
    ...style,
  } as React.CSSProperties;

  return (
    <svg
      viewBox={`${0} ${0} ${svgWidth} ${svgHeight}`}
      tabIndex={isKeyboardNavigationEnabled ? 0 : undefined}
      data-has-focused-item={hasFocusedItem || undefined}
      style={styles}
      {...other}
      ref={handleRef}
    >
      {hasIntrinsicSize && children}
    </svg>
  );
});

export { Surface };
