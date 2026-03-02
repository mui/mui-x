import {
  ChartsTooltipCell,
  ChartsTooltipPaper,
  ChartsTooltipRow,
  ChartsTooltipTable,
  useAxesTooltip,
} from '@mui/x-charts/ChartsTooltip';
import { HeatmapTooltipAxesValue } from '@mui/x-charts-pro/Heatmap/HeatmapTooltip/HeatmapTooltipAxesValue';
import clsx from 'clsx';
import { type CandlestickTooltipProps } from './CandlestickTooltip.types';
import { useUtilityClasses } from './Candlestick.classes';

export function CandlestickTooltipContent(props: CandlestickTooltipProps) {
  const classes = useUtilityClasses(props);
  const tooltipData = useAxesTooltip();

  if (tooltipData == null) {
    return null;
  }

  return (
    <ChartsTooltipPaper className={classes.paper}>
      {tooltipData.map((data) => {
        const formattedAxisValue =
          data.axisValue instanceof Date
            ? data.axisValue.toLocaleString('en-US')
            : data.axisValue.toString();
        const ohlcValue = data.seriesItems[0].value;

        if (!Array.isArray(ohlcValue) || ohlcValue.length !== 4) {
          return null; // Skip if the value is not in the expected OHLC format
        }

        const [open, high, low, close] = ohlcValue;

        return (
          <ChartsTooltipTable className={classes.table} key={data.axisId}>
            <HeatmapTooltipAxesValue>
              <span>{formattedAxisValue}</span>
            </HeatmapTooltipAxesValue>
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
      })}
    </ChartsTooltipPaper>
  );
}
