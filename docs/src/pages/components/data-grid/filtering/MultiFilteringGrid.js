import * as React from 'react';
import { XGrid } from '@material-ui/x-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

export default function MultiFilteringGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 200,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <XGrid
        {...data}
        filterModel={{
          items: [
            { columnField: 'commodity', operatorValue: 'contains', value: 'rice' },
            { columnField: 'quantity', operatorValue: '>=', value: '20000' },
          ],
        }}
      />
    </div>
  );
}
