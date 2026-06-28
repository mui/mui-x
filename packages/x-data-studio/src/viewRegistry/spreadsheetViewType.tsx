'use client';
import * as React from 'react';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { createSvgIcon } from '@mui/material/utils';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
  type GridRowId,
  type GridRowModel,
  type GridValidRowModel,
} from '@mui/x-data-grid';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { styled } from '../internals/zero-styled';
import type { DataStudioViewRenderProps, DataStudioViewType } from './types';

const DEFAULT_COLUMN_COUNT = 8;
const DEFAULT_ROW_COUNT = 10;
const DEFAULT_COLUMN_WIDTH = 100;
const ROW_HEADER_FIELD = '__row_header__';
const ROW_HEADER_WIDTH = 56;
const ROW_HEADER_CLASS = 'DataStudioSpreadsheet-rowHeader';
// Persistent, color-independent markers for the active row/column that Delete
// targets — they survive focus leaving the grid for the toolbar.
const ACTIVE_ROW_CLASS = 'DataStudioSpreadsheet-activeRow';
const ACTIVE_COLUMN_CLASS = 'DataStudioSpreadsheet-activeColumn';

const AddIcon = createSvgIcon(<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z" />, 'Add');
const RemoveIcon = createSvgIcon(<path d="M19 13H5v-2h14z" />, 'Remove');

const SpreadsheetRoot = styled('div')(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  // Spreadsheet look: ruled cells (vertical + horizontal borders) and a tinted,
  // centered row-number gutter as the first column.
  [`& .${ROW_HEADER_CLASS}`]: {
    backgroundColor: (theme.vars || theme).palette.action.hover,
    color: (theme.vars || theme).palette.text.secondary,
    fontSize: '0.75rem',
    fontWeight: 500,
    fontVariantNumeric: 'tabular-nums',
    justifyContent: 'center',
    // Stronger structural rule than the interior gridlines so the gutter frame
    // outranks the field. `borderInlineEnd` keeps the rule on the inline edge in RTL.
    borderInlineEnd: `1px solid ${(theme.vars || theme).palette.divider}`,
  },
  // Header band sits one luminance step above the gutter so it reads as a fixed
  // frame, not part of the data field.
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: (theme.vars || theme).palette.action.selected,
  },
  // The column letters and the row-number gutter read as one coordinate label
  // register: 0.75rem / 500 / text.secondary / centered / tabular-nums.
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: 500,
    fontSize: '0.75rem',
    letterSpacing: '0.02em',
    color: (theme.vars || theme).palette.text.secondary,
    fontVariantNumeric: 'tabular-nums',
  },
  // Extend the header tint across the auto-fill filler so the header band runs
  // edge-to-edge instead of dying after the last column into a white phantom.
  '& .MuiDataGrid-filler, & .MuiDataGrid-scrollbarFiller': {
    backgroundColor: (theme.vars || theme).palette.action.hover,
  },
  // Editable cells: signal interactivity with a cell cursor + a faint hover wash
  // before the user double-clicks to edit.
  '& .MuiDataGrid-cell': {
    cursor: 'cell',
  },
  '& .MuiDataGrid-cell:hover': {
    backgroundColor: theme.alpha((theme.vars || theme).palette.primary.main, 0.04),
  },
  // Classic spreadsheet active-cell box: a 2px inset primary ring instead of the
  // default thin focus outline.
  '& .MuiDataGrid-cell:focus-within': {
    outline: 'none',
    boxShadow: `inset 0 0 0 2px ${(theme.vars || theme).palette.primary.main}`,
  },
  // Selection reads as a chromatic primary wash, distinct from all the neutral
  // grey chrome, rather than a grey-on-grey row.
  '& .MuiDataGrid-row.Mui-selected, & .MuiDataGrid-cell.Mui-selected': {
    backgroundColor: theme.alpha((theme.vars || theme).palette.primary.main, 0.08),
  },
  // Persistent active-row / active-column edge so the user can see what Delete
  // will destroy even after focus moves to the toolbar. A 2px primary edge +
  // faint wash is a non-color-dependent target indicator (the edge carries it).
  [`& .${ACTIVE_ROW_CLASS}`]: {
    backgroundColor: theme.alpha((theme.vars || theme).palette.primary.main, 0.06),
    boxShadow: `inset 0 2px 0 0 ${(theme.vars || theme).palette.primary.main}`,
  },
  [`& .${ACTIVE_COLUMN_CLASS}`]: {
    backgroundColor: theme.alpha((theme.vars || theme).palette.primary.main, 0.06),
    boxShadow: `inset 2px 0 0 0 ${(theme.vars || theme).palette.primary.main}`,
  },
}));

