'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';

export interface ChartDataTableSeries {
  id: string;
  label: string;
  data: (number | null)[];
}

export interface ChartDataTableProps {
  /** The x-axis category label and values. */
  dimensionLabel: string;
  categories: (string | number | Date | null)[];
  /** The value series. */
  series: ChartDataTableSeries[];
  /** Table caption (the chart title). */
  caption?: string;
}

// Visually hidden, but present for screen readers and keyboard navigation —
// the accessible, structured counterpart to the chart (PRD "Explain" a11y).
const VisuallyHidden = styled('table')({
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
});

const formatCell = (value: string | number | Date | null): string => {
  if (value === null || value === undefined) {
    return '';
  }
  return value instanceof Date ? value.toLocaleDateString() : String(value);
};

/**
 * A keyboard-navigable, screen-reader-only data table mirroring the chart's
 * resolved series. Gives non-visual users the same data the chart shows,
 * without changing the visual layout.
 */
export function ChartDataTable(props: ChartDataTableProps) {
  const { dimensionLabel, categories, series, caption } = props;

  if (series.length === 0 || categories.length === 0) {
    return null;
  }

  return (
    <VisuallyHidden>
      {caption ? <caption>{caption}</caption> : null}
      <thead>
        <tr>
          <th scope="col">{dimensionLabel || 'Category'}</th>
          {series.map((s) => (
            <th key={s.id} scope="col">
              {s.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {categories.map((category, index) => (
          <tr key={index}>
            <th scope="row">{formatCell(category)}</th>
            {series.map((s) => (
              <td key={s.id}>{formatCell(s.data[index] ?? null)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </VisuallyHidden>
  );
}
