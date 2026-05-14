import { getLabel } from './getLabel';

export interface GetBarDescriptionParams {
  identifier: { dataIndex: number };
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
    barDescription: (params: {
      value: number | null;
      formattedValue: string;
      categoryValue: string | number | null;
      formattedCategoryValue: string;
      seriesLabel?: string;
    }) => string;
  };
}

export function getBarDescription(params: GetBarDescriptionParams): string {
  const { identifier, series, categoryAxis, localeText } = params;

  const label = getLabel(series.label, 'tooltip');
  const value = series.data[identifier.dataIndex] ?? null;
  const categoryValue = (categoryAxis.data?.[identifier.dataIndex] ?? null) as
    | string
    | number
    | null;

  const formattedValue = series.valueFormatter(value, { dataIndex: identifier.dataIndex });
  const formattedCategory = categoryAxis.valueFormatter?.(categoryValue as never, {
    location: 'tooltip',
    scale: categoryAxis.scale as never,
  });

  return localeText.barDescription({
    value,
    formattedValue: formattedValue ?? '',
    categoryValue,
    formattedCategoryValue: formattedCategory ?? '',
    seriesLabel: label,
  });
}
