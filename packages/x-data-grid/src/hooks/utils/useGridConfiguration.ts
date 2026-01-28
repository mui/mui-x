'use client';
import * as React from 'react';
import { GridConfigurationContext } from '../../components/GridConfigurationContext';
import { GridConfiguration } from '../../models/configuration/gridConfiguration';
import type { GridPrivateApiCommon } from '../../models/api/gridApiCommon';
import type { GridPrivateApiCommunity } from '../../models/api/gridApiCommunity';

export const useGridConfiguration = <
  Api extends GridPrivateApiCommon = GridPrivateApiCommunity,
>() => {
  const configuration = React.useContext(GridConfigurationContext);

  if (configuration === undefined) {
    throw new Error(
      [
        'MUI X: Could not find the Data Grid configuration context.',
        'It looks like you rendered your component outside of a DataGrid, DataGridPro or DataGridPremium parent component.',
        'This can also happen if you are bundling multiple versions of the Data Grid.',
      ].join('\n'),
    );
  }

  return configuration as GridConfiguration<Api>;
};
