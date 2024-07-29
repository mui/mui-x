import * as React from 'react';
import { useGridApiEventHandler, GridEventListener } from '@mui/x-data-grid';
import { GridApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';

import { GRID_TREE_DATA_GROUPING_FIELD } from './gridTreeDataGroupColDef';

export const useGridTreeData = (
  apiRef: React.MutableRefObject<GridApiPro>,
  props: Pick<DataGridProProcessedProps, 'unstable_dataSource'>,
) => {
  /**
   * EVENTS
   */
  const handleCellKeyDown = React.useCallback<GridEventListener<'cellKeyDown'>>(
    (params, event) => {
      const cellParams = apiRef.current.getCellParams(params.id, params.field);
      if (
        cellParams.colDef.field === GRID_TREE_DATA_GROUPING_FIELD &&
        event.key === ' ' &&
        !event.shiftKey
      ) {
        if (params.rowNode.type !== 'group') {
          return;
        }

        if (props.unstable_dataSource && !params.rowNode.childrenExpanded) {
          apiRef.current.unstable_dataSource.fetchRows(params.id);
          return;
        }

        apiRef.current.setRowChildrenExpansion(params.id, !params.rowNode.childrenExpanded);
      }
    },
    [apiRef, props.unstable_dataSource],
  );

  useGridApiEventHandler(apiRef, 'cellKeyDown', handleCellKeyDown);
};
