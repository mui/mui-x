import * as React from 'react';
import {
  DataGridPro,
  useGridApiRef,
  GridInitialState,
  GridDataSource,
} from '@mui/x-data-grid-pro';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { alpha, styled, darken, lighten, Theme } from '@mui/material/styles';
import { useMockServer } from '@mui/x-data-grid-generator';
import LoadingSlate from './LoadingSlateNoSnap';

const pageSizeOptions = [5, 10, 50];
const serverOptions = { useCursorPagination: false };
const dataSetOptions = {
  dataSet: 'Employee' as 'Employee',
  rowLength: 1000,
  treeData: { maxDepth: 3, groupingField: 'name', averageChildren: 5 },
};

export default function ServerSideTreeDataErrorHandling() {
  const apiRef = useGridApiRef();
  const [rootError, setRootError] = React.useState<string>();
  const [childrenError, setChildrenError] = React.useState<string>();
  const [shouldRequestsFail, setShouldRequestsFail] = React.useState(false);

  const { isInitialized, fetchRows, ...props } = useMockServer(
    dataSetOptions,
    serverOptions,
    shouldRequestsFail,
  );

  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: encodeURIComponent(
            JSON.stringify(params.paginationModel),
          ),
          filterModel: encodeURIComponent(JSON.stringify(params.filterModel)),
          sortModel: encodeURIComponent(JSON.stringify(params.sortModel)),
          groupKeys: encodeURIComponent(JSON.stringify(params.groupKeys)),
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );
        return {
          rows: getRowsResponse.rows,
          rowCount: getRowsResponse.rowCount,
        };
      },
      getGroupKey: (row) => row[dataSetOptions.treeData.groupingField],
      getChildrenCount: (row) => row.descendantCount,
    }),
    [fetchRows],
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

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          onClick={() => {
            setRootError('');
            apiRef.current.fetchTopLevelRows();
          }}
        >
          Refetch rows
        </Button>
        <FormControlLabel
          control={
            <Checkbox
              checked={shouldRequestsFail}
              onChange={(e) => setShouldRequestsFail(e.target.checked)}
            />
          }
          label="Make the requests fail"
        />
      </div>
      <div style={{ height: 400, position: 'relative' }}>
        {isInitialized ? (
          <React.Fragment>
            <DataGridPro
              {...props}
              treeData
              unstable_dataSource={dataSource}
              unstable_onDataSourceError={(e, params) => {
                if (!params.groupKeys || params.groupKeys.length === 0) {
                  setRootError(e.message);
                } else {
                  setChildrenError(
                    `${e.message} (Requested level: ${params.groupKeys.join(', ')})`,
                  );
                }
              }}
              disableDataSourceCache
              apiRef={apiRef}
              pagination
              pageSizeOptions={pageSizeOptions}
              initialState={initialState}
            />
            {rootError && <ErrorOverlay error={rootError} />}
            <Snackbar
              open={!!childrenError}
              autoHideDuration={3000}
              onClose={() => setChildrenError('')}
              message={childrenError}
            />
          </React.Fragment>
        ) : (
          <LoadingSlate />
        )}
      </div>
    </div>
  );
}

function getBorderColor(theme: Theme) {
  if (theme.palette.mode === 'light') {
    return lighten(alpha(theme.palette.divider, 1), 0.88);
  }
  return darken(alpha(theme.palette.divider, 1), 0.68);
}

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
  border: `1px solid ${getBorderColor(t)}`,
  backgroundColor: t.palette.background.default,
}));

function ErrorOverlay({ error }: { error: string }) {
  if (!error) {
    return null;
  }
  return <StyledDiv>{error}</StyledDiv>;
}
