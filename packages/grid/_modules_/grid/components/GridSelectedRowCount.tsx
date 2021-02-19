import * as React from 'react';
import { GridApiContext } from './GridApiContext';

interface SelectedRowCountProps {
  selectedRowCount: number;
}

export function GridSelectedRowCount(props: SelectedRowCountProps) {
  const { selectedRowCount } = props;
  const apiRef = React.useContext(GridApiContext);
  const rowSelectedText = apiRef!.current.getLocaleText('footerRowSelected')(selectedRowCount);

  return <div className="MuiDataGrid-selectedRowCount">{rowSelectedText}</div>;
}
