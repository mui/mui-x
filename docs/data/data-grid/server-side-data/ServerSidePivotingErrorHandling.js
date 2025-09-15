import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  GridGetRowsError,
  GridSidebarValue,
} from '@mui/x-data-grid-premium';
import { useMockServer } from '@mui/x-data-grid-generator';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { alpha, styled, darken, lighten } from '@mui/material/styles';

const pivotModel = {
  rows: [{ field: 'commodity' }, { field: 'traderName' }],
  columns: [{ field: 'status' }],
  values: [{ field: 'quantity', aggFunc: 'sum' }],
};

const aggregationFunctions = {
  sum: { columnTypes: ['number'] },
  avg: { columnTypes: ['number'] },
  min: { columnTypes: ['number', 'date', 'dateTime'] },
  max: { columnTypes: ['number', 'date', 'dateTime'] },
  size: {},
};

export default function ServerSidePivotingErrorHandling() {
  const apiRef = useGridApiRef();
  const [rootError, setRootError] = React.useState();
  const [childrenError, setChildrenError] = React.useState();
  const [shouldRequestsFail, setShouldRequestsFail] = React.useState(false);

  const {
    columns,
    initialState: initialStateMock,
    fetchRows,
  } = useMockServer(
    {
      rowLength: 200,
      dataSet: 'Commodity',
      maxColumns: 20,
    },
    {},
    shouldRequestsFail,
  );

  const dataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
          groupKeys: JSON.stringify(params.groupKeys),
          groupFields: JSON.stringify(params.groupFields),
          pivotModel: JSON.stringify(params.pivotModel),
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );
        return {
          rows: getRowsResponse.rows,
          rowCount: getRowsResponse.rowCount,
          aggregateRow: getRowsResponse.aggregateRow,
          pivotColumns: getRowsResponse.pivotColumns,
        };
      },
      getGroupKey: (row) => row.group,
      getChildrenCount: (row) => row.descendantCount,
      getAggregatedValue: (row, field) => row[field],
      getPivotColumnDef: (field, columnGroupPath) => ({
        field: columnGroupPath
          .map((path) =>
            typeof path.value === 'string' ? path.value : path.value[path.field],
          )
          .concat(field)
          .join('>->'),
      }),
    }),
    [fetchRows],
  );

  const initialState = React.useMemo(
    () => ({
      ...initialStateMock,
      pivoting: {
        model: pivotModel,
        enabled: true,
      },
      sidebar: {
        open: true,
        value: GridSidebarValue.Pivot,
      },
    }),
    [initialStateMock],
  );

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          onClick={() => {
            setRootError('');
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
      <div style={{ height: 600, position: 'relative' }}>
        <DataGridPremium
          apiRef={apiRef}
          columns={columns}
          dataSource={dataSource}
          showToolbar
          initialState={initialState}
          aggregationFunctions={aggregationFunctions}
          onDataSourceError={(error) => {
            if (error instanceof GridGetRowsError) {
              if (!error.params.groupKeys || error.params.groupKeys.length === 0) {
                setRootError(error.message);
              } else {
                setChildrenError(
                  `${error.message} (Requested level: ${error.params.groupKeys.join(' > ')})`,
                );
              }
            }
          }}
          dataSourceCache={null}
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

function getBorderColor(theme) {
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

function ErrorOverlay({ error }) {
  if (!error) {
    return null;
  }
  return <StyledDiv>{error}</StyledDiv>;
}
