import * as React from 'react';
import { XGrid } from '@material-ui/x-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

const filterModel = {
  items: [
    { columnField: 'commodity', operatorValue: 'contains', value: 'rice' },
    { columnField: 'commodity', operatorValue: 'startsWith', value: 'soy' },
  ],
  linkOperator: 'or',
};

export default function MultiFilteringGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <XGrid filterModel={filterModel} {...data} />
    </div>
  );
}
