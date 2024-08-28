import * as React from 'react';
import NoSsr from '@mui/material/NoSsr';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import { useItemTooltip, useMouseTracker } from '@mui/x-charts/ChartsTooltip';

type MousePosition = {
  x: number;
  y: number;
  pointerType: 'mouse' | 'touch' | 'pen';
  height: number;
};

function generateVirtualElement(mousePosition: MousePosition | null) {
  if (mousePosition === null) {
    return {
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        toJSON: () => '',
      }),
    };
  }
  const { x, y } = mousePosition;
  const boundingBox = {
    width: 0,
    height: 0,
    x,
    y,
    top: y,
    right: x,
    bottom: y,
    left: x,
  };
  return {
    getBoundingClientRect: () => ({
      ...boundingBox,
      toJSON: () => JSON.stringify(boundingBox),
    }),
  };
}

export function ItemTooltip() {
  const tooltipData = useItemTooltip();
  const mousePosition = useMouseTracker();

  console.log({ tooltipData, mousePosition });
  if (!tooltipData) {
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
        placement={
          mousePosition?.pointerType === 'mouse'
            ? ('right-start' as const)
            : ('top' as const)
        }
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
        <Paper>
          <div style={{ height: 5, width: 5, backgroundColor: tooltipData.color }} />
          <p>{tooltipData.formattedValue}</p>
          <p>{tooltipData.label}</p>
        </Paper>
      </Popper>
    </NoSsr>
  );
}
