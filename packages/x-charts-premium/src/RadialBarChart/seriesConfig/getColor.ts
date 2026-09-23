import { resolveColorProcessor } from '@mui/x-charts/internals';
import type { ColorProcessor } from '@mui/x-charts/internals';

const getColor: ColorProcessor<'radialBar'> = (series, rotationAxis, radiusAxis) => {
  const verticalLayout = series.layout === 'vertical';
  return resolveColorProcessor({
    series,
    valueColorScale: verticalLayout ? radiusAxis?.colorScale : rotationAxis?.colorScale,
    categoryColorScale: verticalLayout ? rotationAxis?.colorScale : radiusAxis?.colorScale,
    categoryValues: verticalLayout ? rotationAxis?.data : radiusAxis?.data,
  });
};

export default getColor;
