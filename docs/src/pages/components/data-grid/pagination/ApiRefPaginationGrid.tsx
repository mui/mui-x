import * as React from 'react';
import Button from '@material-ui/core/Button';
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
    <div
      style={{
        width: '100%',
      }}
    >
      <Button color="primary" variant="outlined" onClick={handleClick}>
        Set page 2
      </Button>
      <div style={{ height: 400, width: '100%', marginTop: 16 }}>
        <XGrid pagination pageSize={5} apiRef={apiRef} {...data} />
      </div>
    </div>
  );
}
