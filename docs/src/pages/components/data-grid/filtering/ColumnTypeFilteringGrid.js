import * as React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import { DataGrid, getGridNumericColumnOperators } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const priceColumnType = {
  extendType: 'number',
  filterOperators: getGridNumericColumnOperators()
    .filter((operator) => operator.value === '>' || operator.value === '<')
    .map((operator) => {
      return {
        ...operator,
        InputComponentProps: {
          InputProps: {
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          },
        },
      };
    }),
};

export default function ColumnTypeFilteringGrid() {
  const { data } = useDemoData({ dataSet: 'Commodity', rowLength: 100 });
  const columns = React.useMemo(() => {
    if (data.columns.length > 0) {
      const visibleFields = ['desk', 'commodity', 'totalPrice'];
      const mappedColumns = data.columns.map((dataColumn) => {
        const mappedColumn = {
          ...dataColumn,
          hide: visibleFields.indexOf(dataColumn.field) === -1,
        };

        if (mappedColumn.field === 'totalPrice') {
          mappedColumn.type = 'price';
          mappedColumn.width = 180;
        }
        return mappedColumn;
      });
      return mappedColumns;
    }
    return [];
  }, [data.columns]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data.rows}
        columns={columns}
        columnTypes={{ price: priceColumnType }}
        initialState={{
          filter: {
            filterModel: {
              items: [
                { columnField: 'totalPrice', value: '3000000', operatorValue: '>' },
              ],
            },
          },
        }}
      />
    </div>
  );
}
