import * as React from 'react';
import {
  DataGridPremium,
  Unstable_GridToolbarPromptControl as GridToolbarPromptControl,
  GridToolbar,
} from '@mui/x-data-grid-premium';
import { mockPromptResolver, useDemoData } from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

function ToolbarWithPromptInput() {
  return (
    <Stack gap={0.5} sx={{ px: 0.5 }}>
      <GridToolbar />
      <Box sx={{ px: 0.5 }}>
        <GridToolbarPromptControl onPrompt={mockPromptResolver} allowDataSampling />
      </Box>
    </Stack>
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
      />
    </div>
  );
}
