import * as React from 'react';
import {
  DataGridPremium,
  GridDataSource,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMockServer } from '@mui/x-data-grid-generator';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { alpha, styled, darken, lighten, Theme } from '@mui/material/styles';

export default function ServerSideRowGroupingErrorHandling() {
  const apiRef = useGridApiRef();
  const [rootError, setRootError] = React.useState<string>();
  const [childrenError, setChildrenError] = React.useState<string>();
  const [shouldRequestsFail, setShouldRequestsFail] = React.useState(false);

  const { fetchRows, columns } = useMockServer(
    {
      rowGrouping: true,
    },
    {},
    shouldRequestsFail,
  );

  const dataSource: GridDataSource = React.useMemo(() => {
    return {
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
          groupKeys: JSON.stringify(params.groupKeys),
          groupFields: JSON.stringify(params.groupFields),
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );
        return {
          rows: getRowsResponse.rows,
          rowCount: getRowsResponse.rowCount,
        };
      },
      getGroupKey: (row) => row.group,
      getChildrenCount: (row) => row.descendantCount,
    };
  }, [fetchRows]);

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['company', 'director'],
      },
    },
  });

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          onClick={() => {
            setRootError('');
            apiRef.current.unstable_dataSource.fetchRows();
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
        <DataGridPremium
          columns={columns}
          unstable_dataSource={dataSource}
          unstable_onDataSourceError={(error, params) => {
            if (!params.groupKeys || params.groupKeys.length === 0) {
              setRootError(error.message);
            } else {
              setChildrenError(
                `${error.message} (Requested level: ${params.groupKeys.join(' > ')})`,
              );
            }
          }}
          unstable_dataSourceCache={null}
          apiRef={apiRef}
          initialState={initialState}
        />
        {rootError && <ErrorOverlay error={rootError} />}
        <Snackbar
          open={!!childrenError}
          autoHideDuration={3000}
          onClose={() => setChildrenError('')}
          message={childrenError}
        />
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
