import * as React from 'react';
import { ColDef } from '../../models/colDef';
import { useLogger } from '../utils';
import { ApiRef } from '../../models';

export const useColumnReorder = (
  apiRef: ApiRef
) => {
  const logger = useLogger('useColumnReorder');

  const dragCol = React.useRef<ColDef | null>();
  const dragColNode = React.useRef<HTMLElement | null>();

  const handleDragStart = React.useCallback(
    (col: ColDef, htmlEl: any): void => {
      logger.debug(`Start dragging col ${col.field}`);
      dragCol.current = col;
      dragColNode.current = htmlEl;
      dragColNode.current?.addEventListener('dragend', handleDragEnd);
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

        columnsSnapshot.splice(targetColIndex, 0, columnsSnapshot.splice(dragColIndex, 1)[0]);

        apiRef.current.updateColumns(columnsSnapshot, true);
      }
    },
    [apiRef, logger]
  );

  const handleDragEnd = React.useCallback(
    (): void => {
      logger.debug(`End dragging col ${dragCol.current!.field}`);

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
