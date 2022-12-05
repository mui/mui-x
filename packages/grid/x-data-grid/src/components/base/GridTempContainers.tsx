import * as React from 'react';
import Box from '@mui/material/Box';

import { GridEventListener } from '../../models/events';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { useGridApiEventHandler } from '../../hooks/utils/useGridApiEventHandler';

// This container helps cell elements stay in the DOM if they are the active elements and
// If they have an event attached to them, that should be active even if using virtualization.
export function GridTempContainers() {
  const apiRef = useGridPrivateApiContext();
  const [focusedCellElement, setFocusedCellElement] = React.useState<React.ReactElement | null>(
    null,
  );

  const handelcellFocusUnmount = React.useCallback<GridEventListener<'cellFocusUnmount'>>(
    (params) => {
      const { cell, columnHeader } = apiRef.current.state.focus;
      if (cell) {
        const cellElement = apiRef.current.getCellElement(cell.id, cell.field);
        if (cellElement && focusedCellElement !== null) {
          setFocusedCellElement(null);
        } else if (focusedCellElement === null && cellElement === null) {
          setFocusedCellElement(params);
        }
      }
      if (columnHeader) {
        const columnElement = apiRef.current.getColumnHeaderElement(columnHeader.field);
        if (columnElement && focusedCellElement !== null) {
          setFocusedCellElement(null);
        } else if (focusedCellElement === null && columnElement === null) {
          setFocusedCellElement(params);
        }
      }
    },
    [apiRef, focusedCellElement],
  );
  const handleCellFocusOut = React.useCallback<GridEventListener<'cellFocusOut'>>(() => {
    setFocusedCellElement(null);
  }, []);

  useGridApiEventHandler(apiRef, 'cellFocusUnmount', handelcellFocusUnmount);
  useGridApiEventHandler(apiRef, 'cellFocusOut', handleCellFocusOut);
  useGridApiEventHandler(apiRef, 'columnHeaderBlur', handleCellFocusOut);

  return (
    <Box sx={{ height: 0, width: 0, opacity: 0 }}>{focusedCellElement && focusedCellElement}</Box>
  );
}
