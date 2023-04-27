import * as React from 'react';
import { styled, alpha, Theme, useTheme } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import {
  useGridSelector,
  getDataGridUtilityClass,
  gridClasses,
  gridVisibleColumnFieldsSelector,
  gridRowsMetaSelector,
  useGridApiEventHandler,
  GridRowId,
  GridOverlays,
} from '@mui/x-data-grid';
import {
  GridVirtualScroller,
  GridVirtualScrollerContent,
  GridVirtualScrollerRenderZone,
  useGridVirtualScroller,
  calculatePinnedRowsHeight,
} from '@mui/x-data-grid/internals';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { DataGridProProcessedProps } from '../models/dataGridProProps';
import {
  gridPinnedColumnsSelector,
  GridPinnedColumns,
  GridPinnedPosition,
} from '../hooks/features/columnPinning';
import {
  gridDetailPanelExpandedRowsContentCacheSelector,
  gridDetailPanelExpandedRowsHeightCacheSelector,
  gridDetailPanelExpandedRowIdsSelector,
} from '../hooks/features/detailPanel';
import { GridDetailPanel } from './GridDetailPanel';
import { gridPinnedRowsSelector } from '../hooks/features/rowPinning/gridRowPinningSelector';

export const filterColumns = (
  pinnedColumns: GridPinnedColumns,
  columns: string[],
  invert?: boolean,
): [string[], string[]] => {
  if (!Array.isArray(pinnedColumns.left) && !Array.isArray(pinnedColumns.right)) {
    return [[], []];
  }

  if (pinnedColumns.left?.length === 0 && pinnedColumns.right?.length === 0) {
    return [[], []];
  }

  const filter = (newPinnedColumns: any[] | undefined, remainingColumns: string[]) => {
    if (!Array.isArray(newPinnedColumns)) {
      return [];
    }
    return newPinnedColumns.filter((field) => remainingColumns.includes(field));
  };

  const leftPinnedColumns = filter(pinnedColumns.left, columns);
  const columnsWithoutLeftPinnedColumns = columns.filter(
    // Filter out from the remaining columns those columns already pinned to the left
    (field) => !leftPinnedColumns.includes(field),
  );
  const rightPinnedColumns = filter(pinnedColumns.right, columnsWithoutLeftPinnedColumns);
  if (invert) {
    return [rightPinnedColumns, leftPinnedColumns];
  }
  return [leftPinnedColumns, rightPinnedColumns];
};

