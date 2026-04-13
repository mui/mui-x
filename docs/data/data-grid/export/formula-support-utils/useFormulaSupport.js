import * as React from 'react';
import HyperFormula from 'hyperformula';
import { GridCellEditStopReasons } from '@mui/x-data-grid';
import { useEventCallback } from '@mui/material/utils';
import useOnMount from '@mui/utils/useOnMount';
import { FormulaEditCell } from './FormulaEditCell';
import { TitleWithAlphabet } from './TitleWithAlphabet';

// Row type with HyperFormula reference

const rowNumberColumn = {
  field: 'row_number',
  headerName: '',
  width: 50,
  minWidth: 50,
  maxWidth: 80,
  disableColumnMenu: true,
  sortable: false,
  editable: false,
  disableExport: true,
  cellClassName: 'row-number-cell',
};

const defaultGetRowId = (row) => row.id;

export function useFormulaSupport(options) {
  const {
    columns,
    initialData,
    apiRef,
    getRowId = defaultGetRowId,
    sheetName = 'Sheet1',
  } = options;

  // HyperFormula instance reference
  const hfRef = React.useRef(null);

  // Version counter for reactivity - increments on any HyperFormula change
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Dynamic row count for adding rows
  const [rowCount, setRowCount] = React.useState(initialData.length);

  // Track next row ID to avoid conflicts with existing IDs
  const nextRowIdRef = React.useRef(
    // Find the max ID from initial data and start from there + 1
    initialData.reduce((max, row) => {
      const id = typeof row.id === 'number' ? row.id : 0;
      return Math.max(max, id);
    }, 0) + 1,
  );

  // Dynamic columns for adding columns
  const [dynamicColumns, setDynamicColumns] = React.useState(columns);

  // Cell editing state for formula bar
  const [currentField, setCurrentField] = React.useState('');
  const [currentRow, setCurrentRow] = React.useState(null);
  const [currentFormula, setCurrentFormula] = React.useState('');

  // Derive isFormula from currentFormula (no separate state needed)
  const isFormula = currentFormula.startsWith('=');

  // Track if we're currently editing (to avoid committing during typing)
  const isEditingRef = React.useRef(false);

  // Refs for values needed in event handlers to avoid effect re-subscription
  const editingStateRef = React.useRef({
    field: '',
    row: null,
    formula: '',
  });

  // Get ordered formula columns for consistent array conversion
  const formulaColumns = React.useMemo(
    () => dynamicColumns.filter((col) => col.type === 'formula'),
    [dynamicColumns],
  );

  // Build column field to HyperFormula column index mapping
  const columnFieldMap = React.useMemo(() => {
    const map = new Map();
    formulaColumns.forEach((col, index) => {
      map.set(col.field, index);
    });
    return map;
  }, [formulaColumns]);

  // Convert object rows to 2D array format for HyperFormula
  const dataArray = React.useMemo(
    () => initialData.map((row) => formulaColumns.map((col) => row[col.field])),
    [initialData, formulaColumns],
  );

  // Initialize HyperFormula
  useOnMount(() => {
    const hf = HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' });
    const name = hf.addSheet(sheetName);
    const sheetId = hf.getSheetId(name);

    // Populate with initial data (converted to 2D array format)
    hf.setCellContents({ sheet: sheetId, row: 0, col: 0 }, dataArray);

    hfRef.current = { hf, sheetId };

    // Trigger initial render
    setIsInitialized(true);

    return () => {
      hf.destroy();
    };
  });

  // Map to store IDs for dynamically added rows (rowIndex -> rowId)
  const addedRowIdsRef = React.useRef(new Map());

  // Generate minimal rows - depends on rowCount state for dynamic row additions
  // Rows are stable references; cell values come from valueGetter
  const rows = React.useMemo(() => {
    if (!hfRef.current) {
      return [];
    }

    return Array.from({ length: rowCount }, (_, rowIndex) => {
      const rowData = initialData[rowIndex];
      let rowId;
      if (rowData) {
        // Use getRowId for initial data rows
        rowId = getRowId?.(rowData, rowIndex) ?? rowIndex;
      } else {
        // Use stored ID for dynamically added rows
        rowId = addedRowIdsRef.current.get(rowIndex) ?? rowIndex;
      }
      return {
        id: rowId,
        _hfRowIndex: rowIndex,
        row_number: rowIndex + 1,
      };
    });
    // Regenerate when HF is initialized or rowCount changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, getRowId, rowCount]);

  // Get cell value from HyperFormula - used by valueGetter
  const getCellValue = useEventCallback((hfRowIndex, colIndex) => {
    if (!hfRef.current) {
      return null;
    }
    const { hf, sheetId } = hfRef.current;
    const value = hf.getCellValue({
      sheet: sheetId,
      row: hfRowIndex,
      col: colIndex,
    });

    // Format numbers for display
    // eslint-disable-next-line no-restricted-globals
    if (typeof value === 'number' && !isNaN(value)) {
      return value.toFixed(2);
    }
    return value;
  });

  // Get serialized formula from HyperFormula
  const getCellFormula = useEventCallback((hfRowIndex, colIndex) => {
    if (!hfRef.current) {
      return '';
    }
    const { hf, sheetId } = hfRef.current;
    return (
      hf.getCellSerialized({ sheet: sheetId, row: hfRowIndex, col: colIndex }) ?? ''
    );
  });

  // Transform formula row references to account for Excel header row offset
  // HyperFormula A1 (row 0) -> Excel A2 (row 1 is header)
  const adjustFormulaForExcelHeaders = useEventCallback((cellContent) => {
    // Only transform string formulas (starting with '=')
    if (typeof cellContent !== 'string' || !cellContent.startsWith('=')) {
      return cellContent;
    }
    // Match cell references like A1, $A1, A$1, $A$1, AA123, etc.
    // Captures: optional $, column letters, optional $, row number
    return cellContent.replace(
      /(\$?)([A-Z]+)(\$?)(\d+)/gi,
      (_match, colDollar, col, rowDollar, row) => {
        const newRow = parseInt(row, 10) + 1;
        return `${colDollar}${col}${rowDollar}${newRow}`;
      },
    );
  });

  // Commit cell value to HyperFormula (called when editing ends)
  const commitCellValue = useEventCallback((hfRowIndex, colIndex, value) => {
    if (!hfRef.current) {
      return;
    }
    const { hf, sheetId } = hfRef.current;
    hf.setCellContents({ sheet: sheetId, row: hfRowIndex, col: colIndex }, [
      [value],
    ]);
  });

  // Handle formula changes from edit cell (updates local state only, commits on cellEditStop)
  const handleCellFormulaChange = useEventCallback((newValue) => {
    setCurrentFormula(newValue);
    editingStateRef.current.formula = newValue;
  });

  const handleFormulaBarChange = useEventCallback((newValue) => {
    if (!currentRow || !currentField) {
      return;
    }

    const colIndex = columnFieldMap.get(currentField);
    if (colIndex === undefined) {
      return;
    }

    setCurrentFormula(newValue);
    editingStateRef.current.formula = newValue;

    // Update HyperFormula immediately for formula bar edits
    // eslint-disable-next-line no-underscore-dangle
    commitCellValue(currentRow._hfRowIndex, colIndex, newValue);
  });

  // Subscribe to cell focus and edit events
  React.useEffect(() => {
    if (!apiRef.current) {
      return undefined;
    }

    const handleCellFocusIn = (params) => {
      const { field, row, isEditable } = params;

      if (!isEditable) {
        setCurrentFormula('');
        setCurrentField('');
        setCurrentRow(null);
        editingStateRef.current = { field: '', row: null, formula: '' };
        return;
      }

      const hfRow = row;
      const colIndex = columnFieldMap.get(field);

      if (colIndex === undefined) {
        return;
      }

      // Get formula directly from HyperFormula
      // eslint-disable-next-line no-underscore-dangle
      const formula = getCellFormula(hfRow._hfRowIndex, colIndex);
      const formulaStr = String(formula ?? '');

      setCurrentFormula(formulaStr);
      setCurrentField(field);
      setCurrentRow(hfRow);
      editingStateRef.current = { field, row: hfRow, formula: formulaStr };
    };

    const handleCellEditStart = () => {
      isEditingRef.current = true;
    };

    const handleCellEditStop = (params) => {
      isEditingRef.current = false;

      // Read from ref to get current values without adding to effect dependencies
      const { row, field, formula } = editingStateRef.current;

      // Don't commit if edit was cancelled
      if (params.reason === GridCellEditStopReasons.escapeKeyDown) {
        // Reset formula to original value
        if (row && field) {
          const colIndex = columnFieldMap.get(field);
          if (colIndex !== undefined) {
            // eslint-disable-next-line no-underscore-dangle
            const originalFormula = getCellFormula(row._hfRowIndex, colIndex);
            const originalFormulaStr = String(originalFormula ?? '');
            setCurrentFormula(originalFormulaStr);
            editingStateRef.current.formula = originalFormulaStr;
          }
        }
        return;
      }

      // Commit the edit to HyperFormula
      if (row && field) {
        const colIndex = columnFieldMap.get(field);
        if (colIndex !== undefined) {
          // eslint-disable-next-line no-underscore-dangle
          commitCellValue(row._hfRowIndex, colIndex, formula);
        }
      }
    };

    const unsubscribeFocus = apiRef.current.subscribeEvent(
      'cellFocusIn',
      handleCellFocusIn,
    );
    const unsubscribeEditStart = apiRef.current.subscribeEvent(
      'cellEditStart',
      handleCellEditStart,
    );
    const unsubscribeEditStop = apiRef.current.subscribeEvent(
      'cellEditStop',
      handleCellEditStop,
    );

    return () => {
      unsubscribeFocus();
      unsubscribeEditStart();
      unsubscribeEditStop();
    };
  }, [apiRef, columnFieldMap, getCellFormula, commitCellValue]);

  // Create valueGetter for a formula column
  // Note: valueGetter reads directly from HyperFormula, so it always returns current computed value
  const createValueGetter = useEventCallback((colIndex) => (_value, row) => {
    // eslint-disable-next-line no-underscore-dangle
    return getCellValue(row._hfRowIndex, colIndex);
  });

  // Create excelValueGetter for a formula column
  // Returns the formula string adjusted for Excel's header row (row numbers +1)
  const createExcelValueGetter = useEventCallback((colIndex) => (_value, row) => {
    // eslint-disable-next-line no-underscore-dangle
    const formula = getCellFormula(row._hfRowIndex, colIndex);
    return adjustFormulaForExcelHeaders(formula ?? '');
  });

  // Enhance columns with formula support
  // Note: We use hfVersion in the dependency to force column recreation when HF changes
  // This ensures valueGetter returns updated values after edits
  const enhancedColumns = React.useMemo(() => {
    const formulaEnhancedColumns = dynamicColumns.map((col) => {
      if (col.type !== 'formula') {
        return col;
      }

      const colIndex = columnFieldMap.get(col.field);
      if (colIndex === undefined) {
        return col;
      }

      return {
        ...col,
        type: 'string',
        editable: col.editable !== false,
        // Read cell value from HyperFormula
        valueGetter: createValueGetter(colIndex),
        // Export raw formula for Excel (requires escapeFormulas: false)
        excelValueGetter: createExcelValueGetter(colIndex),
        renderEditCell: (params) => (
          <FormulaEditCell {...params} onChange={handleCellFormulaChange} />
        ),
        renderHeader: (params) => <TitleWithAlphabet {...params} />,
      };
    });

    // Prepend row number column
    return [rowNumberColumn, ...formulaEnhancedColumns];
    // Include isInitialized to recreate columns when HF data changes (forces valueGetter re-evaluation)
    // Note: rowNumberColumn is a module-level constant, no need to include in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dynamicColumns,
    columnFieldMap,
    createValueGetter,
    createExcelValueGetter,
    handleCellFormulaChange,
    isInitialized,
  ]);

  // Formula bar props
  const formulaBarProps = React.useMemo(() => {
    const colIndex = currentField
      ? (apiRef.current?.getColumnIndexRelativeToVisibleColumns(currentField) ??
        null)
      : null;

    return {
      value: currentFormula,
      onChange: handleFormulaBarChange,
      isFormula,
      field: currentField,
      rowNumber: currentRow?.row_number ?? null,
      colIndex,
    };
  }, [
    currentFormula,
    handleFormulaBarChange,
    isFormula,
    currentField,
    currentRow,
    apiRef,
  ]);

  // HyperFormula context value
  const hfContextValue = React.useMemo(() => {
    if (!hfRef.current) {
      // Return a placeholder until HyperFormula is initialized
      return {
        hf: null,
        sheetId: 0,
        version: isInitialized ? 1 : 0,
        columnFieldMap,
      };
    }
    return {
      hf: hfRef.current.hf,
      sheetId: hfRef.current.sheetId,
      version: isInitialized ? 1 : 0,
      columnFieldMap,
    };
  }, [isInitialized, columnFieldMap]);

  // Add a new empty row at the end
  const addRow = useEventCallback(() => {
    if (!hfRef.current) {
      return;
    }
    const { hf, sheetId } = hfRef.current;
    hf.addRows(sheetId, [rowCount, 1]);

    // Store unique ID for the new row
    const newRowId = nextRowIdRef.current;
    nextRowIdRef.current += 1;
    addedRowIdsRef.current.set(rowCount, newRowId);

    setRowCount((prev) => prev + 1);
  });

  // Check if a field name already exists
  const isFieldDuplicate = useEventCallback((field) => {
    const normalizedField = field.trim().toLowerCase();
    return dynamicColumns.some((col) => col.field.toLowerCase() === normalizedField);
  });

  // Add a new column at the end
  const addColumn = useEventCallback((field, headerName) => {
    if (!hfRef.current || !field.trim() || !headerName.trim()) {
      return;
    }
    if (isFieldDuplicate(field)) {
      return;
    }
    const { hf, sheetId } = hfRef.current;
    const newColIndex = formulaColumns.length;
    hf.addColumns(sheetId, [newColIndex, 1]);

    const newColumn = {
      field: field.trim(),
      headerName: headerName.trim(),
      width: 150,
      type: 'formula',
    };

    setDynamicColumns((prev) => [...prev, newColumn]);
  });

  return {
    columns: enhancedColumns,
    rows,
    formulaBarProps,
    currentFormula,
    currentField,
    isFormula,
    hfContextValue,
    addRow,
    addColumn,
    isFieldDuplicate,
  };
}
