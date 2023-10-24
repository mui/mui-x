import * as React from 'react';
import { SVGContext } from './context/DrawingProvider';
import {
  AxisInteractionData,
  InteractionContext,
  ItemInteractionData,
} from './context/InteractionProvider';
import { TriggerOptions } from './ChartsTooltip/utils';
import { CartesianChartSeriesType, ChartSeriesType } from './models/seriesType/config';
import { SeriesContext } from './context/SeriesContextProvider';
import { CartesianContext } from './context/CartesianContextProvider';

function hasData(
  trigger: TriggerOptions,
  displayedData: null | AxisInteractionData | ItemInteractionData<ChartSeriesType>,
): boolean {
  if (trigger === 'item') {
    return displayedData !== null;
  }

  const hasAxisXData = (displayedData as AxisInteractionData).x !== null;
  const hasAxisYData = (displayedData as AxisInteractionData).y !== null;

  return hasAxisXData || hasAxisYData;
}

interface OnClickHandlerProps {
  trigger: any;
  onClick?: (event: any, series: any, itemData: any) => void;
}

function OnClickHandler({ trigger, onClick }: OnClickHandlerProps) {
  const svgRef = React.useContext(SVGContext);
  const { item, axis } = React.useContext(InteractionContext);

  const series = React.useContext(SeriesContext);

  const { xAxisIds, yAxisIds } = React.useContext(CartesianContext);

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return () => {};
    }
    const handleMouseDown = (event: MouseEvent) => {
      event.preventDefault();
      if (onClick == null) {
        return;
      }

      if (trigger === 'item') {
        const displayedData = item as ItemInteractionData<ChartSeriesType>;
        const tooltipHasData = hasData(trigger, displayedData);

        if (tooltipHasData) {
          const data = series[displayedData.type]!.series[displayedData.seriesId];
          const displayedLabel =
            data.type === 'pie' ? data.data[displayedData.dataIndex!] : data.label;

          onClick(event, displayedLabel, displayedData);
        }
      } else {
        const displayedData = axis as AxisInteractionData;

        if (hasData(trigger, displayedData)) {
          const isXaxis = (displayedData.x && displayedData.x.index) !== undefined;
          const USED_AXIS_ID = isXaxis ? xAxisIds[0] : yAxisIds[0];
          const dataIndex = isXaxis
            ? displayedData.x && displayedData.x.index
            : displayedData.y && displayedData.y.index;

          if (dataIndex == null) {
            return;
          }
          const data: any[] = [];
          (
            Object.keys(series).filter((seriesType) =>
              ['bar', 'line', 'scatter'].includes(seriesType),
            ) as CartesianChartSeriesType[]
          ).forEach((seriesType) => {
            series[seriesType]!.seriesOrder.forEach((seriesId) => {
              const seriesItem = series[seriesType]!.series[seriesId];
              const axisKey = isXaxis ? seriesItem.xAxisKey : seriesItem.yAxisKey;
              if (axisKey === undefined || axisKey === USED_AXIS_ID) {
                data.push(series[seriesType]!.series[seriesId]);
              }
            });
          });

          onClick(event, data, displayedData);
        }
      }
    };

    element.addEventListener('mousedown', handleMouseDown);
    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
    };
  }, [axis, item, series, svgRef, trigger, xAxisIds, yAxisIds, onClick]);

  return null;
}
export default OnClickHandler;
