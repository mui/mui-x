import * as React from 'react';
import { GridFilterModel, XGrid } from '@material-ui/x-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

export default function MultiFilteringGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 200,
    maxColumns: 6,
  });
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [
      { id: 1, columnField: 'commodity', operatorValue: 'contains', value: 'rice' },
      { id: 2, columnField: 'quantity', operatorValue: '>=', value: '20000' },
    ],
  });
  return (
    <div style={{ height: 400, width: '100%' }}>
      <XGrid
        {...data}
        filterModel={filterModel}
        onFilterModelChange={(model) => setFilterModel(model)}
      />
    </div>
  );
}
