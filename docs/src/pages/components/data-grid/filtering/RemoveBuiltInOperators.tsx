import * as React from 'react';
import { DataGrid, getGridNumericOperators } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function RemoveBuiltInOperators() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    rowLength: 100,
    visibleFields: VISIBLE_FIELDS,
  });

  const columns = React.useMemo(
    () =>
      data.columns.map((col) => {
        if (col.field !== 'rating') {
          return col;
        }

        return {
          ...col,
          filterOperators: getGridNumericOperators().filter(
            (operator) => operator.value === '>' || operator.value === '<',
          ),
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
