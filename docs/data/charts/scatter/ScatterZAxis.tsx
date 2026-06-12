import * as React from 'react';
import { ScatterChart, ScatterMarkerProps } from '@mui/x-charts/ScatterChart';
import { useZAxis, useScatterSeries } from '@mui/x-charts/hooks';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ChartsDataProvider } from '@mui/x-charts/ChartsDataProvider';
import { darken } from '@mui/material/styles';

// The Iris flower dataset, with sepal length and width mapped to the x and y axes, respectively,
// and species and petal length mapped to two separate z-axes for color and size encoding.
const irisData = [
  { id: 1, x: 5.1, y: 3.5, colorValue: 'Setosa', sizeValue: 1.4 },
  { id: 2, x: 4.9, y: 3, colorValue: 'Setosa', sizeValue: 1.4 },
  { id: 3, x: 4.7, y: 3.2, colorValue: 'Setosa', sizeValue: 1.3 },
  { id: 4, x: 5, y: 3.6, colorValue: 'Setosa', sizeValue: 1.4 },
  { id: 5, x: 5.4, y: 3.9, colorValue: 'Setosa', sizeValue: 1.7 },
  { id: 6, x: 4.6, y: 3.4, colorValue: 'Setosa', sizeValue: 1.4 },
  { id: 7, x: 5, y: 3.4, colorValue: 'Setosa', sizeValue: 1.5 },
  { id: 8, x: 4.4, y: 2.9, colorValue: 'Setosa', sizeValue: 1.4 },
  { id: 9, x: 5.4, y: 3.7, colorValue: 'Setosa', sizeValue: 1.5 },
  { id: 10, x: 4.8, y: 3.4, colorValue: 'Setosa', sizeValue: 1.6 },
  { id: 11, x: 5.8, y: 4, colorValue: 'Setosa', sizeValue: 1.2 },
  { id: 12, x: 5.7, y: 4.4, colorValue: 'Setosa', sizeValue: 1.5 },
  { id: 13, x: 5.4, y: 3.4, colorValue: 'Setosa', sizeValue: 1.7 },
  { id: 14, x: 5.1, y: 3.7, colorValue: 'Setosa', sizeValue: 1.5 },
  { id: 15, x: 4.6, y: 3.6, colorValue: 'Setosa', sizeValue: 1 },
  { id: 16, x: 7, y: 3.2, colorValue: 'Versicolor', sizeValue: 4.7 },
  { id: 17, x: 6.4, y: 3.2, colorValue: 'Versicolor', sizeValue: 4.5 },
  { id: 18, x: 6.9, y: 3.1, colorValue: 'Versicolor', sizeValue: 4.9 },
  { id: 19, x: 5.5, y: 2.3, colorValue: 'Versicolor', sizeValue: 4 },
  { id: 20, x: 6.5, y: 2.8, colorValue: 'Versicolor', sizeValue: 4.6 },
  { id: 21, x: 5.7, y: 2.8, colorValue: 'Versicolor', sizeValue: 4.5 },
  { id: 22, x: 6.3, y: 3.3, colorValue: 'Versicolor', sizeValue: 4.7 },
  { id: 23, x: 4.9, y: 2.4, colorValue: 'Versicolor', sizeValue: 3.3 },
  { id: 24, x: 6.6, y: 2.9, colorValue: 'Versicolor', sizeValue: 4.6 },
  { id: 25, x: 5.2, y: 2.7, colorValue: 'Versicolor', sizeValue: 3.9 },
  { id: 26, x: 5, y: 2, colorValue: 'Versicolor', sizeValue: 3.5 },
  { id: 27, x: 5.9, y: 3, colorValue: 'Versicolor', sizeValue: 4.2 },
  { id: 28, x: 6, y: 2.2, colorValue: 'Versicolor', sizeValue: 4 },
  { id: 29, x: 6.1, y: 2.9, colorValue: 'Versicolor', sizeValue: 4.7 },
  { id: 30, x: 5.6, y: 2.9, colorValue: 'Versicolor', sizeValue: 3.6 },
  { id: 31, x: 6.3, y: 3.3, colorValue: 'Virginica', sizeValue: 6 },
  { id: 32, x: 5.8, y: 2.7, colorValue: 'Virginica', sizeValue: 5.1 },
  { id: 33, x: 7.1, y: 3, colorValue: 'Virginica', sizeValue: 5.9 },
  { id: 34, x: 6.3, y: 2.9, colorValue: 'Virginica', sizeValue: 5.6 },
  { id: 35, x: 6.5, y: 3, colorValue: 'Virginica', sizeValue: 5.8 },
  { id: 36, x: 7.6, y: 3, colorValue: 'Virginica', sizeValue: 6.6 },
  { id: 37, x: 4.9, y: 2.5, colorValue: 'Virginica', sizeValue: 4.5 },
  { id: 38, x: 7.3, y: 2.9, colorValue: 'Virginica', sizeValue: 6.3 },
  { id: 39, x: 6.7, y: 2.5, colorValue: 'Virginica', sizeValue: 5.8 },
  { id: 40, x: 7.2, y: 3.6, colorValue: 'Virginica', sizeValue: 6.1 },
  { id: 41, x: 6.5, y: 3.2, colorValue: 'Virginica', sizeValue: 5.1 },
  { id: 42, x: 6.4, y: 2.7, colorValue: 'Virginica', sizeValue: 5.3 },
  { id: 43, x: 6.8, y: 3, colorValue: 'Virginica', sizeValue: 5.5 },
  { id: 44, x: 5.7, y: 2.5, colorValue: 'Virginica', sizeValue: 5 },
  { id: 45, x: 5.8, y: 2.8, colorValue: 'Virginica', sizeValue: 5.1 },
];

