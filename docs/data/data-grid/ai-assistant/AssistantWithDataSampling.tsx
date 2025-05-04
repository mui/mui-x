import * as React from 'react';
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

function processPrompt(prompt: string, context: string, conversationId?: string) {
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
        }}
      />
    </div>
  );
}
