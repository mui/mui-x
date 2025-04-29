import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useAxesTooltip } from '@mui/x-charts/ChartsTooltip';

export function CustomAxisTooltip() {
  const tooltipData = useAxesTooltip();

  // In this demo only one axis id used.
  const firstAxisData = tooltipData?.[0];

  if (!firstAxisData) {
    return null;
  }
  return (
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
          'tr:first-of-type': { td: { paddingTop: 1.5 } },
          'tr:last-of-type': { td: { paddingBottom: 1.5 } },
          tr: {
            'td:first-of-type': { paddingLeft: 1.5 },
            'td:last-of-type': { paddingRight: 1.5 },
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
              <Typography>{firstAxisData.axisFormattedValue}</Typography>
            </td>
          </tr>
        </thead>
        <tbody>
          {firstAxisData.seriesItems.map((seriesItem) => (
            <tr key={seriesItem.seriesId}>
              <td aria-label={`${seriesItem.formattedLabel}-series-color`}>
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
  );
}
