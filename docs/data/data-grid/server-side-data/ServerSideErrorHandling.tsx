import * as React from 'react';
import {
  DataGrid,
  useGridApiRef,
  GridInitialState,
  GridDataSource,
  GridGetRowsError,
} from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertProps } from '@mui/material/Alert';
import { alpha, styled, darken, lighten } from '@mui/material/styles';
import { useMockServer } from '@mui/x-data-grid-generator';

const pageSizeOptions = [5, 10, 50];
const serverOptions = { useCursorPagination: false };
const datasetOptions = { editable: true };

const StyledDiv = styled('div')(({ theme: t }) => ({
  position: 'absolute',
  zIndex: 10,
  fontSize: '0.875em',
  top: 0,
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  border: `1px solid ${lighten(alpha(t.palette.divider, 1), 0.88)}`,
  backgroundColor: t.palette.background.default,
  ...t.applyStyles('dark', {
    borderColor: darken(alpha(t.palette.divider, 1), 0.68),
  }),
}));

function ErrorOverlay({ error }: { error: string }) {
  if (!error) {
    return null;
  }
  return <StyledDiv>{error}</StyledDiv>;
}

export default function ServerSideErrorHandling() {
  const apiRef = useGridApiRef();
  const [error, setError] = React.useState<string>();
  const [snackbar, setSnackbar] = React.useState<AlertProps | null>(null);
  const [shouldRequestsFail, setShouldRequestsFail] = React.useState(false);

  const { fetchRows, editRow, ...props } = useMockServer(
    datasetOptions,
    serverOptions,
    shouldRequestsFail,
  );

  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );
        return {
          rows: getRowsResponse.rows,
          rowCount: getRowsResponse.rowCount,
        };
      },
      updateRow: async (params) => {
        const syncedRow = await editRow(params.rowId, params.updatedRow);
        return syncedRow;
      },
    }),
    [fetchRows, editRow],
  );

  const initialState: GridInitialState = React.useMemo(
    () => ({
      ...props.initialState,
      pagination: {
        paginationModel: {
          pageSize: 5,
        },
        rowCount: 0,
      },
    }),
    [props.initialState],
  );

  const handleCloseSnackbar = () => {
    setSnackbar(null);
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          onClick={() => {
            setError('');
            apiRef.current?.dataSource.fetchRows();
          }}
        >
          Refetch rows
        </Button>
        <FormControlLabel
          control={
            <Checkbox
              checked={shouldRequestsFail}
              onChange={(event) => setShouldRequestsFail(event.target.checked)}
            />
          }
          label="Make the requests fail"
        />
      </div>
      <div style={{ height: 400, position: 'relative' }}>
        <DataGrid
          {...props}
          dataSource={dataSource}
          onDataSourceError={(dataSourceError) => {
            if (dataSourceError instanceof GridGetRowsError) {
              setError(dataSourceError.message);
              return;
            }
            setSnackbar({ children: dataSourceError.message, severity: 'error' });
          }}
          dataSourceCache={null}
          apiRef={apiRef}
          pagination
          pageSizeOptions={pageSizeOptions}
          initialState={initialState}
          showToolbar
        />
        {!!snackbar && (
          <Snackbar
            open
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            onClose={handleCloseSnackbar}
            autoHideDuration={6000}
          >
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}
        {error && <ErrorOverlay error={error} />}
      </div>
    </div>
  );
}
