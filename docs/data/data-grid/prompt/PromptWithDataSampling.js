import * as React from 'react';
import {
  DataGridPremium,
  FilterPanelTrigger,
  Unstable_GridToolbarPromptControl as GridToolbarPromptControl,
  Toolbar,
  ToolbarButton,
  ColumnsPanelTrigger,
} from '@mui/x-data-grid-premium';
import { mockPromptResolver, useDemoData } from '@mui/x-data-grid-generator';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import Box from '@mui/material/Box';

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

export default function PromptWithDataSampling() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 10000,
  });

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPremium
        {...data}
        slots={{
          toolbar: ToolbarWithPromptInput,
        }}
        showToolbar
      />
    </div>
  );
}
