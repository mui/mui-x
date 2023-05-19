import * as React from 'react';
import {
  unstable_gridFocusColumnHeaderFilterSelector,
  useGridSelector,
  gridFilterModelSelector,
  unstable_gridTabIndexColumnHeaderFilterSelector,
} from '@mui/x-data-grid';
import { styled } from '@mui/system';
import {
  useGridColumnHeaders as useGridColumnHeadersCommunity,
  UseGridColumnHeadersProps,
  GetHeadersParams,
  getTotalHeaderHeight,
  useGridPrivateApiContext,
  getGridFilter,
} from '@mui/x-data-grid/internals';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';

type OwnerState = DataGridProProcessedProps;

const GridHeaderFilterRow = styled('div', {
  name: 'MuiDataGrid',
  slot: 'HeaderFilterRow',
  overridesResolver: (props, styles) => styles.headerFilterRow,
})<{ ownerState: OwnerState }>(() => ({
  display: 'flex',
  borderTop: '1px solid rgba(224, 224, 224, 1)',
}));

export const useGridColumnHeaders = (props: UseGridColumnHeadersProps) => {
  const apiRef = useGridPrivateApiContext();

  const { headerGroupingMaxDepth, hasOtherElementInTabSequence } = props;
  const columnHeaderFilterTabIndexState = useGridSelector(
    apiRef,
    unstable_gridTabIndexColumnHeaderFilterSelector,
  );
  const { getColumnsToRender, getRootProps, ...otherProps } = useGridColumnHeadersCommunity({
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
  const disableHeaderFiltering = !rootProps.unstable_headerFilters;
  const headerHeight = Math.floor(rootProps.columnHeaderHeight * props.densityFactor);
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const totalHeaderHeight =
    getTotalHeaderHeight(apiRef, rootProps.columnHeaderHeight) +
    (disableHeaderFiltering ? 0 : headerHeight);

  const columnHeaderFilterFocus = useGridSelector(
    apiRef,
    unstable_gridFocusColumnHeaderFilterSelector,
  );

  const getColumnFilters = (params?: GetHeadersParams, other = {}) => {
    if (disableHeaderFiltering) {
      return null;
    }

    const columnsToRender = getColumnsToRender(params);

    if (columnsToRender == null) {
      return null;
    }

    const { renderedColumns, firstColumnToRender } = columnsToRender;

    const filters: JSX.Element[] = [];
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

      let headerFilterComponent: React.ReactNode;
      if (colDef.renderHeaderFilter) {
        headerFilterComponent = colDef.renderHeaderFilter(
          apiRef.current.getColumnHeaderParams(colDef.field),
        );
      }

      const headerClassName =
        typeof colDef.headerClassName === 'function'
          ? colDef.headerClassName({ field: colDef.field, colDef })
          : colDef.headerClassName;

      // TODO: Support for `isAnyOf` operator
      const filterOperators =
        colDef.filterOperators?.filter((operator) => operator.value !== 'isAnyOf') ?? [];

      const item =
        filterModel?.items.find((it) => it.field === colDef.field && it.operator !== 'isAnyOf') ??
        getGridFilter(colDef);

      filters.push(
        <rootProps.slots.headerFilterCell
          colIndex={columnIndex}
          key={`${colDef.field}-filter`}
          height={headerHeight}
          width={colDef.computedWidth}
          colDef={colDef}
          hasFocus={hasFocus}
          tabIndex={tabIndex}
          headerFilterMenuRef={headerFilterMenuRef}
          headerFilterComponent={headerFilterComponent}
          headerClassName={headerClassName}
          filterOperators={filterOperators}
          data-field={colDef.field}
          item={item}
          {...rootProps.slotProps?.headerFilterCell}
          {...other}
        />,
      );
    }

    return (
      <GridHeaderFilterRow
        ref={headerFiltersRef}
        ownerState={rootProps}
        role="row"
        aria-rowindex={headerGroupingMaxDepth + 2}
      >
        {filters}
      </GridHeaderFilterRow>
    );
  };

  const rootStyle = {
    minHeight: totalHeaderHeight,
    maxHeight: totalHeaderHeight,
    lineHeight: `${headerHeight}px`,
  };

  return {
    ...otherProps,
    getColumnFilters,
    getRootProps: disableHeaderFiltering
      ? getRootProps
      : (other = {}) => ({ style: rootStyle, ...other }),
  };
};
