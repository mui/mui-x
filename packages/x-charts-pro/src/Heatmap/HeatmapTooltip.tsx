'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import {
  ChartsTooltipPaper,
  ChartsTooltipTable,
  ChartsTooltipRow,
  ChartsTooltipCell,
  ChartsTooltipMark,
  useItemTooltip,
  ChartsTooltipContainerProps,
  getChartsTooltipUtilityClass,
  ChartsTooltipContainer,
} from '@mui/x-charts/ChartsTooltip';
import { useXAxis, useYAxis } from '@mui/x-charts/hooks';
import { getLabel } from '@mui/x-charts/internals';
import { useHeatmapSeries } from '../hooks/useSeries';

export interface HeatmapTooltipProps
  extends Omit<ChartsTooltipContainerProps, 'trigger' | 'children'> {}

const useUtilityClasses = (ownerState: { classes: HeatmapTooltipProps['classes'] }) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
    paper: ['paper'],
    table: ['table'],
    row: ['row'],
    cell: ['cell'],
    mark: ['mark'],
    markCell: ['markCell'],
    labelCell: ['labelCell'],
    valueCell: ['valueCell'],
  };

  return composeClasses(slots, getChartsTooltipUtilityClass, classes);
};

/**
 * @ignore - internal component.
 */
function DefaultHeatmapTooltipContent(props: Pick<HeatmapTooltipProps, 'classes'>) {
  const { classes } = props;

  const xAxis = useXAxis();
  const yAxis = useYAxis();
  const heatmapSeries = useHeatmapSeries();

  const tooltipData = useItemTooltip<'heatmap'>();

  if (!tooltipData || !heatmapSeries || heatmapSeries.seriesOrder.length === 0) {
    return null;
  }

  const { series, seriesOrder } = heatmapSeries;
  const seriesId = seriesOrder[0];

  const { color, value, identifier } = tooltipData;

  const [xIndex, yIndex] = value;

  const formattedX =
    xAxis.valueFormatter?.(xAxis.data![xIndex], { location: 'tooltip' }) ??
    xAxis.data![xIndex].toLocaleString();
  const formattedY =
    yAxis.valueFormatter?.(yAxis.data![yIndex], { location: 'tooltip' }) ??
    yAxis.data![yIndex].toLocaleString();
  const formattedValue = series[seriesId].valueFormatter(value, {
    dataIndex: identifier.dataIndex,
  });

  const seriesLabel = getLabel(series[seriesId].label, 'tooltip');

  return (
    <ChartsTooltipPaper className={classes?.paper}>
      <ChartsTooltipTable className={classes?.table}>
        <thead>
          <ChartsTooltipRow className={classes?.row}>
            <ChartsTooltipCell className={classes?.cell}>{formattedX}</ChartsTooltipCell>
            {formattedX && formattedY && <ChartsTooltipCell />}
            <ChartsTooltipCell className={classes?.cell}>{formattedY}</ChartsTooltipCell>
          </ChartsTooltipRow>
        </thead>
        <tbody>
          <ChartsTooltipRow className={classes?.row}>
            <ChartsTooltipCell className={clsx(classes?.markCell, classes?.cell)}>
              <ChartsTooltipMark color={color} className={classes?.mark} />
            </ChartsTooltipCell>
            <ChartsTooltipCell className={clsx(classes?.labelCell, classes?.cell)}>
              {seriesLabel}
            </ChartsTooltipCell>
            <ChartsTooltipCell className={clsx(classes?.valueCell, classes?.cell)}>
              {formattedValue}
            </ChartsTooltipCell>
          </ChartsTooltipRow>
        </tbody>
      </ChartsTooltipTable>
    </ChartsTooltipPaper>
  );
}

DefaultHeatmapTooltipContent.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
} as any;

function HeatmapTooltip(props: HeatmapTooltipProps) {
  const classes = useUtilityClasses({ classes: props.classes });

  return (
    <ChartsTooltipContainer {...props} classes={classes} trigger="item">
      <DefaultHeatmapTooltipContent classes={classes} />
    </ChartsTooltipContainer>
  );
}

HeatmapTooltip.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
} as any;

export { HeatmapTooltip };
