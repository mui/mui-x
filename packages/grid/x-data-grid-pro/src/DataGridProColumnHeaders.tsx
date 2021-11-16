import * as React from 'react';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { getDataGridUtilityClass } from '../../_modules_/grid/gridClasses';
import { useGridRootProps } from '../../_modules_/grid/hooks/utils/useGridRootProps';
import { GridComponentProps } from '../../_modules_/grid/GridComponentProps';
import { useGridColumnHeaders } from '../../_modules_/grid/hooks/features/columnHeaders/useGridColumnHeaders';
import { useGridApiContext } from '../../_modules_/grid/hooks/utils/useGridApiContext';
import { useGridSelector } from '../../_modules_/grid/hooks/utils/useGridSelector';
import { visibleGridColumnsSelector } from '../../_modules_/grid/hooks/features/columns/gridColumnsSelector';
import { useGridApiEventHandler } from '../../_modules_/grid/hooks/utils/useGridApiEventHandler';
import { GridColumnHeadersInner } from '../../_modules_/grid/components/columnHeaders/GridColumnHeadersInner';
import { GridColumnHeaders } from '../../_modules_/grid/components/columnHeaders/GridColumnHeaders';
import { gridPinnedColumnsSelector } from '../../_modules_/grid/hooks/features/columnPinning/columnPinningSelector';
import { GridEvents } from '../../_modules_/grid/constants/eventsConstants';
import { filterColumns } from './DataGridProVirtualScroller';

type OwnerState = {
  classes?: GridComponentProps['classes'];
  leftPinnedColumns: number;
  rightPinnedColumns: number;
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { leftPinnedColumns, rightPinnedColumns, classes } = ownerState;

  const slots = {
    leftPinnedColumns: [
      'pinnedColumnHeaders',
      leftPinnedColumns > 0 && `pinnedColumnHeaders--left`,
    ],
    rightPinnedColumns: [
      'pinnedColumnHeaders',
      rightPinnedColumns > 0 && `pinnedColumnHeaders--right`,
    ],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

interface GridColumnHeadersPinnedColumnHeadersProps {
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

const GridColumnHeadersPinnedColumnHeaders = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PinnedColumnHeaders',
  overridesResolver: (props, styles) => styles.pinnedColumnHeaders,
})<{ ownerState: GridColumnHeadersPinnedColumnHeadersProps }>(({ theme, ownerState }) => ({
  position: 'absolute',
  overflow: 'hidden',
  height: '100%',
  zIndex: 1,
  display: 'flex',
  boxShadow: theme.shadows[2],
  backgroundColor: theme.palette.background.default,
  ...(theme.palette.mode === 'dark' && {
    backgroundImage: `linear-gradient(${alpha('#fff', getOverlayAlpha(2))}, ${alpha(
      '#fff',
      getOverlayAlpha(2),
    )})`,
  }),
  ...(ownerState.side === 'left' && { left: 0 }),
  ...(ownerState.side === 'right' && { right: 0 }),
}));

interface DataGridProColumnHeadersProps extends React.HTMLAttributes<HTMLDivElement> {
  innerRef?: React.Ref<HTMLDivElement>;
}

export const DataGridProColumnHeaders = React.forwardRef<
  HTMLDivElement,
  DataGridProColumnHeadersProps
>(function DataGridProColumnHeaders(props, ref) {
  const { style, className, innerRef, ...other } = props;
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const [scrollbarSize, setScrollbarSize] = React.useState(0);

  const handleContentSizeChange = React.useCallback(() => {
    if (!apiRef.current.windowRef?.current) {
      return;
    }
    // TODO expose scrollbar size on getRootDimensions
    const newScrollbarSize =
      apiRef.current.windowRef.current.offsetWidth - apiRef.current.windowRef.current.clientWidth;
    setScrollbarSize(newScrollbarSize);
  }, [apiRef]);

  useGridApiEventHandler(
    apiRef,
    GridEvents.virtualScrollerContentSizeChange,
    handleContentSizeChange,
  );

  const pinnedColumns = useGridSelector(apiRef, gridPinnedColumnsSelector);
  const leftPinnedColumns = filterColumns(pinnedColumns.left, visibleColumns).length;
  const rightPinnedColumns = filterColumns(pinnedColumns.right, visibleColumns).length;

  const {
    isDragging,
    renderContext,
    updateInnerPosition,
    getRootProps,
    getInnerProps,
    getColumns,
  } = useGridColumnHeaders({
    innerRef,
    minColumnIndex: leftPinnedColumns,
  });

  const ownerState = { leftPinnedColumns, rightPinnedColumns, classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  React.useEffect(() => {
    if (renderContext) {
      updateInnerPosition(renderContext);
    }
  }, [renderContext, updateInnerPosition]);

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

  return (
    <GridColumnHeaders ref={ref} className={className} {...getRootProps(other)}>
      {leftRenderContext && (
        <GridColumnHeadersPinnedColumnHeaders
          className={classes.leftPinnedColumns}
          ownerState={{ side: 'left' }}
        >
          {getColumns(
            {
              renderContext: leftRenderContext,
              minFirstColumn: leftRenderContext.firstColumnIndex,
              maxLastColumn: leftRenderContext.lastColumnIndex,
            },
            { disableReorder: true },
          )}
        </GridColumnHeadersPinnedColumnHeaders>
      )}
      {rightRenderContext && (
        <GridColumnHeadersPinnedColumnHeaders
          ownerState={{ side: 'right' }}
          className={classes.rightPinnedColumns}
          style={{ paddingRight: scrollbarSize }}
        >
          {getColumns(
            {
              renderContext: rightRenderContext,
              minFirstColumn: rightRenderContext.firstColumnIndex,
              maxLastColumn: rightRenderContext.lastColumnIndex,
            },
            { disableReorder: true },
          )}
        </GridColumnHeadersPinnedColumnHeaders>
      )}
      <GridColumnHeadersInner isDragging={isDragging} {...getInnerProps()}>
        {getColumns({
          renderContext,
          minFirstColumn: leftPinnedColumns,
          maxLastColumn: visibleColumns.length - rightPinnedColumns,
        })}
      </GridColumnHeadersInner>
    </GridColumnHeaders>
  );
});
