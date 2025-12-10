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
import { useSelector } from '@mui/x-charts/internals/store/useSelector';
import { useStore } from '@mui/x-charts/internals/store/useStore';

export interface ChartsSurfaceProps
  extends Omit<
    React.SVGProps<SVGSVGElement>,
    'id' | 'children' | 'className' | 'height' | 'width' | 'cx' | 'cy' | 'viewBox' | 'color' | 'ref'
  > {
  className?: string;
  children?: React.ReactNode;
}

const ChartsSurface = React.forwardRef<SVGSVGElement, ChartsSurfaceProps>(function ChartsSurface(
  inProps: ChartsSurfaceProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const store = useStore();

  const svgWidth = useSelector(store, selectorChartSvgWidth);
  const svgHeight = useSelector(store, selectorChartSvgHeight);

  const propsWidth = useSelector(store, selectorChartPropsWidth);
  const propsHeight = useSelector(store, selectorChartPropsHeight);
  const isKeyboardNavigationEnabled = useSelector(store, selectorChartsIsKeyboardNavigationEnabled);
  const hasFocusedItem = useSelector(store, selectorChartsHasFocusedItem);
  const svgRef = useSvgRef();
  const handleRef = useForkRef(svgRef, ref);

  const { children, style, ...other } = inProps;

  const hasIntrinsicSize = svgHeight > 0 && svgWidth > 0;

  const styles = {
    height: propsWidth ? `${propsHeight}px` : '100%',
    width: propsWidth ? `${propsWidth}px` : '100%',
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

export { ChartsSurface };
