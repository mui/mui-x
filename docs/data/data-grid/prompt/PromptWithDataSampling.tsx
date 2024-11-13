import * as React from 'react';
import {
  DataGridPremium,
  GridToolbarPromptControl,
  GridToolbar,
  GridToolbarContainer,
  PromptResponse,
  GridSlots,
} from '@mui/x-data-grid-premium';
import { useDemoData, useMockServer } from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';

interface ToolbarWithPromptInputProps {
  mockPromptResolver: (context: string, query: string) => Promise<PromptResponse>;
}

function ToolbarWithPromptInput(props: ToolbarWithPromptInputProps) {
  return (
    <GridToolbarContainer sx={{ p: 1 }}>
      <Stack flex={1} gap={1}>
        <GridToolbar />
        <GridToolbarPromptControl
          onPrompt={props.mockPromptResolver}
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

export default function PromptWithDataSampling() {
  const { mockPromptResolver } = useMockServer();
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
          toolbar: ToolbarWithPromptInput as GridSlots['toolbar'],
        }}
        slotProps={{
          toolbar: mockPromptResolver,
        }}
      />
    </div>
  );
}
