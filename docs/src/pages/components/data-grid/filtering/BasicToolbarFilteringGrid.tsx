import * as React from 'react';
import { DataGrid, FilterModel } from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

const riceFilterModel: FilterModel = {
  items: [{ columnField: 'commodity', operatorValue: 'contains', value: 'rice' }],
};

export default function BasicToolbarFilteringGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} filterModel={riceFilterModel} showToolbar />
    </div>
  );
}
