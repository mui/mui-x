import SvgIcon from '@mui/material/SvgIcon';
import {
  DataGridPremium,
  GridAiAssistantPanel,
  unstable_gridDefaultPromptResolver as promptResolver,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

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

function BlueAiAssistantIcon(props) {
  return (
    <SvgIcon {...props} color="primary">
      <path d="M19 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-5.12 10.88L12 17l-1.88-4.12L6 11l4.12-1.88L12 5l1.88 4.12L18 11z" />
    </SvgIcon>
  );
}

function processPrompt(prompt, context, conversationId) {
  return promptResolver(
    'https://backend.mui.com/api/datagrid/prompt',
    prompt,
    context,
    conversationId,
  );
}

export default function AssistantWithDataSampling() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 1000,
  });

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPremium
        {...data}
        aiAssistantSuggestions={[
          { value: 'Sort by name' },
          { value: 'Show people from the EU' },
          { value: 'Sort by company name and employee name' },
          { value: 'Order companies by amount of people' },
        ]}
        allowAiAssistantDataSampling
        aiAssistant
        onPrompt={processPrompt}
        showToolbar
        slots={{
          aiAssistantPanel: GridAiAssistantPanel,
          aiAssistantIcon: BlueAiAssistantIcon,
        }}
      />
    </div>
  );
}
