'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { getDataGridUtilityClass, useGridEvent } from '@mui/x-data-grid-pro';
import type { GridEventListener } from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import type { RefObject } from '@mui/x-internals/types';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import type { GridPrivateApiPremium } from '../../models/gridApiPremium';
import { GridSidebarValue } from '../../hooks/features/sidebar/gridSidebarInterfaces';
import { gridComputedColumnDefinitionSelector } from '../../hooks/features/computedColumns/gridComputedColumnsSelectors';
import {
  registerFormulaFocusSafeElement,
  unregisterFormulaFocusSafeElement,
} from '../../hooks/features/formula/gridFormulaBarElements';
import { GridComputedColumnsPanelHeader } from './GridComputedColumnsPanelHeader';
import { GridComputedColumnsPanelEditor } from './GridComputedColumnsPanelEditor';
import type { GridComputedColumnsPanelEditorSession } from './GridComputedColumnsPanelEditor';

type OwnerState = DataGridPremiumProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['computedColumnsPanel'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridComputedColumnsPanelRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ComputedColumnsPanel',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
});

interface EditorSessionState extends GridComputedColumnsPanelEditorSession {
  /**
   * Bumped for every request: a new request remounts the editor with a fresh draft.
   */
  key: number;
}

/**
 * Reads and clears the request left by `showComputedColumnEditor()`. Without a
 * request (the sidebar opened through `showSidebar()`), the editor opens on a
 * new column.
 */
function consumeEditorRequest(
  apiRef: RefObject<GridPrivateApiPremium>,
  key: number,
): EditorSessionState {
  const request = apiRef.current.caches.computedColumns.editorRequest;
  apiRef.current.caches.computedColumns.editorRequest = null;
  const definition =
    request?.field == null ? null : gridComputedColumnDefinitionSelector(apiRef, request.field);
  return {
    key,
    definition,
    sampleRowId: request?.sampleRowId,
    columnIndex: request?.columnIndex,
  };
}

/**
 * The computed columns side panel, rendered by the formula feature for
 * `GridSidebarValue.ComputedColumns`. The editor view creates or edits one
 * computed column; the list view lands with a later iteration, so opening the
 * panel without a request starts a new column.
 */
function GridComputedColumnsPanel() {
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);
  const titleId = React.useId();

  const [session, setSession] = React.useState<EditorSessionState>(() =>
    consumeEditorRequest(apiRef, 0),
  );

  // `showSidebar()` publishes `sidebarOpen` on every call, including when the
  // panel is already open: that is how a new request reaches a mounted panel.
  const handleSidebarOpen = React.useCallback<GridEventListener<'sidebarOpen'>>(
    ({ value }) => {
      if (value === GridSidebarValue.ComputedColumns) {
        setSession((prev) => consumeEditorRequest(apiRef, prev.key + 1));
      }
    },
    [apiRef],
  );
  useGridEvent(apiRef, 'sidebarOpen', handleSidebarOpen);

  // Interactions inside the panel must not clear the grid's cell focus — the
  // registry the formula bar uses (see `gridFormulaBarElements`).
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const handleRootRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (rootRef.current) {
        unregisterFormulaFocusSafeElement(apiRef, rootRef.current);
      }
      rootRef.current = node;
      if (node) {
        registerFormulaFocusSafeElement(apiRef, node);
      }
    },
    [apiRef],
  );

  const handleClose = React.useCallback(() => {
    apiRef.current.hideComputedColumnEditor();
  }, [apiRef]);

  const title = apiRef.current.getLocaleText(
    session.definition === null ? 'computedColumnEditorNewTitle' : 'computedColumnEditorEditTitle',
  );

  return (
    <GridComputedColumnsPanelRoot
      ref={handleRootRef}
      ownerState={rootProps}
      className={classes.root}
      aria-labelledby={titleId}
    >
      <GridComputedColumnsPanelHeader title={title} titleId={titleId} onClose={handleClose} />
      <GridComputedColumnsPanelEditor key={session.key} session={session} onDone={handleClose} />
    </GridComputedColumnsPanelRoot>
  );
}

export { GridComputedColumnsPanel };
