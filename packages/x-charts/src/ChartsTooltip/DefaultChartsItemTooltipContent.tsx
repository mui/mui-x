import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { ChartSeriesType } from '../models/seriesType/config';
import {
  ChartsTooltipTable,
  ChartsTooltipCell,
  ChartsTooltipMark,
  ChartsTooltipPaper,
  ChartsTooltipRow,
} from './ChartsTooltipTable';
import type { ChartsItemContentProps } from './ChartsItemTooltipContent';
import { CommonSeriesType } from '../models/seriesType/common';
import { getLabel } from '../internals/getLabel';

function DefaultChartsItemTooltipContent<T extends ChartSeriesType = ChartSeriesType>(
  props: ChartsItemContentProps<T>,
) {
  const { series, itemData, sx, classes, getColor } = props;

  if (itemData.dataIndex === undefined || !series.data[itemData.dataIndex]) {
    return null;
  }
  const { displayedLabel, color } =
    series.type === 'pie'
      ? {
          color: getColor(itemData.dataIndex),
          displayedLabel: getLabel(series.data[itemData.dataIndex].label, 'tooltip'),
        }
      : {
          color: getColor(itemData.dataIndex),
          displayedLabel: getLabel(series.label, 'tooltip'),
        };

  const value =
    series.type === 'pie'
      ? {
          ...series.data[itemData.dataIndex],
          label: getLabel(series.data[itemData.dataIndex].label, 'tooltip'),
        }
      : series.data[itemData.dataIndex];
  const formattedValue = (
    series.valueFormatter as CommonSeriesType<typeof value>['valueFormatter']
  )?.(value, { dataIndex: itemData.dataIndex });
  return (
    <ChartsTooltipPaper sx={sx} className={classes.root}>
      <ChartsTooltipTable className={classes.table}>
        <tbody>
          <ChartsTooltipRow className={classes.row}>
            <ChartsTooltipCell className={clsx(classes.markCell, classes.cell)}>
              <ChartsTooltipMark color={color} className={classes.mark} />
            </ChartsTooltipCell>
            <ChartsTooltipCell className={clsx(classes.labelCell, classes.cell)}>
              {displayedLabel}
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

DefaultChartsItemTooltipContent.propTypes = {
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
    dataIndex: PropTypes.number,
    seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    type: PropTypes.oneOf(['bar', 'line', 'pie', 'scatter']).isRequired,
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

export { DefaultChartsItemTooltipContent };
