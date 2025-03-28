import * as React from 'react';
import {
  Toolbar as ToolbarPrimitive,
  ToolbarButton,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
} from '@mui/x-data-grid-premium';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import AssistantIcon from '@mui/icons-material/Assistant';
import { AssistantPanel } from './AssistantPanel';

function Toolbar({ assistantPanelProps }) {
  const [assistantPanelOpen, setAssistantPanelOpen] = React.useState(false);
  const assistantAnchorRef = React.useRef(null);

  return (
    <ToolbarPrimitive aria-labelledby="grid-label">
      <Typography id="grid-label" fontWeight="medium" sx={{ ml: 0.75, mr: 'auto' }}>
        Data Grid with AI Assistant
      </Typography>

      <Tooltip title="Columns">
        <ColumnsPanelTrigger render={<ToolbarButton />}>
          <ViewColumnIcon fontSize="small" />
        </ColumnsPanelTrigger>
      </Tooltip>

      <Tooltip title="Filters">
        <FilterPanelTrigger
          render={(props, state) => (
            <ToolbarButton {...props} color="default">
              <Badge badgeContent={state.filterCount} color="primary" variant="dot">
                <FilterListIcon fontSize="small" />
              </Badge>
            </ToolbarButton>
          )}
        />
      </Tooltip>

      <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />
      <Tooltip title="AI Assistant">
        <ToolbarButton
          ref={assistantAnchorRef}
          onClick={() => setAssistantPanelOpen(true)}
        >
          <AssistantIcon fontSize="small" />
        </ToolbarButton>
      </Tooltip>

      <AssistantPanel
        {...assistantPanelProps}
        open={assistantPanelOpen}
        onClose={() => setAssistantPanelOpen(false)}
        anchorEl={assistantAnchorRef.current}
      />
    </ToolbarPrimitive>
  );
}

export { Toolbar };
