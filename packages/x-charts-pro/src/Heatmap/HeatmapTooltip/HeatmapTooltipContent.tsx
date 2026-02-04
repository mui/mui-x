'use client';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  ChartsTooltipPaper,
  ChartsTooltipTable,
  ChartsTooltipRow,
  ChartsTooltipCell,
  useItemTooltip,
} from '@mui/x-charts/ChartsTooltip';
import { useXAxis, useYAxis } from '@mui/x-charts/hooks';
import { getLabel, ChartsLabelMark } from '@mui/x-charts/internals';
import { useHeatmapSeriesContext } from '../../hooks/useHeatmapSeries';
import { HeatmapTooltipAxesValue } from './HeatmapTooltipAxesValue';
import { type HeatmapTooltipProps } from './HeatmapTooltip.types';
import { useUtilityClasses } from './HeatmapTooltip.classes';

export interface HeatmapTooltipContentProps extends Pick<HeatmapTooltipProps, 'classes'> {}

export function HeatmapTooltipContent(props: HeatmapTooltipContentProps) {
  const classes = useUtilityClasses(props);

  const xAxis = useXAxis();
  const yAxis = useYAxis();
  const heatmapSeries = useHeatmapSeriesContext();

  const tooltipData = useItemTooltip<'heatmap'>();

  const dataIndex = tooltipData?.identifier.dataIndex;
  if (
    !tooltipData ||
    dataIndex === undefined ||
    !heatmapSeries ||
    heatmapSeries.seriesOrder.length === 0
  ) {
    return null;
  }

  const { series, seriesOrder } = heatmapSeries;
  const seriesId = seriesOrder[0];

  const { color, value, markType } = tooltipData;

  const [xIndex, yIndex] = value;

  const formattedX =
    xAxis.valueFormatter?.(xAxis.data![xIndex], {
      location: 'tooltip',
      scale: xAxis.scale,
    }) ?? xAxis.data![xIndex].toLocaleString();
  const formattedY =
    yAxis.valueFormatter?.(yAxis.data![yIndex], { location: 'tooltip', scale: yAxis.scale }) ??
    yAxis.data![yIndex].toLocaleString();
  const formattedValue = series[seriesId].valueFormatter(value, { dataIndex });

  const seriesLabel = getLabel(series[seriesId].label, 'tooltip');

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

HeatmapTooltipContent.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
} as any;
