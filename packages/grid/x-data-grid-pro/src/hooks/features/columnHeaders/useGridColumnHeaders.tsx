import * as React from 'react';
import {
  useGridRootProps,
  gridFocusColumnHeaderFilterSelector,
  useGridSelector,
} from '@mui/x-data-grid';
import { styled } from '@mui/system';
import {
  useGridColumnHeaders as useGridColumnHeadersCommunity,
  UseGridColumnHeadersProps,
  GetHeadersParams,
  getTotalHeaderHeight,
  useGridPrivateApiContext,
} from '@mui/x-data-grid/internals';
import { GridHeaderFilterItem } from '../../../components/headerFiltering/GridHeaderFilterItem';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';

export interface UseGridColumnHeadersProProps extends UseGridColumnHeadersProps {}

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
  const { getColumnsToRender, getRootProps, ...otherProps } = useGridColumnHeadersCommunity(props);
  const apiRef = useGridPrivateApiContext();
  const headerFilterMenuRef = React.useRef<HTMLButtonElement | null>(null);
  const rootProps = useGridRootProps() as DataGridProProcessedProps;
  const disableHeaderFiltering = !rootProps.experimentalFeatures?.headerFiltering;
  const headerHeight = Math.floor(rootProps.columnHeaderHeight * props.densityFactor);
  const totalHeaderHeight =
    getTotalHeaderHeight(apiRef, rootProps.columnHeaderHeight) +
    (disableHeaderFiltering ? 0 : rootProps.columnHeaderHeight);

  const columnHeaderFilterFocus = useGridSelector(apiRef, gridFocusColumnHeaderFilterSelector);

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
      const tabIndexField = props.columnHeaderFilterTabIndexState?.field;
      const tabIndex =
        tabIndexField === colDef.field || (isFirstColumn && !props.hasOtherElementInTabSequence)
          ? 0
          : -1;

      filters.push(
        <GridHeaderFilterItem
          key={`${colDef.field}-filter`}
          headerHeight={headerHeight}
          colDef={colDef}
          colIndex={columnIndex}
          hasFocus={hasFocus}
          tabIndex={tabIndex}
          headerFilterMenuRef={headerFilterMenuRef}
          {...other}
        />,
      );
    }

    return (
      <GridHeaderFilterRow ownerState={rootProps} role="row">
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
