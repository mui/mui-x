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
import { gridVisibleColumnFieldsSelector } from '../../_modules_/grid/hooks/features/columns/gridColumnsSelector';
import { useGridApiEventHandler } from '../../_modules_/grid/hooks/utils/useGridApiEventHandler';
import { GridEvents } from '../../_modules_/grid/models/events';
import { useGridSelector } from '../../_modules_/grid/hooks/utils/useGridSelector';
import { GridComponentProps } from '../../_modules_/grid/GridComponentProps';
import { getDataGridUtilityClass } from '../../_modules_/grid/gridClasses';
import { gridPinnedColumnsSelector } from '../../_modules_/grid/hooks/features/columnPinning/columnPinningSelector';
import {
  GridPinnedColumns,
  GridPinnedPosition,
} from '../../_modules_/grid/models/api/gridColumnPinningApi';

export const filterColumns = (pinnedColumns: GridPinnedColumns, columns: string[]) => {
  const filter = (newPinnedColumns: any[] | undefined, remaningColumns: string[]) => {
    if (!Array.isArray(newPinnedColumns)) {
      return [];
    }
    return newPinnedColumns.filter((field) => remaningColumns.includes(field));
  };

  const leftPinnedColumns = filter(pinnedColumns.left, columns);
  const columnsWithoutLeftPinnedColumns = columns.filter(
    // Filter out from the remaning columns those columns already pinned to the left
    (field) => !leftPinnedColumns.includes(field),
  );
  const rightPinnedColumns = filter(pinnedColumns.right, columnsWithoutLeftPinnedColumns);
  return [leftPinnedColumns, rightPinnedColumns];
};

type OwnerState = {
  classes: GridComponentProps['classes'];
  leftPinnedColumns: GridPinnedColumns['left'];
  rightPinnedColumns: GridPinnedColumns['right'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes, leftPinnedColumns, rightPinnedColumns } = ownerState;

  const slots = {
    leftPinnedColumns: [
      'pinnedColumns',
      leftPinnedColumns && leftPinnedColumns.length > 0 && 'pinnedColumns--left',
    ],
    rightPinnedColumns: [
      'pinnedColumns',
      rightPinnedColumns && rightPinnedColumns.length > 0 && 'pinnedColumns--right',
    ],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

interface VirtualScrollerPinnedColumnsProps {
  side: GridPinnedPosition;
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
  ...(ownerState.side === GridPinnedPosition.left && { left: 0, float: 'left' }),
  ...(ownerState.side === GridPinnedPosition.right && { right: 0, float: 'right' }),
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
  const visibleColumnFields = useGridSelector(apiRef, gridVisibleColumnFieldsSelector);
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
  const [leftPinnedColumns, rightPinnedColumns] = filterColumns(pinnedColumns, visibleColumnFields);

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
    renderZoneMinColumnIndex: leftPinnedColumns.length,
    renderZoneMaxColumnIndex: visibleColumnFields.length - rightPinnedColumns.length,
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
            ownerState={{ side: GridPinnedPosition.left }}
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
            ownerState={{ side: GridPinnedPosition.right }}
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
