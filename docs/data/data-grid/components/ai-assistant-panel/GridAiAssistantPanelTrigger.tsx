import * as React from 'react';
import {
  DataGridPremium,
  Toolbar,
  ToolbarButton,
  AiAssistantPanelTrigger,
} from '@mui/x-data-grid-premium';
import { mockPromptResolver, useDemoData } from '@mui/x-data-grid-generator';
import Tooltip from '@mui/material/Tooltip';
import AssistantIcon from '@mui/icons-material/Assistant';

function CustomToolbar() {
  return (
    <Toolbar>
      <Tooltip title="AI Assistant">
        <AiAssistantPanelTrigger render={<ToolbarButton />}>
          <AssistantIcon fontSize="small" />
        </AiAssistantPanelTrigger>
      </Tooltip>
    </Toolbar>
  );
}

export default function GridAiAssistantPanelTrigger() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        loading={loading}
        slots={{ toolbar: CustomToolbar }}
        enableAiAssistant
        onPrompt={mockPromptResolver}
        showToolbar
      />
    </div>
  );
}
