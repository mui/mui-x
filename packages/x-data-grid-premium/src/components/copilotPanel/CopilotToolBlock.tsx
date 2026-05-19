'use client';
import * as React from 'react';
import { styled } from '@mui/system';
import { vars } from '@mui/x-data-grid-pro/internals';
import { CopilotAppliedChanges } from './CopilotAppliedChanges';

interface CopilotToolBlockOwnerState {
  messageId: string;
  toolName: string;
  state: string;
  role: string;
  pendingApproval: boolean;
}

interface CopilotToolBlockProps {
  className?: string;
  ownerState?: CopilotToolBlockOwnerState;
}

const CopilotToolBlockRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotToolBlock',
})({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginTop: vars.spacing(0.5),
  marginBottom: vars.spacing(0.5),
});

function CopilotToolBlock(props: CopilotToolBlockProps) {
  const { ownerState, className } = props;
  const messageId = ownerState?.messageId;
  if (!messageId) {
    return null;
  }
  return (
    <CopilotToolBlockRoot className={className}>
      <CopilotAppliedChanges messageId={messageId} />
    </CopilotToolBlockRoot>
  );
}

export { CopilotToolBlock };
