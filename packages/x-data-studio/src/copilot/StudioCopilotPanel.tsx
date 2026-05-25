'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ChatBox, type ChatBoxProps } from '@mui/x-chat';
import { CopilotPluginRenderProvider } from '@mui/x-copilot';
import type { CopilotAdapter } from '@mui/x-copilot/adapter';
import type { StudioCopilotApi } from './studioHostAdapter';
import type { StudioDataQueryResult } from './dataQuery';

export interface StudioCopilotPanelProps
  extends Omit<ChatBoxProps, 'adapter' | 'classes' | 'variant'> {
  /** The Studio copilot adapter returned from `useStudioCopilot`. */
  adapter: CopilotAdapter;
  /** Optional plugin-render API (forwarded to plugins via the render context). */
  api?: StudioCopilotApi | null;
  /** Live query-result cache (forwarded to plugins via the render context). */
  queryResults?: ReadonlyMap<string, StudioDataQueryResult>;
}

const PanelRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  minHeight: 0,
  backgroundColor: (theme.vars ?? theme).palette.background.paper,
  color: (theme.vars ?? theme).palette.text.primary,
  fontFamily: theme.typography.fontFamily,
}));

/**
 * Drawer-friendly Copilot panel for `<DataStudio>`. Wraps `@mui/x-chat`'s
 * `<ChatBox>` and provides the `CopilotPluginRenderProvider` context that
 * PDF + Formula plugin renderers consume.
 *
 * The panel is intentionally minimal — full-fat features (A/B variant tabs,
 * tool blocks, approval cards) live in Grid Premium today and can be ported
 * once `@mui/x-copilot` ships shared building blocks.
 */
export function StudioCopilotPanel(props: StudioCopilotPanelProps) {
  const { adapter, api, queryResults, ...chatBoxProps } = props;

  const renderContext = React.useMemo(
    () => ({
      api: (api ?? null) as unknown,
      queryResults: (queryResults ?? new Map()) as ReadonlyMap<string, unknown>,
    }),
    [api, queryResults],
  );

  return (
    <PanelRoot>
      <CopilotPluginRenderProvider value={renderContext}>
        <ChatBox adapter={adapter} {...chatBoxProps} />
      </CopilotPluginRenderProvider>
    </PanelRoot>
  );
}
