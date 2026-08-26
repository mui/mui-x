'use client';
import * as React from 'react';
import { useTheme, useThemeProps } from '@mui/material/styles';
import type { ChartsDataProviderProps } from './ChartsDataProvider';
import type { ChartsProviderProps } from '../context/ChartsProvider';
import { defaultSeriesConfig } from '../internals/plugins/utils/defaultSeriesConfig';
import type { ChartAnyPluginSignature, MergeSignaturesProperty } from '../internals/plugins/models';
import type { ChartSeriesType } from '../models/seriesType/config';
import type { ChartCorePluginSignatures } from '../internals/plugins/corePlugins';
import { DEFAULT_PLUGINS } from '../internals/plugins/allPlugins';
import type { AllPluginSignatures } from '../internals/plugins/allPlugins';
import type { ChartsLocalizationProviderProps } from '../ChartsLocalizationProvider';
import { DEFAULT_TICK_LABEL_FONT_SIZE } from '../constants';
import type { ChartsTextStyle } from '../internals/getWordsByLines';

export const useChartsDataProviderProps = <
  SeriesType extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<SeriesType>,
>(
  inProps: ChartsDataProviderProps<SeriesType, TSignatures> & ChartsLocalizationProviderProps,
) => {
  // eslint-disable-next-line mui/material-ui-name-matches-component-name
  const props = useThemeProps({ props: inProps, name: 'MuiChartsDataProvider' });

  const {
    children,
    localeText,
    plugins = DEFAULT_PLUGINS,
    slots,
    slotProps,
    seriesConfig = defaultSeriesConfig,
    ...other
  } = props;

  const theme = useTheme();

  // The axes measure their tick labels outside React, so they cannot read the theme themselves.
  // Keep this in sync with the style `useAxisTicksProps` renders the ticks with.
  const { fontFamily, fontStyle, fontWeight, letterSpacing, textTransform } =
    theme.typography.caption;
  const defaultTickLabelStyle: ChartsTextStyle = React.useMemo(
    () => ({
      fontFamily,
      fontStyle,
      fontWeight,
      letterSpacing,
      textTransform,
      fontSize: DEFAULT_TICK_LABEL_FONT_SIZE,
    }),
    [fontFamily, fontStyle, fontWeight, letterSpacing, textTransform],
  );

  const chartProviderProps: ChartsProviderProps<SeriesType, TSignatures> = {
    plugins: plugins as ChartsProviderProps<SeriesType, TSignatures>['plugins'],
    pluginParams: {
      theme: theme.palette.mode,
      defaultTickLabelStyle,
      seriesConfig,
      ...other,
    } as unknown as MergeSignaturesProperty<
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
