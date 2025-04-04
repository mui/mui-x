import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { useGridEvent, GridEventListener } from '@mui/x-data-grid';
import { GridApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';

import { GRID_TREE_DATA_GROUPING_FIELD } from './gridTreeDataGroupColDef';

export const useGridTreeData = (
  apiRef: RefObject<GridApiPro>,
  props: Pick<DataGridProProcessedProps, 'dataSource'>,
) => {
  /**
   * EVENTS
   */
  const handleCellKeyDown = React.useCallback<GridEventListener<'cellKeyDown'>>(
    (params, event) => {
      const cellParams = apiRef.current.getCellParams(params.id, params.field);
      if (
        cellParams.colDef.field === GRID_TREE_DATA_GROUPING_FIELD &&
        (event.key === ' ' || event.key === 'Enter') &&
        !event.shiftKey
      ) {
        if (params.rowNode.type !== 'group') {
          return;
        }

        if (props.dataSource && !params.rowNode.childrenExpanded) {
          apiRef.current.dataSource.fetchRows(params.id);
          return;
        }

        apiRef.current.setRowChildrenExpansion(params.id, !params.rowNode.childrenExpanded);
      }
    },
    [apiRef, props.dataSource],
  );

  useGridEvent(apiRef, 'cellKeyDown', handleCellKeyDown);
};
