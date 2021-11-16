import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { GridRowId } from '../../_modules_/grid/models/gridRows';
import { GridVirtualScroller } from '../../_modules_/grid/components/virtualization/GridVirtualScroller';
import { GridVirtualScrollerContent } from '../../_modules_/grid/components/virtualization/GridVirtualScrollerContent';
import { GridVirtualScrollerRenderZone } from '../../_modules_/grid/components/virtualization/GridVirtualScrollerRenderZone';
import { useGridVirtualScroller } from '../../_modules_/grid/hooks/features/virtualization/useGridVirtualScroller';
import { useGridApiContext } from '../../_modules_/grid/hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../_modules_/grid/hooks/utils/useGridRootProps';
import { visibleGridColumnsSelector } from '../../_modules_/grid/hooks/features/columns/gridColumnsSelector';
import { useGridApiEventHandler } from '../../_modules_/grid/hooks/utils/useGridApiEventHandler';
import { GridEvents } from '../../_modules_/grid/constants/eventsConstants';
import { useGridSelector } from '../../_modules_/grid/hooks/utils/useGridSelector';
import { GridComponentProps } from '../../_modules_/grid/GridComponentProps';
import { getDataGridUtilityClass } from '../../_modules_/grid/gridClasses';
import { gridPinnedColumnsSelector } from '../../_modules_/grid/hooks/features/columnPinning/columnPinningSelector';
import { GridColumns } from '../../_modules_/grid/models/colDef/gridColDef';

export const filterColumns = (newPinnedColumns: string[] | undefined, columns: GridColumns) => {
  if (!Array.isArray(newPinnedColumns)) {
    return [];
  }
  return newPinnedColumns.filter((field) => !!columns.find((column) => column.field === field));
};

type OwnerState = {
  classes: GridComponentProps['classes'];
  leftPinnedColumns: number;
  rightPinnedColumns: number;
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes, leftPinnedColumns, rightPinnedColumns } = ownerState;

  const slots = {
    leftPinnedColumns: ['pinnedColumns', leftPinnedColumns > 0 && 'pinnedColumns--left'],
    rightPinnedColumns: ['pinnedColumns', rightPinnedColumns > 0 && 'pinnedColumns--right'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

interface VirtualScrollerPinnedColumnsProps {
  side: 'left' | 'right';
}

// Inspired by https://github.com/material-components/material-components-ios/blob/bca36107405594d5b7b16265a5b0ed698f85a5ee/components/Elevation/src/UIColor%2BMaterialElevation.m#L61
const getOverlayAlpha = (elevation) => {
  let alphaValue;
  if (elevation < 1) {
    alphaValue = 5.11916 * elevation ** 2;
  } else {
    alphaValue = 4.5 * Math.log(elevation + 1) + 2;
  }
  return alphaValue / 100;
};

const VirtualScrollerPinnedColumns = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PinnedColumns',
})<{ ownerState: VirtualScrollerPinnedColumnsProps }>(({ theme, ownerState }) => ({
  position: 'sticky',
  overflow: 'hidden',
  zIndex: 1,
  boxShadow: theme.shadows[2],
  backgroundColor: theme.palette.background.default,
  ...(theme.palette.mode === 'dark' && {
    backgroundImage: `linear-gradient(${alpha('#fff', getOverlayAlpha(2))}, ${alpha(
      '#fff',
      getOverlayAlpha(2),
    )})`,
  }),
  ...(ownerState.side === 'left' && { left: 0, float: 'left' }),
  ...(ownerState.side === 'right' && { right: 0, float: 'right' }),
}));

interface DataGridProVirtualScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  selectionLookup: Record<string, GridRowId>;
  disableVirtualization?: boolean;
}

const DataGridProVirtualScroller = React.forwardRef<
  HTMLDivElement,
  DataGridProVirtualScrollerProps
