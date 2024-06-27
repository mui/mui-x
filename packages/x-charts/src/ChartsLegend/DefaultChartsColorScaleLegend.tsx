import * as React from 'react';
import { LegendPerItem, LegendPerItemProps } from './LegendPerItem';
import { AxisDefaultized } from '../models/axis';
import { ZAxisDefaultized } from '../models/z-axis';

export interface ChartsColorScaleLegendRenderProps
  extends Omit<LegendPerItemProps, 'itemsToDisplay'> {
  axisItem: ZAxisDefaultized | AxisDefaultized;
}

function DefaultChartsColorScaleLegend(props: ChartsColorScaleLegendRenderProps) {
  const { axisItem, ...other } = props;

  const colorMap = axisItem?.colorMap;
  if (!colorMap || !colorMap.type) {
    return null;
  }

  if (colorMap.type === 'piecewise') {
    const valueFormatter = (v: number | Date) =>
      (axisItem as AxisDefaultized).valueFormatter?.(v, { location: 'legend' }) ??
      v.toLocaleString();

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
  return null;
}

export { DefaultChartsColorScaleLegend };
