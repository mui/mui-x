import * as React from 'react';
import Box from '@mui/material/Box';
import { useLegend } from '@mui/x-charts/hooks';
import { ChartDataProvider } from '@mui/x-charts/context';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';

function MyCustomLegend() {
  const { items } = useLegend();
  return (
    <table
      style={{
        marginLeft: 40,
        marginRight: 40,
      }}
    >
      <tbody>
        {items.map((v) => {
          return (
            <tr key={v.id}>
              <td aria-hidden>
                <div
                  style={{
                    background: v.color,
                    height: 10,
                    width: 10,
                    marginRight: 10,
                    flexShrink: 0,
                    borderRadius: 5,
                  }}
                />
              </td>
              <td>{`${v.label}`}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const veryLongText =
  "Second Series. You should always try to avoid long sentences. But oftentimes, it's not possible. So, we need to handle them gracefully. This is a very long sentence that should be fully readable.";

export default function HtmlLegend() {
  return (
    <Box sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
      <ChartDataProvider
        series={[
          { label: 'First Series', type: 'bar', data: [100, 200] },
          { label: veryLongText, type: 'bar', data: [45, 333] },
        ]}
        xAxis={[{ data: ['A', 'B'], scaleType: 'band', id: 'x-axis' }]}
      >
        <ChartsSurface>
          <BarPlot />
          <ChartsXAxis position="bottom" axisId="x-axis" />
          <ChartsYAxis position="left" />
        </ChartsSurface>
        <MyCustomLegend />
      </ChartDataProvider>
    </Box>
  );
}
