import type { AxisTooltipGetter } from '../../../../x-charts/src/internals/plugins/corePlugins/useChartSeriesConfig';

export const axisTooltipGetter: AxisTooltipGetter<'radial-line', 'rotation' | 'radius'> = (
  series,
) => {
  return Object.values(series).map((s) => ({
    direction: 'rotation',
    axisId: 'rotationAxisId' in s ? s.rotationAxisId : undefined,
  }));
};
