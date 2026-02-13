import {
  ChartsLabelMark,
  ChartsTooltipCell,
  ChartsTooltipPaper,
  ChartsTooltipRow,
  ChartsTooltipTable,
  useItemTooltip,
  useXAxis,
  useYAxis,
} from '@mui/x-charts';
import { HeatmapTooltipAxesValue } from '@mui/x-charts-pro/Heatmap/HeatmapTooltip/HeatmapTooltipAxesValue';
import clsx from 'clsx';
import { useOHLCSeriesContext } from '../../hooks';
import { type CandlestickTooltipProps } from './CandlestickTooltip.types';
import { useUtilityClasses } from './Candlestick.classes';

export function CandlestickTooltipContent(props: CandlestickTooltipProps) {
  const classes = useUtilityClasses(props);

  const xAxis = useXAxis();
  const yAxis = useYAxis();
  const ohlcSeries = useOHLCSeriesContext();

  const tooltipData = useItemTooltip<'ohlc'>();

  return (
    <ChartsTooltipPaper className={classes.paper}>
      <ChartsTooltipTable className={classes.table}>
        <HeatmapTooltipAxesValue>
          <span>{formattedX}</span>
          <span>{formattedY}</span>
        </HeatmapTooltipAxesValue>
        <tbody>
          <ChartsTooltipRow className={classes.row}>
            <ChartsTooltipCell className={clsx(classes.labelCell, classes.cell)} component="th">
              <div className={classes.markContainer}>
                <ChartsLabelMark type={markType} color={color} className={classes.mark} />
              </div>
              {seriesLabel}
            </ChartsTooltipCell>
            <ChartsTooltipCell className={clsx(classes.valueCell, classes.cell)} component="td">
              {formattedValue}
            </ChartsTooltipCell>
          </ChartsTooltipRow>
        </tbody>
      </ChartsTooltipTable>
    </ChartsTooltipPaper>
  );
}
