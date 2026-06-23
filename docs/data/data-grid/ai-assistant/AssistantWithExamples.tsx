import * as React from 'react';
import SvgIcon, { type SvgIconProps } from '@mui/material/SvgIcon';
import {
  DataGridPremium,
  GridAiAssistantPanel,
  GridPreferencePanelsValue,
  unstable_gridDefaultPromptResolver as promptResolver,
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
} from '@mui/x-data-grid-generator';

function createExamples(column: string) {
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

function processPrompt(prompt: string, context: string, conversationId?: string) {
  return promptResolver(
    'https://backend.mui.com/api/datagrid/prompt',
    prompt,
    context,
    conversationId,
  );
}

const VISIBLE_FIELDS = [
  'id',
  'avatar',
  'name',
  'website',
  'rating',
  'email',
  'phone',
  'username',
  'position',
  'company',
  'salary',
  'country',
  'city',
  'lastUpdated',
  'dateCreated',
  'isAdmin',
];

function BlueAiAssistantIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} color="primary">
      <path d="M19 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-5.12 10.88L12 17l-1.88-4.12L6 11l4.12-1.88L12 5l1.88 4.12L18 11z" />
    </SvgIcon>
  );
}

export default function AssistantWithExamples() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 1000,
  });

  const columns = React.useMemo(
    () =>
      data.columns.map((column) => ({
        ...column,
        examples: createExamples(column.field),
      })),
    [data.columns],
  );

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPremium
        {...data}
        columns={columns}
        initialState={{
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.aiAssistant,
          },
        }}
        aiAssistantSuggestions={[
          { value: 'Sort by name' },
          { value: 'Show people from the EU' },
          { value: 'Sort by company name and employee name' },
          { value: 'Order companies by amount of people' },
        ]}
        aiAssistant
        onPrompt={processPrompt}
        showToolbar
        slots={{
          aiAssistantPanel: GridAiAssistantPanel,
          aiAssistantIcon: BlueAiAssistantIcon,
        }}
        slotProps={{
          baseTextField: {
            material: {
              autoFocus: false,
            },
          },
        }}
      />
    </div>
  );
}
