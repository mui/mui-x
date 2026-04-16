'use client';
import {
  type ChartAnyPluginSignature,
  type ChartSeriesType,
  useChartsContainerProps,
  type UseChartsContainerPropsReturnValue,
} from '@mui/x-charts/internals';
import type { ChartsDataProviderProProps } from '../ChartsDataProviderPro';
import type { ChartsContainerProProps } from './ChartsContainerPro';
import { DEFAULT_PLUGINS, type AllPluginSignatures } from '../internals/plugins/allPlugins';

export type UseChartsContainerProPropsReturnValue<
  SeriesType extends ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[],
> = Pick<
  UseChartsContainerPropsReturnValue<SeriesType, TSignatures>,
  'chartsSurfaceProps' | 'children'
> & {
  chartsDataProviderProProps: ChartsDataProviderProProps<SeriesType, TSignatures>;
};

export const useChartsContainerProProps = <
  SeriesType extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<SeriesType>,
>(
  props: ChartsContainerProProps<SeriesType, TSignatures>,
): UseChartsContainerProPropsReturnValue<SeriesType, TSignatures> => {
  const {
    initialZoom,
    initialRangeKey,
    zoomData,
    onZoomChange,
    zoomInteractionConfig,
    rangeButtons,
    plugins,
    apiRef,
    ...baseProps
  } = props as ChartsContainerProProps<SeriesType, AllPluginSignatures<SeriesType>>;

  const { chartsDataProviderProps, chartsSurfaceProps, children } =
    useChartsContainerProps<SeriesType>(baseProps);

  const chartsDataProviderProProps = {
    ...chartsDataProviderProps,
    initialZoom,
    initialRangeKey,
    zoomData,
    onZoomChange,
    zoomInteractionConfig,
    rangeButtons,
    apiRef,
    plugins: plugins ?? DEFAULT_PLUGINS,
  } as unknown as ChartsDataProviderProProps<SeriesType, TSignatures>;

  return {
    chartsDataProviderProProps,
    chartsSurfaceProps,
    children,
  };
};
