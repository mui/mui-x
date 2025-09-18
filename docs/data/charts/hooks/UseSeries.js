import * as React from 'react';
import { useSeries, useXAxis, useYAxis } from '@mui/x-charts/hooks';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartDataProvider } from '@mui/x-charts/ChartDataProvider';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';

const barData = [4, 3, 5, 7, 2];
const barData2 = [1, 2, 1, 2, 3];
const lineData = [2, 5, 3, 8, 4];
const xLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];

function MaxLineOnEachSeries() {
  const series = useSeries();
  const yAxis = useYAxis();
  const xAxis = useXAxis('pointId');

  const maxEach = Object.entries(series).flatMap(([_, typeSeries]) => {
    return Object.values(typeSeries.series).map((s) => ({
      id: s.id,
      max: Math.max(...s.data),
    }));
  });

  return (
    <React.Fragment>
      {maxEach.map(({ id, max }) => (
        <line
          key={id}
          x1={xAxis.scale(xAxis.scale.domain().at(0))}
          x2={xAxis.scale(xAxis.scale.domain().at(-1))}
          y1={yAxis.scale(max)}
          y2={yAxis.scale(max)}
          stroke="gray"
          strokeDasharray="4 4"
        />
      ))}
    </React.Fragment>
  );
}

export default function UseSeries() {
  return (
    <div>
      <ChartDataProvider
        series={[
          {
            data: barData,
            label: 'Revenue',
            type: 'bar',
          },
          {
            data: lineData,
            label: 'Profit',
            type: 'line',
            xAxisId: 'pointId',
          },
          {
            data: barData2,
            label: 'Expenses',
            type: 'bar',
          },
        ]}
        xAxis={[
          { scaleType: 'band', data: xLabels },
          { id: 'pointId', scaleType: 'point', data: xLabels },
        ]}
        yAxis={[{ scaleType: 'linear' }]}
        width={400}
        height={300}
      >
        <ChartsSurface>
          <BarPlot />
          <LinePlot />
          <ChartsXAxis />
          <ChartsYAxis />
          <MaxLineOnEachSeries />
        </ChartsSurface>
      </ChartDataProvider>
    </div>
  );
}
