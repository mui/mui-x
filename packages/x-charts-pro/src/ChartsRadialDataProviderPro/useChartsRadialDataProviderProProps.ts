'use client';
import { useTheme, useThemeProps } from '@mui/material/styles';
import type {
  ChartAnyPluginSignature, ChartCorePluginSignatures, ChartSeriesConfig, ChartsProviderProps, MergeSignaturesProperty, PolarChartSeriesType
} from '@mui/x-charts/internals';
import type { ChartsRadialDataProviderProProps } from './ChartsRadialDataProviderPro';
import { type RadialProPluginSignatures, RADIAL_PRO_PLUGINS } from './ChartsRadialDataProviderPro.plugins';
import { type ChartsLocalizationProviderProps } from '../ChartsLocalizationProvider';



const RADIAL_SERIES_CONFIG: ChartSeriesConfig<never> = {};

export const useChartsRadialDataProviderProProps = <
  SeriesType extends PolarChartSeriesType = PolarChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = RadialProPluginSignatures<SeriesType>,
>(
  inProps: ChartsRadialDataProviderProProps<SeriesType, TSignatures> & ChartsLocalizationProviderProps,
) => {
  // eslint-disable-next-line mui/material-ui-name-matches-component-name
  const props = useThemeProps({ props: inProps, name: 'MuiChartsRadialDataProvider' });

  const {
    children,
    localeText,
    plugins = RADIAL_PRO_PLUGINS,
    slots,
    slotProps,
    seriesConfig = RADIAL_SERIES_CONFIG,
    ...other
  } = props;

  const theme = useTheme();

  const chartProviderProps: ChartsProviderProps<SeriesType, TSignatures> = {
    plugins: plugins as ChartsProviderProps<SeriesType, TSignatures>['plugins'],
    pluginParams: {
      theme: theme.palette.mode,
      seriesConfig,
      ...other,
    } as MergeSignaturesProperty<
      [...ChartCorePluginSignatures<SeriesType>, ...TSignatures],
      'params'
    >,
  };

  return {
    children,
    localeText,
    chartProviderProps,
    slots,
    slotProps,
  };
};
