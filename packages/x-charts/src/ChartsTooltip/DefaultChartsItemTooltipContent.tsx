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

function DefaultChartsItemTooltipContent<T extends ChartSeriesType = ChartSeriesType>(
  props: ChartsItemContentProps<T>,
) {
  const { series, itemData, sx, classes } = props;

  if (itemData.dataIndex === undefined) {
    return null;
  }
  // this can be missed item on the `itemData.dataIndex` index in series.data
  if (series.type === 'pie' && !series.data[itemData.dataIndex]) {
    return null;
  }
  const { displayedLabel, color } =
    series.type === 'pie'
      ? {
          color: series.data[itemData.dataIndex].color,
          displayedLabel: series.data[itemData.dataIndex].label,
        }
      : {
          color: series.color,
          displayedLabel: series.label,
        };

  // TODO: Manage to let TS understand series.data and series.valueFormatter are coherent
  // @ts-ignore
  const formattedValue = series.valueFormatter(series.data[itemData.dataIndex]);
  return (
    <ChartsTooltipPaper sx={sx} className={classes.root}>
      <ChartsTooltipTable className={classes.table}>
        <tbody>
          <ChartsTooltipRow className={classes.row}>
            <ChartsTooltipCell className={clsx(classes.markCell, classes.cell)}>
              <ChartsTooltipMark ownerState={{ color }} className={classes.mark} />
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
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object.isRequired,
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
  series: PropTypes.shape({
    color: PropTypes.string,
    data: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.number),
      PropTypes.arrayOf(PropTypes.number),
      PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired,
        }),
      ),
      PropTypes.arrayOf(
        PropTypes.shape({
          color: PropTypes.string.isRequired,
          endAngle: PropTypes.number.isRequired,
          formattedValue: PropTypes.string.isRequired,
          id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
          index: PropTypes.number.isRequired,
          label: PropTypes.string,
          padAngle: PropTypes.number.isRequired,
          startAngle: PropTypes.number.isRequired,
          value: PropTypes.number.isRequired,
        }),
      ),
    ]).isRequired,
    highlightScope: PropTypes.shape({
      faded: PropTypes.oneOf(['global', 'none', 'series']),
      highlighted: PropTypes.oneOf(['item', 'none', 'series']),
    }),
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    type: PropTypes.oneOf(['bar', 'line', 'pie', 'scatter']).isRequired,
    valueFormatter: PropTypes.func.isRequired,
  }).isRequired,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { DefaultChartsItemTooltipContent };
