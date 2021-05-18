import * as React from 'react';
import { XGrid, useGridApiRef } from '@material-ui/x-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

export default function ApiRefPaginationGrid() {
  const apiRef = useGridApiRef();
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });

  const handleClick = () => {
    apiRef.current.setPage(1);
  };

  return (
    <div>
      <button type="button" onClick={handleClick}>
        Set page 2
      </button>
      <br />
      <br />
      <div style={{ height: 400, width: '100%' }}>
        <XGrid pagination pageSize={5} apiRef={apiRef} {...data} />
      </div>
    </div>
  );
}
