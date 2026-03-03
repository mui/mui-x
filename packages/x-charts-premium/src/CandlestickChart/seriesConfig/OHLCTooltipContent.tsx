import {
  ChartsTooltipCell,
  ChartsTooltipRow,
  ChartsTooltipTable,
} from '@mui/x-charts/ChartsTooltip';
import clsx from 'clsx';
import {
  type AxisTooltipContentProps,
  type ItemTooltipContentProps,
} from '@mui/x-charts/internals';
import { useUtilityClasses } from '../CandlestickTooltip/Candlestick.classes';

export function OHLCTooltipContent(
  props: AxisTooltipContentProps<'ohlc'> | ItemTooltipContentProps<'ohlc'>,
) {
  const { item } = props;
  const classes = useUtilityClasses({});

  if (item.value == null) {
    return null;
  }

  const [open, high, low, close] = item.value;

  return (
    <ChartsTooltipTable className={classes.table}>
      <tbody>
        <ChartsTooltipRow className={classes.row}>
          <ChartsTooltipCell className={clsx(classes.labelCell, classes.cell)} component="th">
            Open
          </ChartsTooltipCell>
          <ChartsTooltipCell className={clsx(classes.valueCell, classes.cell)} component="td">
            {open}
          </ChartsTooltipCell>
        </ChartsTooltipRow>
        <ChartsTooltipRow className={classes.row}>
          <ChartsTooltipCell className={clsx(classes.labelCell, classes.cell)} component="th">
            High
          </ChartsTooltipCell>
          <ChartsTooltipCell className={clsx(classes.valueCell, classes.cell)} component="td">
            {high}
          </ChartsTooltipCell>
        </ChartsTooltipRow>
        <ChartsTooltipRow className={classes.row}>
          <ChartsTooltipCell className={clsx(classes.labelCell, classes.cell)} component="th">
            Low
          </ChartsTooltipCell>
          <ChartsTooltipCell className={clsx(classes.valueCell, classes.cell)} component="td">
            {low}
          </ChartsTooltipCell>
        </ChartsTooltipRow>
        <ChartsTooltipRow className={classes.row}>
          <ChartsTooltipCell className={clsx(classes.labelCell, classes.cell)} component="th">
            Close
          </ChartsTooltipCell>
          <ChartsTooltipCell className={clsx(classes.valueCell, classes.cell)} component="td">
            {close}
          </ChartsTooltipCell>
        </ChartsTooltipRow>
      </tbody>
    </ChartsTooltipTable>
  );
}
