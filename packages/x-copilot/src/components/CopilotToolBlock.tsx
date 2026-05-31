'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';

export interface CopilotToolBlockOwnerState {
  messageId: string;
  toolName: string;
  state: string;
  role: string;
  pendingApproval: boolean;
}

/**
 * Renders the host-specific "applied changes" view for a tool block. The host
 * supplies this component (grid: `CopilotAppliedChanges`); the generic panel
 * leaves it undefined and renders nothing.
 */
export type CopilotToolBlockAppliedChanges = React.ComponentType<{ messageId: string }>;

export interface CopilotToolBlockProps {
  className?: string;
  ownerState?: CopilotToolBlockOwnerState;
  /**
   * Host-supplied component that renders the applied changes for the message.
   * When omitted, the tool block renders an empty container (no host coupling).
   */
  appliedChanges?: CopilotToolBlockAppliedChanges;
}

const CopilotToolBlockRoot = styled('div', {
  name: 'MuiCopilotToolBlock',
  slot: 'Root',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginTop: theme.spacing(0.5),
  marginBottom: theme.spacing(0.5),
}));

/**
 * Generic tool block wrapper. The host-specific applied-changes renderer is
 * injected via the `appliedChanges` prop rather than imported, keeping this
 * component host-agnostic.
 */
function CopilotToolBlock(props: CopilotToolBlockProps) {
  const { ownerState, className, appliedChanges: AppliedChanges } = props;
  const messageId = ownerState?.messageId;
  if (!messageId) {
    return null;
  }
  return (
    <CopilotToolBlockRoot className={className}>
      {AppliedChanges ? <AppliedChanges messageId={messageId} /> : null}
    </CopilotToolBlockRoot>
  );
}

export { CopilotToolBlock };
