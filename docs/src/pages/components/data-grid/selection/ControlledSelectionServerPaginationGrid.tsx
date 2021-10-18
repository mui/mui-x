import * as React from 'react';
import { DataGrid, GridRowsProp, GridSelectionModel } from '@mui/x-data-grid';
import { GeneratedDemoData, useDemoData } from '@mui/x-data-grid-generator';

function loadServerRows(page: number, data: GeneratedDemoData): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data.rows.slice(page * 5, (page + 1) * 5));
    }, Math.random() * 500 + 100); // simulate network latency
  });
}

export default function ControlledSelectionServerPaginationGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  const [page, setPage] = React.useState(0);
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const prevSelectionModel = React.useRef<GridSelectionModel>(selectionModel);

  React.useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      const newRows = await loadServerRows(page, data);

      if (!active) {
        return;
      }

      setRows(newRows);
      setLoading(false);
      setTimeout(() => {
        setSelectionModel(prevSelectionModel.current);
      });
    })();

    return () => {
      active = false;
    };
  }, [page, data]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={data.columns}
        pagination
        checkboxSelection
        pageSize={5}
        rowsPerPageOptions={[5]}
        rowCount={100}
        paginationMode="server"
        onPageChange={(newPage) => {
          prevSelectionModel.current = selectionModel;
          setPage(newPage);
        }}
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
        selectionModel={selectionModel}
        loading={loading}
      />
    </div>
  );
}
