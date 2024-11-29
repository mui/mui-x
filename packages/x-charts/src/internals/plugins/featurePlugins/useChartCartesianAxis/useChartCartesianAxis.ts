'use client';
import * as React from 'react';
import { ChartPlugin } from '../../models';
import { UseChartCartesianAxisSignature } from './useChartCartesianAxis.types';
import { blueberryTwilightPalette } from '../../../../colorPalettes';
import { useSelector } from '../../../store/useSelector';
import { selectorChartDrawingArea } from '../../corePlugins/useChartDimensions/useChartDimensions.selectors';
import { computeAxisValue } from './computeAxisValue';
import { selectorChartSeriesState } from '../../corePlugins/useChartSeries/useChartSeries.selectors';

export const useChartCartesianAxis: ChartPlugin<UseChartCartesianAxisSignature> = ({
  params,
  store,
  seriesConfig,
}) => {
  const { xAxis, yAxis } = params;

  const drawingArea = useSelector(store, selectorChartDrawingArea);
  const formattedSeries = useSelector(store, selectorChartSeriesState);

  React.useEffect(() => {
    store.update((prev) => {
      return {
        ...prev,
        cartesianAxis: {
          ...prev.cartesianAxis,
          x: computeAxisValue({
            drawingArea,
            formattedSeries,
            axis: xAxis,
            seriesConfig,
            axisDirection: 'x',
          }),
        },
      };
    });
  }, [seriesConfig, drawingArea, formattedSeries, xAxis, store]);

  React.useEffect(() => {
    store.update((prev) => ({
      ...prev,
      cartesianAxis: {
        ...prev.cartesianAxis,
        y: computeAxisValue({
          drawingArea,
          formattedSeries,
          axis: yAxis,
          seriesConfig,
          axisDirection: 'y',
        }),
      },
    }));
  }, [seriesConfig, drawingArea, formattedSeries, yAxis, store]);

  return {};
};

useChartCartesianAxis.params = {
  xAxis: true,
  yAxis: true,
};

useChartCartesianAxis.getDefaultizedParams = ({ params }) => ({
  ...params,
  colors: params.colors ?? blueberryTwilightPalette,
  theme: params.theme ?? 'light',
});

useChartCartesianAxis.getInitialState = (
  { xAxis, yAxis },
  { dimensions, series },
  seriesConfig,
) => {
  return {
    cartesianAxis: {
      x: computeAxisValue({
        drawingArea: dimensions,
        formattedSeries: series,
        axis: xAxis,
        seriesConfig,
        axisDirection: 'x',
      }),
      y: computeAxisValue({
        drawingArea: dimensions,
        formattedSeries: series,
        axis: yAxis,
        seriesConfig,
        axisDirection: 'y',
      }),
    },
  };
};
