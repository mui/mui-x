import * as React from 'react';
import { GridConfigurationContext } from '../../components/GridConfigurationContext';
import { GridConfiguration } from '../../models/configuration/gridConfiguration';

export const useGridConfiguration = () => {
  const configuration = React.useContext(GridConfigurationContext);

  if (configuration === undefined) {
    throw new Error(
      [
        'MUI X: Could not find the data grid configuration context.',
        'It looks like you rendered your component outside of a DataGrid, DataGridPro or DataGridPremium parent component.',
        'This can also happen if you are bundling multiple versions of the data grid.',
      ].join('\n'),
    );
  }

  return configuration as GridConfiguration;
};