type OwnerState = DataGridProProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    leftPinnedColumns: ['pinnedColumns', 'pinnedColumns--left'],
    rightPinnedColumns: ['pinnedColumns', 'pinnedColumns--right', 'withBorderColor'],
    topPinnedRows: ['pinnedRows', 'pinnedRows--top'],
    bottomPinnedRows: ['pinnedRows', 'pinnedRows--bottom'],
    pinnedRowsRenderZone: ['pinnedRowsRenderZone'],
    detailPanels: ['detailPanels'],
    detailPanel: ['detailPanel'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

interface VirtualScrollerPinnedColumnsProps {
  side: GridPinnedPosition;
  showCellVerticalBorder: boolean;
}

// Inspired by https://github.com/material-components/material-components-ios/blob/bca36107405594d5b7b16265a5b0ed698f85a5ee/components/Elevation/src/UIColor%2BMaterialElevation.m#L61
const getOverlayAlpha = (elevation: number) => {
  let alphaValue: number;
  if (elevation < 1) {
    alphaValue = 5.11916 * elevation ** 2;
  } else {
    alphaValue = 4.5 * Math.log(elevation + 1) + 2;
  }
  return alphaValue / 100;
};

const getBoxShadowColor = (theme: Theme) => {
  return theme.vars ? `rgba(0 0 0 /  0.21)` : alpha(theme.palette.common.black, 0.21);
};

const VirtualScrollerDetailPanels = styled('div', {
  name: 'MuiDataGrid',
  slot: 'DetailPanels',
  overridesResolver: (props, styles) => styles.detailPanels,
})<{ ownerState: OwnerState }>({
  position: 'relative',
});

const darkModeBackgroundImage = `linear-gradient(${alpha('#fff', getOverlayAlpha(2))}, ${alpha(
  '#fff',
  getOverlayAlpha(2),
)})`;

const VirtualScrollerPinnedColumns = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PinnedColumns',
  overridesResolver: (props, styles) => [
    { [`&.${gridClasses['pinnedColumns--left']}`]: styles['pinnedColumns--left'] },
    { [`&.${gridClasses['pinnedColumns--right']}`]: styles['pinnedColumns--right'] },
    styles.pinnedColumns,
  ],
})<{ ownerState: OwnerState & VirtualScrollerPinnedColumnsProps }>(({ theme, ownerState }) => {
  const boxShadowColor = getBoxShadowColor(theme);
  return {
    position: 'sticky',
    overflow: 'hidden',
    zIndex: 1,
    backgroundColor: (theme.vars || theme).palette.background.default,
    ...(theme.vars
      ? { backgroundImage: theme.vars.overlays?.[2] }
      : { ...(theme.palette.mode === 'dark' && { backgroundImage: darkModeBackgroundImage }) }),
    ...(ownerState.side === GridPinnedPosition.left && {
      left: 0,
      float: 'left',
      boxShadow: `2px 0px 4px -2px ${boxShadowColor}`,
    }),
    ...(ownerState.side === GridPinnedPosition.right && {
      right: 0,
      float: 'right',
      boxShadow: `-2px 0px 4px -2px ${boxShadowColor}`,
    }),
    ...(ownerState.side === GridPinnedPosition.right &&
      ownerState.showCellVerticalBorder && {
        borderLeftWidth: '1px',
        borderLeftStyle: 'solid',
      }),
  };
});

enum PinnedRowsPosition {
  top = 'top',
  bottom = 'bottom',
}

const VirtualScrollerPinnedRows = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PinnedRows',
  overridesResolver: (props, styles) => [
    { [`&.${gridClasses['pinnedRows--top']}`]: styles['pinnedRows--top'] },
    { [`&.${gridClasses['pinnedRows--bottom']}`]: styles['pinnedRows--bottom'] },
    styles.pinnedRows,
  ],
})<{ ownerState: OwnerState & { position: PinnedRowsPosition } }>(({ theme, ownerState }) => {
  const boxShadowColor = getBoxShadowColor(theme);
  return {
    position: 'sticky',
    // should be above the detail panel
    zIndex: 3,
    backgroundColor: (theme.vars || theme).palette.background.default,
    ...(theme.vars
      ? { backgroundImage: theme.vars.overlays?.[2] }
      : { ...(theme.palette.mode === 'dark' && { backgroundImage: darkModeBackgroundImage }) }),
    ...(ownerState.position === 'top' && {
      top: 0,
      boxShadow: `0px 3px 4px -2px ${boxShadowColor}`,
    }),
    ...(ownerState.position === PinnedRowsPosition.bottom && {
      boxShadow: `0px -3px 4px -2px ${boxShadowColor}`,
      bottom: 0,
    }),
  };
});

const VirtualScrollerPinnedRowsRenderZone = styled('div')({
  position: 'absolute',
});

interface DataGridProVirtualScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  disableVirtualization?: boolean;
}

const DataGridProVirtualScroller = React.forwardRef<
  HTMLDivElement,
  DataGridProVirtualScrollerProps
