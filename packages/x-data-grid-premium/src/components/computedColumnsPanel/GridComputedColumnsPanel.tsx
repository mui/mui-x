'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  getDataGridUtilityClass,
  gridFocusCellSelector,
  gridFocusColumnHeaderSelector,
  useGridEvent,
} from '@mui/x-data-grid-pro';
import type { GridEventListener, GridRowId } from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import type { RefObject } from '@mui/x-internals/types';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import type { GridPrivateApiPremium } from '../../models/gridApiPremium';
import { GridSidebarValue } from '../../hooks/features/sidebar/gridSidebarInterfaces';
import { gridSidebarStateSelector } from '../../hooks/features/sidebar/gridSidebarSelector';
import { gridComputedColumnDefinitionSelector } from '../../hooks/features/computedColumns/gridComputedColumnsSelectors';
import {
  registerFormulaFocusSafeElement,
  unregisterFormulaFocusSafeElement,
} from '../../hooks/features/formula/gridFormulaBarElements';
import { GridComputedColumnsPanelHeader } from './GridComputedColumnsPanelHeader';
import { GridComputedColumnsPanelList } from './GridComputedColumnsPanelList';
import { GridComputedColumnsPanelEditor } from './GridComputedColumnsPanelEditor';
import type {
  GridComputedColumnsPanelEditorOutcome,
  GridComputedColumnsPanelEditorSession,
} from './GridComputedColumnsPanelEditor';

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

type PanelView =
  | {
      kind: 'list';
      /**
       * The item to focus when the list shows (the column just applied); `null`
       * focuses the Add button.
       */
      focusField?: string | null;
    }
  | {
      kind: 'editor';
      /**
       * Bumped for every editor session: a new session remounts the editor with a fresh draft.
       */
      key: number;
      session: GridComputedColumnsPanelEditorSession;
      /**
       * Where the session came from: a request (column menu, cell gesture,
       * `showComputedColumnEditor()`) closes the panel when the editor is done, the
       * list takes the editor back to it.
       */
      origin: 'request' | 'list';
    };

/**
 * What to focus when the panel closes: the element that opened it (the
 * toolbar trigger, through the sidebar's `labelId`), else the grid focus at
 * the time it opened (the column header of the menu — `hideColumnMenu` focuses
 * it — or the cell of a gesture).
 */
type PanelOpener =
  | { kind: 'element'; id: string }
  | { kind: 'columnHeader'; field: string }
  | { kind: 'cell'; id: GridRowId; field: string }
  | null;

function captureOpener(apiRef: RefObject<GridPrivateApiPremium>): PanelOpener {
  const { labelId } = gridSidebarStateSelector(apiRef);
  if (labelId) {
    return { kind: 'element', id: labelId };
  }
  const columnHeader = gridFocusColumnHeaderSelector(apiRef);
  if (columnHeader !== null) {
    return { kind: 'columnHeader', field: columnHeader.field };
  }
  const cell = gridFocusCellSelector(apiRef);
  if (cell !== null) {
    return { kind: 'cell', id: cell.id, field: cell.field };
  }
  return null;
}

function focusOpener(apiRef: RefObject<GridPrivateApiPremium>, opener: PanelOpener): void {
  if (opener === null) {
    return;
  }
  const doc = apiRef.current.rootElementRef?.current?.ownerDocument ?? document;
  switch (opener.kind) {
    case 'element':
      doc.getElementById(opener.id)?.focus();
      break;
    case 'columnHeader':
      if (apiRef.current.getColumn(opener.field) !== undefined) {
        apiRef.current.setColumnHeaderFocus(opener.field);
        apiRef.current.getColumnHeaderElement(opener.field)?.focus();
      }
      break;
    case 'cell':
      if (
        apiRef.current.getRow(opener.id) != null &&
        apiRef.current.getColumn(opener.field) !== undefined
      ) {
        apiRef.current.setCellFocus(opener.id, opener.field);
        // The cell's own focus effect yields to the panel (a focus-safe
        // element still holding the focus), so the element is focused directly.
        apiRef.current.getCellElement(opener.id, opener.field)?.focus();
      }
      break;
    default:
      break;
  }
}

/**
 * Reads and clears the request left by `showComputedColumnEditor()`. Without a
 * request (the sidebar opened through `showSidebar()`, e.g. the toolbar
 * trigger), the panel shows the list.
 */
