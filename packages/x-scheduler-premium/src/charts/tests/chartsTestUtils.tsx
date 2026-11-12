'use client';
import * as React from 'react';
import type { Dataset } from '@mui/x-internals/types';
import type { EventCalendarPremiumChartsRenderer } from '../chartsFeature';

export interface CapturedDataset {
  dimensions: Dataset<string | number | Date | null>;
  values: Dataset<number | null>;
}

/**
 * The datasets the stub renderer received last, per chart type.
 */
export const capturedDatasets: Partial<Record<string, CapturedDataset>> = {};

interface StubItem {
  id: string;
  label: string;
  value: number;
  color?: string;
}

/**
 * The rings of a pie chart as `ChartsRenderer` builds them: one ring per dimension, the first
 * dimension inside, each inner item summing the rows under it.
 */
function buildRings(
  dimensions: CapturedDataset['dimensions'],
  valueItem: CapturedDataset['values'][number],
): { id: string; data: StubItem[] }[] {
  if (dimensions.length < 2) {
    return [
      {
        id: `${valueItem.id}-0`,
        data: valueItem.data.map((value, index) => ({
          id: `${valueItem.id}-${index}`,
          label: String(dimensions[0]?.data[index]),
          value: value ?? 0,
        })),
      },
    ];
  }
  const roots = new Map<string, StubItem>();
  valueItem.data.forEach((value, index) => {
    const rootId = String(dimensions[0].data[index]);
    const root = roots.get(rootId) ?? { id: rootId, label: rootId, value: 0 };
    root.value += value ?? 0;
    roots.set(rootId, root);
  });
  return [
    { id: `${valueItem.id}-0`, data: Array.from(roots.values()) },
    {
      id: `${valueItem.id}-1`,
      data: valueItem.data.map((value, index) => ({
        id: String(dimensions[1].data[index]),
        label: String(dimensions[1].data[index]),
        value: value ?? 0,
      })),
    },
  ];
}

function StubChart(props: Record<string, any>) {
  const { series, onItemClick, chartType, xAxis } = props;
  const itemClassName = chartType === 'pie' ? 'MuiPieChart-arc' : 'MuiBarChart-element';
  // the formatted category, e.g. the day of month of a column
  const periodLabel = (index: number) =>
    xAxis?.[0]?.valueFormatter?.(xAxis[0].data[index]) ?? xAxis?.[0]?.data[index];
  return (
    <div data-chart={chartType}>
      {series.map((entry: Record<string, any>) =>
        entry.data.map((item: StubItem | number | null, index: number) => (
          <button
            key={`${entry.id}-${index}`}
            type="button"
            className={itemClassName}
            data-series={entry.id}
            data-index={index}
            data-period={chartType === 'pie' ? undefined : periodLabel(index)}
            data-label={typeof item === 'object' && item ? item.label : entry.label}
            data-color={typeof item === 'object' && item ? item.color : entry.color}
            onClick={(event) => onItemClick?.(event, { seriesId: entry.id, dataIndex: index })}
          >
            {typeof item === 'object' && item ? item.value : item}
          </button>
        )),
      )}
    </div>
  );
}

/**
 * A renderer with the contract of `ChartsRenderer`: one button per bar segment or slice,
 * with the same class names, so the panel can be exercised without `@mui/x-charts`.
 */
export function StubRenderer({
  dimensions,
  values,
  chartType,
  onRender,
}: React.ComponentProps<EventCalendarPremiumChartsRenderer>) {
  React.useEffect(() => {
    capturedDatasets[chartType] = { dimensions, values };
  });
  const series =
    chartType === 'pie'
      ? buildRings(dimensions, values[0])
      : values.map((valueItem) => ({ ...valueItem }));
  const props = {
    chartType,
    series,
    xAxis: [{ data: dimensions[0]?.data ?? [] }],
    slotProps: {},
  };
  return onRender ? onRender(chartType, props, StubChart) : <StubChart {...props} />;
}

export function getChartItems(container: HTMLElement, seriesId: string) {
  return Array.from(container.querySelectorAll<HTMLButtonElement>(`[data-series="${seriesId}"]`));
}
