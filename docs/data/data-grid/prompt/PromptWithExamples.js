import * as React from 'react';
import {
  DataGridPremium,
  GridToolbarPromptControl,
  GridToolbar,
  GridToolbarContainer,
} from '@mui/x-data-grid-premium';
import {
  randomBoolean,
  randomCompanyName,
  randomCountry,
  randomCreatedDate,
  randomEmail,
  randomInt,
  randomJobTitle,
  randomPhoneNumber,
  randomTraderName,
  useDemoData,
  useMockServer,
} from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';

function ToolbarWithPromptInput(props) {
  return (
    <GridToolbarContainer sx={{ p: 1 }}>
      <Stack flex={1} gap={1}>
        <GridToolbar />
        <GridToolbarPromptControl onPrompt={props.mockPromptResolver} />
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

function createExamples(column) {
  switch (column) {
    case 'name':
      return Array.from({ length: 5 }, () => randomTraderName());
    case 'email':
      return Array.from({ length: 5 }, () => randomEmail());
    case 'position':
      return Array.from({ length: 5 }, () => randomJobTitle());
    case 'company':
      return Array.from({ length: 5 }, () => randomCompanyName());
    case 'salary':
      return Array.from({ length: 5 }, () => randomInt(30000, 80000));
    case 'phone':
      return Array.from({ length: 5 }, () => randomPhoneNumber());
    case 'country':
      return Array.from({ length: 5 }, () => randomCountry());
    case 'dateCreated':
      return Array.from({ length: 5 }, () => randomCreatedDate());
    case 'isAdmin':
      return Array.from({ length: 5 }, () => randomBoolean());
    default:
      return [];
  }
}

export default function PromptWithExamples() {
  const { mockPromptResolver } = useMockServer();
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 10000,
  });

  const columns = data.columns.map((column) => ({
    ...column,
    examples: createExamples(column.field),
  }));

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPremium
        {...data}
        columns={columns}
        slots={{
          toolbar: ToolbarWithPromptInput,
        }}
        slotProps={{
          toolbar: mockPromptResolver,
        }}
      />
    </div>
  );
}
