import * as React from 'react';
import useId from '@mui/utils/useId';
import {
  DataGridPremium,
  GridSlotProps,
  useGridApiRef,
  useGridApiContext,
  useGridRootProps,
  Toolbar,
  ToolbarButton,
  ExportCsv,
  ExportPrint,
  ExportExcel,
  GridMenu,
} from '@mui/x-data-grid-premium';
import { GridToolbarDivider } from '@mui/x-data-grid/internals';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import {
  useFormulaSupport,
  FormulaColumnDef,
  FormulaBarProps,
} from './formula-support-utils/useFormulaSupport';
import { FormulaBar } from './formula-support-utils/FormulaBar';
import { rowData } from './formula-support-utils/formulaSupportData';
import { HyperFormulaContext } from './formula-support-utils/formulaSupportContext';

declare module '@mui/x-data-grid-premium' {
  interface ToolbarPropsOverrides {
    formulaBarProps: FormulaBarProps;
    onAddRow: () => void;
    onAddColumn: () => void;
  }
}

const baseColumns: FormulaColumnDef[] = [
  { field: 'name', headerName: 'Name', width: 130, type: 'formula' },
  { field: 'year_1', headerName: 'Year_1', width: 100, type: 'formula' },
  { field: 'year_2', headerName: 'Year_2', width: 100, type: 'formula' },
  { field: 'average', headerName: 'Average', width: 100, type: 'formula' },
  { field: 'sum', headerName: 'Sum', width: 100, type: 'formula' },
];

const buttonSx = {
  backgroundColor: '#F3F3F3',
  border: '1px solid #D4D4D4',
  borderRadius: '4px',
  color: '#333',
  fontFamily: '"Calibri", "Segoe UI", sans-serif',
  fontSize: '12px',
  fontWeight: 500,
  textTransform: 'none',
  px: 2,
  height: '34px',
  '&:hover': {
    backgroundColor: '#E8E8E8',
    borderColor: '#C0C0C0',
  },
};

function CustomToolbar(props: GridSlotProps['toolbar']) {
  const { formulaBarProps, onAddRow, onAddColumn, excelOptions } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const [exportMenuOpen, setExportMenuOpen] = React.useState(false);
  const exportMenuTriggerRef = React.useRef<HTMLButtonElement>(null);
  const exportMenuId = useId();
  const exportMenuTriggerId = useId();

  const closeExportMenu = () => setExportMenuOpen(false);

  return (
    <Toolbar>
      {/* Formula Bar */}
      <Box sx={{ flex: 1, minWidth: 200 }}>
        <FormulaBar {...formulaBarProps} />
      </Box>

      <GridToolbarDivider />

      {/* Add Row/Column Buttons */}
      <rootProps.slots.baseTooltip title="Add Row">
        <ToolbarButton onClick={onAddRow}>
          <PostAddIcon fontSize="small" />
        </ToolbarButton>
      </rootProps.slots.baseTooltip>
      <rootProps.slots.baseTooltip title="Add Column">
        <ToolbarButton onClick={onAddColumn}>
          <PlaylistAddIcon fontSize="small" />
        </ToolbarButton>
      </rootProps.slots.baseTooltip>

      <GridToolbarDivider />

      {/* Export Menu */}
      <rootProps.slots.baseTooltip
        title={apiRef.current.getLocaleText('toolbarExport')}
        disableInteractive={exportMenuOpen}
      >
        <ToolbarButton
          ref={exportMenuTriggerRef}
          id={exportMenuTriggerId}
          aria-controls={exportMenuId}
          aria-haspopup="true"
          aria-expanded={exportMenuOpen ? 'true' : undefined}
          onClick={() => setExportMenuOpen(!exportMenuOpen)}
        >
          <rootProps.slots.exportIcon fontSize="small" />
        </ToolbarButton>
      </rootProps.slots.baseTooltip>

      <GridMenu
        target={exportMenuTriggerRef.current}
        open={exportMenuOpen}
        onClose={closeExportMenu}
        position="bottom-end"
      >
        <rootProps.slots.baseMenuList
          id={exportMenuId}
          aria-labelledby={exportMenuTriggerId}
          autoFocusItem
          {...rootProps.slotProps?.baseMenuList}
        >
          <ExportPrint
            render={
              <rootProps.slots.baseMenuItem {...rootProps.slotProps?.baseMenuItem} />
            }
            onClick={closeExportMenu}
          >
            {apiRef.current.getLocaleText('toolbarExportPrint')}
          </ExportPrint>
          <ExportCsv
            render={
              <rootProps.slots.baseMenuItem {...rootProps.slotProps?.baseMenuItem} />
            }
            onClick={closeExportMenu}
          >
            {apiRef.current.getLocaleText('toolbarExportCSV')}
          </ExportCsv>
          <ExportExcel
            render={
              <rootProps.slots.baseMenuItem {...rootProps.slotProps?.baseMenuItem} />
            }
            options={excelOptions}
            onClick={closeExportMenu}
          >
            {apiRef.current.getLocaleText('toolbarExportExcel')}
          </ExportExcel>
        </rootProps.slots.baseMenuList>
      </GridMenu>
    </Toolbar>
  );
}

