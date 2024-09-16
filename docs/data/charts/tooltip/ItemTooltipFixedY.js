import * as React from 'react';
import NoSsr from '@mui/material/NoSsr';
import Popper from '@mui/material/Popper';
import { useItemTooltip, useMouseTracker } from '@mui/x-charts/ChartsTooltip';
import { useDrawingArea, useSvgRef } from '@mui/x-charts/hooks';
import { CustomItemTooltipContent } from './CustomItemTooltipContent';
import { generateVirtualElement } from './generateVirtualElement';

export function ItemTooltipFixedY() {
  const tooltipData = useItemTooltip();
  const mousePosition = useMouseTracker();
  const svgRef = useSvgRef(); // Get the ref of the <svg/> component.
  const drawingArea = useDrawingArea(); // Get the dimensions of the chart inside the <svg/>.

  if (!tooltipData || !mousePosition) {
    // No data to display
    return null;
  }

  const tooltipPosition = {
    ...mousePosition,
    // Add the y-coordinate of the <svg/> to the to margin between the <svg/> and the drawing area
    y: svgRef.current.getBoundingClientRect().top + drawingArea.top,
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
