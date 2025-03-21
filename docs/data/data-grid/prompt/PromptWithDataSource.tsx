import * as React from 'react';
import {
  DataGridPremium,
  Unstable_GridToolbarPromptControl as GridToolbarPromptControl,
  Toolbar,
  ToolbarButton,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  GridDataSource,
} from '@mui/x-data-grid-premium';
import { mockPromptResolver, useMockServer } from '@mui/x-data-grid-generator';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import Box from '@mui/material/Box';

const VISIBLE_FIELDS = [
  'name',
  'email',
  'position',
  'company',
  'salary',
  'phone',
  'country',
  'dateCreated',
  'isAdmin',
];

function ToolbarWithPromptInput() {
  return (
    <Toolbar
      render={
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            p: 0.5,
          }}
        />
      }
    >
      <Box sx={{ display: 'flex', gap: 0.25 }}>
        <Tooltip title="Columns">
          <ColumnsPanelTrigger render={<ToolbarButton />}>
            <ViewColumnIcon fontSize="small" />
          </ColumnsPanelTrigger>
        </Tooltip>

        <Tooltip title="Filters">
          <FilterPanelTrigger
            render={(props, state) => (
              <ToolbarButton {...props} color="default">
                <Badge
                  badgeContent={state.filterCount}
                  color="primary"
                  variant="dot"
                >
                  <FilterListIcon fontSize="small" />
                </Badge>
              </ToolbarButton>
            )}
          />
        </Tooltip>
      </Box>
      <GridToolbarPromptControl onPrompt={mockPromptResolver} allowDataSampling />
    </Toolbar>
  );
}

export default function PromptWithDataSource() {
  const { columns, initialState, fetchRows } = useMockServer(
    { dataSet: 'Employee', visibleFields: VISIBLE_FIELDS, maxColumns: 16 },
    { useCursorPagination: false },
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
    }),
    [fetchRows],
  );

  const initialStateWithPagination = React.useMemo(
    () => ({
      ...initialState,
      pagination: {
        paginationModel: { pageSize: 10, page: 0 },
        rowCount: 0,
      },
    }),
    [initialState],
  );

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPremium
        columns={columns}
        dataSource={dataSource}
        pagination
        initialState={initialStateWithPagination}
        pageSizeOptions={[10, 20, 50]}
        slots={{
          toolbar: ToolbarWithPromptInput,
        }}
        showToolbar
      />
    </div>
  );
}
