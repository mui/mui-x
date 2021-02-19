import * as React from 'react';
import { GridApiContext } from './GridApiContext';

export const GridRowCount: React.FC<{ rowCount: number }> = ({ rowCount }) => {
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
