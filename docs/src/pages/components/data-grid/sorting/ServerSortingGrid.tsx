import * as React from 'react';
import {
  RowsProp,
  DataGrid,
  SortModel,
  SortModelParams,
} from '@material-ui/data-grid';
import { useDemoData, GridData } from '@material-ui/x-grid-data-generator';

function loadServerRows(sortModel: SortModel, data: GridData): Promise<any> {
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      if (sortModel.length === 0) {
        resolve(data.rows);
        return;
      }

      const sortedColumn = sortModel[0];

      let sortedRows = [...data.rows].sort((a, b) =>
        String(a[sortedColumn.field]).localeCompare(String(b[sortedColumn.field])),
      );

      if (sortModel[0].sort === 'desc') {
        sortedRows = sortedRows.reverse();
      }

      resolve(sortedRows);
    }, Math.random() * 500 + 100); // simulate network latency
  });
}

export default function ServerSortingGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });
  const [sortModel, setSortModel] = React.useState<SortModel>([
    { field: 'commodity', sort: 'asc' },
  ]);
  const [rows, setRows] = React.useState<RowsProp>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleSortModelChange = (params: SortModelParams) => {
    if (params.sortModel !== sortModel) {
      setSortModel(params.sortModel);
    }
  };

  React.useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      const newRows = await loadServerRows(sortModel, data);

      if (!active) {
        return;
      }

      setRows(newRows);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [sortModel, data]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={data.columns}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
        loading={loading}
      />
    </div>
  );
}
