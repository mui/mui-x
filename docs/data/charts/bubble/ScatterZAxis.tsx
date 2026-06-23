import * as React from 'react';
import { ScatterChart, ScatterMarkerProps } from '@mui/x-charts/ScatterChart';
import { ChartsTooltipContainer, useItemTooltip } from '@mui/x-charts/ChartsTooltip';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
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

function IrisTooltip() {
  return (
    <ChartsTooltipContainer trigger="item">
      <IrisTooltipContent />
    </ChartsTooltipContainer>
  );
}

function IrisTooltipContent() {
  const item = useItemTooltip<'scatter'>();

  function numberFormatter(value: number | string | undefined) {
    if (typeof value === 'number') {
      return new Intl.NumberFormat('en-US').format(value);
    }
    return String(value);
  }

  // Get the full data item from irisData using dataIndex from identifier
  const dataIndex = item?.identifier.dataIndex;
  const dataItem = dataIndex !== undefined ? irisData[dataIndex] : null;

  if (!item || !dataItem) {
    return null;
  }

  return (
    <Paper sx={{ p: 1.5 }} elevation={4}>
      <Box
        sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 1 }}
      >
        <Box
          sx={{
            width: 20,
            height: 20,
            backgroundColor: item?.color,
            borderRadius: 1,
            mr: 2,
          }}
        />
        <Typography sx={{ fontWeight: 600 }}>{dataItem.species}</Typography>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 0.75 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption">Sepal Length:</Typography>
          <Typography variant="caption" sx={{ fontWeight: 500 }}>
            {numberFormatter(dataItem.sepalLength)} cm
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption">Sepal Width:</Typography>
          <Typography variant="caption" sx={{ fontWeight: 500 }}>
            {numberFormatter(dataItem.sepalWidth)} cm
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption">Petal Length:</Typography>
          <Typography variant="caption" sx={{ fontWeight: 500 }}>
            {numberFormatter(dataItem.petalLength)} cm
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption">Petal Width:</Typography>
          <Typography variant="caption" sx={{ fontWeight: 500 }}>
            {numberFormatter(dataItem.petalWidth)} cm
          </Typography>
        </Box>
        <Divider sx={{ my: 0.5 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption">Predicted:</Typography>
          <Typography variant="caption" sx={{ fontWeight: 500 }}>
            {dataItem.prediction}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption">Confidence:</Typography>
          <Typography variant="caption" sx={{ fontWeight: 500 }}>
            {numberFormatter(dataItem.confidence)}%
          </Typography>
        </Box>
      </Box>
    </Paper>
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
        slots={{ marker: IrisMarker, tooltip: IrisTooltip }}
      ></ScatterChart>
      <IrisAnnotation />
    </Stack>
  );
}
