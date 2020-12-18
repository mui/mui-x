import { LinkOperator, XGrid } from '@material-ui/x-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import * as React from 'react';

const filterModel = {
  items: [
    { columnField: 'commodity', operatorValue: 'contains', value: 'rice' },
    { columnField: 'commodity', operatorValue: 'startsWith', value: 'soy' },
  ],
  linkOperator: LinkOperator.Or,
};

export default function MultiFilteringWithOrGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <XGrid {...data} filterModel={filterModel} />
    </div>
  );
}
