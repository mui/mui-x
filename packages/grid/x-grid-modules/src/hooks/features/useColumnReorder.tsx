import * as React from 'react';
import { ColDef } from '../../models/colDef';
import { useLogger } from '../utils';
import { ApiRef } from '../../models';
import { COL_REORDER_START, COL_REORDER_STOP } from '../../constants/eventsConstants';

const reorderColDefArray = (
  columns: ColDef[],
  newColIndex: number,
  oldColIndex: number
): ColDef[] => {
  const columnsClone = JSON.parse(JSON.stringify(columns))

  columnsClone.splice(newColIndex, 0, columnsClone.splice(oldColIndex, 1)[0]);

  return columnsClone;
};

export const useColumnReorder = (
  apiRef: ApiRef
) => {
  const logger = useLogger('useColumnReorder');

  const dragCol = React.useRef<ColDef | null>();
  const dragColNode = React.useRef<HTMLElement | null>();

  const handleDragStart = React.useCallback(
    (col: ColDef, htmlEl: any): void => {
      logger.debug(`Start dragging col ${col.field}`);
      apiRef.current.publishEvent(COL_REORDER_START);

      dragCol.current = col;
      dragColNode.current = htmlEl;
      dragColNode.current?.addEventListener('dragend', handleDragEnd, { once: true });
      dragColNode.current?.classList.add('dragging');
      setTimeout(() => {
        dragColNode.current?.classList.remove('dragging');
      }, 0);
    },
    [apiRef, logger]
  );

  const handleDragEnter = React.useCallback(
    (col: ColDef): void => {
      logger.debug(`Enter dragging col ${col.field}`);

      if (col.field !== dragCol.current?.field) {
        const targetColIndex = apiRef.current.getColumnIndex(col.field);
        const dragColIndex = apiRef.current.getColumnIndex(dragCol.current!.field);
        const columnsSnapshot = apiRef.current.getAllColumns();

        apiRef.current.scrollToIndexes({
          colIndex: targetColIndex,
          rowIndex: 0
        });

        const columnsReordered = reorderColDefArray(columnsSnapshot, targetColIndex, dragColIndex);

        apiRef.current.updateColumns(columnsReordered, true);
      }
    },
    [apiRef, logger]
  );

  const handleDragEnd = React.useCallback(
    (): void => {
      logger.debug(`End dragging col ${dragCol.current!.field}`);
      apiRef.current.publishEvent(COL_REORDER_STOP);

      dragColNode.current?.removeEventListener('dragend', handleDragEnd);
      dragCol.current = null;
      dragColNode.current = null;
    },
    [logger]
  );

  return {
    handleDragStart,
    handleDragEnter
  };
};