>(function DataGridProVirtualScroller(props, ref) {
  const { className, disableVirtualization, selectionLookup, ...other } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const leftColumns = React.useRef<HTMLDivElement>(null);
  const rightColumns = React.useRef<HTMLDivElement>(null);
  const [shouldExtendContent, setShouldExtendContent] = React.useState(false);

  const handleRenderZonePositioning = ({ top }) => {
    if (leftColumns.current) {
      leftColumns.current!.style.transform = `translate3d(0px, ${top}px, 0px)`;
    }
    if (rightColumns.current) {
      rightColumns.current!.style.transform = `translate3d(0px, ${top}px, 0px)`;
    }
  };

  const pinnedColumns = useGridSelector(apiRef, gridPinnedColumnsSelector);
  const leftPinnedColumns = filterColumns(pinnedColumns.left, visibleColumns).length;
  const rightPinnedColumns = filterColumns(pinnedColumns.right, visibleColumns).length;

  const ownerState = { classes: rootProps.classes, leftPinnedColumns, rightPinnedColumns };
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
    renderZoneMinColumnIndex: leftPinnedColumns,
    renderZoneMaxColumnIndex: visibleColumns.length - rightPinnedColumns,
    onRenderZonePositioning: handleRenderZonePositioning,
    ...props,
  });

  const refreshRenderZonePosition = React.useCallback(() => {
    if (renderContext) {
      updateRenderZonePosition(renderContext);
    }
  }, [renderContext, updateRenderZonePosition]);

  useGridApiEventHandler(apiRef, GridEvents.columnWidthChange, refreshRenderZonePosition);
  useGridApiEventHandler(apiRef, GridEvents.columnOrderChange, refreshRenderZonePosition);

  React.useEffect(() => {
    refreshRenderZonePosition();
  }, [refreshRenderZonePosition]);

  const handleContentSizeChange = React.useCallback(() => {
    if (!apiRef.current.windowRef?.current) {
      return;
    }
    setShouldExtendContent(
      apiRef.current.windowRef.current.scrollHeight <=
        apiRef.current.windowRef.current.clientHeight,
    );
  }, [apiRef]);

  useGridApiEventHandler(
    apiRef,
    GridEvents.virtualScrollerContentSizeChange,
    handleContentSizeChange,
  );

  const leftRenderContext =
    renderContext && leftPinnedColumns
      ? {
          ...renderContext,
          firstColumnIndex: 0,
          lastColumnIndex: leftPinnedColumns,
        }
      : null;

  const rightRenderContext =
    renderContext && rightPinnedColumns
      ? {
          ...renderContext,
          firstColumnIndex: visibleColumns.length - rightPinnedColumns,
          lastColumnIndex: visibleColumns.length,
        }
      : null;

  const contentStyle = {
    minHeight: shouldExtendContent ? '100%' : 'auto',
  };

  const pinnedColumnsStyle = {
    minHeight: shouldExtendContent ? '100%' : 'auto',
  };

  return (
    <GridVirtualScroller {...getRootProps(other)}>
      <GridVirtualScrollerContent {...getContentProps({ style: contentStyle })}>
        {leftRenderContext && (
          <VirtualScrollerPinnedColumns
            ref={leftColumns}
            className={classes.leftPinnedColumns}
            ownerState={{ side: 'left' }}
            style={pinnedColumnsStyle}
          >
            {getRows({
              renderContext: leftRenderContext,
              minFirstColumn: leftRenderContext.firstColumnIndex,
              maxLastColumn: leftRenderContext.lastColumnIndex,
              availableSpace: 0,
            })}
          </VirtualScrollerPinnedColumns>
        )}
        {rightRenderContext && (
          <VirtualScrollerPinnedColumns
            ref={rightColumns}
            ownerState={{ side: 'right' }}
            className={classes.rightPinnedColumns}
            style={pinnedColumnsStyle}
          >
            {getRows({
              renderContext: rightRenderContext,
              minFirstColumn: rightRenderContext.firstColumnIndex,
              maxLastColumn: rightRenderContext.lastColumnIndex,
              availableSpace: 0,
            })}
          </VirtualScrollerPinnedColumns>
        )}
        <GridVirtualScrollerRenderZone {...getRenderZoneProps()}>
          {getRows({ renderContext })}
        </GridVirtualScrollerRenderZone>
      </GridVirtualScrollerContent>
    </GridVirtualScroller>
  );
});

export { DataGridProVirtualScroller };
