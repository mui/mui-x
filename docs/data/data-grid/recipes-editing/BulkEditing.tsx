/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import {
  DataGrid,
  GridRowId,
  GridValidRowModel,
  DataGridProps,
  useGridApiRef,
  GridActionsCellItem,
  GridColDef,
  gridClasses,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { darken } from '@mui/material/styles';

const visibleFields = [
  'id',
  'commodity',
  'traderName',
  'traderEmail',
  'quantity',
  'filledQuantity',
];

export default function BulkEditing() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 7,
    editable: true,
    visibleFields,
  });

  const apiRef = useGridApiRef();

  const [hasUnsavedRows, setHasUnsavedRows] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const unsavedChangesRef = React.useRef<{
    unsavedRows: Record<GridRowId, GridValidRowModel>;
    rowsBeforeChange: Record<GridRowId, GridValidRowModel>;
  }>({
    unsavedRows: {},
    rowsBeforeChange: {},
  });

  const columns = React.useMemo<GridColDef[]>(() => {
    return [
      {
        field: 'actions',
        type: 'actions',
        getActions: ({ id, row }) => {
          return [
            <GridActionsCellItem
              icon={<RestoreIcon />}
              label="Discard changes"
              disabled={unsavedChangesRef.current.unsavedRows[id] === undefined}
              onClick={() => {
                apiRef.current.updateRows([
                  unsavedChangesRef.current.rowsBeforeChange[id],
                ]);
                delete unsavedChangesRef.current.rowsBeforeChange[id];
                delete unsavedChangesRef.current.unsavedRows[id];
                setHasUnsavedRows(
                  Object.keys(unsavedChangesRef.current.unsavedRows).length > 0,
                );
              }}
            />,
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => {
                unsavedChangesRef.current.unsavedRows[id] = {
                  ...row,
                  _action: 'delete',
                };
                if (!unsavedChangesRef.current.rowsBeforeChange[id]) {
                  unsavedChangesRef.current.rowsBeforeChange[id] = row;
                }
                setHasUnsavedRows(true);
                apiRef.current.updateRows([row]); // to trigger row render
              }}
            />,
          ];
        },
      },
      ...data.columns,
    ];
  }, [data.columns, unsavedChangesRef, apiRef]);

  const processRowUpdate = React.useCallback<
    NonNullable<DataGridProps['processRowUpdate']>
  >((newRow, oldRow) => {
    const rowId = newRow.id;

    unsavedChangesRef.current.unsavedRows[rowId] = newRow;
    if (!unsavedChangesRef.current.rowsBeforeChange[rowId]) {
      unsavedChangesRef.current.rowsBeforeChange[rowId] = oldRow;
    }
    setHasUnsavedRows(true);
    return newRow;
  }, []);

  const discardChanges = React.useCallback(() => {
    setHasUnsavedRows(false);
    Object.values(unsavedChangesRef.current.rowsBeforeChange).forEach((row) => {
      apiRef.current.updateRows([row]);
    });
    unsavedChangesRef.current = {
      unsavedRows: {},
      rowsBeforeChange: {},
    };
  }, [apiRef]);

  const saveChanges = React.useCallback(async () => {
    try {
      // Persist updates in the database
      setIsSaving(true);
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });

      setIsSaving(false);
      const rowsToDelete = Object.values(
        unsavedChangesRef.current.unsavedRows,
      ).filter((row) => row._action === 'delete');
      if (rowsToDelete.length > 0) {
        rowsToDelete.forEach((row) => {
          apiRef.current.updateRows([row]);
        });
      }

      setHasUnsavedRows(false);
      unsavedChangesRef.current = {
        unsavedRows: {},
        rowsBeforeChange: {},
      };
    } catch (error) {
      setIsSaving(false);
    }
  }, [apiRef]);

  const getRowClassName = React.useCallback<
    NonNullable<DataGridProps['getRowClassName']>
  >(({ id }) => {
    const unsavedRow = unsavedChangesRef.current.unsavedRows[id];
    if (unsavedRow) {
      if (unsavedRow._action === 'delete') {
        return 'row--removed';
      }
      return 'row--edited';
    }
    return '';
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: 8 }}>
        <LoadingButton
          disabled={!hasUnsavedRows}
          loading={isSaving}
          onClick={saveChanges}
          startIcon={<SaveIcon />}
          loadingPosition="start"
        >
          <span>Save</span>
        </LoadingButton>
        <Button
          disabled={!hasUnsavedRows || isSaving}
          onClick={discardChanges}
          startIcon={<RestoreIcon />}
        >
          Discard all changes
        </Button>
      </div>
      <div style={{ height: 400 }}>
        <DataGrid
          {...data}
          columns={columns}
          apiRef={apiRef}
          disableRowSelectionOnClick
          processRowUpdate={processRowUpdate}
          ignoreValueFormatterDuringExport
          sx={{
            [`& .${gridClasses.row}.row--removed`]: {
              backgroundColor: (theme) => {
                if (theme.palette.mode === 'light') {
                  return 'rgba(255, 170, 170, 0.3)';
                }
                return darken('rgba(255, 170, 170, 1)', 0.7);
              },
            },
            [`& .${gridClasses.row}.row--edited`]: {
              backgroundColor: (theme) => {
                if (theme.palette.mode === 'light') {
                  return 'rgba(255, 254, 176, 0.3)';
                }
                return darken('rgba(255, 254, 176, 1)', 0.6);
              },
            },
          }}
          loading={isSaving}
          getRowClassName={getRowClassName}
        />
      </div>
    </div>
  );
}
