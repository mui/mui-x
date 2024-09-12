import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import NoSsr from '@mui/material/NoSsr';
import Popper from '@mui/material/Popper';
import { useRadarSeriesTooltip } from './useRadarTooltip';
import { generateVirtualElement, useMouseTracker } from '../ChartsTooltip/utils';

export function RadarTooltip() {
  const tooltipData = useRadarSeriesTooltip();
  const mousePosition = useMouseTracker();

  return (
    <NoSsr>
      {mousePosition !== null && tooltipData !== null && (
        <Popper
          sx={{ pointerEvents: 'none' }}
          open
          placement={
            mousePosition?.pointerType === 'mouse' ? ('right-start' as const) : ('top' as const)
          }
          anchorEl={generateVirtualElement(mousePosition)}
          modifiers={[
            {
              name: 'offset',
              options: {
                offset: [0, mousePosition?.pointerType === 'touch' ? 40 - mousePosition.height : 0],
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
                  '&> div': {
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  },
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
                    paddingBottom: '5px',
                  },
                },
              },
            }}
          >
            <table>
              {tooltipData?.seriesLabel && (
                <thead>
                  <tr>
                    <td colSpan={2}>
                      <div>
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 2,
                            backgroundColor: tooltipData.color,
                            marginRight: 10,
                          }}
                        />
                        <Typography>{tooltipData.seriesLabel}</Typography>
                      </div>
                    </td>
                  </tr>
                </thead>
              )}
              <tbody>
                {(Array.isArray(tooltipData.points)
                  ? tooltipData.points
                  : [tooltipData.points]
                ).map((point, index) => (
                  <tr key={index}>
                    <td>
                      <Typography fontWeight="light">{point.label}</Typography>
                    </td>
                    <td>
                      <Typography>{point.formattedValue}</Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Paper>
        </Popper>
      )}
    </NoSsr>
  );
}
