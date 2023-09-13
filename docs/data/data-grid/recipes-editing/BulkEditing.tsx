/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import {
  DataGridPremium,
  GridRowId,
  GridValidRowModel,
  DataGridPremiumProps,
  useGridApiRef,
  GridActionsCellItem,
  GridColDef,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';

export default function BulkEditing() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 7,
    editable: true,
    visibleFields: [
      'id',
      'commodity',
      'traderName',
      'traderEmail',
      'quantity',
      'filledQuantity',
    ],
  });

  const apiRef = useGridApiRef();

  const [hasUnsavedRows, setHasUnsavedRows] = React.useState(false);
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
              label="Restore"
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

  const processRowUpdate: NonNullable<DataGridPremiumProps['processRowUpdate']> = (
    newRow,
    oldRow,
  ) => {
    const rowId = newRow.id;

    unsavedChangesRef.current.unsavedRows[rowId] = newRow;
    if (!unsavedChangesRef.current.rowsBeforeChange[rowId]) {
      unsavedChangesRef.current.rowsBeforeChange[rowId] = oldRow;
    }
    setHasUnsavedRows(true);
    return newRow;
  };

  const discardChanges = () => {
    setHasUnsavedRows(false);
    apiRef.current.updateRows(
      Object.values(unsavedChangesRef.current.rowsBeforeChange),
    );
    unsavedChangesRef.current = {
      unsavedRows: {},
      rowsBeforeChange: {},
    };
  };

  const saveChanges = () => {
    try {
      // TODO: Persist updates in the database

      const rowsToDelete = Object.values(
        unsavedChangesRef.current.unsavedRows,
      ).filter((row) => row._action === 'delete');
      if (rowsToDelete.length > 0) {
        apiRef.current.updateRows(rowsToDelete);
      }

      setHasUnsavedRows(false);
      unsavedChangesRef.current = {
        unsavedRows: {},
        rowsBeforeChange: {},
      };
    } catch (error) {
      // Retry or restore the old data?
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: 8 }}>
        <Button disabled={!hasUnsavedRows} onClick={saveChanges}>
          Save
        </Button>
        <Button disabled={!hasUnsavedRows} onClick={discardChanges}>
          Discard all changes
        </Button>
      </div>
      <div style={{ height: 400 }}>
        <DataGridPremium
          {...data}
          columns={columns}
          apiRef={apiRef}
          disableRowSelectionOnClick
          checkboxSelection
          unstable_cellSelection
          processRowUpdate={processRowUpdate}
          experimentalFeatures={{ clipboardPaste: true }}
          unstable_ignoreValueFormatterDuringExport
          sx={{
            '& .MuiDataGrid-row.row--removed': {
              backgroundColor: 'rgba(200, 0, 0, 0.3)',
            },
            '& .MuiDataGrid-row.row--edited': {
              backgroundColor: 'rgba(0, 100, 0, 0.3)',
            },
          }}
          getRowClassName={({ id }) => {
            const unsavedRow = unsavedChangesRef.current.unsavedRows[id];
            if (unsavedRow) {
              if (unsavedRow._action === 'delete') {
                return 'row--removed';
              }
              return 'row--edited';
            }
            return '';
          }}
        />
      </div>
    </div>
  );
}
