import * as React from 'react';
import { createTheme, ThemeOptions } from '@mui/material/styles';
import '@mui/x-charts/themeAugmentation';
import { MakeOptional } from '../../packages/x-internals/build/esm/types/MakeOptional';
import {
  PieSeriesType,
  PieValueType,
} from '../../packages/x-charts/build/esm/models/seriesType/pie';
import {
  ChartSeriesType,
  UseChartHighlightSignature,
  ChartAnyPluginSignature,
  MergeSignaturesProperty,
  ChartSeriesConfig,
  ConvertSignaturesIntoPlugins,
} from '../../packages/x-charts/build/esm/internals';
import { AllPluginSignatures } from '../../packages/x-charts/build/esm/internals/plugins/allPlugins';
import { UseChartBaseProps } from '../../packages/x-charts/build/esm/internals/store/useCharts.types';
// import { ChartCorePluginSignatures } from '../../packages/x-charts/build/esm/internals/plugins/corePlugins/corePlugins';

export const getDesignTokens = () => ({}) as ThemeOptions;

export const brandingDarkTheme = createTheme(getDesignTokens());

export type ChartPluginParams<TSignatures extends readonly ChartAnyPluginSignature[]> =
  UseChartBaseProps<TSignatures> &
    MergeSignaturesProperty<
      [
        // ...ChartCorePluginSignatures,
        ...TSignatures,
      ],
      'params'
    >;

export interface ChartProviderProps<
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = [],
> {
  /**
   * Array of plugins used to add features to the chart.
   */
  plugins?: ConvertSignaturesIntoPlugins<TSignatures>;
  pluginParams?: ChartPluginParams<TSignatures>;
  /**
   * The configuration helpers used to compute attributes according to the series type.
   * @ignore Unstable props for internal usage.
   */
  seriesConfig?: ChartSeriesConfig<TSeries>;
}

export type ChartDataProviderProps<
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
> = React.PropsWithChildren<
  ChartProviderProps<TSeries, TSignatures>['pluginParams'] &
    Pick<ChartProviderProps<TSeries, TSignatures>, 'seriesConfig' | 'plugins'>
>;

export type ChartContainerProps<
  SeriesType extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<SeriesType>,
> = Omit<ChartDataProviderProps<SeriesType, TSignatures>, 'children'>;

interface PieChartProps
  extends Omit<ChartContainerProps<'pie', [UseChartHighlightSignature]>, 'series'> {
  /**
   * The series to display in the pie chart.
   * An array of [[PieSeriesType]] objects.
   */
  series: Readonly<MakeOptional<PieSeriesType<MakeOptional<PieValueType, 'id'>>, 'type'>[]>;
}

// const colors: string[] = [];

function P(p?: PieChartProps) {
  return p ? null : <p>t</p>;
}

export default function ChartUserByCountry() {
  return (
    <div>
      {/* <PieChart colors={colors} series={[]} /> */}
      <P series={[]} highlightedItem={null} />
    </div>
  );
}
