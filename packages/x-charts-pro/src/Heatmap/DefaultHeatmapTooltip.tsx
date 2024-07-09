import * as React from 'react';
import clsx from 'clsx';
import {
  ChartsItemContentProps,
  ChartsTooltipPaper,
  ChartsTooltipTable,
  ChartsTooltipRow,
  ChartsTooltipCell,
  ChartsTooltipMark,
} from '@mui/x-charts/ChartsTooltip';
import { useXAxis, useYAxis } from '@mui/x-charts/hooks';
import { getLabel } from '@mui/x-charts/internals';

/**
 * @ignore - do not document.
 */
export function DefaultHeatmapTooltip(props: ChartsItemContentProps<'heatmap'>) {
  const { series, itemData, sx, classes, getColor } = props;

  const xAxis = useXAxis();
  const yAxis = useYAxis();

  if (itemData.dataIndex === undefined || !series.data[itemData.dataIndex]) {
    return null;
  }

  const color = getColor(itemData.dataIndex);

  const valueItem = series.data[itemData.dataIndex];
  const [xIndex, yIndex] = valueItem;

  const formattedX =
    xAxis.valueFormatter?.(xAxis.data![xIndex], { location: 'tooltip' }) ??
    xAxis.data![xIndex].toLocaleString();
  const formattedY =
    yAxis.valueFormatter?.(yAxis.data![yIndex], { location: 'tooltip' }) ??
    yAxis.data![yIndex].toLocaleString();
  const formattedValue = series.valueFormatter(valueItem, { dataIndex: itemData.dataIndex });

  const seriesLabel = getLabel(series.label, 'tooltip');

  return (
    <ChartsTooltipPaper sx={sx} className={classes.root}>
      <ChartsTooltipTable className={classes.table}>
        <thead>
          <ChartsTooltipRow>
            <ChartsTooltipCell>{formattedX}</ChartsTooltipCell>
            {formattedX && formattedY && <ChartsTooltipCell />}
            <ChartsTooltipCell>{formattedY}</ChartsTooltipCell>
          </ChartsTooltipRow>
        </thead>
        <tbody>
          <ChartsTooltipRow className={classes.row}>
            <ChartsTooltipCell className={clsx(classes.markCell, classes.cell)}>
              <ChartsTooltipMark color={color} className={classes.mark} />
            </ChartsTooltipCell>
            <ChartsTooltipCell className={clsx(classes.labelCell, classes.cell)}>
              {seriesLabel}
            </ChartsTooltipCell>
            <ChartsTooltipCell className={clsx(classes.valueCell, classes.cell)}>
              {formattedValue}
            </ChartsTooltipCell>
          </ChartsTooltipRow>
        </tbody>
      </ChartsTooltipTable>
    </ChartsTooltipPaper>
  );
}
