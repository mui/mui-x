import * as React from 'react';
import { DataGrid, GridRowsProp, GridRowSelectionModel } from '@mui/x-data-grid';
import { GridDemoData, useDemoData, randomInt } from '@mui/x-data-grid-generator';

function loadServerRows(page: number, data: GridDemoData): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(
      () => {
        resolve(data.rows.slice(page * 5, (page + 1) * 5));
      },
      randomInt(100, 600),
    ); // simulate network latency
  });
}

export default function ControlledSelectionServerPaginationGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [loading, setLoading] = React.useState(false);
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);

  React.useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      const newRows = await loadServerRows(paginationModel.page, data);

      if (!active) {
        return;
      }

      setRows(newRows);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [paginationModel.page, data]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        rows={rows}
        pagination
        checkboxSelection
        paginationModel={paginationModel}
        pageSizeOptions={[5]}
        rowCount={100}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
        loading={loading}
        keepNonExistentRowsSelected
      />
    </div>
  );
}
