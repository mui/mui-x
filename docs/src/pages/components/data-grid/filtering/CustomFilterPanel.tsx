import * as React from 'react';
import { DataGridPro, GridLinkOperator } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function CustomFilterPanel() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        // components={{
        //   FilterPanel: MyCustomFilterPanel,
        // }}
        componentsProps={{
          filterPanel: {
            linkOperators: [GridLinkOperator.And],
            columnsSort: 'asc',
            deleteIconContainerSx: { display: 'none' },
            valueContainerSx: { width: 200 },
            // linkOperatorContainerSx: {},
            // columnContainerSx: {},
            // operatorContainerSx: {}
          },
        }}
      />
    </div>
  );
}
