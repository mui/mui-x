import * as React from 'react';
import { Initializable } from '../context.types';
import { FormattedSeries } from './Series.types';

export const SeriesContext = React.createContext<Initializable<FormattedSeries>>({
  isInitialized: false,
  data: {},
});

if (process.env.NODE_ENV !== 'production') {
  SeriesContext.displayName = 'SeriesContext';
}
