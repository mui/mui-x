import * as React from 'react';
import {
  DataGridPro,
  gridDataRowIdsSelector,
  Toolbar,
  ToolbarButton,
  useGridApiContext,
} from '@mui/x-data-grid-pro';
import { createFakeServer } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';
import Download from '@mui/icons-material/Download';

const SERVER_OPTIONS = {
  useCursorPagination: false,
};

const { useQuery, ...data } = createFakeServer(
  {
    rowLength: 10000,
  },
  SERVER_OPTIONS,
);

function CustomToolbar() {
  const apiRef = useGridApiContext();
  const [exporting, setExporting] = React.useState(false);

  // Due to the mockup API, it's required to get all rows from the hook.
  // For a real-world scenario, this line is not necessary.
  const { rows: allExportRows } = useQuery({});

  async function exportAllRows<
    T extends (params: { fileName: string; includeHeaders: boolean }) => void,
  >(exporter: T) {
    apiRef.current.setLoading(true);
    setExporting(true);

    // Save current row IDs to restore later
    const currentRowIds = gridDataRowIdsSelector(apiRef);

    try {
      // TODO: replace this line with real API call to your database.
      const allRows = await Promise.resolve(allExportRows);

      apiRef.current.updateRows(allRows);

      exporter({
        fileName: `full-csv-export`,
        includeHeaders: true,
      });

      const idsToDelete = allRows
        .map((row) => row.id)
        .filter((id) => !currentRowIds.includes(id));

      // Restore to original rows
      apiRef.current.updateRows(
        idsToDelete.map((id) => ({ id, _action: 'delete' })),
      );
    } finally {
      setExporting(false);
      apiRef.current.setLoading(false);
    }
  }
  return (
    <Toolbar>
      <ToolbarButton
        render={
          <Button
            loading={exporting}
            onClick={() => exportAllRows(apiRef.current.exportDataAsCsv)}
            startIcon={<Download />}
          >
            Export All
          </Button>
        }
      />
    </Toolbar>
  );
}

export default function ExportServerSideData() {
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });
  const { isLoading, rows, pageInfo } = useQuery(paginationModel);
  const rowCountRef = React.useRef(pageInfo?.totalRowCount || 0);

  const rowCount = React.useMemo(() => {
    if (pageInfo?.totalRowCount !== undefined) {
      rowCountRef.current = pageInfo.totalRowCount;
    }
    return rowCountRef.current;
  }, [pageInfo?.totalRowCount]);

  return (
    <div style={{ height: 450, width: '100%' }}>
      <DataGridPro
        {...data}
        loading={isLoading}
        rows={rows}
        rowCount={rowCount}
        pagination
        paginationModel={paginationModel}
        pageSizeOptions={[5]}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        showToolbar
        slots={{
          toolbar: CustomToolbar,
        }}
      />
    </div>
  );
}
