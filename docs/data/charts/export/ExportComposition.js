import * as React from 'react';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { useChartRootRef } from '@mui/x-charts/hooks';
import Button from '@mui/material/Button';

import { Stack } from '@mui/system';
import { ChartDataProviderPro } from '@mui/x-charts-pro/ChartDataProviderPro';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';

function CustomChartWrapper({ children }) {
  const chartRootRef = useChartRootRef();

  return <div ref={chartRootRef}>{children}</div>;
}

export default function ExportComposition() {
  const apiRef = React.useRef(undefined);

  return (
    <Stack width="100%">
      <ChartDataProviderPro
        apiRef={apiRef}
        height={300}
        series={[
          {
            type: 'bar',
            data: [1, 2, 3, 2, 1],
          },
          {
            type: 'line',
            data: [4, 3, 1, 3, 4],
          },
        ]}
        xAxis={[
          {
            data: ['A', 'B', 'C', 'D', 'E'],
            scaleType: 'band',
            id: 'x-axis-id',
            height: 45,
          },
        ]}
      >
        <CustomChartWrapper>
          <ChartsSurface>
            <BarPlot />
            <LinePlot />
            <MarkPlot />
            <ChartsXAxis label="X axis" axisId="x-axis-id" />
          </ChartsSurface>
        </CustomChartWrapper>
      </ChartDataProviderPro>

      <Button onClick={() => apiRef.current?.exportAsPrint()}>Print</Button>
    </Stack>
  );
}
