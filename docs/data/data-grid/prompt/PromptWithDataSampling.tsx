import * as React from 'react';
import {
  DataGridPremium,
  GridToolbarPromptControl,
  GridToolbar,
  GridToolbarContainer,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';

const REMOTE_ENDPOINT =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost'
    : 'https://mui.com/x/api/data-grid';

function ToolbarWithPromptInput() {
  return (
    <GridToolbarContainer sx={{ p: 1 }}>
      <Stack flex={1} gap={1}>
        <GridToolbar />
        <GridToolbarPromptControl
          promptResolverApiUrl={`${REMOTE_ENDPOINT}/api/datagrid/prompt`}
          promptContext="List of employees with their company, position, and salary"
          allowDataSampling
        />
      </Stack>
    </GridToolbarContainer>
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

export default function PromptWithExamples() {
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
