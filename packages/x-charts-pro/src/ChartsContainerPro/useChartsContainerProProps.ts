'use client';
import * as React from 'react';
import { useChartsContainerProps } from '@mui/x-charts/internals';
import type {
  ChartAnyPluginSignature,
  ChartSeriesType,
  SamplingConfig,
  SamplingMethod,
  UseChartsContainerPropsReturnValue,
} from '@mui/x-charts/internals';
import type { ChartsDataProviderProProps } from '../ChartsDataProviderPro';
import type { ChartsContainerProProps } from './ChartsContainerPro';
import { DEFAULT_PLUGINS } from '../internals/plugins/allPlugins';
import type { AllPluginSignatures } from '../internals/plugins/allPlugins';

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
  /** Maps a chart's single `sampling` method to the provider's per-type config. Omit if unsupported. */
  samplingOptions?: { seriesType: SeriesType; method: SamplingMethod | undefined },
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

  const samplingMethod = samplingOptions?.method;
  const samplingSeriesType = samplingOptions?.seriesType;
  const samplingConfig = React.useMemo(
    () =>
      samplingMethod
        ? ({ [samplingSeriesType as ChartSeriesType]: samplingMethod } as SamplingConfig)
        : undefined,
    [samplingMethod, samplingSeriesType],
  );

  const { chartsDataProviderProps, chartsSurfaceProps, children } =
    useChartsContainerProps<SeriesType>(baseProps);

  const chartsDataProviderProProps = {
    ...chartsDataProviderProps,
    initialZoom,
    zoomData,
    onZoomChange,
    zoomInteractionConfig,
    apiRef,
    sampling: samplingConfig,
    plugins: plugins ?? DEFAULT_PLUGINS,
  } as unknown as ChartsDataProviderProProps<SeriesType, TSignatures>;

  return {
    chartsDataProviderProProps,
    chartsSurfaceProps,
    children,
  };
};
