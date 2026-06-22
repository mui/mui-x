'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { useScatterSeriesContext } from '../../hooks/useScatterSeries';
import { useXAxes, useYAxes } from '../../hooks';
import { useZAxes } from '../../hooks/useZAxis';
import { getValueToPositionMapper } from '../../hooks/getValueToPositionMapper';
import { useChartsContext } from '../../context/ChartsProvider';
import { useItemHighlightStateGetter } from '../../hooks/useItemHighlightStateGetter';
import getMarkerSize from '../seriesConfig/getMarkerSize';
import { useUtilityClasses } from '../scatterClasses';
import {
  MarkerLabelItem,
  type MarkerLabelSlotProps,
  type MarkerLabelSlots,
} from './MarkerLabelItem';
import { getMarkerLabel } from './getMarkerLabel';

export interface MarkerLabelPlotSlots extends MarkerLabelSlots {}
export interface MarkerLabelPlotSlotProps extends MarkerLabelSlotProps {}

export interface MarkerLabelPlotProps {
  /**
   * A CSS class name applied to the root element.
   */
  className?: string;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MarkerLabelPlotSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MarkerLabelPlotSlotProps;
}

const MarkerLabelPlotRoot = styled('g', {
  name: 'MuiMarkerLabelPlot',
  slot: 'Root',
})();

function MarkerLabelPlot(props: MarkerLabelPlotProps) {
  const { className, slots, slotProps } = props;
  const seriesData = useScatterSeriesContext();
  const { xAxis, xAxisIds } = useXAxes();
  const { yAxis, yAxisIds } = useYAxes();
  const { zAxis, zAxisIds } = useZAxes();
  const { instance } = useChartsContext();
  const getHighlightState = useItemHighlightStateGetter();
  const classes = useUtilityClasses();

  if (seriesData === undefined) {
    return null;
  }

  const { series, seriesOrder } = seriesData;
  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];
  const defaultZAxisId = zAxisIds[0];

  return (
    <MarkerLabelPlotRoot className={className}>
      {seriesOrder.map((seriesId) => {
        const seriesItem = series[seriesId];
        const { id, xAxisId, yAxisId, sizeAxisId, hidden, markerLabel, data } = seriesItem;

        if (hidden || !markerLabel) {
          return null;
        }

        const sizeGetter = getMarkerSize(seriesItem, zAxis[sizeAxisId ?? defaultZAxisId]);
        const xScale = xAxis[xAxisId ?? defaultXAxisId].scale;
        const yScale = yAxis[yAxisId ?? defaultYAxisId].scale;
        const getXPosition = getValueToPositionMapper(xScale);
        const getYPosition = getValueToPositionMapper(yScale);

        return (
          <g key={id} data-series={id} className={clsx(classes.seriesLabels)}>
            {data.map((point, dataIndex) => {
              const x = getXPosition(point.x);
              const y = getYPosition(point.y);

              if (!instance.isPointInside(x, y)) {
                return null;
              }

              const text = getMarkerLabel({
                markerLabel,
                value: point,
                dataIndex,
                seriesId: id,
                markerSize: sizeGetter(dataIndex),
              });

              if (!text) {
                return null;
              }

              const highlightState = getHighlightState({
                type: 'scatter',
                seriesId: id,
                dataIndex,
              });

              return (
                <MarkerLabelItem
                  key={point.id ?? dataIndex}
                  x={x}
                  y={y}
                  text={text}
                  isHighlighted={highlightState === 'highlighted'}
                  isFaded={highlightState === 'faded'}
                  slots={slots}
                  slotProps={slotProps}
                />
              );
            })}
          </g>
        );
      })}
    </MarkerLabelPlotRoot>
  );
}

MarkerLabelPlot.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * A CSS class name applied to the root element.
   */
  className: PropTypes.string,
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

export { MarkerLabelPlot };
