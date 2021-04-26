import * as React from 'react';
import { GridApiContext } from './GridApiContext';

export interface GridRowCountProps {
  rowCount: number;
}

export const GridRowCount = (props: GridRowCountProps) => {
  const { rowCount } = props;
  const apiRef = React.useContext(GridApiContext);

  if (rowCount === 0) {
    return null;
  }
  return (
    <div className="MuiDataGrid-rowCount">
      {`${apiRef!.current.getLocaleText('footerTotalRows')} ${rowCount.toLocaleString()}`}
    </div>
  );
};