function consumeEditorRequest(apiRef: RefObject<GridPrivateApiPremium>, key: number): PanelView {
  const request = apiRef.current.caches.computedColumns.editorRequest;
  apiRef.current.caches.computedColumns.editorRequest = null;
  if (request === null) {
    return { kind: 'list' };
  }
  const definition =
    request.field == null ? null : gridComputedColumnDefinitionSelector(apiRef, request.field);
  return {
    kind: 'editor',
    key,
    origin: 'request',
    session: {
      definition,
      sampleRowId: request.sampleRowId,
      columnIndex: request.columnIndex,
    },
  };
}

/**
 * The computed columns side panel, rendered by the formula feature for
 * `GridSidebarValue.ComputedColumns`: the list of the stored definitions, and
 * the editor view that creates or edits one of them.
 */
function GridComputedColumnsPanel() {
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);
  const titleId = React.useId();

  const [view, setView] = React.useState<PanelView>(() => consumeEditorRequest(apiRef, 0));
  const editorKeyRef = React.useRef(0);
  const nextEditorKey = () => {
    editorKeyRef.current += 1;
    return editorKeyRef.current;
  };
  const openerRef = React.useRef<PanelOpener>(captureOpener(apiRef));

  // `showSidebar()` publishes `sidebarOpen` on every call, including when the
  // panel is already open: that is how a new request reaches a mounted panel.
  const handleSidebarOpen = React.useCallback<GridEventListener<'sidebarOpen'>>(
    ({ value }) => {
      if (value === GridSidebarValue.ComputedColumns) {
        setView(consumeEditorRequest(apiRef, nextEditorKey()));
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

  const closePanel = React.useCallback(() => {
    focusOpener(apiRef, openerRef.current);
    apiRef.current.hideComputedColumnEditor();
  }, [apiRef]);

  const showList = React.useCallback((focusField?: string | null) => {
    setView({ kind: 'list', focusField });
  }, []);

  const openEditor = React.useCallback(
    (field: string | null) => {
      setView({
        kind: 'editor',
        key: nextEditorKey(),
        origin: 'list',
        session: {
          definition: field === null ? null : gridComputedColumnDefinitionSelector(apiRef, field),
        },
      });
    },
    [apiRef],
  );

  const handleEditorDone = React.useCallback(
    (outcome: GridComputedColumnsPanelEditorOutcome) => {
      if (view.kind !== 'editor') {
        return;
      }
      const appliedField = outcome.type === 'applied' ? outcome.field : null;
      // With a controlled model, the column only exists once the parent echoes the model.
      const appliedColumnExists =
        appliedField !== null && apiRef.current.getColumn(appliedField)?.computed === true;
      if (appliedColumnExists) {
        apiRef.current.scrollToIndexes({ colIndex: apiRef.current.getColumnIndex(appliedField) });
      }
      if (view.origin === 'list') {
        showList(appliedField ?? view.session.definition?.field ?? null);
        return;
      }
      if (appliedColumnExists) {
        apiRef.current.hideComputedColumnEditor();
        apiRef.current.setColumnHeaderFocus(appliedField);
        return;
      }
      closePanel();
    },
    [apiRef, view, showList, closePanel],
  );

  const handleBack = React.useCallback(() => {
    if (view.kind === 'editor') {
      showList(view.session.definition?.field ?? null);
    }
  }, [view, showList]);

  let titleKey:
    'computedColumnsPanelTitle' | 'computedColumnEditorNewTitle' | 'computedColumnEditorEditTitle';
  if (view.kind === 'list') {
    titleKey = 'computedColumnsPanelTitle';
  } else if (view.session.definition === null) {
    titleKey = 'computedColumnEditorNewTitle';
  } else {
    titleKey = 'computedColumnEditorEditTitle';
  }
  const title = apiRef.current.getLocaleText(titleKey);

  return (
    <GridComputedColumnsPanelRoot
      ref={handleRootRef}
      ownerState={rootProps}
      className={classes.root}
      aria-labelledby={titleId}
    >
      <GridComputedColumnsPanelHeader
        title={title}
        titleId={titleId}
        onClose={closePanel}
        onBack={view.kind === 'editor' ? handleBack : undefined}
      />
      {view.kind === 'list' ? (
        <GridComputedColumnsPanelList
          onAdd={() => openEditor(null)}
          onEdit={openEditor}
          focusField={view.focusField}
        />
      ) : (
        <GridComputedColumnsPanelEditor
          key={view.key}
          session={view.session}
          onDone={handleEditorDone}
        />
      )}
    </GridComputedColumnsPanelRoot>
  );
}

export { GridComputedColumnsPanel };
