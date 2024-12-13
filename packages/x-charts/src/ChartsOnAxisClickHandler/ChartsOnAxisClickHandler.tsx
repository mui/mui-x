'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useSeries } from '../hooks/useSeries';
import { useSvgRef } from '../hooks';
import { useCartesianContext } from '../context/CartesianProvider';
import { useStore } from '../internals/store/useStore';

export type ChartsAxisData = {
  dataIndex: number;
  axisValue?: number | Date | string;
  seriesValues: Record<string, number | null | undefined>;
};

export interface ChartsOnAxisClickHandlerProps {
  /**
   * The function called for onClick events.
   * The second argument contains information about all line/bar elements at the current mouse position.
   * @param {MouseEvent} event The mouse event recorded on the `<svg/>` element.
   * @param {null | AxisData} data The data about the clicked axis and items associated with it.
   */
  onAxisClick?: (event: MouseEvent, data: null | ChartsAxisData) => void;
}

function ChartsOnAxisClickHandler(props: ChartsOnAxisClickHandlerProps) {
  const { onAxisClick } = props;

  const svgRef = useSvgRef();
  const series = useSeries();
  const store = useStore();

  const { xAxisIds, xAxis, yAxisIds, yAxis } = useCartesianContext();

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null || !onAxisClick) {
      return () => {};
    }

    const handleMouseClick = (event: MouseEvent) => {
      event.preventDefault();

      const { x: axisX, y: axisY } = store.value.interaction.axis;
      const isXaxis = axisX && axisX.index !== -1;
      const USED_AXIS_ID = isXaxis ? xAxisIds[0] : yAxisIds[0];
      const dataIndex = isXaxis ? axisX && axisX.index : axisY && axisY.index;

      if (dataIndex == null) {
        return;
      }

      const seriesValues: Record<string, number | null | undefined> = {};

      Object.keys(series)
        .filter((seriesType): seriesType is 'bar' | 'line' => ['bar', 'line'].includes(seriesType))
        .forEach((seriesType) => {
          series[seriesType]?.seriesOrder.forEach((seriesId) => {
            const seriesItem = series[seriesType]!.series[seriesId];

            const providedXAxisId = seriesItem.xAxisId;
            const providedYAxisId = seriesItem.yAxisId;

            const axisKey = isXaxis ? providedXAxisId : providedYAxisId;
            if (axisKey === undefined || axisKey === USED_AXIS_ID) {
              seriesValues[seriesId] = seriesItem.data[dataIndex];
            }
          });
        });
      const axisValue = (isXaxis ? xAxis : yAxis)[USED_AXIS_ID].data?.[dataIndex];
      onAxisClick(event, { dataIndex, axisValue, seriesValues });
    };

    element.addEventListener('click', handleMouseClick);
    return () => {
      element.removeEventListener('click', handleMouseClick);
    };
  }, [onAxisClick, series, store, svgRef, xAxis, xAxisIds, yAxis, yAxisIds]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <React.Fragment />;
}

ChartsOnAxisClickHandler.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The function called for onClick events.
   * The second argument contains information about all line/bar elements at the current mouse position.
   * @param {MouseEvent} event The mouse event recorded on the `<svg/>` element.
   * @param {null | AxisData} data The data about the clicked axis and items associated with it.
   */
  onAxisClick: PropTypes.func,
} as any;

export { ChartsOnAxisClickHandler };
