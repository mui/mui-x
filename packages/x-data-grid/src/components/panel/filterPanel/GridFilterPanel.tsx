import * as React from 'react';
import PropTypes from 'prop-types';
import { SxProps, Theme } from '@mui/material/styles';
import { GridFilterItem, GridLogicOperator } from '../../../models/gridFilterItem';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { GridPanelContent } from '../GridPanelContent';
import { GridPanelFooter } from '../GridPanelFooter';
import { GridPanelWrapper } from '../GridPanelWrapper';
import { GridFilterForm, GridFilterFormProps } from './GridFilterForm';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { useGridSelector } from '../../../hooks/utils/useGridSelector';
import { gridFilterModelSelector } from '../../../hooks/features/filter/gridFilterSelector';
import {
  gridFilterableColumnDefinitionsSelector,
  gridFilterableColumnLookupSelector,
} from '../../../hooks/features/columns/gridColumnsSelector';
import { GridColDef, GridStateColDef } from '../../../models/colDef/gridColDef';

export interface GetColumnForNewFilterArgs {
  currentFilters: GridFilterItem[];
  columns: GridStateColDef[];
}

export interface GridFilterPanelProps
  extends Pick<GridFilterFormProps, 'logicOperators' | 'columnsSort'> {
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

const getGridFilter = (col: GridStateColDef): GridFilterItem => ({
  field: col.field,
  operator: col.filterOperators![0].value,
  id: Math.round(Math.random() * 1e5),
});

const GridFilterPanel = React.forwardRef<HTMLDivElement, GridFilterPanelProps>(
  function GridFilterPanel(props, ref) {
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
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
      ...other
    } = props;

    const applyFilter = apiRef.current.upsertFilterItem;

    const applyFilterLogicOperator = React.useCallback(
      (operator: GridLogicOperator) => {
        apiRef.current.setFilterLogicOperator(operator);
      },
      [apiRef],
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
      apiRef.current.upsertFilterItems([...items, newFilter]);
    }, [apiRef, getNewFilter, items]);

    const deleteFilter = React.useCallback(
      (item: GridFilterItem) => {
        const shouldCloseFilterPanel = validFilters.length === 1;
        apiRef.current.deleteFilterItem(item);
        if (shouldCloseFilterPanel) {
          apiRef.current.hideFilterPanel();
        }
      },
      [apiRef, validFilters.length],
    );

    const handleRemoveAll = React.useCallback(() => {
      if (validFilters.length === 1 && validFilters[0].value === undefined) {
        apiRef.current.deleteFilterItem(validFilters[0]);
        return apiRef.current.hideFilterPanel();
      }
      return apiRef.current.setFilterModel(
        { ...filterModel, items: readOnlyFilters },
        'removeAllFilterItems',
      );
    }, [apiRef, readOnlyFilters, filterModel, validFilters]);

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
      <GridPanelWrapper ref={ref} {...other}>
        <GridPanelContent>
          {readOnlyFilters.map((item, index) => (
            <GridFilterForm
              key={item.id == null ? index : item.id}
              item={item}
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
            <GridFilterForm
              key={item.id == null ? index + readOnlyFilters.length : item.id}
              item={item}
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

GridFilterPanel.propTypes = {
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
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

/**
 * Demos:
 * - [Filtering - overview](https://mui.com/x/react-data-grid/filtering/)
 *
 * API:
 * - [GridFilterPanel API](https://mui.com/x/api/data-grid/grid-filter-panel/)
 */
export { GridFilterPanel, getGridFilter };
