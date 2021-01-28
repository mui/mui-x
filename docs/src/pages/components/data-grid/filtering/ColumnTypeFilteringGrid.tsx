import * as React from 'react';
import { InputAdornment } from '@material-ui/core';
import {
  DataGrid,
  ColTypeDef,
  getNumericColumnOperators,
  PreferencePanelsValue,
} from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

const priceColumnType: ColTypeDef = {
  extendType: 'number',
  filterOperators: getNumericColumnOperators()
    .filter((operator) => operator.value === '>' || operator.value === '<')
    .map((operator) => {
      return {
        ...operator,
        InputComponentProps: {
          inputProps: {
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          },
        },
      };
    }),
};

export default function NewColumnTypes() {
  const { data } = useDemoData({ dataSet: 'Commodity', rowLength: 100 });
  const [cols, setCols] = React.useState(data.columns);

  React.useEffect(() => {
    if (data.columns.length > 0) {
      const visibleFields = ['desk', 'commodity', 'totalPrice'];
      const demoCols = data.columns.map((col) => {
        const newCol = { ...col, hide: visibleFields.indexOf(col.field) === -1 };
        if (newCol.field === 'totalPrice') {
          newCol.type = 'price';
        }
        return newCol;
      });
      setCols(demoCols);
    }
  }, [data]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data.rows}
        columns={cols}
        columnTypes={{ price: priceColumnType }}
        filterModel={{
          items: [
            { columnField: 'totalPrice', value: '3000000', operatorValue: '>' },
          ],
        }}
        state={{
          preferencePanel: {
            open: true,
            openedPanelValue: PreferencePanelsValue.filters,
          },
        }}
      />
    </div>
  );
}
