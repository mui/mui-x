'use client';
import * as React from 'react';
import { keyframes, styled } from '@mui/material/styles';
import { vars } from '@mui/x-data-grid-pro/internals';
import { useMessage } from '@mui/x-chat-headless';
import type { GridPrivateApiPremium } from '../../models/gridApiPremium';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { findToolPartByCallId } from '../../hooks/features/copilot/plugins/findToolPartByCallId';
import {
  DEFAULT_ROW_LIMIT as DEFAULT_QUERY_ROW_LIMIT,
  previewGridDataQuery,
  type GridDataQueryInput,
  type GridDataQueryPreview,
} from '../../hooks/features/copilot/executor/queryGridData';

interface CopilotDataQueryApprovalOwnerState {
  messageId: string;
  toolName: string;
  toolCallId: string;
  state: string;
}

interface CopilotDataQueryApprovalProps {
  className?: string;
  ownerState?: CopilotDataQueryApprovalOwnerState;
}

const ApprovalRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotDataQueryApproval',
})({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.spacing(0.75),
  padding: vars.spacing(1.25, 1.5),
  marginTop: vars.spacing(0.5),
  marginBottom: vars.spacing(0.5),
  border: `1px solid ${vars.colors.border.base}`,
  borderRadius: vars.spacing(0.5),
  background: vars.colors.background.base,
});

const Heading = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotDataQueryApprovalHeading',
})({
  display: 'flex',
  alignItems: 'center',
  gap: vars.spacing(0.75),
  font: vars.typography.font.body,
  fontWeight: vars.typography.fontWeight.medium,
  color: vars.colors.foreground.base,
});

const Subtitle = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotDataQueryApprovalSubtitle',
})({
  font: vars.typography.font.small,
  color: vars.colors.foreground.muted,
});

const StatusNote = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotDataQueryApprovalStatus',
})({
  font: vars.typography.font.small,
  color: vars.colors.foreground.muted,
  fontStyle: 'italic',
});

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50%      { opacity: 1; }
`;

const PendingPulse = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotDataQueryApprovalPendingPulse',
})({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.spacing(0.5),
  font: vars.typography.font.small,
  color: vars.colors.foreground.muted,
  '&::before': {
    content: '""',
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: vars.colors.foreground.muted,
    animation: `${pulse} 1.4s ease-in-out infinite`,
  },
});

function CopilotDataQueryApproval(props: CopilotDataQueryApprovalProps) {
  const { className, ownerState } = props;
  const messageId = ownerState?.messageId;
  const toolCallId = ownerState?.toolCallId ?? '';
  const apiRef = useGridApiContext();
  const message = useMessage(messageId ?? '');
  const toolPart = findToolPartByCallId(message?.parts, toolCallId);
  const invocation = toolPart?.toolInvocation;
  const input = invocation?.input as GridDataQueryInput | undefined;
  const state = invocation?.state ?? ownerState?.state;

  // queryGridData is auto-executed by the executor (values never leave the
  // browser — only meta + state-binding pointer is forwarded). This card
  // exists purely as a transparency surface telling the user what slice was
  // read from the grid for the report. No buttons.

  const preview = React.useMemo<GridDataQueryPreview | null>(() => {
    if (!input || typeof input !== 'object' || typeof input.mode !== 'string') {
      return null;
    }
    try {
      return previewGridDataQuery(
        input,
        apiRef as unknown as React.RefObject<GridPrivateApiPremium>,
      );
    } catch {
      return null;
    }
  }, [input, apiRef]);

  if (!input || !invocation) {
    return null;
  }

  if (state === 'output-error') {
    return (
      <ApprovalRoot className={className}>
        <Heading>Could not gather data</Heading>
        <StatusNote>{invocation.errorText ?? 'Unknown error'}</StatusNote>
      </ApprovalRoot>
    );
  }

  const totalRows = preview?.rowCount ?? 0;
  const columnCount = preview?.columns.length ?? input.columns?.length ?? 0;
  const filterLabel = input.rowFilter ?? 'visible';
  const isAggregate = input.mode === 'aggregate';
  const aggregationCount = input.aggregations?.length ?? 0;
  const isStreaming = state !== 'output-available' && state !== 'output-error';

  // `limit` only meaningfully truncates in `rows` mode — `aggregate` mode
  // always aggregates over every matching row regardless. When the executor's
  // default kicks in (no explicit `limit`), it caps at `DEFAULT_ROW_LIMIT`
  // (500) — surface that too so the user isn't surprised by a big dataset
  // silently truncating.
  const effectiveLimit = isAggregate ? undefined : (input.limit ?? DEFAULT_QUERY_ROW_LIMIT);
  const sentRows =
    effectiveLimit !== undefined && totalRows > effectiveLimit ? effectiveLimit : totalRows;
  const isLimited = sentRows < totalRows;

  // Heading wording — past-tense fact once complete, present-progressive while
  // the query is still in flight. Keeps the lifecycle scannable (`Computing…`
  // → `Computed N values`) instead of mixing verbs (`Reading…` → `Data shared`).
  let heading: string;
  if (isStreaming) {
    heading = isAggregate ? 'Computing summary stats…' : 'Reading grid data…';
  } else if (isAggregate) {
    heading = `Computed ${aggregationCount.toLocaleString()} value${aggregationCount === 1 ? '' : 's'}`;
  } else {
    heading = `Read ${sentRows.toLocaleString()} row${sentRows === 1 ? '' : 's'}`;
  }

  // Subtitle — concrete shape of what was queried + the privacy reassurance.
  // For aggregate we list how many rows fed the computation; for rows we list
  // sent-vs-total when limited.
  let shapeLine: string;
  if (isAggregate) {
    shapeLine = `across ${totalRows.toLocaleString()} row${totalRows === 1 ? '' : 's'} (${filterLabel})`;
  } else if (isLimited) {
    shapeLine = `${sentRows.toLocaleString()} of ${totalRows.toLocaleString()} rows × ${columnCount.toLocaleString()} column${columnCount === 1 ? '' : 's'} (${filterLabel})`;
  } else {
    shapeLine = `${totalRows.toLocaleString()} row${totalRows === 1 ? '' : 's'} × ${columnCount.toLocaleString()} column${columnCount === 1 ? '' : 's'} (${filterLabel})`;
  }

  return (
    <ApprovalRoot className={className}>
      <Heading>{heading}</Heading>
      <Subtitle>{shapeLine} — values stayed in your browser</Subtitle>
      {isStreaming ? <PendingPulse>Computing…</PendingPulse> : null}
    </ApprovalRoot>
  );
}

export { CopilotDataQueryApproval };
