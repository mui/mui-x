import * as React from 'react';
import { ApiContext } from './api-context';

interface SelectedRowCountProps {
  selectedRowCount: number;
}

export function SelectedRowCount(props: SelectedRowCountProps) {
  const { selectedRowCount } = props;
  const apiRef = React.useContext(ApiContext);
  const rowSelectedText =
    selectedRowCount > 1
      ? apiRef!.current.getLocaleText('footerRowSelectedPlural')
      : apiRef!.current.getLocaleText('footerRowSelected');

  return (
    <div className="MuiDataGrid-selectedRowCount">
      {`${selectedRowCount.toLocaleString()} ${rowSelectedText}`}
    </div>
  );
}