const species = ['Setosa', 'Versicolor', 'Virginica'];
const speciesColors = ['#2e7d32', '#ed6c02', '#9c27b0'];

/**
 * A custom marker that uses the `color` and `size` props—already
 * mapped through the z-axis scales by `ScatterPlot`—to derive
 * independent stroke and fill styling.
 */
function IrisMarker(props: ScatterMarkerProps) {
  const { x, y, color, size, isHighlighted, isFaded, ...other } = props;

  const r = (isHighlighted ? 1.2 : 1) * size;
  const strokeWidth = Math.max(1, size / 5);
  const strokeColor = darken(color, 0.2);

  return (
    <circle
      cx={0}
      cy={0}
      r={r}
      transform={`translate(${x}, ${y})`}
      fill={color}
      fillOpacity={isFaded ? 0.15 : 0.35}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeOpacity={isFaded ? 0.3 : 1}
      cursor={other.onClick ? 'pointer' : 'unset'}
      {...other}
    />
  );
}

/**
 * A custom legend showing the color encoding used for each Iris species.
 */
function IrisLegend() {
  return (
    <Stack
      direction="row"
      spacing={2}
      useFlexGap
      sx={{ justifyContent: 'center', flexWrap: 'wrap', mb: 1 }}
    >
      {species.map((name, index) => {
        const color = speciesColors[index];
        return (
          <Stack
            key={name}
            direction="row"
            spacing={0.5}
            sx={{ alignItems: 'center' }}
          >
            <svg width={14} height={14}>
              <circle
                cx={7}
                cy={7}
                r={6}
                fill={color ?? undefined}
                fillOpacity={0.35}
                stroke={color ? darken(color, 0.2) : undefined}
                strokeWidth={1.5}
              />
            </svg>
            <Typography variant="caption">{name}</Typography>
          </Stack>
        );
      })}
    </Stack>
  );
}
/**
 * An annotation component that calculates the average petal length across the dataset and uses the z-axis size scale to show how that value maps to marker radius, demonstrating how to access and use z-axis scales directly in custom components.
 */
function IrisAnnotation() {
  const series = useScatterSeries('data');
  const zAxis = useZAxis('petal');
  const sizeScale = zAxis?.sizeScale;

  if (!series?.data || !sizeScale) {
    return null;
  }

  const avgPetalLength =
    series.data.reduce((sum, item) => sum + Number(item.sizeValue ?? 0), 0) /
    series.data.length;

  const avgMarkerRadius = sizeScale(avgPetalLength);

  return (
    <Typography variant="caption" sx={{ textAlign: 'center' }}>
      Bubble size is proportional to petal length (average:{' '}
      {avgPetalLength.toFixed(1)} cm, mapped to a {avgMarkerRadius?.toFixed(1)}px
      radius)
    </Typography>
  );
}

export default function ScatterZAxis() {
  return (
    <Stack sx={{ width: '100%' }}>
      <ChartsDataProvider
        series={[
          {
            type: 'scatter',
            data: irisData,
            id: 'data',
            label: 'Iris Dataset',
          },
        ]}
        xAxis={[{ id: 'x-axis', label: 'Sepal length (cm)', min: 4 }]}
        yAxis={[{ id: 'y-axis', label: 'Sepal width (cm)', min: 1.5 }]}
        zAxis={[
          {
            id: 'species',
            data: irisData.map((d) => d.colorValue),
            colorMap: {
              type: 'ordinal',
              values: species,
              colors: speciesColors,
            },
          },
          {
            id: 'petal',
            data: irisData.map((d) => d.sizeValue),
            sizeMap: {
              type: 'continuous',
              min: 1,
              max: 7,
              size: [4, 16],
            },
          },
        ]}
      >
        <ScatterChart
          dataset={irisData}
          height={300}
          grid={{ horizontal: true, vertical: true }}
          series={[
            {
              id: 'data',
              data: irisData,
              colorAxisId: 'species',
              sizeAxisId: 'petal',
              highlightScope: { highlight: 'item', fade: 'global' },
              valueFormatter: (v) =>
                v
                  ? `Sepal: ${v.x} × ${v.y} cm · Petal length: ${v.sizeValue} cm`
                  : '',
            },
          ]}
          xAxis={[{ label: 'Sepal length (cm)', min: 4 }]}
          yAxis={[{ label: 'Sepal width (cm)', min: 1.5 }]}
          zAxis={[
            {
              id: 'species',
              dataKey: 'colorValue',
              colorMap: {
                type: 'ordinal',
                values: species,
                colors: speciesColors,
              },
            },
            {
              id: 'petal',
              dataKey: 'sizeValue',
              sizeMap: {
                type: 'continuous',
                min: 1,
                max: 7,
                size: [4, 16],
              },
            },
          ]}
          slots={{ marker: IrisMarker }}
        >
          <IrisLegend />
        </ScatterChart>
        <IrisAnnotation />
      </ChartsDataProvider>
    </Stack>
  );
}
