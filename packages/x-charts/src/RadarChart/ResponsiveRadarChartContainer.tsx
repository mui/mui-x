import * as React from 'react';
import { ResizableContainer } from '../ResponsiveChartContainer/ResizableContainer';
import { RadarChartContainer, RadarChartContainerProps } from './RadarChartContainer';
import { useResponsiveChartContainerProps } from '../ResponsiveChartContainer/useResponsiveChartContainerProps';

export interface ResponsiveRadarChartContainerProps
  extends Omit<RadarChartContainerProps, 'width' | 'height'> {
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width?: number;
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   */
  height?: number;
}

export const ResponsiveRadarChartContainer = React.forwardRef(
  function ResponsiveRadarChartContainer(
    { radar, ...props }: ResponsiveRadarChartContainerProps,
    ref,
  ) {
    const { hasIntrinsicSize, chartContainerProps, resizableChartContainerProps } =
      useResponsiveChartContainerProps(props, ref);

    return (
      <ResizableContainer {...resizableChartContainerProps}>
        {hasIntrinsicSize ? <RadarChartContainer radar={radar} {...chartContainerProps} /> : null}
      </ResizableContainer>
    );
  },
);
