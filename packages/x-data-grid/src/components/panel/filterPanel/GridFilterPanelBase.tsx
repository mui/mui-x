'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import type { SxProps, Theme } from '@mui/material/styles';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { GridLogicOperator } from '../../../models/gridFilterItem';
import type { GridFilterItem } from '../../../models/gridFilterItem';
import type { GridFilterModel } from '../../../models/gridFilterModel';
import type { GridControlledStateReasonLookup } from '../../../models/events';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { GridPanelContent } from '../GridPanelContent';
import { GridPanelFooter } from '../GridPanelFooter';
import { GridPanelWrapper } from '../GridPanelWrapper';
import { GridFilterFormBase } from './GridFilterFormBase';
import type { GridFilterFormProps } from './GridFilterFormBase';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { useGridSelector } from '../../../hooks/utils/useGridSelector';
import {
  gridFilterableColumnDefinitionsSelector,
  gridFilterableColumnLookupSelector,
} from '../../../hooks/features/columns/gridColumnsSelector';
import {
  upsertFilterItemInModel,
  upsertFilterItemsInModel,
  deleteFilterItemFromModel,
  setFilterLogicOperatorInModel,
} from '../../../hooks/features/filter/gridFilterUtils';
import type { GridColDef, GridStateColDef } from '../../../models/colDef/gridColDef';

export interface GetColumnForNewFilterArgs {
  currentFilters: GridFilterItem[];
  columns: GridStateColDef[];
}

export interface GridFilterPanelProps extends Pick<
  GridFilterFormProps,
  'logicOperators' | 'columnsSort'
> {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * Function that returns the next filter item to be picked as default filter.
   * @param {GetColumnForNewFilterArgs} args Currently configured filters and columns.
   * @returns {GridColDef['field']} The field to be used for the next filter or `null` to prevent adding a filter.
   */
  getColumnForNewFilter?: (args: GetColumnForNewFilterArgs) => GridColDef['field'] | null;
  /**
   * Props passed to each filter form.
   */
  filterFormProps?: Pick<
    GridFilterFormProps,
    | 'columnsSort'
    | 'deleteIconProps'
    | 'logicOperatorInputProps'
    | 'operatorInputProps'
    | 'columnInputProps'
    | 'valueInputProps'
    | 'filterColumns'
  >;

  /**
   * If `true`, the `Add filter` button will not be displayed.
   * @default false
   */
  disableAddFilterButton?: boolean;
  /**
   * If `true`, the `Remove all` button will be disabled
   * @default false
   */
  disableRemoveAllButton?: boolean;
  /**
   * @ignore - do not document.
   */
  children?: React.ReactNode;
}

export interface GridFilterPanelBaseProps extends GridFilterPanelProps {
  /**
   * The filter model edited by the panel.
   */
  filterModel: GridFilterModel;
  /**
   * Callback fired when the filter model is changed through the panel.
   * @param {GridFilterModel} model The new filter model.
   * @param {GridControlledStateReasonLookup['filter']} reason The reason for the model to have changed.
   */
  onFilterModelChange: (
    model: GridFilterModel,
    reason?: GridControlledStateReasonLookup['filter'],
  ) => void;
  /**
   * Callback fired when the panel requests to be closed, e.g. after the last filter is removed.
   * In `GridFilterPanel` it hides the grid filter panel; for standalone usage it is a no-op
   * unless provided.
   */
  onClose?: () => void;
}

const getGridFilter = (col: GridStateColDef): GridFilterItem => ({
  field: col.field,
  operator: col.filterOperators![0].value,
  id: Math.round(Math.random() * 1e5),
});

