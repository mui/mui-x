import * as React from 'react';

export const RowCount: React.FC<{ rowCount: number }> = ({ rowCount }) => {
  if (rowCount === 0) {
    return null;
  }
  return <div className="MuiDataGrid-rowCount">Total Rows: {rowCount.toLocaleString()}</div>;
};
