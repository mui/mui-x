import * as React from 'react';

export interface RowCountProps {
  totalRowCount: number;
  visibleRowCount: number;
}

export const RowCount: React.FC<RowCountProps> = React.memo(({totalRowCount, visibleRowCount}) => {
  if (totalRowCount === 0) {
    return null;
  }

  console.log('rendering ROW COUNT---------');
  const rowCountString = visibleRowCount !== totalRowCount ? `${visibleRowCount.toLocaleString()}/${totalRowCount.toLocaleString()}` : totalRowCount.toLocaleString();
  // const rowCountString = `${visibleRowCount.toLocaleString()}/${totalRowCount.toLocaleString()}`;
  return <div className="MuiDataGrid-rowCount">Total Rows: {rowCountString}</div>;
});
