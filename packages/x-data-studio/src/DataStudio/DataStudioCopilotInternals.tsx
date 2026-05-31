'use client';
import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import type { ChatAdapter } from '@mui/x-chat-headless';
import type { CopilotPlugin } from '@mui/x-copilot';
import { createSvgIcon } from '@mui/x-data-grid/internals';
import {
  StudioCopilotPanel,
  StudioCopilotProvider,
  type StudioCopilotPanelProps,
  type StudioGuards,
  useStudioCopilot,
  useStudioCopilotControls,
} from '../copilot';
import type { DataStudioDataSource } from './DataStudio.types';
import type { DataStudioStateApi } from './useDataStudioState';

const CopilotIcon = createSvgIcon(
  // Sparkles-style "AI" icon — generic enough to suit any backend.
  <path d="M12 2 9.5 7.5 4 10l5.5 2.5L12 18l2.5-5.5L20 10l-5.5-2.5L12 2zm6 11-1 2-2 1 2 1 1 2 1-2 2-1-2-1-1-2zM5 14l-1 2-2 1 2 1 1 2 1-2 2-1-2-1-1-2z" />,
  'StudioCopilot',
);

const DrawerContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: 380,
  minWidth: 320,
  maxWidth: '90vw',
});

export interface StudioCopilotDrawerProps {
  open: boolean;
  onClose: () => void;
  Panel: React.ComponentType<StudioCopilotPanelProps>;
  panelProps: StudioCopilotPanelProps;
}

export function StudioCopilotDrawer(props: StudioCopilotDrawerProps) {
  const { open, onClose, Panel, panelProps } = props;
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      slotProps={{
        paper: {
          'aria-label': 'Copilot',
          sx: {
            borderInlineStart: '1px solid',
            borderColor: 'divider',
            boxShadow: 4,
          },
        },
      }}
    >
      <DrawerContainer>
        <Panel {...panelProps} onClose={onClose} />
      </DrawerContainer>
    </Drawer>
  );
}

/**
 * Default toolbar trigger. Reads the Studio copilot controls from context
 * and renders an icon button that opens the drawer.
 */
export function DefaultCopilotTrigger() {
  const { open, setOpen, available } = useStudioCopilotControls();
  if (!available) {
    return null;
  }
  return (
    <Tooltip title="Open Copilot">
      <IconButton
        size="small"
        aria-label="Open Copilot"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <CopilotIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}

export { StudioCopilotPanel };

interface DataStudioCopilotMountProps {
  inner: ChatAdapter;
  stateApi: DataStudioStateApi<any>;
  dataSources: ReadonlyArray<DataStudioDataSource<any>>;
  features?: Partial<StudioGuards>;
  plugins?: ReadonlyArray<CopilotPlugin<any, any>>;
  Panel: React.ComponentType<StudioCopilotPanelProps>;
  children: React.ReactNode;
}

/**
 * Mounts the Copilot stack: invokes `useStudioCopilot`, owns the open/close
 * state, provides `StudioCopilotContext` to descendants (so the toolbar
 * trigger can toggle the drawer), and renders the drawer at the end. Only
 * rendered when `<DataStudio copilotChatAdapter>` is supplied.
 */
export function DataStudioCopilotMount(props: DataStudioCopilotMountProps) {
  const { inner, stateApi, dataSources, features, plugins, Panel, children } = props;
  const [open, setOpen] = React.useState(false);
  const studio = useStudioCopilot({ inner, stateApi, dataSources, features, plugins });
  // The query results map is updated imperatively on the underlying ref —
  // subscribe to results to force a re-read after each turn so panel renderers
  // see the latest cache.
  const [resultsTick, setResultsTick] = React.useState(0);
  React.useEffect(
    () =>
      studio.subscribeResults(() => {
        setResultsTick((tick) => tick + 1);
      }),
    [studio],
  );
  const queryResults = React.useMemo(
    () => studio.getQueryResults(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [studio, resultsTick],
  );

  const panelProps: StudioCopilotPanelProps = {
    adapter: studio.adapter,
    api: studio.host.api,
    queryResults,
  };

  return (
    <StudioCopilotProvider open={open} setOpen={setOpen} available>
      {children}
      <StudioCopilotDrawer
        open={open}
        onClose={() => setOpen(false)}
        Panel={Panel}
        panelProps={panelProps}
      />
    </StudioCopilotProvider>
  );
}

interface DataStudioCopilotShellProps {
  inner?: ChatAdapter;
  stateApi: DataStudioStateApi<any>;
  dataSources: ReadonlyArray<DataStudioDataSource<any>>;
  features?: Partial<StudioGuards>;
  plugins?: ReadonlyArray<CopilotPlugin<any, any>>;
  Panel: React.ComponentType<StudioCopilotPanelProps>;
  children: React.ReactNode;
}

/**
 * Shell that decides between the mounted Copilot stack and a plain
 * "no copilot" provider. Keeps `useStudioCopilot` out of the parent's
 * render path so its hooks fire only when the integration is actually on.
 */
export function DataStudioCopilotShell(props: DataStudioCopilotShellProps) {
  const { inner, stateApi, dataSources, features, plugins, Panel, children } = props;
  if (!inner) {
    return (
      <StudioCopilotProvider open={false} setOpen={() => {}} available={false}>
        {children}
      </StudioCopilotProvider>
    );
  }
  return (
    <DataStudioCopilotMount
      inner={inner}
      stateApi={stateApi}
      dataSources={dataSources}
      features={features}
      plugins={plugins}
      Panel={Panel}
    >
      {children}
    </DataStudioCopilotMount>
  );
}
