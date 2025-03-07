import type { GridColDef, GridColumnsState } from '@mui/x-data-grid-pro';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';

import { isGroupingColumn } from '../rowGrouping';

export const isPivotingEnabled = (
  props: Pick<DataGridPremiumProcessedProps, 'experimentalFeatures' | 'disablePivoting'>,
) => {
  return props.experimentalFeatures?.pivoting && !props.disablePivoting;
};

export const getInitialColumns = (
  orderedFields: GridColumnsState['orderedFields'],
  lookup: GridColumnsState['lookup'],
) => {
  const initialColumns: GridColDef[] = [];
  for (let i = 0; i < orderedFields.length; i += 1) {
    const field = orderedFields[i];
    const column = lookup[field];
    if (!isGroupingColumn(field)) {
      initialColumns.push(column);

      if (column.type === 'date') {
        initialColumns.push({
          // String column type to avoid formatting the value as 2,025 instead of 2025
          field: `${field}-year`,
          headerName: `${column.headerName} (Year)`,
          valueGetter: (value, row) => new Date(row[field]).getFullYear(),
        });

        initialColumns.push({
          field: `${field}-quarter`,
          headerName: `${column.headerName} (Quarter)`,
          valueGetter: (value, row) => `Q${Math.floor(new Date(row[field]).getMonth() / 3) + 1}`,
        });
      }
    }
  }

  return initialColumns;
};
