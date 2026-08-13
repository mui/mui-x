import * as React from 'react';
import { LineChart, lineClasses } from '@mui/x-charts/LineChart';
import { chartsGridClasses } from '@mui/x-charts/ChartsGrid';

import { useDrawingArea, useYAxes, useYAxisTicks } from '@mui/x-charts/hooks';
import { dataset, valueFormatter } from '../dataset/weather';

const LABEL_GAP = 4;

function GridLabelsYAxis(props) {
  const { yAxisIds } = useYAxes();
  const axisId = props.axisId ?? yAxisIds[0];

  const ticks = useYAxisTicks(axisId);
  const { left } = useDrawingArea();

  return (
    <React.Fragment>
      {ticks.map((tick) => (
        <text
          key={tick.value}
          x={left + LABEL_GAP}
          y={tick.offset - LABEL_GAP}
          textAnchor="start"
          className="grid-label"
        >
          {tick.formattedValue}
        </text>
      ))}
    </React.Fragment>
  );
}

export default function GridLabels() {
  return (
    <LineChart
      dataset={dataset}
      xAxis={[{ dataKey: 'month', scaleType: 'point' }]}
      // A width of 0 gives the space back to the drawing area.
      yAxis={[{ width: 0, valueFormatter }]}
      series={[
        { dataKey: 'london', label: 'London rainfall', area: true, valueFormatter },
      ]}
      slots={{ yAxis: GridLabelsYAxis }}
      grid={{ horizontal: true }}
      hideLegend
      height={300}
      sx={(theme) => ({
        [`& .${chartsGridClasses.horizontalLine}`]: { strokeDasharray: '4 4' },
        // A lighter area keeps the grid and its labels visible behind the data.
        [`& .${lineClasses.area}`]: { fillOpacity: 0.3 },
        '& .grid-label': {
          fill: (theme.vars || theme).palette.text.secondary,
          fontSize: 12,
          // Outline the text so that it stays readable over the area.
          stroke: (theme.vars || theme).palette.background.paper,
          strokeWidth: 3,
          paintOrder: 'stroke',
        },
      })}
    />
  );
}
