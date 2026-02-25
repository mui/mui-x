'use client';
import * as React from 'react';
import { ChartsLocalizationContext } from '../ChartsLocalizationProvider/ChartsLocalizationProvider';

export const useChartsLocalization = () => {
  const localization = React.useContext(ChartsLocalizationContext);
  if (localization === null) {
    throw new Error(
      'MUI X Charts: Could not find the charts localization context. ' +
        'This happens when the component is rendered without a ChartsLocalizationProvider. ' +
        'Wrap your component in a ChartsLocalizationProvider. ' +
        'This can also happen if you are bundling multiple versions of the `@mui/x-charts` package.',
    );
  }

  return localization;
};