const SpreadsheetToolbar = styled('div')(({ theme }) => ({
  flex: '0 0 auto',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0.75, 1),
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
  backgroundColor: (theme.vars || theme).palette.background.paper,
}));

const SpreadsheetActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.8125rem',
  minWidth: theme.spacing(11),
  // Right-size the +/- glyph to the 0.8125rem label instead of the default 24px.
  '& .MuiButton-startIcon > svg': {
    fontSize: '1.125rem',
  },
}));

const SpreadsheetGridWrap = styled('div')({
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  display: 'flex',
});

const SPREADSHEET_GRID_PROPS = {
  hideFooter: true,
  showToolbar: false,
  disableColumnFilter: true,
  disableColumnMenu: true,
  disableColumnSelector: true,
  disableDensitySelector: true,
  disableColumnSorting: true,
  disableRowSelectionOnClick: true,
  disableVirtualization: false,
  // Ruled cells, like a spreadsheet.
  showCellVerticalBorder: true,
  showColumnVerticalBorder: true,
  columnHeaderHeight: 32,
  // Tight, even vertical cadence (~1.125 ratio to the 32px header) so the gutter
  // numeral sits in a proportioned box instead of the loose 52px default.
  rowHeight: 36,
  // No row-selection model — the spreadsheet treats the grid as a 2D canvas,
  // not a database. (On premium, cell selection is enabled instead, below.)
  rowSelection: false,
} as const;

/**
 * Excel/Sheets-style column name for a 0-based index: A, B, …, Z, AA, AB, ….
 */
