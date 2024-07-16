import * as React from 'react';
import PropTypes from 'prop-types';
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

function DefaultHeatmapTooltip(props: ChartsItemContentProps<'heatmap'>) {
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

DefaultHeatmapTooltip.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object.isRequired,
  /**
   * Get the color of the item with index `dataIndex`.
   * @param {number} dataIndex The data index of the item.
   * @returns {string} The color to display.
   */
  getColor: PropTypes.func.isRequired,
  /**
   * The data used to identify the triggered item.
   */
  itemData: PropTypes.shape({
    dataIndex: PropTypes.number.isRequired,
    seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    type: PropTypes.oneOf(['heatmap']).isRequired,
  }).isRequired,
  /**
   * The series linked to the triggered axis.
   */
  series: PropTypes.object.isRequired,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { DefaultHeatmapTooltip };
