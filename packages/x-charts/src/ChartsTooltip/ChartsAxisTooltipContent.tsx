'use client';
import PropTypes from 'prop-types';
import { type SxProps, type Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { type ChartsTooltipClasses, useUtilityClasses } from './chartsTooltipClasses';
import {
  ChartsTooltipCell,
  ChartsTooltipPaper,
  ChartsTooltipRow,
  ChartsTooltipTable,
} from './ChartsTooltipTable';
import { useAxesTooltip } from './useAxesTooltip';
import { ChartsLabelMark } from '../ChartsLabel/ChartsLabelMark';
import { useStore } from '../internals/store/useStore';
import { selectorChartSeriesConfigGetter } from '../internals/plugins/corePlugins/useChartSeries';
import {
  type CartesianChartSeriesType,
  type PolarChartSeriesType,
} from '../models/seriesType/config';
import { type AxisTooltipContentProps } from '../internals/plugins/corePlugins/useChartSeriesConfig';

export interface ChartsAxisTooltipContentClasses extends ChartsTooltipClasses {}

export interface ChartsAxisTooltipContentProps {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsTooltipClasses>;
  sx?: SxProps<Theme>;
  /**
   * The sort in which series items are displayed in the tooltip.
   * When set to `none`, series are sorted as they are provided in the series property. Otherwise they are sorted by their value.
   * @default 'none'
   */
  sort?: 'none' | 'asc' | 'desc';
}

function ChartsAxisTooltipContent(props: ChartsAxisTooltipContentProps) {
  const { sort } = props;
  const classes = useUtilityClasses(props.classes);
  const store = useStore();

  const getSeriesConfig = store.use(selectorChartSeriesConfigGetter);

  const tooltipData = useAxesTooltip();

  if (tooltipData === null) {
    return null;
  }

  return (
    <ChartsTooltipPaper sx={props.sx} className={classes.paper}>
      {tooltipData.map(({ axisId, mainAxis, axisValue, axisFormattedValue, seriesItems }) => {
        const sortedItems =
          sort && sort !== 'none'
            ? [...seriesItems].sort((a, b) => {
                const aValue = a.value?.valueOf();
                const bValue = b.value?.valueOf();
                if (typeof aValue !== 'number') {
                  return 1;
                }
                if (typeof bValue !== 'number') {
                  return -1;
                }

                return sort === 'asc' ? aValue - bValue : bValue - aValue;
              })
            : seriesItems;

        return (
          <ChartsTooltipTable className={classes.table} key={axisId}>
            {axisValue != null && !mainAxis.hideTooltip && (
              <Typography component="caption">{axisFormattedValue}</Typography>
            )}

            <tbody>
              {sortedItems.map((item) => {
                const seriesConfig = getSeriesConfig(item.seriesId);
                const Content =
                  seriesConfig && 'AxisTooltipContent' in seriesConfig
                    ? (seriesConfig.AxisTooltipContent ?? DefaultContent)
                    : DefaultContent;

                return (
                  <Content
                    key={item.seriesId}
                    classes={props.classes}
                    item={
                      /* TypeScript can't guarantee that the item's series type is the same as the Content's series type,
                       * so we need to cast */
                      item as any
                    }
                  />
                );
              })}
            </tbody>
          </ChartsTooltipTable>
        );
      })}
    </ChartsTooltipPaper>
  );
}

function DefaultContent<T extends CartesianChartSeriesType | PolarChartSeriesType>(
  props: AxisTooltipContentProps<T>,
) {
  const classes = useUtilityClasses(props.classes);
  const { item } = props;

  if (item.formattedValue == null) {
    return null;
  }

  return (
    <ChartsTooltipRow
      className={classes.row}
      data-series={item.seriesId}
      data-index={'dataIndex' in item ? item.dataIndex : undefined}
    >
      <ChartsTooltipCell className={clsx(classes.labelCell, classes.cell)} component="th">
        <div className={classes.markContainer}>
          <ChartsLabelMark
            type={item.markType}
            markShape={item.markShape}
            color={item.color}
            className={classes.mark}
          />
        </div>
        {item.formattedLabel || null}
      </ChartsTooltipCell>
      <ChartsTooltipCell className={clsx(classes.valueCell, classes.cell)} component="td">
        {String(item.formattedValue)}
      </ChartsTooltipCell>
    </ChartsTooltipRow>
  );
}

ChartsAxisTooltipContent.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * The sort in which series items are displayed in the tooltip.
   * When set to `none`, series are sorted as they are provided in the series property. Otherwise they are sorted by their value.
   * @default 'none'
   */
  sort: PropTypes.oneOf(['none', 'asc', 'desc']),
} as any;

export { ChartsAxisTooltipContent };
