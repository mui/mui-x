'use client';
import { useTheme } from '@mui/material/styles';
import type { ZAxisContextProviderProps } from '../ZAxisContextProvider';
import type { ChartDataProviderProps } from './ChartDataProvider';
import { HighlightedProviderProps } from '../HighlightedProvider';
import { useDefaultizeAxis } from './useDefaultizeAxis';
import { AnimationProviderProps } from '../AnimationProvider';
import { ChartProviderProps } from '../ChartProvider';
import { UseChartCartesianAxisSignature } from '../../internals/plugins/featurePlugins/useChartCartesianAxis';

export const useChartDataProviderProps = (props: ChartDataProviderProps) => {
  const {
    width,
    height,
    series,
    margin,
    xAxis,
    yAxis,
    zAxis,
    colors,
    dataset,
    highlightedItem,
    onHighlightChange,
    children,
    skipAnimation,
  } = props;

  const theme = useTheme();
  const [defaultizedXAxis, defaultizedYAxis] = useDefaultizeAxis(xAxis, yAxis, dataset);

  const chartProviderProps: Omit<
    ChartProviderProps<[UseChartCartesianAxisSignature]>,
    'children'
  > = {
    pluginParams: {
      width,
      height,
      margin,
      dataset,
      series,
      colors,
      theme: theme.palette.mode,
      xAxis: defaultizedXAxis,
      yAxis: defaultizedYAxis,
    },
  };

  const animationProviderProps: Omit<AnimationProviderProps, 'children'> = {
    skipAnimation,
  };

  const zAxisContextProps: Omit<ZAxisContextProviderProps, 'children'> = {
    zAxis,
    dataset,
  };

  const highlightedProviderProps: Omit<HighlightedProviderProps, 'children'> = {
    highlightedItem,
    onHighlightChange,
  };

  return {
    children,
    zAxisContextProps,
    highlightedProviderProps,
    animationProviderProps,
    xAxis: defaultizedXAxis,
    yAxis: defaultizedYAxis,
    chartProviderProps,
  };
};
