'use client';
import * as React from 'react';
import { GridChartsIntegrationContext } from '../../components/chartsIntegration/GridChartsIntegrationContext';
import { GridChartsIntegrationContextValue } from '../../models/gridChartsIntegration';

export const useGridChartsIntegrationContext = (ignoreError = false) => {
  const context = React.useContext(GridChartsIntegrationContext);
  if (!context && !ignoreError) {
    throw new Error(
      [
        'MUI X: Could not find the Data Grid charts integration context.',
        'It looks like you rendered your component outside of a DataGrid, DataGridPro or DataGridPremium parent component.',
        'This can also happen if you are bundling multiple versions of the Data Grid.',
      ].join('\n'),
    );
  }

  return context as GridChartsIntegrationContextValue;
};
