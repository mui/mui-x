import * as React from 'react';
import {
  DataGridPremium,
  DataGridPremiumProps,
  GridColDef,
  GridRowId,
  gridExpandedSortedRowIdsSelector,
  gridFocusCellSelector,
  gridRowSelectionCountSelector,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import { randomEmail, randomId, randomUserName } from '@mui/x-data-grid-generator';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 200, editable: true },
  { field: 'email', headerName: 'Email', width: 250, editable: true },
  { field: 'age', headerName: 'Age', type: 'number', width: 100, editable: true },
];

const initialRows = [
  { id: randomId(), name: randomUserName(), email: randomEmail(), age: 25 },
  { id: randomId(), name: randomUserName(), email: randomEmail(), age: 36 },
  { id: randomId(), name: randomUserName(), email: randomEmail(), age: 19 },
];

const createEmptyRow = () => ({ id: randomId() });

export default function ClipboardPasteAddRows() {
  const apiRef = useGridApiRef();
  const addedRowIds = React.useRef<GridRowId[]>([]);

  const handleBeforeClipboardPasteStart: DataGridPremiumProps['onBeforeClipboardPasteStart'] =
    async ({ data }) => {
      addedRowIds.current = [];

      // The grid pastes past the last row only when it starts from the focused cell.
      // With selected rows or a selected cell range, it pastes into the selection.
      if (
        gridRowSelectionCountSelector(apiRef) > 0 ||
        apiRef.current!.getSelectedCellsAsArray().length > 1
      ) {
        return;
      }

      const focusedCell = gridFocusCellSelector(apiRef);
      if (!focusedCell) {
        return;
      }

      const focusedRowIndex = apiRef.current!.getRowIndexRelativeToVisibleRows(
        focusedCell.id,
      );
      const visibleRowCount = gridExpandedSortedRowIdsSelector(apiRef).length;
      const missingRowCount = focusedRowIndex + data.length - visibleRowCount;
      if (missingRowCount <= 0) {
        return;
      }

      // Add empty rows at the end.
      // The grid then pastes into them and parses the values like for any other row.
      const newRows = Array.from({ length: missingRowCount }, createEmptyRow);
      addedRowIds.current = newRows.map((row) => row.id);
      apiRef.current!.updateRows(newRows);
    };

  const handleClipboardPasteEnd: DataGridPremiumProps['onClipboardPasteEnd'] = ({
    newRows,
  }) => {
    // Remove the added rows that did not get a value,
    // for example when `processRowUpdate` rejected the update.
    const emptyRowIds = addedRowIds.current.filter((id) => !newRows.has(id));
    addedRowIds.current = [];
    if (emptyRowIds.length > 0) {
      apiRef.current!.updateRows(
        emptyRowIds.map((id) => ({ id, _action: 'delete' })),
      );
    }
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        apiRef={apiRef}
        rows={initialRows}
        columns={columns}
        disableRowSelectionOnClick
        onBeforeClipboardPasteStart={handleBeforeClipboardPasteStart}
        onClipboardPasteEnd={handleClipboardPasteEnd}
      />
    </div>
  );
}
