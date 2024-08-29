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

  return (
    <NoSsr>
      <Popper
        sx={{
          pointerEvents: 'none',
          zIndex: (theme) => theme.zIndex.modal,
        }}
        open
        placement={mousePosition?.pointerType === 'mouse' ? 'top-end' : 'top'}
        anchorEl={generateVirtualElement(mousePosition)}
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [
                0,
                mousePosition?.pointerType === 'touch'
                  ? 40 - mousePosition.height
                  : 0,
              ],
            },
          },
        ]}
      >
        <CustomItemTooltipContent {...tooltipData} />
      </Popper>
    </NoSsr>
  );
}
