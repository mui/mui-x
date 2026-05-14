import { getLabel } from './getLabel';

export interface GetLineDescriptionParams {
  identifier: { dataIndex?: number };
  series: {
    label?: string | ((location: 'tooltip' | 'legend') => string);
    data: readonly (number | null)[];
    valueFormatter: (value: number | null, context: { dataIndex: number }) => string | null;
  };
  categoryAxis: {
    data?: readonly unknown[];
    valueFormatter?: (value: never, context: { location: 'tooltip'; scale: never }) => string;
    scale: unknown;
  };
  localeText: {
    lineDescription: (params: {
      x: unknown;
      y: number | null;
      formattedXValue: string;
      formattedYValue: string;
      seriesLabel: string;
    }) => string;
  };
}

export function getLineDescription(params: GetLineDescriptionParams): string {
  const { identifier, series, categoryAxis, localeText } = params;

  const dataIndex = identifier.dataIndex;

  if (dataIndex === undefined) {
    return '';
  }

  const label = getLabel(series.label, 'tooltip');
  const xValue = categoryAxis.data?.[dataIndex] ?? null;
  const yValue = series.data[dataIndex] ?? null;

  const formattedXValue = categoryAxis.valueFormatter?.(xValue as never, {
    location: 'tooltip',
    scale: categoryAxis.scale as never,
  });
  const formattedYValue = series.valueFormatter(yValue, { dataIndex });

  return localeText.lineDescription({
    x: xValue,
    y: yValue,
    formattedXValue: formattedXValue ?? '',
    formattedYValue: formattedYValue ?? '',
    seriesLabel: label,
  });
}
