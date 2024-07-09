import * as React from 'react';
import { AxisDefaultized } from '../models/axis';
import { useAxis } from './useAxis';
import { ColorLegendSelector } from './legend.types';
import { LegendPerItem, LegendPerItemProps } from './LegendPerItem';

export interface PiecewiseColorLegendProps
  extends ColorLegendSelector,
    Omit<LegendPerItemProps, 'itemsToDisplay'> {}

export function PiecewiseColorLegend(props: PiecewiseColorLegendProps) {
  const { axisDirection, axisId, ...other } = props;

  const axisItem = useAxis({ axisDirection, axisId });

  const colorMap = axisItem?.colorMap;
  if (!colorMap || !colorMap.type || colorMap.type !== 'piecewise') {
    return null;
  }
  const valueFormatter = (v: number | Date) =>
    (axisItem as AxisDefaultized).valueFormatter?.(v, { location: 'legend' }) ?? v.toLocaleString();

  const formattedLabels = colorMap.thresholds.map(valueFormatter);
  const itemsToDisplay = colorMap.colors.map((color, index) => {
    if (index === 0) {
      const label = formattedLabels[index];
      return { id: label, color, label: `<${label}` };
    }
    if (index === colorMap.colors.length - 1) {
      const label = formattedLabels[index - 1];
      return { id: label, color, label: `>${label}` };
    }

    const label1 = formattedLabels[index - 1];
    const label2 = formattedLabels[index];
    const label = `${label1} - ${label2}`;
    return { id: label, color, label };
  });

  return <LegendPerItem {...other} itemsToDisplay={itemsToDisplay} />;
}