const GridFilterPanelBase = forwardRef<HTMLDivElement, GridFilterPanelBaseProps>(
  function GridFilterPanelBase(props, ref) {
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const filterableColumns = useGridSelector(apiRef, gridFilterableColumnDefinitionsSelector);
    const filterableColumnsLookup = useGridSelector(apiRef, gridFilterableColumnLookupSelector);
    const lastFilterRef = React.useRef<any>(null);
    const placeholderFilter = React.useRef<GridFilterItem | null>(null);

    const {
      logicOperators = [GridLogicOperator.And, GridLogicOperator.Or],
      columnsSort,
      filterFormProps,
      getColumnForNewFilter,
      children,
      disableAddFilterButton = false,
      disableRemoveAllButton = false,
      filterModel,
      onFilterModelChange,
      onClose,
      ...other
    } = props;

    const applyFilter = React.useCallback(
      (item: GridFilterItem) => {
        onFilterModelChange(upsertFilterItemInModel(filterModel, item), 'upsertFilterItem');
      },
      [filterModel, onFilterModelChange],
    );

    const applyFilterLogicOperator = React.useCallback(
      (operator: GridLogicOperator) => {
        onFilterModelChange(
          setFilterLogicOperatorInModel(filterModel, operator),
          'changeLogicOperator',
        );
      },
      [filterModel, onFilterModelChange],
    );

    const getDefaultFilter = React.useCallback((): GridFilterItem | null => {
      let nextColumnWithOperator;
      if (getColumnForNewFilter && typeof getColumnForNewFilter === 'function') {
        // To allow override the column for default (first) filter
        const nextFieldName = getColumnForNewFilter({
          currentFilters: filterModel?.items || [],
          columns: filterableColumns,
        });

        if (nextFieldName === null) {
          return null;
        }

        nextColumnWithOperator = filterableColumns.find(({ field }) => field === nextFieldName);
      } else {
        nextColumnWithOperator = filterableColumns.find((colDef) => colDef.filterOperators?.length);
      }

      if (!nextColumnWithOperator) {
        return null;
      }

      return getGridFilter(nextColumnWithOperator);
    }, [filterModel?.items, filterableColumns, getColumnForNewFilter]);

    const getNewFilter = React.useCallback((): GridFilterItem | null => {
      if (getColumnForNewFilter === undefined || typeof getColumnForNewFilter !== 'function') {
        return getDefaultFilter();
      }

      const currentFilters = filterModel.items.length
        ? filterModel.items
        : [getDefaultFilter()].filter(Boolean);

      // If no items are there in filterModel, we have to pass defaultFilter
      const nextColumnFieldName = getColumnForNewFilter({
        currentFilters: currentFilters as GridFilterItem[],
        columns: filterableColumns,
      });

      if (nextColumnFieldName === null) {
        return null;
      }

      const nextColumnWithOperator = filterableColumns.find(
        ({ field }) => field === nextColumnFieldName,
      );

      if (!nextColumnWithOperator) {
        return null;
      }

      return getGridFilter(nextColumnWithOperator);
    }, [filterModel.items, filterableColumns, getColumnForNewFilter, getDefaultFilter]);

    const items = React.useMemo<GridFilterItem[]>(() => {
      if (filterModel.items.length) {
        return filterModel.items;
      }

      if (!placeholderFilter.current) {
        placeholderFilter.current = getDefaultFilter();
      }

      return placeholderFilter.current ? [placeholderFilter.current] : [];
    }, [filterModel.items, getDefaultFilter]);

    const hasMultipleFilters = items.length > 1;

    const { readOnlyFilters, validFilters } = React.useMemo<{
      readOnlyFilters: GridFilterItem[];
      validFilters: GridFilterItem[];
    }>(
      () =>
        items.reduce(
          (acc, item) => {
            if (filterableColumnsLookup[item.field]) {
              acc.validFilters.push(item);
            } else {
              acc.readOnlyFilters.push(item);
            }
            return acc;
          },
          { readOnlyFilters: [] as GridFilterItem[], validFilters: [] as GridFilterItem[] },
        ),
      [items, filterableColumnsLookup],
    );

    const addNewFilter = React.useCallback(() => {
      const newFilter = getNewFilter();
      if (!newFilter) {
        return;
      }
      onFilterModelChange(
        upsertFilterItemsInModel(filterModel, [...items, newFilter]),
        'upsertFilterItems',
      );
    }, [filterModel, onFilterModelChange, getNewFilter, items]);

    const deleteFilter = React.useCallback(
      (item: GridFilterItem) => {
        const shouldCloseFilterPanel = validFilters.length === 1;
        onFilterModelChange(deleteFilterItemFromModel(filterModel, item), 'deleteFilterItem');
        if (shouldCloseFilterPanel) {
          onClose?.();
        }
      },
      [filterModel, onFilterModelChange, onClose, validFilters.length],
    );

    const handleRemoveAll = React.useCallback(() => {
      if (validFilters.length === 1 && validFilters[0].value === undefined) {
        onFilterModelChange(
          deleteFilterItemFromModel(filterModel, validFilters[0]),
          'deleteFilterItem',
        );
        onClose?.();
        return;
      }
      onFilterModelChange({ ...filterModel, items: readOnlyFilters }, 'removeAllFilterItems');
    }, [filterModel, onFilterModelChange, onClose, readOnlyFilters, validFilters]);

    React.useEffect(() => {
      if (
        logicOperators.length > 0 &&
        filterModel.logicOperator &&
        !logicOperators.includes(filterModel.logicOperator)
      ) {
        applyFilterLogicOperator(logicOperators[0]);
      }
    }, [logicOperators, applyFilterLogicOperator, filterModel.logicOperator]);

    React.useEffect(() => {
      if (validFilters.length > 0) {
        lastFilterRef.current!.focus();
      }
    }, [validFilters.length]);

    return (
      <GridPanelWrapper {...other} ref={ref}>
        <GridPanelContent>
          {readOnlyFilters.map((item, index) => (
            <GridFilterFormBase
              key={item.id == null ? index : item.id}
              item={item}
              filterModel={filterModel}
              applyFilterChanges={applyFilter}
              deleteFilter={deleteFilter}
              hasMultipleFilters={hasMultipleFilters}
              showMultiFilterOperators={index > 0}
              disableMultiFilterOperator={index !== 1}
              applyMultiFilterOperatorChanges={applyFilterLogicOperator}
              focusElementRef={null}
              readOnly
              logicOperators={logicOperators}
              columnsSort={columnsSort}
              {...filterFormProps}
            />
          ))}
          {validFilters.map((item, index) => (
            <GridFilterFormBase
              key={item.id == null ? index + readOnlyFilters.length : item.id}
              item={item}
              filterModel={filterModel}
              applyFilterChanges={applyFilter}
              deleteFilter={deleteFilter}
              hasMultipleFilters={hasMultipleFilters}
              showMultiFilterOperators={readOnlyFilters.length + index > 0}
              disableMultiFilterOperator={readOnlyFilters.length + index !== 1}
              applyMultiFilterOperatorChanges={applyFilterLogicOperator}
              focusElementRef={index === validFilters.length - 1 ? lastFilterRef : null}
              logicOperators={logicOperators}
              columnsSort={columnsSort}
              {...filterFormProps}
            />
          ))}
        </GridPanelContent>
        {!rootProps.disableMultipleColumnsFiltering &&
        !(disableAddFilterButton && disableRemoveAllButton) ? (
          <GridPanelFooter>
            {!disableAddFilterButton ? (
              <rootProps.slots.baseButton
                onClick={addNewFilter}
                startIcon={<rootProps.slots.filterPanelAddIcon />}
                {...rootProps.slotProps?.baseButton}
              >
                {apiRef.current.getLocaleText('filterPanelAddFilter')}
              </rootProps.slots.baseButton>
            ) : (
              <span />
            )}

            {!disableRemoveAllButton && validFilters.length > 0 ? (
              <rootProps.slots.baseButton
                onClick={handleRemoveAll}
                startIcon={<rootProps.slots.filterPanelRemoveAllIcon />}
                {...rootProps.slotProps?.baseButton}
              >
                {apiRef.current.getLocaleText('filterPanelRemoveAll')}
              </rootProps.slots.baseButton>
            ) : null}
          </GridPanelFooter>
        ) : null}
      </GridPanelWrapper>
    );
  },
);

