import * as React from 'react';
import {
  gridFocusColumnHeaderFilterSelector,
  useGridSelector,
  gridFilterModelSelector,
  gridTabIndexColumnHeaderFilterSelector,
  getDataGridUtilityClass,
  GridFilterItem,
} from '@mui/x-data-grid';
import {
  gridColumnsTotalWidthSelector,
  gridHasFillerSelector,
  gridHeaderFilterHeightSelector,
  gridVerticalScrollbarWidthSelector,
  useGridColumnHeaders as useGridColumnHeadersCommunity,
  UseGridColumnHeadersProps,
  GetHeadersParams,
  useGridPrivateApiContext,
  getGridFilter,
  GridStateColDef,
  GridColumnHeaderRow,
  shouldCellShowLeftBorder,
  shouldCellShowRightBorder,
  PinnedColumnPosition,
} from '@mui/x-data-grid/internals';
import composeClasses from '@mui/utils/composeClasses';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';

type OwnerState = DataGridProProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;
  return React.useMemo(() => {
    const slots = {
      headerFilterRow: ['headerFilterRow'],
    };

    return composeClasses(slots, getDataGridUtilityClass, classes);
  }, [classes]);
};

const filterItemsCache: Record<GridStateColDef['field'], GridFilterItem> = Object.create(null);

export const useGridColumnHeaders = (props: UseGridColumnHeadersProps) => {
  const apiRef = useGridPrivateApiContext();
  const { headerGroupingMaxDepth, hasOtherElementInTabSequence } = props;
  const columnHeaderFilterTabIndexState = useGridSelector(
    apiRef,
    gridTabIndexColumnHeaderFilterSelector,
  );
  const {
    getColumnsToRender,
    getPinnedCellOffset,
    renderContext,
    leftRenderContext,
    rightRenderContext,
    pinnedColumns,
    visibleColumns,
    columnPositions,
    ...otherProps
  } = useGridColumnHeadersCommunity({
    ...props,
    hasOtherElementInTabSequence:
      hasOtherElementInTabSequence || columnHeaderFilterTabIndexState !== null,
  });
  const headerFiltersRef = React.useRef<HTMLDivElement>(null);
  apiRef.current.register('private', {
    headerFiltersElementRef: headerFiltersRef,
  });
  const headerFilterMenuRef = React.useRef<HTMLButtonElement | null>(null);
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);
  const disableHeaderFiltering = !rootProps.headerFilters;
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const columnsTotalWidth = useGridSelector(apiRef, gridColumnsTotalWidthSelector);
  const gridHasFiller = useGridSelector(apiRef, gridHasFillerSelector);
  const headerFilterHeight = useGridSelector(apiRef, gridHeaderFilterHeightSelector);
  const scrollbarWidth = useGridSelector(apiRef, gridVerticalScrollbarWidthSelector);

  const columnHeaderFilterFocus = useGridSelector(apiRef, gridFocusColumnHeaderFilterSelector);

  const getFilterItem = React.useCallback(
    (colDef: GridStateColDef) => {
      const filterModelItem = filterModel?.items.find(
        (it) => it.field === colDef.field && it.operator !== 'isAnyOf',
      );
      if (filterModelItem != null) {
        // there's a valid `filterModelItem` for this column
        return filterModelItem;
      }
      const defaultCachedItem = filterItemsCache[colDef.field];
      if (defaultCachedItem != null) {
        // there's a cached `defaultItem` for this column
        return defaultCachedItem;
      }
      // there's no cached `defaultItem` for this column, let's generate one and cache it
      const defaultItem = getGridFilter(colDef);
      filterItemsCache[colDef.field] = defaultItem;
      return defaultItem;
    },
    [filterModel],
  );

  const getColumnFilters = (params?: GetHeadersParams) => {
    const { renderedColumns, firstColumnToRender } = getColumnsToRender(params);

    const filters: React.JSX.Element[] = [];
    for (let i = 0; i < renderedColumns.length; i += 1) {
      const colDef = renderedColumns[i];
      const columnIndex = firstColumnToRender + i;
      const hasFocus = columnHeaderFilterFocus?.field === colDef.field;
      const isFirstColumn = columnIndex === 0;
      const tabIndexField = columnHeaderFilterTabIndexState?.field;
      const tabIndex =
        tabIndexField === colDef.field || (isFirstColumn && !props.hasOtherElementInTabSequence)
          ? 0
          : -1;

      const headerClassName =
        typeof colDef.headerClassName === 'function'
          ? colDef.headerClassName({ field: colDef.field, colDef })
          : colDef.headerClassName;

      const item = getFilterItem(colDef);

      const pinnedPosition = params?.position;
      const pinnedOffset = getPinnedCellOffset(
        pinnedPosition,
        colDef.computedWidth,
        columnIndex,
        columnPositions,
        columnsTotalWidth,
        scrollbarWidth,
      );

      const indexInSection = i;
      const sectionLength = renderedColumns.length;

      const showLeftBorder = shouldCellShowLeftBorder(pinnedPosition, indexInSection);
      const showRightBorder = shouldCellShowRightBorder(
        pinnedPosition,
        indexInSection,
        sectionLength,
        rootProps.showCellVerticalBorder,
        gridHasFiller,
      );

      filters.push(
        <rootProps.slots.headerFilterCell
          colIndex={columnIndex}
          key={`${colDef.field}-filter`}
          height={headerFilterHeight}
          width={colDef.computedWidth}
          colDef={colDef}
          hasFocus={hasFocus}
          tabIndex={tabIndex}
          headerFilterMenuRef={headerFilterMenuRef}
          headerClassName={headerClassName}
          data-field={colDef.field}
          item={item}
          pinnedPosition={pinnedPosition}
          pinnedOffset={pinnedOffset}
          showLeftBorder={showLeftBorder}
          showRightBorder={showRightBorder}
          {...rootProps.slotProps?.headerFilterCell}
        />,
      );
    }

    return otherProps.getFillers(params, filters, 0, true);
  };

  const getColumnFiltersRow = () => {
    if (disableHeaderFiltering) {
      return null;
    }

    return (
      <GridColumnHeaderRow
        ref={headerFiltersRef}
        className={classes.headerFilterRow}
        role="row"
        aria-rowindex={headerGroupingMaxDepth + 2}
        ownerState={rootProps}
      >
        {leftRenderContext &&
          getColumnFilters({
            position: PinnedColumnPosition.LEFT,
            renderContext: leftRenderContext,
            maxLastColumn: leftRenderContext.lastColumnIndex,
          })}
        {getColumnFilters({
          renderContext,
          maxLastColumn: visibleColumns.length - pinnedColumns.right.length,
        })}
        {rightRenderContext &&
          getColumnFilters({
            position: PinnedColumnPosition.RIGHT,
            renderContext: rightRenderContext,
            maxLastColumn: rightRenderContext.lastColumnIndex,
          })}
      </GridColumnHeaderRow>
    );
  };

  return {
    ...otherProps,
    getColumnFiltersRow,
  };
};
