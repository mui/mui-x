import { getLabel } from './getLabel';
import type { ChartSeriesType } from '../models/seriesType/config';
import type { DescriptionGetter } from './plugins/corePlugins/useChartSeriesConfig';

interface AxisLike {
  data?: any[];
  valueFormatter?: (value: any, context: { location: string; scale: any }) => string;
  scale: any;
}

export function createLineStyleDescriptionGetter<T extends ChartSeriesType>(
  getMainAxis: (params: any) => AxisLike,
): DescriptionGetter<T> {
  const descriptionGetter: DescriptionGetter<T> = (params) => {
    const { identifier, series, localeText } = params as any;

    const label = getLabel(series.label, 'tooltip');
    const dataIndex = identifier.dataIndex;

    if (dataIndex === undefined) {
      return '';
    }

    const mainAxis = getMainAxis(params);

    const xValue = mainAxis.data?.[dataIndex] ?? null;
    const yValue = series.data[dataIndex] ?? null;

    const formattedXValue = mainAxis.valueFormatter?.(xValue, {
      location: 'tooltip',
      scale: mainAxis.scale,
    });
    const formattedYValue = series.valueFormatter(yValue, { dataIndex });

    return localeText.lineDescription({
      x: xValue,
      y: yValue,
      formattedXValue: formattedXValue ?? '',
      formattedYValue: formattedYValue ?? '',
      seriesLabel: label,
    });
  };
  return descriptionGetter;
}
