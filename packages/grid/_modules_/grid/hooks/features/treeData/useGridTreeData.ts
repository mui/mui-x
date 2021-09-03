import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { gridRowsStateSelector } from '../rows';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { GridEvents } from '../../../constants';

export const useGridTreeData = (apiRef: GridApiRef) => {
  // console.log('HEY')
  const updateTree = React.useCallback(() => {
    const rows = gridRowsStateSelector(apiRef.current.state);

    // console.log(rows)
  }, [apiRef]);

  useGridApiEventHandler(apiRef, GridEvents.rowsSet, updateTree);
};
