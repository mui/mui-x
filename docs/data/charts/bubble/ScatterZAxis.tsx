import * as React from 'react';
import { ScatterChart, ScatterMarkerProps } from '@mui/x-charts/ScatterChart';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useZAxis } from '@mui/x-charts-premium/hooks';
import { irisData } from '../dataset/irisDataset';

const species = ['Setosa', 'Versicolor', 'Virginica'];
const speciesColors = ['#2e7d32', '#ed6c02', '#9c27b0'];
const speciesPredictionColors = ['#5aa35e', '#be7f4b', '#ba68c9'];

function IrisMarker(props: ScatterMarkerProps) {
  const { x, y, color, size, isHighlighted, isFaded, dataIndex, ...other } = props;

  // Get and use color/size scale to determine stroke color and width based on prediction and confidence z-axes.
  const predictionAxis = useZAxis('prediction');
  const confidenceAxis = useZAxis('confidence');
  const strokeWidth =
    confidenceAxis?.sizeScale?.(confidenceAxis.data?.[dataIndex]) ?? 0;
  const strokeColor =
    predictionAxis?.colorScale?.(predictionAxis.data?.[dataIndex]) ?? 'gray';

  const r = (isHighlighted ? 1.2 : 1) * size;
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
 * Explains how the scatter plot encodes multiple dimensions of the dataset.
 */
function IrisAnnotation() {
  return (
    <Typography variant="caption" sx={{ textAlign: 'center' }}>
      Fill color represents the actual species, stroke color represents the predicted
      species, bubble size represents petal length, and stroke width represents
      prediction confidence.
    </Typography>
  );
}

export default function ScatterZAxis() {
  return (
    <Stack sx={{ width: '100%' }}>
      <ScatterChart
        dataset={irisData}
        height={300}
        grid={{ horizontal: true, vertical: true }}
        series={[
          {
            id: 'data',
            colorAxisId: 'species',
            sizeAxisId: 'petal',
            datasetKeys: { x: 'sepalLength', y: 'sepalWidth' },
            highlightScope: { highlight: 'item', fade: 'global' },
          },
        ]}
        xAxis={[{ label: 'Sepal length (cm)' }]}
        yAxis={[{ label: 'Sepal width (cm)' }]}
        zAxis={[
          {
            id: 'species',
            dataKey: 'species',
            colorMap: {
              type: 'ordinal',
              values: species,
              colors: speciesColors,
            },
          },
          {
            id: 'petal',
            dataKey: 'petalLength',
            sizeMap: {
              type: 'continuous',
              min: 1,
              max: 7,
              size: [3, 10],
            },
          },
          {
            id: 'prediction',
            dataKey: 'prediction',
            colorMap: {
              type: 'ordinal',
              values: species,
              colors: speciesPredictionColors,
            },
          },
          {
            id: 'confidence',
            dataKey: 'confidence',
            sizeMap: {
              type: 'continuous',
              min: Math.min(...irisData.map((item) => item.confidence)),
              max: 100,
              size: [0.5, 3],
            },
          },
        ]}
        slots={{ marker: IrisMarker }}
      ></ScatterChart>
      <IrisAnnotation />
    </Stack>
  );
}
