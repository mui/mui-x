import * as React from 'react';
import { ChartsLocalizationContext } from '../ChartsLocalizationProvider/ChartsLocalizationProvider';

export const useChartsLocalization = () => {
  const localization = React.useContext(ChartsLocalizationContext);
  if (localization === null) {
    throw new Error(
      [
        'MUI X Charts: Can not find the charts localization context.',
        'It looks like you forgot to wrap your component in ChartsLocalizationProvider.',
        'This can also happen if you are bundling multiple versions of the `@mui/x-charts` package',
      ].join('\n'),
    );
  }

  return localization;
};
