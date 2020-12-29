import * as React from 'react';
import { ApiContext } from './api-context';

interface SelectedRowCountProps {
  selectedRowCount: number;
}

export function SelectedRowCount(props: SelectedRowCountProps) {
  const { selectedRowCount } = props;
  const apiRef = React.useContext(ApiContext);
  const rowSelectedText = apiRef!.current.getLocaleText('footerRowSelected')(selectedRowCount);

  return <div className="MuiDataGrid-selectedRowCount">{rowSelectedText}</div>;
}
