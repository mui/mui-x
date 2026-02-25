'use client';
import * as React from 'react';
import { GridConfigurationContext } from '../../components/GridConfigurationContext';
import type { GridConfiguration } from '../../models/configuration/gridConfiguration';
import type { GridPrivateApiCommon } from '../../models/api/gridApiCommon';
import type { GridPrivateApiCommunity } from '../../models/api/gridApiCommunity';

export const useGridConfiguration = <
  Api extends GridPrivateApiCommon = GridPrivateApiCommunity,
>() => {
  const configuration = React.useContext(GridConfigurationContext);

  if (configuration === undefined) {
    throw new Error(
      'MUI X Data Grid: Could not find the Data Grid configuration context. ' +
        'This happens when a component is rendered outside of a DataGrid, DataGridPro, or DataGridPremium parent component. ' +
        'Ensure your component is a child of a Data Grid component. ' +
        'This can also happen if you are bundling multiple versions of the Data Grid.',
    );
  }

  return configuration as GridConfiguration<Api>;
};
