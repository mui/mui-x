import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import { getDataGridUtilityClass, useGridSelector, GridRowId } from '@mui/x-data-grid';
import { GridDetailPanelsProps, EMPTY_DETAIL_PANELS } from '@mui/x-data-grid/internals';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import {
  gridDetailPanelExpandedRowsContentCacheSelector,
  gridDetailPanelExpandedRowsHeightCacheSelector,
  gridDetailPanelExpandedRowIdsSelector,
} from '../hooks/features/detailPanel';
import { GridDetailPanel } from './GridDetailPanel';

const useUtilityClasses = () => {
  const slots = {
    detailPanel: ['detailPanel'],
  };
  return composeClasses(slots, getDataGridUtilityClass, {});
};

export function GridDetailPanels(props: GridDetailPanelsProps) {
  const rootProps = useGridRootProps();
  if (!rootProps.getDetailPanelContent) {
    return null;
  }
  return React.createElement(GridDetailPanelsImpl, props);
}

function GridDetailPanelsImpl({ virtualScroller }: GridDetailPanelsProps) {
  const apiRef = useGridPrivateApiContext();
  const classes = useUtilityClasses();
  const { setPanels } = virtualScroller;

  const expandedRowIds = useGridSelector(apiRef, gridDetailPanelExpandedRowIdsSelector);
  const detailPanelsContent = useGridSelector(
    apiRef,
    gridDetailPanelExpandedRowsContentCacheSelector,
  );
  const detailPanelsHeights = useGridSelector(
    apiRef,
    gridDetailPanelExpandedRowsHeightCacheSelector,
  );

  const getDetailPanel = React.useCallback(
    (rowId: GridRowId): React.ReactNode => {
      const content = detailPanelsContent[rowId];

      // Check if the id exists in the current page
      const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(rowId);
      const exists = rowIndex !== undefined;

      if (!React.isValidElement(content) || !exists) {
        return null;
      }

      const hasAutoHeight = apiRef.current.detailPanelHasAutoHeight(rowId);
      const height = hasAutoHeight ? 'auto' : detailPanelsHeights[rowId];

      return (
        <GridDetailPanel
          key={`panel-${rowId}`}
          rowId={rowId}
          height={height}
          className={classes.detailPanel}
        >
          {content}
        </GridDetailPanel>
      );
    },
    [apiRef, classes.detailPanel, detailPanelsHeights, detailPanelsContent],
  );

  React.useEffect(() => {
    if (expandedRowIds.length === 0) {
      setPanels(EMPTY_DETAIL_PANELS);
    } else {
      setPanels(
        new Map<GridRowId, React.ReactNode>(
          expandedRowIds.map((rowId) => [rowId, getDetailPanel(rowId)]),
        ),
      );
    }
  }, [expandedRowIds, setPanels, getDetailPanel]);

  return null;
}
