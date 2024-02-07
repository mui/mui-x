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
  useGridColumnHeaders as useGridColumnHeadersCommunity,
  UseGridColumnHeadersProps,
  GetHeadersParams,
  useGridPrivateApiContext,
  getGridFilter,
  GridStateColDef,
  GridColumnHeaderRow,
} from '@mui/x-data-grid/internals';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
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
  const { getColumnsToRender, ...otherProps } = useGridColumnHeadersCommunity({
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
  const dimensions = apiRef.current.getRootDimensions();
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);

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

  const getColumnFilters = (params?: GetHeadersParams, other = {}) => {
    if (disableHeaderFiltering) {
      return null;
    }

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

      filters.push(
        <rootProps.slots.headerFilterCell
          colIndex={columnIndex}
          key={`${colDef.field}-filter`}
          height={dimensions.headerHeight}
          width={colDef.computedWidth}
          colDef={colDef}
          hasFocus={hasFocus}
          tabIndex={tabIndex}
          headerFilterMenuRef={headerFilterMenuRef}
          headerClassName={headerClassName}
          data-field={colDef.field}
          item={item}
          {...rootProps.slotProps?.headerFilterCell}
          {...other}
        />,
      );
    }

    return (
      <GridColumnHeaderRow
        ref={headerFiltersRef}
        ownerState={{ params }}
        className={classes.headerFilterRow}
        role="row"
        aria-rowindex={headerGroupingMaxDepth + 2}
      >
        {filters}
        {otherProps.getFiller(params, true)}
      </GridColumnHeaderRow>
    );
  };

  return {
    ...otherProps,
    getColumnFilters,
  };
};
