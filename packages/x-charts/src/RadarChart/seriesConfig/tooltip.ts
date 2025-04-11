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
    rotationAxis.valueFormatter?.(v, {
      location: 'tooltip',
      scale: rotationAxis.scale,
    }) ?? (v == null ? '' : v.toLocaleString());

  return {
    identifier,
    color: getColor(),
    label,
    markType: series.labelMarkType,
    values: series.data.map((value, dataIndex) => ({
      value,
      formattedValue: series.valueFormatter(value, { dataIndex }),
      markType: series.labelMarkType,
      label: formatter(rotationAxis?.data?.[dataIndex]),
    })),
  };
};

export const axisTooltipGetter: AxisTooltipGetter<'radar', 'rotation'> = (series) => {
  return Object.values(series).map(() => ({ direction: 'rotation', axisId: undefined }));
};

export default tooltipGetter;
