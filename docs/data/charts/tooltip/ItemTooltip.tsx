import * as React from 'react';
import NoSsr from '@mui/material/NoSsr';
import Popper from '@mui/material/Popper';
import { useItemTooltip, useMouseTracker } from '@mui/x-charts/ChartsTooltip';
import { CustomItemTooltipContent } from './CustomItemTooltipContent';
import { generateVirtualElement } from './generateVirtualElement';

export function ItemTooltip() {
  const tooltipData = useItemTooltip();
  const mousePosition = useMouseTracker(); // Track the mouse position on chart.

  if (!tooltipData || !mousePosition) {
    // No data to display
    return null;
  }

  // The pointer type can be used to have different behavior based on pointer type.
  const isMousePointer = mousePosition?.pointerType === 'mouse';
  // Adapt the tooltip offset to the size of the pointer.
  const yOffset = isMousePointer ? 0 : 40 - mousePosition.height;

  return (
    <NoSsr>
      <Popper
        sx={{
          pointerEvents: 'none',
          zIndex: (theme) => theme.zIndex.modal,
        }}
        open
        placement={isMousePointer ? 'top-end' : 'top'}
        anchorEl={generateVirtualElement(mousePosition)}
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, yOffset],
            },
          },
        ]}
      >
        <CustomItemTooltipContent {...tooltipData} />
      </Popper>
    </NoSsr>
  );
}
