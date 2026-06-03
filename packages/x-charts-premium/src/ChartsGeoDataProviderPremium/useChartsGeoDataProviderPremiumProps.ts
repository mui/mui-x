'use client';
import { useTheme, useThemeProps } from '@mui/material/styles';
import {
  type ChartAnyPluginSignature,
  type ChartSeriesType,
  type ChartsPluginParams,
  type ChartsProviderProps,
  type ChartSeriesConfig,
} from '@mui/x-charts/internals';
import { type ChartsGeoDataProviderPremiumProps } from './ChartsGeoDataProviderPremium';
import {
  GEO_PREMIUM_PLUGINS,
  type GeoPremiumPluginSignatures,
} from './ChartsGeoDataProviderPremium.plugins';
import { mapShapeSeriesConfig } from '../Map/seriesConfig';

const GEO_PREMIUM_SERIES_CONFIG: ChartSeriesConfig<'mapShape'> = {
  mapShape: mapShapeSeriesConfig,
};

export const useChartsGeoDataProviderPremiumProps = <
  SeriesType extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = GeoPremiumPluginSignatures<SeriesType>,
>(
  inProps: ChartsGeoDataProviderPremiumProps<SeriesType, TSignatures>,
) => {
  // eslint-disable-next-line mui/material-ui-name-matches-component-name
  const props = useThemeProps({ props: inProps, name: 'MuiChartsGeoDataProviderPremium' });

  const {
    children,
    localeText,
    plugins = GEO_PREMIUM_PLUGINS,
    slots,
    slotProps,
    seriesConfig = GEO_PREMIUM_SERIES_CONFIG,
    ...other
  } = props;

  const theme = useTheme();

  const chartProviderProps: ChartsProviderProps<SeriesType, TSignatures> = {
    plugins: plugins as ChartsProviderProps<SeriesType, TSignatures>['plugins'],
    pluginParams: {
      theme: theme.palette.mode,
      seriesConfig,
      ...other,
    } as ChartsPluginParams<SeriesType, TSignatures>,
  };

  return {
    children,
    localeText,
    chartProviderProps,
    slots,
    slotProps,
  };
};
