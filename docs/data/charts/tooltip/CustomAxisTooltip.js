import * as React from 'react';
import NoSsr from '@mui/material/NoSsr';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAxisTooltip, useMouseTracker } from '@mui/x-charts/ChartsTooltip';
import { generateVirtualElement } from './generateVirtualElement';

export function CustomAxisTooltip() {
  const tooltipData = useAxisTooltip();
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
        <Paper
          elevation={0}
          sx={{
            m: 1,
            p: 1.5,
            border: 'solid',
            borderWidth: 2,
            borderColor: 'divider',
          }}
        >
          {/* <pre>{tooltipData}</pre> */}
          <Typography>{tooltipData.axisFormattedValue}</Typography>
          {tooltipData.seriesItems.map((seriesItem) => (
            <Stack direction="row" alignItems="center">
              {/* key={seriesItem.seriesId}> */}
              <div
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: '50%',
                  backgroundColor: seriesItem.color,
                }}
              />
              <Typography sx={{ ml: 2 }} fontWeight="light">
                {seriesItem.formattedLabel}
              </Typography>
              <Typography sx={{ ml: 2 }}>{seriesItem.formattedValue}</Typography>
            </Stack>
          ))}
        </Paper>
      </Popper>
    </NoSsr>
  );
}
