import * as React from 'react';

interface SelectedRowCountProps {
  selectedRowCount: number;
}

export function SelectedRowCount(props: SelectedRowCountProps) {
  const { selectedRowCount } = props;

  return (
    <div className="MuiDataGrid-selectedRowCount">
      {`${selectedRowCount.toLocaleString()} ${selectedRowCount > 1 ? 'rows' : 'row'} selected`}
    </div>
  );
}
