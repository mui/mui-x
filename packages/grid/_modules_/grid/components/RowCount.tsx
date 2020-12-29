import * as React from 'react';
import { ApiContext } from './api-context';

export const RowCount: React.FC<{ rowCount: number }> = ({ rowCount }) => {
  const apiRef = React.useContext(ApiContext);

  if (rowCount === 0) {
    return null;
  }
  return (
    <div className="MuiDataGrid-rowCount">
      {`${apiRef!.current.getLocaleText('footerTotalRows')} ${rowCount.toLocaleString()}`}
    </div>
  );
};
