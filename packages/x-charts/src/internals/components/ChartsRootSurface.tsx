import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { ChartsSurface, ChartsSurfaceProps } from '../../ChartsSurface';
import { useChartRootRef } from '../../hooks';

export interface ChartsRootSurfaceProps extends ChartsSurfaceProps {}

/**
 * `ChartsRootSurface` is a wrapper around the `ChartsSurface` component that provides a reference to the chart root element.
 * This is only needed for charts that aren't wrapped in `ChartsWrapper`.
 */
export const ChartsRootSurface = React.forwardRef<SVGSVGElement, ChartsRootSurfaceProps>(
  function ChartsRootSurface(props, ref) {
    const chartRootRef = useChartRootRef();
    const chartsSurfaceForkRef = useForkRef(ref, chartRootRef);

    return <ChartsSurface {...props} ref={chartsSurfaceForkRef} />;
  },
);
