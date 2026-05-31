'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { createSvgIcon } from '@mui/material/utils';
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
  /** Closes the surrounding drawer; renders the in-panel close affordance when provided. */
  onClose?: () => void;
}

const CopilotIcon = createSvgIcon(
  // Sparkles-style "AI" icon — matches the toolbar trigger.
  <path d="M12 2 9.5 7.5 4 10l5.5 2.5L12 18l2.5-5.5L20 10l-5.5-2.5L12 2zm6 11-1 2-2 1 2 1 1 2 1-2 2-1-2-1-1-2zM5 14l-1 2-2 1 2 1 1 2 1-2 2-1-2-1-1-2z" />,
  'StudioCopilotPanel',
);

const CloseIcon = createSvgIcon(
  <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />,
  'StudioCopilotClose',
);

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

const PanelHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  flexShrink: 0,
  minHeight: 48,
  paddingBlock: theme.spacing(1),
  paddingInline: theme.spacing(2),
  borderBottom: `1px solid ${(theme.vars ?? theme).palette.divider}`,
}));

const PanelHeaderIcon = styled(CopilotIcon)(({ theme }) => ({
  fontSize: '1.25rem',
  color: (theme.vars ?? theme).palette.primary.main,
}));

const PanelHeaderTitle = styled('div')(({ theme }) => ({
  flex: 1,
  ...theme.typography.subtitle1,
  fontWeight: theme.typography.fontWeightMedium,
  color: (theme.vars ?? theme).palette.text.primary,
}));

const PanelCloseButton = styled(IconButton)({
  minWidth: 44,
  minHeight: 44,
});

const PANEL_SUGGESTIONS = [
  'Add a chart view',
  'Switch dataSource to Coffee Beans',
  'Sort revenue descending',
];

const PANEL_LOCALE_TEXT = {
  composerInputPlaceholder: 'Ask Copilot to add a view, switch data source…',
};

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
  const {
    adapter,
    api,
    queryResults,
    onClose,
    suggestions = PANEL_SUGGESTIONS,
    localeText,
    ...chatBoxProps
  } = props;

  const renderContext = React.useMemo(
    () => ({
      api: (api ?? null) as unknown,
      queryResults: (queryResults ?? new Map()) as ReadonlyMap<string, unknown>,
    }),
    [api, queryResults],
  );

  const mergedLocaleText = React.useMemo(
    () => ({ ...PANEL_LOCALE_TEXT, ...localeText }),
    [localeText],
  );

  return (
    <PanelRoot>
      <PanelHeader>
        <PanelHeaderIcon aria-hidden />
        <PanelHeaderTitle>Copilot</PanelHeaderTitle>
        {onClose ? (
          <PanelCloseButton size="small" aria-label="Close Copilot" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </PanelCloseButton>
        ) : null}
      </PanelHeader>
      <CopilotPluginRenderProvider value={renderContext}>
        <ChatBox
          adapter={adapter}
          suggestions={suggestions}
          localeText={mergedLocaleText}
          {...chatBoxProps}
        />
      </CopilotPluginRenderProvider>
    </PanelRoot>
  );
}
