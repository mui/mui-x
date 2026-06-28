'use client';
import * as React from 'react';
import { createSvgIcon } from '@mui/material/utils';
import {
  GridActionsCellItem,
  GridRowModes,
  type GridColDef,
  type GridRowId,
  type GridRowModesModel,
  type GridValidRowModel,
} from '@mui/x-data-grid';
import type { DataStudioDataSource } from './DataStudio.types';

const SaveIcon = createSvgIcon(
  <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />,
  'Save',
);
const CancelIcon = createSvgIcon(
  <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />,
  'Close',
);
const EditIcon = createSvgIcon(
  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.9959.9959 0 0 0 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />,
  'Edit',
);
const DeleteIcon = createSvgIcon(
  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />,
  'DeleteOutlined',
);

const ACTIONS_FIELD = '__dataStudioActions';

function isIdField(field: string) {
  return /(^|[\s_-])id$/i.test(field);
}

function createDemoCellValue(column: GridColDef, rowIdField: string | undefined, rowIndex: number) {
  if (column.field === rowIdField || isIdField(column.field)) {
    return `demo-${rowIndex}`;
  }
  if (column.type === 'number') {
    return 0;
  }
  if (/date/i.test(column.field)) {
    return new Date().toISOString().slice(0, 10);
  }
  return '';
}

function createDemoRow<R extends GridValidRowModel>(
  columns: readonly GridColDef[],
  rowIdField: string | undefined,
): R {
  const rowIndex = Date.now();
  const row: Record<string, unknown> = {};
  columns.forEach((column) => {
    if (column.field === ACTIONS_FIELD) {
      return;
    }
    row[column.field] = createDemoCellValue(column, rowIdField, rowIndex);
  });
  if (rowIdField && !rowIdField.startsWith('__') && row[rowIdField] == null) {
    row[rowIdField] = `demo-${rowIndex}`;
  }
  return row as R;
}

interface DataStudioGridApiLike {
  current?: {
    getRow?: (id: GridRowId) => unknown;
    updateRows?: (rows: any[]) => void;
    startRowEditMode?: (params: { id: GridRowId }) => void;
    state?: { rows?: { dataRowIdToModelLookup?: Record<string, unknown> } };
    dataSource?: { cache?: { clear?: () => void }; fetchRows?: () => Promise<void> | void };
  } | null;
}

export interface DataStudioRowEditingResult<R extends GridValidRowModel> {
  /**
   * Columns with the `__dataStudioActions` column appended when the active
   * dataSource supports row editing (`dataSource.updateRow` or `dataSource.deleteRow`).
   * Otherwise the input columns unchanged.
   */
  columns: GridColDef<R>[];
  /**
   * Pass to the grid alongside `editMode="row"`. `null` when row editing is
   * disabled for this dataSource — pass nothing to the grid in that case.
   */
  rowModesModel: GridRowModesModel | null;
  onRowModesModelChange: (model: GridRowModesModel) => void;
  /**
   * Trigger row creation through the dataSource's `createRow`. Synthesizes a demo
   * row from the column schema, clears the data-source cache, re-fetches, and
   * (if the new row is loaded in the current page) flips it into edit mode.
   * `null` when the dataSource doesn't expose `createRow`.
   */
  onAddRow: (() => Promise<void>) | null;
}

/**
 * Built-in row editing for `<DataStudio>`. When the active dataSource's
 * `dataSource` exposes `createRow`/`updateRow`/`deleteRow`, appends an actions
 * column (Edit/Save/Cancel/Delete) and provides the `onAddRow` handler that
 * the toolbar's "Add row" button calls. The actions column is keyed by
 * `__dataStudioActions` and is filtered out before any export.
 *
 * @param {DataStudioRowEditingOptions<R>} options Options.
 * @returns {DataStudioRowEditingResult<R>} Decorated columns + state.
 */
