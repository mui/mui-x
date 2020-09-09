import * as React from 'react';

export const SelectedRowCount: React.FC<{ selectedRowCount: number }> = ({ selectedRowCount }) => {
  if (selectedRowCount === 0) {
    return null;
  }

  return (
    <div className="MuiDataGrid-selectedRowCount">
      {`${selectedRowCount.toLocaleString()} ${selectedRowCount > 1 ? 'rows' : 'row'} selected`}
    </div>
  );
};
