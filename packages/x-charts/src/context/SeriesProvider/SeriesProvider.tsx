import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { ChartSeriesType, DatasetType } from '../../models/seriesType/config';
import { blueberryTwilightPalette } from '../../colorPalettes';
import { SeriesProviderProps } from './Series.types';
import { SeriesContext } from './SeriesContext';
import { preprocessSeries } from './processSeries';
import { useSeriesFormatter } from '../PluginProvider';

function SeriesProvider<T extends ChartSeriesType>(props: SeriesProviderProps<T>) {
  const { series, dataset, colors = blueberryTwilightPalette, children } = props;

  const seriesFormatters = useSeriesFormatter();

  const theme = useTheme();

  const formattedSeries = React.useMemo(
    () => ({
      isInitialized: true,
      data: preprocessSeries({
        series,
        colors: typeof colors === 'function' ? colors(theme.palette.mode) : colors,
        seriesFormatters,
        dataset: dataset as DatasetType<number>,
      }),
    }),
    [series, colors, theme.palette.mode, seriesFormatters, dataset],
  );

  return <SeriesContext.Provider value={formattedSeries}>{children}</SeriesContext.Provider>;
}

export { SeriesProvider };
