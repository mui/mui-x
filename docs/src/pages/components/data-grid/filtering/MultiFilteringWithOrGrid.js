import { GridLinkOperator, DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import * as React from 'react';

const filterModel = {
  items: [
    { id: 1, columnField: 'commodity', operatorValue: 'contains', value: 'rice' },
    { id: 2, columnField: 'commodity', operatorValue: 'startsWith', value: 'soy' },
  ],
  linkOperator: GridLinkOperator.Or,
};

export default function MultiFilteringWithOrGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro {...data} initialState={{ filter: { filterModel } }} />
    </div>
  );
}
