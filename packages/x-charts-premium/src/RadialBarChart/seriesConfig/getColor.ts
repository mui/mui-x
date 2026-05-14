import { type ColorProcessor, resolveColorProcessor } from '@mui/x-charts/internals';

const getColor: ColorProcessor<'radialBar'> = (series, rotationAxis, radiusAxis) =>
  resolveColorProcessor({
    series,
    valueColorScale: radiusAxis?.colorScale,
    categoryColorScale: rotationAxis?.colorScale,
    categoryValues: rotationAxis?.data,
  });

export default getColor;