export function useDataStudioRowEditing<R extends GridValidRowModel>(options: {
  dataSource: DataStudioDataSource<R> | null;
  apiRef: DataStudioGridApiLike;
  onError?: (error: unknown) => void;
}): DataStudioRowEditingResult<R> {
  const { dataSource, apiRef, onError } = options;
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

  const dataSourceId = dataSource?.id;
  // Reset edit state when the active dataSource changes so a row that was in
  // edit mode in dataSource A doesn't bleed into dataSource B (whose rows have
  // different ids anyway).
  React.useEffect(() => {
    setRowModesModel({});
  }, [dataSourceId]);

  const reportError = React.useCallback(
    (error: unknown) => {
      onError?.(error instanceof Error ? error : new Error(String(error)));
    },
    [onError],
  );

  const clearCache = React.useCallback(() => {
    apiRef.current?.dataSource?.cache?.clear?.();
  }, [apiRef]);

  const connector = dataSource?.connector;
  const hasUpdate = typeof connector?.updateRow === 'function';
  const hasDelete = typeof connector?.deleteRow === 'function';
  const hasCreate = typeof connector?.createRow === 'function';
  const supportsRowEditing = hasUpdate || hasDelete;

  const handleEditClick = React.useCallback(
    (id: GridRowId) => () => {
      setRowModesModel((model) => ({ ...model, [id]: { mode: GridRowModes.Edit } }));
    },
    [],
  );

  const handleSaveClick = React.useCallback(
    (id: GridRowId) => () => {
      setRowModesModel((model) => ({ ...model, [id]: { mode: GridRowModes.View } }));
    },
    [],
  );

  const handleCancelClick = React.useCallback(
    (id: GridRowId) => () => {
      setRowModesModel((model) => ({
        ...model,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      }));
    },
    [],
  );

  const handleDeleteClick = React.useCallback(
    (id: GridRowId) => async () => {
      if (!connector?.deleteRow) {
        return;
      }
      try {
        const row = apiRef.current?.getRow?.(id);
        const deletedRow = await connector.deleteRow(id, row ?? undefined);
        clearCache();
        apiRef.current?.updateRows?.([deletedRow ?? { id, _action: 'delete' }]);
      } catch (error) {
        reportError(error);
      }
    },
    [apiRef, clearCache, connector, reportError],
  );

  const dataSourceColumns = dataSource?.columns;
  // Stabilize the empty-array fallback so downstream `useMemo`s don't re-run
  // every render when no dataSource is active.
  const baseColumns = React.useMemo<readonly GridColDef[]>(
    () => dataSourceColumns ?? [],
    [dataSourceColumns],
  );
  const rowIdField = dataSource?.rowIdField;

  const columns = React.useMemo<GridColDef<R>[]>(() => {
    if (!supportsRowEditing) {
      return baseColumns as GridColDef<R>[];
    }
    const editableColumns = baseColumns.map((column) => ({
      ...column,
      editable: hasUpdate && column.field !== rowIdField,
    }));
    return [
      ...editableColumns,
      {
        field: ACTIONS_FIELD,
        type: 'actions',
        headerName: '',
        width: 112,
        minWidth: 112,
        align: 'center',
        headerAlign: 'center',
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
          if (isInEditMode) {
            return [
              <GridActionsCellItem
                key="save"
                icon={<SaveIcon />}
                label="Save"
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                key="cancel"
                icon={<CancelIcon />}
                label="Cancel"
                onClick={handleCancelClick(id)}
              />,
            ];
          }
          const actions: React.ReactElement[] = [];
          if (hasUpdate) {
            actions.push(
              <GridActionsCellItem
                key="edit"
                icon={<EditIcon />}
                label="Edit"
                onClick={handleEditClick(id)}
              />,
            );
          }
          if (hasDelete) {
            actions.push(
              <GridActionsCellItem
                key="delete"
                icon={<DeleteIcon />}
                label="Delete"
                onClick={handleDeleteClick(id)}
              />,
            );
          }
          return actions;
        },
      },
    ] as GridColDef<R>[];
  }, [
    baseColumns,
    rowIdField,
    supportsRowEditing,
    hasUpdate,
    hasDelete,
    rowModesModel,
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    handleDeleteClick,
  ]);

  const onAddRow = React.useMemo<(() => Promise<void>) | null>(() => {
    if (!hasCreate || !connector?.createRow) {
      return null;
    }
    const createRow = connector.createRow;
    return async () => {
      try {
        const demoRow = createDemoRow<R>(baseColumns, rowIdField);
        const createdRow = (await createRow(demoRow)) as Record<string, unknown>;
        clearCache();
        await apiRef.current?.dataSource?.fetchRows?.();
        const createdRowId =
          rowIdField && createdRow?.[rowIdField] != null ? String(createdRow[rowIdField]) : null;
        if (createdRowId == null) {
          return;
        }
        // Only flip into edit mode if the freshly-created row landed in the
        // currently-loaded page; otherwise the grid throws
        // `No row with id #<id> found` from `getCellParams`.
        const isLoaded = Boolean(
          apiRef.current?.state?.rows?.dataRowIdToModelLookup?.[createdRowId],
        );
        if (isLoaded) {
          setRowModesModel((model) => ({
            ...model,
            [createdRowId]: { mode: GridRowModes.Edit },
          }));
        }
      } catch (error) {
        reportError(error);
      }
    };
  }, [hasCreate, connector, baseColumns, rowIdField, clearCache, apiRef, reportError]);

  return {
    columns,
    rowModesModel: supportsRowEditing ? rowModesModel : null,
    onRowModesModelChange: setRowModesModel,
    onAddRow,
  };
}
