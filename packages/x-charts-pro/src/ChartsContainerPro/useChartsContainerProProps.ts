'use client';
import {
  type ChartAnyPluginSignature,
  type ChartSeriesType,
  useChartsContainerProps,
  type UseChartsContainerPropsReturnValue,
} from '@mui/x-charts/internals';
import type { ChartDataProviderProProps } from '../ChartDataProviderPro';
import type { ChartsContainerProProps } from './ChartsContainerPro';
import { DEFAULT_PLUGINS, type AllPluginSignatures } from '../internals/plugins/allPlugins';

export type UseChartsContainerProPropsReturnValue<
  SeriesType extends ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[],
> = Pick<
  UseChartsContainerPropsReturnValue<SeriesType, TSignatures>,
  'chartsSurfaceProps' | 'children'
> & {
  chartDataProviderProProps: ChartDataProviderProProps<SeriesType, TSignatures>;
};

export const useChartsContainerProProps = <
  SeriesType extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<SeriesType>,
>(
  props: ChartsContainerProProps<SeriesType, TSignatures>,
): UseChartsContainerProPropsReturnValue<SeriesType, TSignatures> => {
  const {
    initialZoom,
    zoomData,
    onZoomChange,
    zoomInteractionConfig,
    plugins,
    apiRef,
    ...baseProps
  } = props as ChartsContainerProProps<SeriesType, AllPluginSignatures<SeriesType>>;

  const { chartDataProviderProps, chartsSurfaceProps, children } =
    useChartsContainerProps<SeriesType>(baseProps);

  const chartDataProviderProProps = {
    ...chartDataProviderProps,
    initialZoom,
    zoomData,
    onZoomChange,
    zoomInteractionConfig,
    apiRef,
    plugins: plugins ?? DEFAULT_PLUGINS,
  } as unknown as ChartDataProviderProProps<SeriesType, TSignatures>;

  return {
    chartDataProviderProProps,
    chartsSurfaceProps,
    children,
  };
};
