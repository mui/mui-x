import * as React from 'react';
import { ScaleBand } from '@mui/x-charts-vendor/d3-scale';
import NoSsr from '@mui/material/NoSsr';
import Popper from '@mui/material/Popper';
import { useItemTooltip, useMouseTracker } from '@mui/x-charts/ChartsTooltip';
import { useSvgRef, useXAxis, useXScale, useYScale } from '@mui/x-charts/hooks';
import { CustomItemTooltipContent } from './CustomItemTooltipContent';
import { generateVirtualElement, MousePosition } from './generateVirtualElement';

export function ItemTooltipTopElement() {
  const tooltipData = useItemTooltip<'bar'>();
  const mousePosition = useMouseTracker();
  const xAxis = useXAxis(); // Get xAxis config to access its data array.
  const xScale = useXScale(); // Get the scale which map values to SVG coordinates. Pass the axis id to this hook if you use multiple one.
  const yScale = useYScale(); // Get the scale which map values to SVG coordinates. Pass the axis id to this hook if you use multiple one.
  const svgRef = useSvgRef(); // Get the ref of the <svg/> component.

  if (!tooltipData || !mousePosition || !xAxis.data) {
    // No data to display
    return null;
  }

  if (
    tooltipData.identifier.type !== 'bar' ||
    tooltipData.identifier.dataIndex === undefined ||
    tooltipData.value === null
  ) {
    // This demo is only about bar charts
    return null;
  }

  const xValue = xAxis.data[tooltipData.identifier.dataIndex];

  const svgYPosition =
    yScale(tooltipData.value) ?? 0 + (yScale as ScaleBand<any>).step() / 2;
  const svgXPosition = xScale(xValue) ?? 0;

  const tooltipPosition: MousePosition = {
    ...mousePosition,
    x: svgRef.current.getBoundingClientRect().left + svgXPosition,
    y: svgRef.current.getBoundingClientRect().top + svgYPosition,
  };

  return (
    <NoSsr>
      <Popper
        sx={{
          pointerEvents: 'none',
          zIndex: (theme) => theme.zIndex.modal,
        }}
        open
        placement="top"
        anchorEl={generateVirtualElement(tooltipPosition)}
      >
        <CustomItemTooltipContent {...tooltipData} />
      </Popper>
    </NoSsr>
  );
}
