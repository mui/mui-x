'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { vars } from '@mui/x-data-grid-pro/internals';
import { ChatSuggestions, type ChatSuggestionsProps } from '@mui/x-chat';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';

const EmptyStateRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelEmptyState',
})({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: vars.spacing(2),
  boxSizing: 'border-box',
  pointerEvents: 'none',
});

const EmptyStateCenter = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelEmptyStateCenter',
})({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.spacing(1),
  textAlign: 'center',
});

const EmptyStateIconCircle = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelEmptyStateIconCircle',
})({
  width: 64,
  height: 64,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: vars.colors.background.base,
  color: vars.colors.foreground.base,
  marginBottom: vars.spacing(1.5),
});

const EmptyStateTitle = styled('p', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelEmptyStateTitle',
})({
  margin: 0,
  font: vars.typography.font.large,
  fontWeight: vars.typography.fontWeight.medium,
  color: vars.colors.foreground.base,
});

const EmptyStateHelper = styled('p', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelEmptyStateHelper',
})({
  margin: 0,
  maxWidth: 320,
  font: vars.typography.font.body,
  color: vars.colors.foreground.muted,
});

const EmptyStateSuggestions = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelEmptyStateSuggestions',
})({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  pointerEvents: 'auto',
});

function CopilotEmptyState(props: ChatSuggestionsProps) {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();

  return (
    <EmptyStateRoot>
      <EmptyStateCenter>
        <EmptyStateIconCircle>
          <rootProps.slots.promptIcon style={{ width: 28, height: 28 }} fontSize="medium" />
        </EmptyStateIconCircle>
        <EmptyStateTitle>
          {apiRef.current.getLocaleText('copilotPanelEmptyStateTitle')}
        </EmptyStateTitle>
        <EmptyStateHelper>
          {apiRef.current.getLocaleText('copilotPanelEmptyStateHelper')}
        </EmptyStateHelper>
      </EmptyStateCenter>
      <EmptyStateSuggestions>
        <ChatSuggestions {...props} />
      </EmptyStateSuggestions>
    </EmptyStateRoot>
  );
}

export { CopilotEmptyState };