>(function DataGridProVirtualScroller(props, ref) {
  const { className, disableVirtualization, ...other } = props;
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const visibleColumnFields = useGridSelector(apiRef, gridVisibleColumnFieldsSelector);
  const expandedRowIds = useGridSelector(apiRef, gridDetailPanelExpandedRowIdsSelector);
  const detailPanelsContent = useGridSelector(
    apiRef,
    gridDetailPanelExpandedRowsContentCacheSelector,
  );
  const detailPanelsHeights = useGridSelector(
    apiRef,
    gridDetailPanelExpandedRowsHeightCacheSelector,
  );
  const leftColumns = React.useRef<HTMLDivElement>(null);
  const rightColumns = React.useRef<HTMLDivElement>(null);
  const topPinnedRowsRenderZoneRef = React.useRef<HTMLDivElement>(null);
  const bottomPinnedRowsRenderZoneRef = React.useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const handleRenderZonePositioning = React.useCallback(
    ({ top, left }: { top: number; left: number }) => {
      if (leftColumns.current) {
        leftColumns.current!.style.transform = `translate3d(0px, ${top}px, 0px)`;
      }
      if (rightColumns.current) {
        rightColumns.current!.style.transform = `translate3d(0px, ${top}px, 0px)`;
      }
      if (topPinnedRowsRenderZoneRef.current) {
        topPinnedRowsRenderZoneRef.current!.style.transform = `translate3d(${left}px, 0px, 0px)`;
      }
      if (bottomPinnedRowsRenderZoneRef.current) {
        bottomPinnedRowsRenderZoneRef.current!.style.transform = `translate3d(${left}px, 0px, 0px)`;
      }
    },
    [],
  );

  const getRowProps = React.useCallback(
    (id: GridRowId) => {
      if (!expandedRowIds.includes(id)) {
        return null;
      }
      const height = detailPanelsHeights[id];
      return { style: { marginBottom: height } };
    },
    [detailPanelsHeights, expandedRowIds],
  );

  const pinnedColumns = useGridSelector(apiRef, gridPinnedColumnsSelector);
  const [leftPinnedColumns, rightPinnedColumns] = filterColumns(
    pinnedColumns,
    visibleColumnFields,
    theme.direction === 'rtl',
  );

  const pinnedRows = useGridSelector(apiRef, gridPinnedRowsSelector);
  const topPinnedRowsData = React.useMemo(() => pinnedRows?.top || [], [pinnedRows?.top]);
  const bottomPinnedRowsData = React.useMemo(() => pinnedRows?.bottom || [], [pinnedRows?.bottom]);

  const ownerState = { ...rootProps, classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const {
    renderContext,
    getRows,
    getRootProps,
    getContentProps,
    getRenderZoneProps,
    updateRenderZonePosition,
  } = useGridVirtualScroller({
    ref,
    renderZoneMinColumnIndex: leftPinnedColumns.length,
    renderZoneMaxColumnIndex: visibleColumnFields.length - rightPinnedColumns.length,
    onRenderZonePositioning: handleRenderZonePositioning,
    getRowProps,
    ...props,
  });

  const refreshRenderZonePosition = React.useCallback(() => {
    if (renderContext) {
      updateRenderZonePosition(renderContext);
    }
  }, [renderContext, updateRenderZonePosition]);

  useGridApiEventHandler(apiRef, 'columnWidthChange', refreshRenderZonePosition);
  useGridApiEventHandler(apiRef, 'columnOrderChange', refreshRenderZonePosition);
  useGridApiEventHandler(apiRef, 'rowOrderChange', refreshRenderZonePosition);

  const leftRenderContext =
    renderContext && leftPinnedColumns.length > 0
      ? {
          ...renderContext,
          firstColumnIndex: 0,
          lastColumnIndex: leftPinnedColumns.length,
        }
      : null;

  const rightRenderContext =
    renderContext && rightPinnedColumns.length > 0
      ? {
          ...renderContext,
          firstColumnIndex: visibleColumnFields.length - rightPinnedColumns.length,
          lastColumnIndex: visibleColumnFields.length,
        }
      : null;

  // Create a lookup for faster check if the row is expanded
  const expandedRowIdsLookup = React.useMemo(() => {
    const lookup: { [key: GridRowId]: boolean } = {};
    expandedRowIds.forEach((id: GridRowId) => {
      lookup[id] = true;
    });
    return lookup;
  }, [expandedRowIds]);

  const getDetailPanel = (rowId: GridRowId): React.ReactNode => {
    const rowsMeta = gridRowsMetaSelector(apiRef.current.state);
    const content = detailPanelsContent[rowId];

    // Check if the id exists in the current page
    const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(rowId);
    const exists = rowIndex !== undefined;

    if (React.isValidElement(content) && exists) {
      const hasAutoHeight = apiRef.current.detailPanelHasAutoHeight(rowId);
      const height = hasAutoHeight ? 'auto' : detailPanelsHeights[rowId];

      const sizes = apiRef.current.unstable_getRowInternalSizes(rowId);
      const spacingTop = sizes?.spacingTop || 0;
      const top =
        rowsMeta.positions[rowIndex] + apiRef.current.unstable_getRowHeight(rowId) + spacingTop;

      return (
        <GridDetailPanel
          key={rowId}
          rowId={rowId}
          style={{ top }}
          height={height}
          className={classes.detailPanel}
        >
          {content}
        </GridDetailPanel>
      );
    }
    return null;
  };

  const detailPanels: React.ReactNode[] = [];
  const topPinnedRows = getRows({ renderContext, rows: topPinnedRowsData, position: 'center' });

  const pinnedRowsHeight = calculatePinnedRowsHeight(apiRef);

  const mainRows = getRows({
    renderContext,
    rowIndexOffset: topPinnedRowsData.length,
    position: 'center',
    onRowRender: (rowId: GridRowId) => {
      if (rootProps.getDetailPanelContent == null) {
        return;
      }
      if (!expandedRowIdsLookup[rowId]) {
        return;
      }

      const detailPanel = getDetailPanel(rowId);
      if (detailPanel) {
        detailPanels.push(detailPanel);
      }
    },
  });

  const bottomPinnedRows = getRows({
    renderContext,
    rows: bottomPinnedRowsData,
    rowIndexOffset: topPinnedRowsData.length + (mainRows ? mainRows.length : 0),
    position: 'center',
  });

  const contentProps = getContentProps();

  const pinnedColumnsStyle = { minHeight: contentProps.style.minHeight };

  if (contentProps.style.minHeight && contentProps.style.minHeight === '100%') {
    contentProps.style.minHeight = `calc(100% - ${pinnedRowsHeight.top}px - ${pinnedRowsHeight.bottom}px)`;
  }

  return (
    <GridVirtualScroller {...getRootProps(other)}>
      <GridOverlays />
      {topPinnedRowsData.length > 0 ? (
        <VirtualScrollerPinnedRows
          className={classes.topPinnedRows}
          ownerState={{ ...ownerState, position: PinnedRowsPosition.top }}
          style={{ width: contentProps.style.width, height: pinnedRowsHeight.top }}
          role="rowgroup"
        >
          {leftRenderContext && (
            <VirtualScrollerPinnedColumns
              className={classes.leftPinnedColumns}
              ownerState={{
                ...ownerState,
                side: GridPinnedPosition.left,
                showCellVerticalBorder: rootProps.showCellVerticalBorder,
              }}
            >
              {getRows({
                renderContext: leftRenderContext,
                minFirstColumn: leftRenderContext.firstColumnIndex,
                maxLastColumn: leftRenderContext.lastColumnIndex,
                availableSpace: 0,
                rows: topPinnedRowsData,
                position: 'left',
              })}
            </VirtualScrollerPinnedColumns>
          )}
          <VirtualScrollerPinnedRowsRenderZone
            className={classes.pinnedRowsRenderZone}
            ref={topPinnedRowsRenderZoneRef}
            role="presentation"
          >
            {topPinnedRows}
          </VirtualScrollerPinnedRowsRenderZone>
          {rightRenderContext && (
            <VirtualScrollerPinnedColumns
              className={classes.rightPinnedColumns}
              ownerState={{
                ...ownerState,
                side: GridPinnedPosition.right,
                showCellVerticalBorder: rootProps.showCellVerticalBorder,
              }}
            >
              {getRows({
                renderContext: rightRenderContext,
                minFirstColumn: rightRenderContext.firstColumnIndex,
                maxLastColumn: rightRenderContext.lastColumnIndex,
                availableSpace: 0,
                rows: topPinnedRowsData,
                position: 'right',
              })}
            </VirtualScrollerPinnedColumns>
          )}
        </VirtualScrollerPinnedRows>
      ) : null}
      <GridVirtualScrollerContent {...contentProps}>
        {leftRenderContext && (
          <VirtualScrollerPinnedColumns
            ref={leftColumns}
            className={classes.leftPinnedColumns}
            ownerState={{
              ...ownerState,
              side: GridPinnedPosition.left,
              showCellVerticalBorder: rootProps.showCellVerticalBorder,
            }}
            style={pinnedColumnsStyle}
          >
            {getRows({
              renderContext: leftRenderContext,
              minFirstColumn: leftRenderContext.firstColumnIndex,
              maxLastColumn: leftRenderContext.lastColumnIndex,
              availableSpace: 0,
              rowIndexOffset: topPinnedRowsData.length,
              position: 'left',
            })}
          </VirtualScrollerPinnedColumns>
        )}
        <GridVirtualScrollerRenderZone {...getRenderZoneProps()}>
          {mainRows}
        </GridVirtualScrollerRenderZone>
        {rightRenderContext && (
          <VirtualScrollerPinnedColumns
            ref={rightColumns}
            ownerState={{
              ...ownerState,
              side: GridPinnedPosition.right,
              showCellVerticalBorder: rootProps.showCellVerticalBorder,
            }}
            className={classes.rightPinnedColumns}
            style={pinnedColumnsStyle}
          >
            {getRows({
              renderContext: rightRenderContext,
              minFirstColumn: rightRenderContext.firstColumnIndex,
              maxLastColumn: rightRenderContext.lastColumnIndex,
              availableSpace: 0,
              rowIndexOffset: topPinnedRowsData.length,
              position: 'right',
            })}
          </VirtualScrollerPinnedColumns>
        )}
        {detailPanels.length > 0 && (
          <VirtualScrollerDetailPanels className={classes.detailPanels} ownerState={ownerState}>
            {detailPanels}
          </VirtualScrollerDetailPanels>
        )}
      </GridVirtualScrollerContent>
      {bottomPinnedRowsData.length > 0 ? (
        <VirtualScrollerPinnedRows
          className={classes.bottomPinnedRows}
          ownerState={{ ...ownerState, position: PinnedRowsPosition.bottom }}
          style={{ width: contentProps.style.width, height: pinnedRowsHeight.bottom }}
          role="rowgroup"
        >
          {leftRenderContext && (
            <VirtualScrollerPinnedColumns
              className={classes.leftPinnedColumns}
              ownerState={{
                ...ownerState,
                side: GridPinnedPosition.left,
                showCellVerticalBorder: rootProps.showCellVerticalBorder,
              }}
            >
              {getRows({
                renderContext: leftRenderContext,
                minFirstColumn: leftRenderContext.firstColumnIndex,
                maxLastColumn: leftRenderContext.lastColumnIndex,
                availableSpace: 0,
                rows: bottomPinnedRowsData,
                rowIndexOffset: topPinnedRowsData.length + (mainRows ? mainRows.length : 0),
                position: 'left',
              })}
            </VirtualScrollerPinnedColumns>
          )}
          <VirtualScrollerPinnedRowsRenderZone
            className={classes.pinnedRowsRenderZone}
            ref={bottomPinnedRowsRenderZoneRef}
            role="presentation"
          >
            {bottomPinnedRows}
          </VirtualScrollerPinnedRowsRenderZone>
          {rightRenderContext && (
            <VirtualScrollerPinnedColumns
              className={classes.rightPinnedColumns}
              ownerState={{
                ...ownerState,
                side: GridPinnedPosition.right,
                showCellVerticalBorder: rootProps.showCellVerticalBorder,
              }}
            >
              {getRows({
                renderContext: rightRenderContext,
                minFirstColumn: rightRenderContext.firstColumnIndex,
                maxLastColumn: rightRenderContext.lastColumnIndex,
                availableSpace: 0,
                rows: bottomPinnedRowsData,
                rowIndexOffset: topPinnedRowsData.length + (mainRows ? mainRows.length : 0),
                position: 'right',
              })}
            </VirtualScrollerPinnedColumns>
          )}
        </VirtualScrollerPinnedRows>
      ) : null}
    </GridVirtualScroller>
  );
});

export { DataGridProVirtualScroller };
