import * as React from 'react';
import NoSsr from '@mui/material/NoSsr';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
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
            border: 'solid',
            borderWidth: 2,
            borderColor: 'divider',
            table: { borderSpacing: 0 },
            thead: {
              td: {
                px: 1.5,
                py: 0.75,
                borderBottom: 'solid',
                borderWidth: 2,
                borderColor: 'divider',
              },
            },
            tbody: {
              'tr:first-child': { td: { paddingTop: 1.5 } },
              'tr:last-child': { td: { paddingBottom: 1.5 } },
              tr: {
                'td:first-child': { paddingLeft: 1.5 },
                'td:last-child': { paddingRight: 1.5 },
                td: {
                  paddingRight: '7px',
                  paddingBottom: '10px',
                },
              },
            },
          }}
        >
          <table>
            <thead>
              <tr>
                <td colSpan={3}>
                  <Typography>{tooltipData.axisFormattedValue}</Typography>
                </td>
              </tr>
            </thead>
            <tbody>
              {tooltipData.seriesItems.map((seriesItem) => (
                <tr key={seriesItem.seriesId}>
                  <td>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 2,
                        backgroundColor: seriesItem.color,
                      }}
                    />
                  </td>
                  <td>
                    <Typography fontWeight="light">
                      {seriesItem.formattedLabel}
                    </Typography>
                  </td>
                  <td>
                    <Typography>{seriesItem.formattedValue}</Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Paper>
      </Popper>
    </NoSsr>
  );
}
