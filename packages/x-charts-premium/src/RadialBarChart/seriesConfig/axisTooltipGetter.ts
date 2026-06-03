import { type AxisTooltipGetter } from '@mui/x-charts/internals';

export const axisTooltipGetter: AxisTooltipGetter<'radialBar', 'rotation' | 'radius'> = (
  series,
) => {
  return Object.values(series).map((s) =>
    s.layout === 'horizontal'
      ? {
          direction: 'radius',
          axisId: 'radiusAxisId' in s ? s.radiusAxisId : undefined,
        }
      : {
          direction: 'rotation',
          axisId: 'rotationAxisId' in s ? s.rotationAxisId : undefined,
        },
  );
};
