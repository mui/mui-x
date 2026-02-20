import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { ScatterPlot } from '@mui/x-charts/ScatterChart';
import { LinePlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import { internetUsageByCountry } from '../dataset/internetUsageByCountry';

const data = Object.values(internetUsageByCountry);

function calculateStatistics(values: number[]) {
  const n = values.length;
  const mean = values.reduce((sum, val) => sum + val, 0) / n;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);
  return { mean, stdDev };
}

function normalDistribution(x: number, mean: number, stdDev: number) {
  const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
}

export default function BellCurveOverlay() {
  const { mean, stdDev } = calculateStatistics(data);

  // Generate bell curve data
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  const bellCurveData: number[] = [];
  const xValues: number[] = [];
  const numPoints = 100;

  for (let i = 0; i <= numPoints; i += 1) {
    const x = min - range * 0.1 + ((max - min + range * 0.2) * i) / numPoints;
    xValues.push(x);
    bellCurveData.push(normalDistribution(x, mean, stdDev));
  }

  // Stack points that are close together
  const binWidth = range / 70; // Adjust this to control stacking sensitivity
  const sortedData = [...data].sort((a, b) => a - b);
  const bins: Map<number, number[]> = new Map();

  // Group values into bins
  sortedData.forEach((value) => {
    const binIndex = Math.round(value / binWidth);
    if (!bins.has(binIndex)) {
      bins.set(binIndex, []);
    }
    bins.get(binIndex)!.push(value);
  });

  // Create scatter data with stacked y-positions
  const scatterData: Array<{ x: number; y: number; id: number }> = [];
  let globalIndex = 0;
  const baseY = 0.0005;
  const stackHeight = 0.001;

  bins.forEach((values) => {
    values.forEach((value, stackIndex) => {
      scatterData.push({
        x: value,
        y: baseY + stackIndex * stackHeight,
        id: globalIndex,
      });
      globalIndex += 1;
    });
  });

  return (
    <div style={{ width: '100%' }}>
      <ChartContainer
        series={[
          {
            type: 'scatter',
            data: scatterData,
            label: 'Data points',
            id: 'scatter',
            markerSize: 4,
          },
          {
            type: 'line',
            data: bellCurveData,
            label: 'Normal distribution',
            id: 'bell-curve',
            color: '#f97316',
            curve: 'natural',
          },
        ]}
        xAxis={[
          {
            data: xValues,
            min: min - range * 0.1,
            max: max + range * 0.1,
            label: 'Individuals using the Internet (% of population)',
            valueFormatter: (value: string) => `${value}%`,
          },
        ]}
        yAxis={[
          {
            position: 'none',
          },
        ]}
        height={400}
      >
        <ScatterPlot />
        <LinePlot />
        <ChartsReferenceLine
          x={mean}
          label="Mean"
          lineStyle={{ strokeWidth: 2 }}
          labelStyle={{ fontWeight: 'bold' }}
          labelAlign="start"
          spacing={{ y: 40 }}
        />
        <ChartsReferenceLine
          x={mean - stdDev}
          label="-1σ"
          lineStyle={{ strokeWidth: 1.5, strokeDasharray: '5 5' }}
          labelAlign="start"
          spacing={{ y: 40 }}
        />
        <ChartsReferenceLine
          x={mean + stdDev}
          label="+1σ"
          lineStyle={{ strokeWidth: 1.5, strokeDasharray: '5 5' }}
          labelAlign="start"
          spacing={{ y: 40 }}
        />
        <ChartsXAxis />
        <ChartsYAxis />
      </ChartContainer>
    </div>
  );
}
