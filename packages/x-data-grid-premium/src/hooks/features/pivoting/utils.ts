import type { GridColDef, GridColumnsState } from '@mui/x-data-grid-pro';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';

import { isGroupingColumn } from '../rowGrouping';

export const isPivotingEnabled = (
  props: Pick<DataGridPremiumProcessedProps, 'experimentalFeatures' | 'disablePivoting'>,
) => {
  return props.experimentalFeatures?.pivoting && !props.disablePivoting;
};

export const defaultGetPivotDerivedColumns = (column: GridColDef): GridColDef[] | undefined => {
  if (column.type === 'date') {
    const field = column.field;
    return [
      {
        // String column type to avoid formatting the value as 2,025 instead of 2025
        field: `${field}-year`,
        headerName: `${column.headerName} (Year)`,
        valueGetter: (value, row) => new Date(row[field]).getFullYear(),
      },

      {
        field: `${field}-quarter`,
        headerName: `${column.headerName} (Quarter)`,
        valueGetter: (value, row) => `Q${Math.floor(new Date(row[field]).getMonth() / 3) + 1}`,
      },
    ];
  }

  return undefined;
};

export const getInitialColumns = (
  orderedFields: GridColumnsState['orderedFields'],
  lookup: GridColumnsState['lookup'],
  getPivotDerivedColumns: DataGridPremiumProcessedProps['getPivotDerivedColumns'],
) => {
  let initialColumns: GridColDef[] = [];
  for (let i = 0; i < orderedFields.length; i += 1) {
    const field = orderedFields[i];
    const column = lookup[field];
    if (!isGroupingColumn(field)) {
      initialColumns.push(column);

      const derivedColumns = getPivotDerivedColumns(column);
      if (derivedColumns) {
        initialColumns = initialColumns.concat(derivedColumns);
      }
    }
  }

  return initialColumns;
};