GridFilterPanelBase.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * @ignore - do not document.
   */
  children: PropTypes.node,
  /**
   * Changes how the options in the columns selector should be ordered.
   * If not specified, the order is derived from the `columns` prop.
   */
  columnsSort: PropTypes.oneOf(['asc', 'desc']),
  /**
   * If `true`, the `Add filter` button will not be displayed.
   * @default false
   */
  disableAddFilterButton: PropTypes.bool,
  /**
   * If `true`, the `Remove all` button will be disabled
   * @default false
   */
  disableRemoveAllButton: PropTypes.bool,
  /**
   * Props passed to each filter form.
   */
  filterFormProps: PropTypes.shape({
    columnInputProps: PropTypes.any,
    columnsSort: PropTypes.oneOf(['asc', 'desc']),
    deleteIconProps: PropTypes.any,
    filterColumns: PropTypes.func,
    logicOperatorInputProps: PropTypes.any,
    operatorInputProps: PropTypes.any,
    valueInputProps: PropTypes.any,
  }),
  /**
   * The filter model edited by the panel.
   */
  filterModel: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        field: PropTypes.string.isRequired,
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        operator: PropTypes.string.isRequired,
        value: PropTypes.any,
      }),
    ).isRequired,
    logicOperator: PropTypes.oneOf(['and', 'or']),
    quickFilterExcludeHiddenColumns: PropTypes.bool,
    quickFilterLogicOperator: PropTypes.oneOf(['and', 'or']),
    quickFilterValues: PropTypes.array,
  }).isRequired,
  /**
   * Function that returns the next filter item to be picked as default filter.
   * @param {GetColumnForNewFilterArgs} args Currently configured filters and columns.
   * @returns {GridColDef['field']} The field to be used for the next filter or `null` to prevent adding a filter.
   */
  getColumnForNewFilter: PropTypes.func,
  /**
   * Sets the available logic operators.
   * @default [GridLogicOperator.And, GridLogicOperator.Or]
   */
  logicOperators: PropTypes.arrayOf(PropTypes.oneOf(['and', 'or']).isRequired),
  /**
   * Callback fired when the panel requests to be closed, e.g. after the last filter is removed.
   * In `GridFilterPanel` it hides the grid filter panel; for standalone usage it is a no-op
   * unless provided.
   */
  onClose: PropTypes.func,
  /**
   * Callback fired when the filter model is changed through the panel.
   * @param {GridFilterModel} model The new filter model.
   * @param {GridControlledStateReasonLookup['filter']} reason The reason for the model to have changed.
   */
  onFilterModelChange: PropTypes.func.isRequired,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

/**
 * The lower-level filter panel used by `GridFilterPanel`.
 * Unlike `GridFilterPanel`, it does not read or mutate the grid filter state — the model is
 * provided through the `filterModel` prop and edits are reported through `onFilterModelChange`,
 * which makes it usable with a controlled (draft) filter model.
 *
 * Demos:
 * - [Filtering - overview](https://mui.com/x/react-data-grid/filtering/)
 *
 * API:
 * - [GridFilterPanelBase API](https://mui.com/x/api/data-grid/grid-filter-panel-base/)
 */
export { GridFilterPanelBase, getGridFilter };
