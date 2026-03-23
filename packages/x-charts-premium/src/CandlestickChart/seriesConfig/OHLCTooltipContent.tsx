import * as React from 'react';
import clsx from 'clsx';
import { ChartsTooltipCell, ChartsTooltipRow } from '@mui/x-charts/ChartsTooltip';
import {
  type AxisTooltipContentProps,
  type ItemTooltipContentProps,
} from '@mui/x-charts/internals';
import { useChartsLocalization } from '@mui/x-charts/hooks';
import { useChartsTooltipUtilityClasses } from '@mui/x-charts/internals';

export function OHLCTooltipContent(
  props: AxisTooltipContentProps<'ohlc'> | ItemTooltipContentProps<'ohlc'>,
) {
  const { item } = props;
  const classes = useChartsTooltipUtilityClasses(props.classes);
  const { localeText } = useChartsLocalization();

  /* This can only happen if the series is a radar series, but this is a candlestick tooltip,
   * so in practice this will never happen.
   * We can remove this if/when we fix the multiples values in an item tooltip
   * introduced with the radar chart. */
  if ('values' in item) {
    return null;
  }

  if (item.value == null) {
    return null;
  }

  const [open, high, low, close] = item.value;

  return (
    <React.Fragment>
      <ChartsTooltipRow className={classes.row}>
        <ChartsTooltipCell className={clsx(classes.labelCell, classes.cell)} component="th">
          {localeText.open}
        </ChartsTooltipCell>
        <ChartsTooltipCell className={clsx(classes.valueCell, classes.cell)} component="td">
          {open}
        </ChartsTooltipCell>
      </ChartsTooltipRow>
      <ChartsTooltipRow className={classes.row}>
        <ChartsTooltipCell className={clsx(classes.labelCell, classes.cell)} component="th">
          {localeText.high}
        </ChartsTooltipCell>
        <ChartsTooltipCell className={clsx(classes.valueCell, classes.cell)} component="td">
          {high}
        </ChartsTooltipCell>
      </ChartsTooltipRow>
      <ChartsTooltipRow className={classes.row}>
        <ChartsTooltipCell className={clsx(classes.labelCell, classes.cell)} component="th">
          {localeText.low}
        </ChartsTooltipCell>
        <ChartsTooltipCell className={clsx(classes.valueCell, classes.cell)} component="td">
          {low}
        </ChartsTooltipCell>
      </ChartsTooltipRow>
      <ChartsTooltipRow className={classes.row}>
        <ChartsTooltipCell className={clsx(classes.labelCell, classes.cell)} component="th">
          {localeText.close}
        </ChartsTooltipCell>
        <ChartsTooltipCell className={clsx(classes.valueCell, classes.cell)} component="td">
          {close}
        </ChartsTooltipCell>
      </ChartsTooltipRow>
    </React.Fragment>
  );
}
