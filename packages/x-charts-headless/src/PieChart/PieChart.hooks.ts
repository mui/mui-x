'use client';
import { getPieCoordinates } from '@mui/x-charts';
import { getPercentageValue } from '@mui/x-charts/internals/getPercentageValue';
import { selectorChartDrawingArea } from '@mui/x-charts/internals/plugins/corePlugins/useChartDimensions';
import { selectorChartSeriesProcessed } from '@mui/x-charts/internals/plugins/corePlugins/useChartSeries';
import { useStore } from '@mui/x-charts/internals/store/useStore';
import { createSelectorMemoized } from '@mui/x-internals/store';

const pieSelector = createSelectorMemoized(
  selectorChartSeriesProcessed,
  (seriesByType) => seriesByType?.pie,
);

const selectorPieSeriesData = createSelectorMemoized(
  pieSelector,
  selectorChartDrawingArea,
  (pieSeries, drawingArea) => {
    if (!pieSeries) {
      return null;
    }

    const { width, height, left, top } = drawingArea;

    const { series, seriesOrder } = pieSeries;

    return seriesOrder.map((seriesId) => {
      const {
        innerRadius: innerRadiusParam,
        outerRadius: outerRadiusParam,
        arcLabelRadius: arcLabelRadiusParam,
        cornerRadius,
        paddingAngle,
        arcLabel,
        arcLabelMinAngle,
        data,
        highlighted,
        faded,
        cx: cxParam,
        cy: cyParam,
      } = series[seriesId];

      const { cx, cy, availableRadius } = getPieCoordinates(
        { cx: cxParam, cy: cyParam },
        { width, height },
      );
      const outerRadius = getPercentageValue(outerRadiusParam ?? availableRadius, availableRadius);
      const innerRadius = getPercentageValue(innerRadiusParam ?? 0, availableRadius);

      const arcLabelRadius =
        arcLabelRadiusParam === undefined
          ? (outerRadius + innerRadius) / 2
          : getPercentageValue(arcLabelRadiusParam, availableRadius);
      return {
        innerRadius,
        outerRadius,
        cornerRadius,
        paddingAngle,
        id: seriesId,
        data,
        highlighted,
        faded,
        arcLabelRadius,
        arcLabel,
        arcLabelMinAngle,
        availableRadius,
        cx,
        cy,
        transform: `translate(${left + cx}, ${top + cy})`,
      };
    });
  },
);

export const usePiePlotData = () => {
  const store = useStore();
  return store.use(selectorPieSeriesData);
};
