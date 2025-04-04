import { getLabel } from '../../internals/getLabel';
import type { AxisTooltipGetter, TooltipGetter } from '../../internals/plugins/models';

const tooltipGetter: TooltipGetter<'radar'> = (params) => {
  const { series, axesConfig, getColor, identifier } = params;

  const rotationAxis = axesConfig.rotation;
  if (!identifier || !rotationAxis) {
    return null;
  }

  const label = getLabel(series.label, 'tooltip');
  const formatter = (v: any) =>
    v == null
      ? ''
      : (rotationAxis.valueFormatter?.(v, {
          location: 'tooltip',
          scale: rotationAxis.scale,
        }) ?? v.toLocaleString());

  return series.data.map((value, dataIndex) => ({
    identifier,
    color: getColor(dataIndex),
    label,
    value,
    formattedValue: series.valueFormatter(value as any, { dataIndex }),
    markType: series.labelMarkType,
    axisFormattedValue: formatter(rotationAxis?.data?.[dataIndex]),
  }));
};

export const axisTooltipGetter: AxisTooltipGetter<'radar', 'rotation'> = (series) => {
  return Object.values(series).map(() => ({ direction: 'rotation', axisId: undefined }));
};

export default tooltipGetter;
