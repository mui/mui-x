import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

const filterModel =
  {
    items:[{columnField: 'commodity', operatorValue: 'contains', value: 'rice'}]
  };

export default function BasicSortingGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid filterModel={filterModel} {...data} />
    </div>
  );
}
