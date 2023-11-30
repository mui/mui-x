import * as React from 'react';
import { useGridApiEventHandler, GridEventListener } from '@mui/x-data-grid';
import { GridApiPro } from '../../../models/gridApiPro';

export const useGridTreeData = (apiRef: React.MutableRefObject<GridApiPro>) => {
  /**
   * EVENTS
   */
  const handleCellKeyDown = React.useCallback<GridEventListener<'cellKeyDown'>>(
    (params, event) => {
      const cellParams = apiRef.current.getCellParams(params.id, params.field);
      if (cellParams.colDef.field === '__treeDataGroup__' && event.key === ' ' && !event.shiftKey) {
        if (params.rowNode.type !== 'group') {
          return;
        }

        apiRef.current.setRowChildrenExpansion(params.id, !params.rowNode.childrenExpanded);
      }
    },
    [apiRef],
  );

  useGridApiEventHandler(apiRef, 'cellKeyDown', handleCellKeyDown);
};
