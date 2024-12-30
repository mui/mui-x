'use client';
import { useTheme } from '@mui/material/styles';
import type { ZAxisContextProviderProps } from '../ZAxisContextProvider';
import type { ChartDataProviderProps } from './ChartDataProvider';
import { HighlightedProviderProps } from '../HighlightedProvider';
import { AnimationProviderProps } from '../AnimationProvider';
import { ChartProviderProps } from '../ChartProvider';
import { ChartAnyPluginSignature, MergeSignaturesProperty } from '../../internals/plugins/models';
import { ChartSeriesType } from '../../models/seriesType/config';
import { ChartCorePluginSignatures } from '../../internals/plugins/corePlugins';

export const useChartDataProviderProps = <
  TSignatures extends readonly ChartAnyPluginSignature[],
  TSeries extends ChartSeriesType = ChartSeriesType,
>(
  props: ChartDataProviderProps<TSignatures, TSeries>,
) => {
  const {
    apiRef,
    width,
    height,
    series,
    margin,
    zAxis,
    colors,
    dataset,
    highlightedItem,
    onHighlightChange,
    children,
    skipAnimation,
    plugins,
    seriesConfig,
    ...other
  } = props;

  const theme = useTheme();

  const chartProviderProps: Omit<ChartProviderProps<TSignatures, TSeries>, 'children'> = {
    plugins,
    seriesConfig,
    pluginParams: {
      apiRef,
      width,
      height,
      margin,
      dataset,
      series,
      colors,
      theme: theme.palette.mode,
      ...other,
    } as unknown as MergeSignaturesProperty<
      [...ChartCorePluginSignatures, ...TSignatures],
      'params'
    >,
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
    chartProviderProps,
  };
};
