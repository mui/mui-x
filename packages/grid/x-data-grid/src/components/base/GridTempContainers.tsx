import * as React from 'react';
import Box from '@mui/material/Box';

import { GridEventListener } from '../../models/events';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { useGridApiEventHandler } from '../../hooks/utils/useGridApiEventHandler';

// This container helps cell elements stay in the DOM if they are the active elements and
// are not in the view range when virtualization is enabled.

export function GridTempContainers() {
  const apiRef = useGridPrivateApiContext();
  const [focusedCellElement, setFocusedCellElement] = React.useState<React.ReactElement | null>(
    null,
  );

  const handelcellFocusUnmount = React.useCallback<GridEventListener<'cellFocusUnmount'>>(
    (params) => {
      const { cell } = apiRef.current.state.focus;
      if (cell) {
        const cellElement = apiRef.current.getCellElement(cell.id, cell.field);
        if (cellElement) {
          setFocusedCellElement(null);
        } else if (focusedCellElement === null) {
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

  return (
    <Box sx={{ height: 0, width: 0, opacity: 0 }}>{focusedCellElement && focusedCellElement}</Box>
  );
}
