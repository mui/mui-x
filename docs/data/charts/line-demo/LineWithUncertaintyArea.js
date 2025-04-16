import * as React from 'react';
import { AnimatedLine, LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import {
  useChartId,
  useDrawingArea,
  useLineSeries,
  useXAxis,
  useXScale,
  useYScale,
} from '@mui/x-charts/hooks';
import * as d3Shape from '@mui/x-charts-vendor/d3-shape';

import { useTheme } from '@mui/material/styles';

function CustomAnimatedLine(props) {
  const { limit, sxBefore, sxAfter, ...other } = props;
  const { top, bottom, height, left, width } = useDrawingArea();
  const scale = useXScale();
  const chartId = useChartId();

  if (limit === undefined) {
    return <AnimatedLine {...other} />;
  }

  const limitPosition = scale(limit); // Convert value to x coordinate.

  if (limitPosition === undefined) {
    return <AnimatedLine {...other} />;
  }

  const clipIdleft = `${chartId}-${props.ownerState.id}-line-limit-${limit}-1`;
  const clipIdRight = `${chartId}-${props.ownerState.id}-line-limit-${limit}-2`;
  return (
    <React.Fragment>
      {/* Clip to show the line before the limit */}
      <clipPath id={clipIdleft}>
        <rect
          x={left}
          y={0}
          width={limitPosition - left}
          height={top + height + bottom}
        />
      </clipPath>
      {/* Clip to show the line after the limit */}
      <clipPath id={clipIdRight}>
        <rect
          x={limitPosition}
          y={0}
          width={left + width - limitPosition}
          height={top + height + bottom}
        />
      </clipPath>
      <g clipPath={`url(#${clipIdleft})`} className="line-before">
        <AnimatedLine {...other} />
      </g>
      <g clipPath={`url(#${clipIdRight})`} className="line-after">
        <AnimatedLine {...other} />
      </g>
    </React.Fragment>
  );
}

function ForecastArea({ limit, forecast }) {
  const lineSeries = useLineSeries();
  const xAxis = useXAxis();
  const xScale = useXScale();
  const yScale = useYScale();

  const xAxisData = xAxis.data?.slice(limit) ?? [];

  if (!yScale) {
    return null;
  }

  return (
    <React.Fragment>
      {lineSeries.map((series) => {
        const data = xAxisData.map((v, i) => ({
          x: v,
          y0: forecast[i].y0,
          y1: forecast[i].y1,
        }));

        const path = d3Shape
          .area()
          .x((d) => xScale(d.x))
          .y0((d) => yScale(d.y0))
          .y1((d) => yScale(d.y1))(data);

        return <path key={`forecast-area-${series.id}`} d={path} fill="#0000ff44" />;
      })}
    </React.Fragment>
  );
}

function ShadedBackground({ limit }) {
  const { top, bottom, height, left, width } = useDrawingArea();
  const scale = useXScale();
  const limitPosition = scale(limit);
  const theme = useTheme();
  const fill =
    theme.palette.mode === 'dark'
      ? theme.palette.grey[900]
      : theme.palette.grey[400];

  return (
    <rect
      x={limitPosition}
      y={0}
      width={left + width - limitPosition}
      height={top + height + bottom}
      fill={fill}
      opacity={0.4}
    />
  );
}

export default function LineWithUncertaintyArea() {
  const id = React.useId();
  const clipPathId = `${id}-clip-path`;

  return (
    <ChartContainer
      series={[
        {
          type: 'line',
          data: [1, 2, 3, 4, 1, 2, 3, 4, 5],
          valueFormatter: (v, i) => `${v}${i.dataIndex > 5 ? ' (estimated)' : ''}`,
        },
      ]}
      xAxis={[{ data: [0, 1, 2, 3, 4, 5, 6, 7, 8] }]}
      height={200}
      sx={{ '& .line-after path': { strokeDasharray: '10 5' } }}
    >
      <ChartsXAxis />
      <ChartsYAxis />
      <g clipPath={`url(#${clipPathId})`}>
        <ShadedBackground limit={5} />
        <LinePlot
          slots={{ line: CustomAnimatedLine }}
          slotProps={{ line: { limit: 5 } }}
        />
        <ForecastArea
          limit={5}
          forecast={[
            { y0: 2, y1: 2 },
            { y0: 2.3, y1: 4 },
            { y0: 3, y1: 5 },
            { y0: 4.4, y1: 5.8 },
          ]}
        />
        <MarkPlot />
      </g>
      <ChartsTooltip />
      <ChartsClipPath id={clipPathId} />
    </ChartContainer>
  );
}
