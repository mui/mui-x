'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import { type SxProps, type Theme } from '@mui/material/styles';
import { type ChartsTooltipClasses, useChartsTooltipUtilityClasses } from './chartsTooltipClasses';
import { useInternalItemTooltip } from './useItemTooltip';
import {
  ChartsTooltipCell,
  ChartsTooltipPaper,
  ChartsTooltipRow,
  ChartsTooltipTable,
} from './ChartsTooltipTable';
import { ChartsLabelMark } from '../ChartsLabel/ChartsLabelMark';
import { useStore } from '../internals/store/useStore';
import { selectorChartSeriesConfigGetter } from '../internals/plugins/corePlugins/useChartSeries';
import {
  type ItemTooltip,
  type ItemTooltipContentProps,
  type ItemTooltipWithMultipleValues,
} from '../internals/plugins/corePlugins/useChartSeriesConfig';
import { type ChartSeriesType } from '../models/seriesType/config';

export interface ChartsItemTooltipContentClasses extends ChartsTooltipClasses {}

export interface ChartsItemTooltipContentProps {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsTooltipClasses>;
  sx?: SxProps<Theme>;
}

function ChartsItemTooltipContent(props: ChartsItemTooltipContentProps) {
  const { classes: propClasses, sx } = props;
  const tooltipData = useInternalItemTooltip();
  const store = useStore();
  const getSeriesConfig = store.use(selectorChartSeriesConfigGetter);

  const classes = useChartsTooltipUtilityClasses(propClasses);

  if (!tooltipData) {
    return null;
  }

  const seriesConfig = getSeriesConfig(tooltipData.identifier.seriesId);
  const Content =
    seriesConfig && 'ItemTooltipContent' in seriesConfig ? seriesConfig.ItemTooltipContent : null;

  if ('values' in tooltipData) {
    const { label: seriesLabel, color, markType, markShape } = tooltipData;
    return (
      <ChartsTooltipPaper sx={sx} className={classes.paper}>
        <ChartsTooltipTable className={classes.table}>
          <Typography component="caption">
            <div className={classes.markContainer}>
              <ChartsLabelMark
                type={markType}
                markShape={markShape}
                color={color}
                className={classes.mark}
              />
            </div>
            {seriesLabel}
          </Typography>
          <tbody>
            {Content ? (
              <Content classes={propClasses} item={tooltipData} />
            ) : (
              <DefaultMultipleValueContent classes={propClasses} item={tooltipData} />
            )}
          </tbody>
        </ChartsTooltipTable>
      </ChartsTooltipPaper>
    );
  }

  return (
    <ChartsTooltipPaper sx={sx} className={classes.paper}>
      <ChartsTooltipTable className={classes.table}>
        <tbody>
          {Content ? (
            <Content
              classes={propClasses}
              item={
                /* TypeScript can't guarantee that the item's series type is the same as the Content's series type,
                 * so we need to cast */
                tooltipData as any
              }
            />
          ) : (
            <DefaultSingleValueContent classes={propClasses} item={tooltipData} />
          )}
        </tbody>
      </ChartsTooltipTable>
    </ChartsTooltipPaper>
  );
}

interface DefaultMultipleValueContentProps extends ItemTooltipContentProps<'radar'> {
  item: ItemTooltipWithMultipleValues;
}

function DefaultMultipleValueContent({
  classes: propClasses,
  item,
}: DefaultMultipleValueContentProps) {
  const classes = useChartsTooltipUtilityClasses(propClasses);

  return (
    <React.Fragment>
      {item.values.map((value) => (
        <ChartsTooltipRow key={value.label} className={classes.row}>
          <ChartsTooltipCell className={clsx(classes.labelCell, classes.cell)} component="th">
            {value.label}
          </ChartsTooltipCell>
          <ChartsTooltipCell className={clsx(classes.valueCell, classes.cell)} component="td">
            {value.formattedValue}
          </ChartsTooltipCell>
        </ChartsTooltipRow>
      ))}
    </React.Fragment>
  );
}

interface DefaultSingleValueContentProps<
  T extends ChartSeriesType,
> extends ItemTooltipContentProps<T> {
  item: ItemTooltip<T>;
}

function DefaultSingleValueContent<T extends ChartSeriesType>({
  classes: propClasses,
  item,
}: DefaultSingleValueContentProps<T>) {
  const { color, label, formattedValue, markType, markShape } = item;

  const classes = useChartsTooltipUtilityClasses(propClasses);

  return (
    <ChartsTooltipRow className={classes.row}>
      <ChartsTooltipCell className={clsx(classes.labelCell, classes.cell)} component="th">
        <div className={classes.markContainer}>
          <ChartsLabelMark
            type={markType}
            markShape={markShape}
            color={color}
            className={classes.mark}
          />
        </div>
        {label}
      </ChartsTooltipCell>
      <ChartsTooltipCell className={clsx(classes.valueCell, classes.cell)} component="td">
        {formattedValue}
      </ChartsTooltipCell>
    </ChartsTooltipRow>
  );
}

ChartsItemTooltipContent.propTypes = {
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
} as any;

export { ChartsItemTooltipContent };
