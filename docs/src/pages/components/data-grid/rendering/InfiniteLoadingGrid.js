import * as React from 'react';
import { DataGrid, GridOverlay } from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import LinearProgress from '@material-ui/core/LinearProgress';

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: 'absolute', top: 0, width: '100%' }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

export default function InfiniteLoadingGrid() {
  const [size, setSize] = React.useState(20);
  const { loading, data, setRowLength, loadNewData } = useDemoData({
    dataSet: 'Commodity',
    rowLength: size,
    maxColumns: 6,
  });

  const handleOnRowsScrollEnd = (params) => {
    const newRowLength = params.virtualRowsCount + params.viewportPageSize;
    setSize(newRowLength);
    setRowLength(newRowLength);
    loadNewData();
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        hideFooterPagination
        onRowsScrollEnd={handleOnRowsScrollEnd}
        components={{
          LoadingOverlay: CustomLoadingOverlay,
        }}
      />
    </div>
  );
}
