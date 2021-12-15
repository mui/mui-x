import * as React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import { DataGrid, getGridNumericOperators } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const FIELDS = ['id', 'desk', 'commodity', 'quantity', 'unitPrice'];

export default function ColumnTypeFilteringGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    fields: FIELDS,
  });

  const columns = React.useMemo(
    () =>
      data.columns.map((col) => {
        if (col.field !== 'unitPrice') {
          return col;
        }

        return {
          ...col,
          filterOperators: getGridNumericOperators()
            .filter((operator) => operator.value === '>' || operator.value === '<')
            .map((operator) => {
              return {
                ...operator,
                InputComponentProps: {
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  },
                },
              };
            }),
        };
      }),
    [data.columns],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        columns={columns}
        initialState={{
          filter: {
            filterModel: {
              items: [{ columnField: 'unitPrice', value: '25', operatorValue: '>' }],
            },
          },
        }}
      />
    </div>
  );
}
