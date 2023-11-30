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
    seriesId: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['bar', 'line', 'pie', 'scatter']).isRequired,
  }).isRequired,
  /**
   * The series linked to the triggered axis.
   */
  series: PropTypes.shape({
    color: PropTypes.string,
    data: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.number),
      PropTypes.shape({
        '__@iterator@33399': PropTypes.func.isRequired,
        '__@unscopables@36265': PropTypes.shape({
          '__@iterator@33399': PropTypes.bool,
          '__@unscopables@36265': PropTypes.bool,
          at: PropTypes.bool,
          concat: PropTypes.bool,
          copyWithin: PropTypes.bool,
          entries: PropTypes.bool,
          every: PropTypes.bool,
          fill: PropTypes.bool,
          filter: PropTypes.bool,
          find: PropTypes.bool,
          findIndex: PropTypes.bool,
          findLast: PropTypes.bool,
          findLastIndex: PropTypes.bool,
          flat: PropTypes.bool,
          flatMap: PropTypes.bool,
          forEach: PropTypes.bool,
          includes: PropTypes.bool,
          indexOf: PropTypes.bool,
          join: PropTypes.bool,
          keys: PropTypes.bool,
          lastIndexOf: PropTypes.bool,
          length: PropTypes.bool,
          map: PropTypes.bool,
          pop: PropTypes.bool,
          push: PropTypes.bool,
          reduce: PropTypes.bool,
          reduceRight: PropTypes.bool,
          reverse: PropTypes.bool,
          shift: PropTypes.bool,
          slice: PropTypes.bool,
          some: PropTypes.bool,
          sort: PropTypes.bool,
          splice: PropTypes.bool,
          toLocaleString: PropTypes.bool,
          toReversed: PropTypes.bool,
          toSorted: PropTypes.bool,
          toSpliced: PropTypes.bool,
          toString: PropTypes.bool,
          unshift: PropTypes.bool,
          values: PropTypes.bool,
          with: PropTypes.bool,
        }).isRequired,
        at: PropTypes.func.isRequired,
        concat: PropTypes.func.isRequired,
        copyWithin: PropTypes.func.isRequired,
        entries: PropTypes.func.isRequired,
        every: PropTypes.func.isRequired,
        fill: PropTypes.func.isRequired,
        filter: PropTypes.func.isRequired,
        find: PropTypes.func.isRequired,
        findIndex: PropTypes.func.isRequired,
        findLast: PropTypes.func.isRequired,
        findLastIndex: PropTypes.func.isRequired,
        flat: PropTypes.func.isRequired,
        flatMap: PropTypes.func.isRequired,
        forEach: PropTypes.func.isRequired,
        includes: PropTypes.func.isRequired,
        indexOf: PropTypes.func.isRequired,
        join: PropTypes.func.isRequired,
        keys: PropTypes.func.isRequired,
        lastIndexOf: PropTypes.func.isRequired,
        length: PropTypes.number.isRequired,
        map: PropTypes.func.isRequired,
        pop: PropTypes.func.isRequired,
        push: PropTypes.func.isRequired,
        reduce: PropTypes.func.isRequired,
        reduceRight: PropTypes.func.isRequired,
        reverse: PropTypes.func.isRequired,
        shift: PropTypes.func.isRequired,
        slice: PropTypes.func.isRequired,
        some: PropTypes.func.isRequired,
        sort: PropTypes.func.isRequired,
        splice: PropTypes.func.isRequired,
        toLocaleString: PropTypes.func.isRequired,
        toReversed: PropTypes.func.isRequired,
        toSorted: PropTypes.func.isRequired,
        toSpliced: PropTypes.func.isRequired,
        toString: PropTypes.func.isRequired,
        unshift: PropTypes.func.isRequired,
        values: PropTypes.func.isRequired,
        with: PropTypes.func.isRequired,
      }),
    ]).isRequired,
    highlightScope: PropTypes.shape({
      faded: PropTypes.oneOf(['global', 'none', 'series']),
      highlighted: PropTypes.oneOf(['item', 'none', 'series']),
    }),
    id: PropTypes.string.isRequired,
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
