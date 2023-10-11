import * as React from 'react';
import { SVGContext } from './context/DrawingProvider';
import {
  AxisInteractionData,
  InteractionContext,
  ItemInteractionData,
} from './context/InteractionProvider';
import { TriggerOptions } from './ChartsTooltip/utils';
import { CartesianChartSeriesType, ChartSeriesType } from './models/seriesType/config';
import { FormattedSeries, SeriesContext } from './context/SeriesContextProvider';
import { CartesianContext } from './context/CartesianContextProvider';

function getTootipHasData(
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
  trigger: 'item' | 'none' | 'axis';
  onClick: (event: MouseEvent, series: FormattedSeries, itemData: any) => void;
}

function OnClick({ trigger, onClick }: OnClickHandlerProps) {
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
      // if (onClick == null) return;

      if (trigger === 'item') {
        const displayedData = item as ItemInteractionData<ChartSeriesType>;
        const tooltipHasData = getTootipHasData(trigger, displayedData);

        if (tooltipHasData) {
          const data = series[displayedData.type]!.series[displayedData.seriesId];
          const result =
            data.type === 'pie'
              ? {
                  color: data.data[displayedData.dataIndex!],
                  displayedLabel: data.data[displayedData.dataIndex!],
                }
              : {
                  color: data.color,
                  displayedLabel: data.label,
                };

          console.log(displayedData);
          console.log(result.displayedLabel);
          onClick(event, result.displayedLabel, displayedData);
        }
      } else {
        const displayedData = axis as AxisInteractionData;
        const tooltipHasData = getTootipHasData(trigger, displayedData);
        if (tooltipHasData) {
          const isXaxis = (displayedData.x && displayedData.x.index) !== undefined;
          const USED_AXIS_ID = isXaxis ? xAxisIds[0] : yAxisIds[0];
          const dataIndex = isXaxis
            ? displayedData.x && displayedData.x.index
            : displayedData.y && displayedData.y.index;
          const axisValue = isXaxis
            ? displayedData.x && displayedData.x.value
            : displayedData.y && displayedData.y.value;

          if (dataIndex == null) {
            return;
          }
          const rep: any[] = [];
          (
            Object.keys(series).filter((seriesType) =>
              ['bar', 'line', 'scatter'].includes(seriesType),
            ) as CartesianChartSeriesType[]
          ).forEach((seriesType) => {
            series[seriesType]!.seriesOrder.forEach((seriesId) => {
              const seriesItem = series[seriesType]!.series[seriesId];
              const axisKey = isXaxis ? seriesItem.xAxisKey : seriesItem.yAxisKey;
              if (axisKey === undefined || axisKey === USED_AXIS_ID) {
                rep.push(series[seriesType]!.series[seriesId]);
              }
            });
          });
          console.log(rep);
          console.log(displayedData);
        }
      }
    };

    element.addEventListener('mousedown', handleMouseDown);
    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
    };
  }, [axis, item, series, svgRef, trigger, xAxisIds, yAxisIds]);

  return null;
}
export default OnClick;
