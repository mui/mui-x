import * as React from 'react';
import { DataGrid, useApiRef } from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

export default function ApiRefPaginationGrid() {
  const apiRef = useApiRef();
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });

  React.useEffect(() => {
    apiRef.current.setPage(2);
  }, [apiRef]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid pagination pageSize={5} apiRef={apiRef} {...data} />
    </div>
  );
}
