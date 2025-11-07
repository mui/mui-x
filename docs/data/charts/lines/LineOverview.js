import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ChartContainerPro } from '@mui/x-charts-pro/ChartContainerPro';
import { LinePlot } from '@mui/x-charts-pro/LineChart';
import { ChartsXAxis } from '@mui/x-charts-pro/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts-pro/ChartsYAxis';
import { useDrawingArea, useXScale, useYScale, useLineSeries } from '@mui/x-charts-pro/hooks';
import { ChartsTooltip } from '@mui/x-charts-pro/ChartsTooltip';
import { ChartsGrid } from '@mui/x-charts-pro/ChartsGrid';
import { ChartsBrushOverlay } from '@mui/x-charts/ChartsBrushOverlay';
import { ChartZoomSlider } from '@mui/x-charts-pro/ChartZoomSlider';
import { ChartsClipPath } from '@mui/x-charts-pro/ChartsClipPath';
import { DATA } from '../dataset/usUnempGdp';

const dates = DATA.map(d => new Date(d.date));
const unemploymentData = DATA.map(d => d.UNRATE);
const gdpData = DATA.map(d => d.GDP_per_capita);

const recessions = [
  { start: new Date('2001-03-01'), end: new Date('2001-11-01'), label: 'Early 2000s' },
  { start: new Date('2007-12-01'), end: new Date('2009-06-01'), label: 'Great Recession' },
  { start: new Date('2020-02-01'), end: new Date('2020-04-01'), label: 'COVID-19' },
];

function RecessionBands({ periods }) {
  const { top, left, width, height } = useDrawingArea();
  const xScale = useXScale();

  return (
    <g>
      {periods.map((p, index) => {
        const xStart = xScale(p.start.getTime());
        const xEnd = xScale(p.end.getTime());

        if (xStart === undefined || xEnd === undefined || xStart > left + width || xEnd < left) {
            return null;
        }

        const x = Math.max(xStart, left);
        const w = Math.min(xEnd, left + width) - x;

        if (w <= 0) {
            return null;
        }
        
        const textX = x + w / 2;
        const textY = top + height / 3;

        return (
          <React.Fragment key={index}>
            <rect
              x={x}
              y={top}
              width={w}
              height={height}
              fill="grey"
              opacity={0.2}
            />
            <text
              x={textX}
              y={textY}
              transform={`rotate(-90, ${textX}, ${textY})`}
              textAnchor="middle"
              dominantBaseline="central"
              fill="rgba(0, 0, 0, 0.6)"
              style={{
                fontSize: '0.6rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                pointerEvents: 'none',
              }}
            >
              {p.label}
            </text>
          </React.Fragment>
        );
      })}
    </g>
  );
}

function MaxUnemploymentLabel() {
  const { top, left, width, height } = useDrawingArea();
  const xScale = useXScale();
  const yScale = useYScale('unemployment-axis');
  const unemploymentSeries = useLineSeries('unemployment');

  const { value: maxValue, index: maxIndex } = React.useMemo(() => {
    const { value, index } = unemploymentSeries.data.reduce(
      (acc, v, i) =>
         v > acc.value
          ? { value: v, index: i }
          : acc,
      { value: -Infinity, index: -1 },
    );
    return { value, index };
  }, [unemploymentSeries]);

  const x = xScale(dates[maxIndex].getTime());
  const y = yScale(maxValue);

  // Ensure the marker is within the drawing area
  if (x < left || x > left + width || y < top || y > top + height) {
    return null;
  }

  return (
    <g pointerEvents="none">
      <circle cx={x} cy={y} r={3} fill="#345da7" stroke="#fff" strokeWidth={1.5} />
      <text x={x + 6} y={y - 6} fill="#345da7" style={{ fontSize: 12, fontWeight: 600 }}>
        {`${maxValue.toFixed(1)}%`}
      </text>
    </g>
  );
}

export default function LineOverview() {
  const clipPathId = React.useId();
  return (
    <Box width="100%">
      <Box sx={{ mb: 2 }}>
        <Typography>
          US unemployment rate comparison with GDP per capita
        </Typography>
      </Box>
      <Box sx={{ width: '100%', height: 400 }}>
        <ChartContainerPro
          experimentalFeatures={{ preferStrictDomainInLineCharts: true }}
          series={[
            {
              type: 'line',
              id: 'unemployment',
              data: unemploymentData,
              label: 'Unemployment rate',
              color: '#345da7',
              showMark: false,
              yAxisId: 'unemployment-axis',
            },
            {
              type: 'line',
              data: gdpData,
              label: 'GDP per capita',
              color: '#4caf50',
              showMark: false,
              yAxisId: 'gdp-axis',
              connectNulls: true,
            },
          ]}
          xAxis={[
            {
              scaleType: 'time',
              data: dates,
              valueFormatter: (date) => date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
              zoom: { slider: { enabled: true } },
            },
          ]}
          yAxis={[
            {
              id: 'unemployment-axis',
              scaleType: 'linear',
              valueFormatter: (value) => `${value.toFixed(1)}%`,
              width: 70,
              position: 'left',
            },
            {
              id: 'gdp-axis',
              scaleType: 'linear',
              width: 70,
              position: 'right',
              valueFormatter: (value) => `${(value / 1000).toLocaleString()}k`,
            }
          ]}
          sx={{
            '.MuiLineElement-root': {
              strokeWidth: 1,
            },
          }}
          zoomInteractionConfig={{
            zoom: ['brush', 'pinch', 'tapAndDrag',],
            pan: ['drag','pressAndDrag'],
          }}
        >
          <ChartsClipPath id={clipPathId} />
          <RecessionBands periods={recessions} />
          <ChartsGrid horizontal />
          <g clipPath={`url(#${clipPathId})`}>
            <LinePlot />
            <MaxUnemploymentLabel />
          </g>
          <ChartsXAxis />
          <ChartsYAxis axisId="unemployment-axis" label="Unemployment Rate" />
          <ChartsYAxis axisId="gdp-axis" label="GDP per capita in US$" />  
          <ChartsTooltip
            trigger="axis"
            valueFormatter={(value) => `${value.toFixed(2)}%`}
          />
          <ChartZoomSlider />
          <ChartsBrushOverlay />
        </ChartContainerPro>
      </Box>
      <Box sx={{ mt: 1, textAlign: 'right' }}>
        <Typography variant="caption" color="text.secondary">
            Source: FRED
        </Typography>
      </Box>
      </Box>
  );
}