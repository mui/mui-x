import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import GitHubIcon from '@mui/icons-material/GitHub';
import {
  DataGridPremium,
  FormulaBar,
  GRID_FORMULA_FUNCTIONS,
  GridColDef,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import { TEMPLATES, TemplateId, withPlaygroundColumnBehavior } from './playgroundData';
import { PLAYGROUND_FUNCTIONS } from './playgroundFunctions';
import {
  containerSx,
  makeGridSx,
  RefPaletteId,
  SHEETS_HEADER_HEIGHT,
  SHEETS_ROW_HEIGHT,
} from './sheetsStyles';
import { PlaygroundMenuBar, PlaygroundToggles, ExportKind } from './PlaygroundMenuBar';
import { PlaygroundToolbar } from './PlaygroundToolbar';
import { PlaygroundFooter } from './PlaygroundFooter';
import { AddColumnDialog } from './AddColumnDialog';

const GITHUB_URL =
  'https://github.com/mui/mui-x/tree/master/docs/src/modules/components/demos/data-grid/SpreadsheetPlayground';

// The formula bar renders as the grid's toolbar, so it lives inside the grid
// context. Module scope keeps the slot identity stable across re-renders.
function PlaygroundGridToolbar() {
  return <FormulaBar />;
}

const DEFAULT_TOGGLES: PlaygroundToggles = {
  formulasEnabled: true,
  a1Notation: true,
  autocomplete: true,
  formulaBar: true,
  fillHandle: true,
  sorting: false,
  filtering: false,
  customFunctions: false,
  refPalette: 'default',
};

export default function SpreadsheetPlayground() {
  const apiRef = useGridApiRef();
  const [templateId, setTemplateId] = React.useState<TemplateId>('commission');
  const [resetCount, setResetCount] = React.useState(0);
  const [columns, setColumns] = React.useState<GridColDef[]>(TEMPLATES.commission.columns);
  const [toggles, setToggles] = React.useState<PlaygroundToggles>(DEFAULT_TOGGLES);
  const [columnDialogOpen, setColumnDialogOpen] = React.useState(false);
  const [lastEvaluationCount, setLastEvaluationCount] = React.useState<number | null>(null);
  const addedRowsCount = React.useRef(0);

  const template = TEMPLATES[templateId];
  // Remounting on template change or reset is the one sanctioned way to
  // re-supply the seed rows. Everything else must go through the api so
  // user-typed formulas survive.
  const gridKey = `${templateId}-${resetCount}`;

  const pinnedRows = React.useMemo(
    () => ({ top: template.pinnedTop, bottom: template.pinnedBottom }),
    [template],
  );

  const handleTemplateChange = React.useCallback((id: TemplateId) => {
    setTemplateId(id);
    setColumns(TEMPLATES[id].columns);
    setResetCount((count) => count + 1);
  }, []);

  const handleReset = React.useCallback(() => {
    setColumns(TEMPLATES[templateId].columns);
    setToggles(DEFAULT_TOGGLES);
    setLastEvaluationCount(null);
    setResetCount((count) => count + 1);
  }, [templateId]);

  const handleToggle = React.useCallback(
    (key: keyof PlaygroundToggles, value: boolean | RefPaletteId) => {
      setToggles((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleAddRows = React.useCallback(
    (count: number) => {
      const newRows = Array.from({ length: count }, () => {
        addedRowsCount.current += 1;
        return { id: `added-${addedRowsCount.current}` };
      });
      // Appending through the api preserves the formulas users typed into the
      // grid — re-supplying the `rows` prop would wipe them.
      apiRef.current?.updateRows(newRows);
    },
    [apiRef],
  );

  // New columns are appended at the end: inserting one in the middle would
  // re-letter the columns to its right and shift what positional ranges cover.
  const handleAddColumn = React.useCallback((column: GridColDef) => {
    setColumns((prev) => [...prev, withPlaygroundColumnBehavior(column)]);
  }, []);

  const handleOpenFilterPanel = React.useCallback(() => {
    apiRef.current?.showFilterPanel();
  }, [apiRef]);

  const handleExport = React.useCallback(
    (kind: ExportKind) => {
      const api = apiRef.current;
      if (!api) {
        return;
      }
      switch (kind) {
        case 'excel-live':
          api.exportDataAsExcel({ escapeFormulas: false });
          break;
        case 'excel-values':
          api.exportDataAsExcel();
          break;
        case 'csv':
          api.exportDataAsCsv();
          break;
        case 'print':
          api.exportDataAsPrint();
          break;
        default:
          break;
      }
    },
    [apiRef],
  );

  const handleUndo = React.useCallback(() => {
    apiRef.current?.history.undo();
  }, [apiRef]);

  const handleRedo = React.useCallback(() => {
    apiRef.current?.history.redo();
  }, [apiRef]);

  // Surface the evaluation event in the footer. Re-subscribes after each
  // keyed remount (the api re-initializes with the new grid instance).
  React.useEffect(() => {
    const api = apiRef.current;
    if (!api) {
      return undefined;
    }
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const unsubscribe = api.subscribeEvent('formulaEvaluated', ({ changedCells }) => {
      setLastEvaluationCount(changedCells.length);
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => setLastEvaluationCount(null), 4000);
    });
    return () => {
      unsubscribe();
      if (timeout !== null) {
        clearTimeout(timeout);
      }
    };
  }, [apiRef, gridKey]);

  const gridSx = React.useMemo(() => makeGridSx(toggles.refPalette), [toggles.refPalette]);

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" sx={{ mb: 1, justifyContent: 'flex-end' }}>
        <Button
          size="small"
          startIcon={<GitHubIcon />}
          sx={{ textTransform: 'none' }}
          href={GITHUB_URL}
        >
          See on GitHub
        </Button>
      </Stack>
      <Box sx={containerSx}>
        <PlaygroundMenuBar
          templateId={templateId}
          toggles={toggles}
          onTemplateChange={handleTemplateChange}
          onToggle={handleToggle}
          onAddRows={handleAddRows}
          onAddColumn={() => setColumnDialogOpen(true)}
          onOpenFilterPanel={handleOpenFilterPanel}
          onReset={handleReset}
          onExport={handleExport}
        />
        <PlaygroundToolbar
          onUndo={handleUndo}
          onRedo={handleRedo}
          onAddRows={handleAddRows}
          onAddColumn={() => setColumnDialogOpen(true)}
          onExportExcel={() => handleExport('excel-live')}
        />
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <DataGridPremium
            key={gridKey}
            apiRef={apiRef}
            rows={template.rows}
            columns={columns}
            pinnedRows={pinnedRows}
            formulaA1Notation={toggles.a1Notation}
            disableFormulas={!toggles.formulasEnabled}
            disableFormulaAutocomplete={!toggles.autocomplete}
            formulaFunctions={
              toggles.customFunctions ? PLAYGROUND_FUNCTIONS : GRID_FORMULA_FUNCTIONS
            }
            cellSelection
            cellSelectionFillHandle={toggles.fillHandle}
            showToolbar={toggles.formulaBar}
            slots={{ toolbar: PlaygroundGridToolbar }}
            rowSelection={false}
            rowHeight={SHEETS_ROW_HEIGHT}
            columnHeaderHeight={SHEETS_HEADER_HEIGHT}
            showCellVerticalBorder
            showColumnVerticalBorder
            disableColumnMenu
            disableColumnFilter={!toggles.filtering}
            disableColumnReorder
            disableColumnSorting={!toggles.sorting}
            disablePivoting
            hideFooter
            sx={gridSx}
          />
        </Box>
        <PlaygroundFooter
          sheetName={template.sheetName}
          lastEvaluationCount={lastEvaluationCount}
          onAddRows={handleAddRows}
        />
      </Box>
      <AddColumnDialog
        open={columnDialogOpen}
        existingFields={columns.map((column) => column.field)}
        onClose={() => setColumnDialogOpen(false)}
        onAdd={handleAddColumn}
      />
    </Box>
  );
}
