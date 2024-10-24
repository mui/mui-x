import * as React from 'react';

import NoSsr from '@mui/material/NoSsr';
import Popper from '@mui/material/Popper';
import { useItemTooltip, useMouseTracker } from '@mui/x-charts/ChartsTooltip';
import { useSvgRef, useXAxis, useXScale, useYScale } from '@mui/x-charts/hooks';
import { CustomItemTooltipContent } from './CustomItemTooltipContent';
import { generateVirtualElement } from './generateVirtualElement';

export function ItemTooltipTopElement() {
  const tooltipData = useItemTooltip();
  const mousePosition = useMouseTracker();
  // Get xAxis config to access its data array.
  const xAxis = useXAxis();
  // Get the scale which map values to SVG coordinates.
  // Pass the axis id to this hook if you use multiple one.
  const xScale = useXScale();
  // Get the scale which map values to SVG coordinates.
  // Pass the axis id to this hook if you use multiple one.
  const yScale = useYScale();
  // Get the ref of the <svg/> component.
  const svgRef = useSvgRef();

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

  const svgYPosition = yScale(tooltipData.value) ?? 0;
  const svgXPosition = xScale(xValue) ?? 0;

  const tooltipPosition = {
    ...mousePosition,
    // Add half of `yScale.step()` to be in the middle of the band.
    x:
      svgRef.current.getBoundingClientRect().left + svgXPosition + xScale.step() / 2,
    // Add the coordinate of the <svg/> to the to position inside the <svg/>.
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