export default function ExcelFormulaSupport() {
  const apiRef = useGridApiRef();
  const [columnDialogOpen, setColumnDialogOpen] = React.useState(false);
  const [newFieldName, setNewFieldName] = React.useState('');
  const [newColumnName, setNewColumnName] = React.useState('');
  const [fieldError, setFieldError] = React.useState('');

  const {
    columns,
    rows,
    formulaBarProps,
    hfContextValue,
    addRow,
    addColumn,
    isFieldDuplicate,
  } = useFormulaSupport({
    columns: baseColumns,
    initialData: rowData,
    apiRef,
  });

  const handleOpenColumnDialog = () => {
    setNewFieldName('');
    setNewColumnName('');
    setFieldError('');
    setColumnDialogOpen(true);
  };

  const handleCloseColumnDialog = () => {
    setColumnDialogOpen(false);
    setNewFieldName('');
    setNewColumnName('');
    setFieldError('');
  };

  const validateFieldName = (field: string) => {
    if (field.trim() && isFieldDuplicate(field)) {
      setFieldError('Field name already exists');
      return false;
    }
    setFieldError('');
    return true;
  };

  const handleFieldNameChange = (value: string) => {
    setNewFieldName(value);
    validateFieldName(value);
  };

  const canAddColumn = newFieldName.trim() && newColumnName.trim() && !fieldError;

  const handleAddColumn = () => {
    if (canAddColumn && validateFieldName(newFieldName)) {
      addColumn(newFieldName, newColumnName);
      handleCloseColumnDialog();
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <HyperFormulaContext.Provider value={hfContextValue}>
        <Dialog open={columnDialogOpen} onClose={handleCloseColumnDialog}>
          <DialogTitle sx={{ fontFamily: '"Calibri", "Segoe UI", sans-serif' }}>
            Add Column
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Field Name"
              fullWidth
              variant="outlined"
              value={newFieldName}
              onChange={(event) => handleFieldNameChange(event.target.value)}
              error={!!fieldError}
              helperText={fieldError}
              size="small"
              sx={{
                mt: 1,
                '& .MuiInputBase-root': {
                  fontFamily: '"Calibri", "Segoe UI", sans-serif',
                },
              }}
            />
            <TextField
              margin="dense"
              label="Column Name"
              fullWidth
              variant="outlined"
              value={newColumnName}
              onChange={(event) => setNewColumnName(event.target.value)}
              size="small"
              sx={{
                mt: 1,
                '& .MuiInputBase-root': {
                  fontFamily: '"Calibri", "Segoe UI", sans-serif',
                },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseColumnDialog} sx={buttonSx}>
              Cancel
            </Button>
            <Button
              onClick={handleAddColumn}
              disabled={!canAddColumn}
              sx={{
                ...buttonSx,
                backgroundColor: canAddColumn ? '#4472C4' : '#F3F3F3',
                color: canAddColumn ? '#fff' : '#333',
                '&:hover': {
                  backgroundColor: canAddColumn ? '#3861a8' : '#E8E8E8',
                },
                mr: 0.5,
              }}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>

        <DataGridPremium
          apiRef={apiRef}
          columns={columns}
          rows={rows}
          density="compact"
          tabNavigation="all"
          showColumnVerticalBorder
          showCellVerticalBorder
          disableColumnFilter
          disableColumnMenu
          disableColumnSorting
          hideFooter
          historyStackSize={0}
          showToolbar
          slots={{
            toolbar: CustomToolbar,
          }}
          slotProps={{
            toolbar: {
              formulaBarProps,
              onAddRow: addRow,
              onAddColumn: handleOpenColumnDialog,
              excelOptions: {
                escapeFormulas: false,
              },
            },
          }}
          sx={{
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#F3F3F3',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 600,
            },

            '& .row-number-cell': {
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: '#F3F3F3',
              color: '#000',
              fontWeight: 600,
            },

            '& .MuiDataGrid-cell:focus': {
              outline: '2px solid #4472C4',
              outlineOffset: '-2px',
              backgroundColor: '#D6DCE5',
            },
            '& .MuiDataGrid-cell:focus-within': {
              outline: '2px solid #4472C4',
            },

            '& .Mui-selected, .MuiDataGrid-row:hover': {
              backgroundColor: 'transparent !important',
            },
          }}
        />
      </HyperFormulaContext.Provider>
    </Box>
  );
}