function columnName(index: number): string {
  let n = index;
  let name = '';
  do {
    name = String.fromCharCode(65 + (n % 26)) + name;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return name;
}

function buildColumn(field: string): GridColDef {
  return {
    field,
    headerName: field,
    width: DEFAULT_COLUMN_WIDTH,
    editable: true,
    sortable: false,
    filterable: false,
    hideable: false,
    resizable: true,
    headerAlign: 'center',
  };
}

/**
 * Build the default column set for a fresh spreadsheet: lettered headers
 * (A, B, C, …, H).
 */
function buildDefaultColumns(count: number): GridColDef[] {
  return Array.from({ length: count }, (_, i) => buildColumn(columnName(i)));
}

/**
 * Build the default empty row set. The id is a sequence; rows are otherwise
 * empty objects so the grid renders blank cells.
 */
function buildDefaultRows(count: number): GridRowModel[] {
  return Array.from({ length: count }, (_, i) => ({ id: i + 1 }));
}

/**
 * The row-number gutter (1, 2, 3, …) shown as a non-editable first column, like
 * a spreadsheet's row headers. Built at render time and prepended to the user's
 * columns; it is not persisted into the Sheet's `params.columns`.
 */
const VISUALLY_HIDDEN: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

const ROW_HEADER_COLUMN: GridColDef = {
  field: ROW_HEADER_FIELD,
  headerName: '',
  // Keep the header visually empty but give the column a non-anonymous
  // accessible name so the header row is not nameless to assistive tech.
  renderHeader: () => <span style={VISUALLY_HIDDEN}>Row number</span>,
  width: ROW_HEADER_WIDTH,
  minWidth: ROW_HEADER_WIDTH,
  editable: false,
  sortable: false,
  filterable: false,
  hideable: false,
  resizable: false,
  disableColumnMenu: true,
  disableReorder: true,
  align: 'center',
  headerAlign: 'center',
  cellClassName: ROW_HEADER_CLASS,
  headerClassName: ROW_HEADER_CLASS,
  renderCell: (renderParams) => {
    const index = renderParams.api.getRowIndexRelativeToVisibleRows?.(renderParams.id);
    return typeof index === 'number' ? index + 1 : '';
  },
};

export interface SpreadsheetViewParams {
  /**
   * Column definitions. Falls back to A–H when absent.
   */
  columns?: GridColDef[];
  /**
   * Row data. Falls back to 10 empty rows when absent. Each row must have a
   * stable `id`.
   */
  rows?: GridRowModel[];
}

/**
 * Resolve the rendered columns / rows from the sheet's params, applying the
 * default lettered-column / empty-row spreadsheet shape when fields are absent.
 */
function resolveSpreadsheet(params: SpreadsheetViewParams) {
  const columns =
    params.columns?.length ? params.columns : buildDefaultColumns(DEFAULT_COLUMN_COUNT);
  const rows = params.rows ?? buildDefaultRows(DEFAULT_ROW_COUNT);
  return { columns, rows };
}

function SpreadsheetView(props: DataStudioViewRenderProps<SpreadsheetViewParams>) {
  const { params, setParams, plan, apiRef } = props;
  const { columns, rows } = resolveSpreadsheet(params);

  // On premium, render DataGridPremium with cell selection so the spreadsheet
  // gets range selection + clipboard copy/paste — the things that make a grid
  // feel like a spreadsheet. Other plans get the editable community grid.
  const isPremium = plan === 'premium';
  const GridComponent = (isPremium ? DataGridPremium : DataGrid) as typeof DataGrid;

  // Materialize defaults into params on edit so the Sheet's persisted shape
  // always reflects what the user sees.
  const handleProcessRowUpdate = React.useCallback(
    (newRow: GridValidRowModel) => {
      const nextRows = rows.map((row) => (row.id === newRow.id ? newRow : row));
      setParams({ columns, rows: nextRows });
      return newRow;
    },
    [columns, rows, setParams],
  );

  const handleAddRow = React.useCallback(() => {
    const maxId = rows.reduce((max, row) => {
      const id = typeof row.id === 'number' ? row.id : Number(row.id);
      return Number.isFinite(id) && id > max ? id : max;
    }, 0);
    setParams({ columns, rows: [...rows, { id: maxId + 1 }] });
  }, [columns, rows, setParams]);

  const handleAddColumn = React.useCallback(() => {
    setParams({ columns: [...columns, buildColumn(columnName(columns.length))], rows });
  }, [columns, rows, setParams]);

  // Track the last-clicked cell so Delete row / Delete column know what to
  // remove (a spreadsheet deletes the row/column you're on).
  const [activeCell, setActiveCell] = React.useState<{ id: GridRowId; field: string } | null>(
    null,
  );
  const handleCellClick = React.useCallback((cell: GridCellParams) => {
    if (cell.field !== ROW_HEADER_FIELD) {
      setActiveCell({ id: cell.id, field: cell.field });
    }
  }, []);

  const canDeleteRow = activeCell != null && rows.length > 1;
  const canDeleteColumn =
    activeCell != null && columns.length > 1 && columns.some((c) => c.field === activeCell.field);

  const handleDeleteRow = React.useCallback(() => {
    if (!activeCell || rows.length <= 1) {
      return;
    }
    setParams({ columns, rows: rows.filter((row) => row.id !== activeCell.id) });
    setActiveCell(null);
  }, [activeCell, columns, rows, setParams]);

  const handleDeleteColumn = React.useCallback(() => {
    if (!activeCell || columns.length <= 1) {
      return;
    }
    setParams({ columns: columns.filter((column) => column.field !== activeCell.field), rows });
    setActiveCell(null);
  }, [activeCell, columns, rows, setParams]);

  // Prepend the row-number gutter to the user's columns (not persisted). Apply
  // a persistent active-row / active-column class so Delete's target stays
  // visible after focus leaves the grid.
  const gridColumns = React.useMemo(() => {
    const decorate = (column: GridColDef): GridColDef => ({
      ...column,
      cellClassName: (cellParams) => {
        if (!activeCell) {
          return '';
        }
        const classes: string[] = [];
        if (cellParams.id === activeCell.id) {
          classes.push(ACTIVE_ROW_CLASS);
        }
        if (cellParams.field === activeCell.field) {
          classes.push(ACTIVE_COLUMN_CLASS);
        }
        return classes.join(' ');
      },
    });
    return [ROW_HEADER_COLUMN, ...columns.map(decorate)];
  }, [columns, activeCell]);

  return (
    <SpreadsheetRoot>
      <SpreadsheetToolbar role="toolbar" aria-label="Spreadsheet editing">
        <SpreadsheetActionButton size="small" startIcon={<AddIcon />} onClick={handleAddColumn}>
          Add column
        </SpreadsheetActionButton>
        <SpreadsheetActionButton size="small" startIcon={<AddIcon />} onClick={handleAddRow}>
          Add row
        </SpreadsheetActionButton>
        <Divider orientation="vertical" flexItem aria-hidden sx={{ mx: 1, my: 1 }} />
        <Tooltip title={canDeleteColumn ? '' : 'Select a cell to delete its column'}>
          <span>
            <SpreadsheetActionButton
              size="small"
              color="inherit"
              startIcon={<RemoveIcon />}
              onClick={handleDeleteColumn}
              disabled={!canDeleteColumn}
            >
              Delete column
            </SpreadsheetActionButton>
          </span>
        </Tooltip>
        <Tooltip title={canDeleteRow ? '' : 'Select a cell to delete its row'}>
          <span>
            <SpreadsheetActionButton
              size="small"
              color="inherit"
              startIcon={<RemoveIcon />}
              onClick={handleDeleteRow}
              disabled={!canDeleteRow}
            >
              Delete row
            </SpreadsheetActionButton>
          </span>
        </Tooltip>
      </SpreadsheetToolbar>
      <SpreadsheetGridWrap>
        <GridComponent
          {...SPREADSHEET_GRID_PROPS}
          {...(isPremium ? { cellSelection: true } : {})}
          // Share DataStudio's apiRef so the menu bar / toolbar act on this
          // spreadsheet (File → Download, View → Density, …).
          apiRef={apiRef as any}
          columns={gridColumns}
          rows={rows}
          processRowUpdate={handleProcessRowUpdate}
          onCellClick={handleCellClick}
        />
      </SpreadsheetGridWrap>
    </SpreadsheetRoot>
  );
}

/**
 * Built-in `'spreadsheet'` view type — a free-form editable grid with lettered
 * columns (A–H by default), a row-number gutter, ruled cells, and Add row / Add
 * column actions. On `plan="premium"` it uses DataGridPremium for cell-range
 * selection + clipboard copy/paste.
 *
 * Register via `<DataStudio viewTypes={[spreadsheetViewType]} />` and pair with
 * `spreadsheetTemplate` to wire the Composer's "Spreadsheet" card.
 */
export const spreadsheetViewType: DataStudioViewType<SpreadsheetViewParams> = {
  type: 'spreadsheet',
  defaultLabel: 'Spreadsheet',
  // Renders a Data Grid bound to the shared apiRef, so the menu bar
  // (File → Download, View → Density, …) acts on the spreadsheet.
  gridBacked: true,
  // The spreadsheet ships its own "+ Column / + Row" toolbar and has no
  // sort/filter/pivot, so hide the database-style Data Studio toolbar.
  ownsToolbar: true,
  paramsSchema: {
    type: 'object',
    properties: {
      columns: {
        type: 'array',
        description: 'GridColDef-shaped column definitions. Defaults to A–H.',
      },
      rows: {
        type: 'array',
        description: 'Row data. Each row needs a stable `id`.',
      },
    },
  },
  Component: SpreadsheetView,
};
