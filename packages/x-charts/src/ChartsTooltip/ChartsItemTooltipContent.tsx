'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import { type SxProps, type Theme } from '@mui/material/styles';
import { type ChartsTooltipClasses, useUtilityClasses } from './chartsTooltipClasses';
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

  const classes = useUtilityClasses(propClasses);

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
              <Content item={tooltipData} />
            ) : (
              <DefaultMultipleValueContent tooltipData={tooltipData} />
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
              item={
                /* TypeScript can't assert that the item's type is the same type as the `Content`, so we need to cast */
                tooltipData as ItemTooltip<any>
              }
            />
          ) : (
            <DefaultSingleValueContent classes={propClasses} tooltipData={tooltipData} />
          )}
        </tbody>
      </ChartsTooltipTable>
    </ChartsTooltipPaper>
  );
}

interface DefaultMultipleValueContentProps {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsTooltipClasses>;
  tooltipData: ItemTooltipWithMultipleValues;
}

function DefaultMultipleValueContent({
  classes: propClasses,
  tooltipData,
}: DefaultMultipleValueContentProps) {
  const classes = useUtilityClasses(propClasses);

  return (
    <React.Fragment>
      {tooltipData.values.map((value) => (
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

interface DefaultSingleValueContentProps {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsTooltipClasses>;
  tooltipData: ItemTooltip<ChartSeriesType>;
}

function DefaultSingleValueContent({
  classes: propClasses,
  tooltipData,
}: DefaultSingleValueContentProps) {
  const { color, label, formattedValue, markType, markShape } = tooltipData;

  const classes = useUtilityClasses(propClasses);

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
