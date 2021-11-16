import * as React from 'react';
import Button from '@mui/material/Button';
import { GridFilterItem, GridLinkOperator } from '../../../models/gridFilterItem';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { GridAddIcon } from '../../icons';
import { GridPanelContent } from '../GridPanelContent';
import { GridPanelFooter } from '../GridPanelFooter';
import { GridPanelWrapper } from '../GridPanelWrapper';
import { GridFilterForm } from './GridFilterForm';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { useGridSelector } from '../../../hooks/utils/useGridSelector';
import { gridFilterModelSelector } from '../../../hooks/features/filter/gridFilterSelector';
import { filterableGridColumnsSelector } from '../../../hooks/features/columns/gridColumnsSelector';

export function GridFilterPanel() {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const filterableColumns = useGridSelector(apiRef, filterableGridColumnsSelector);

  const applyFilter = React.useCallback(
    (item: GridFilterItem) => {
      apiRef.current.upsertFilterItem(item);
    },
    [apiRef],
  );

  const applyFilterLinkOperator = React.useCallback(
    (operator: GridLinkOperator) => {
      apiRef.current.setFilterLinkOperator(operator);
    },
    [apiRef],
  );

  const getDefaultItem = React.useCallback((): GridFilterItem | null => {
    const firstColumnWithOperator = filterableColumns.find(
      (colDef) => colDef.filterOperators?.length,
    );
    if (!firstColumnWithOperator) {
      return null;
    }

    return {
      columnField: firstColumnWithOperator.field,
      operatorValue: firstColumnWithOperator.filterOperators![0].value,
      id: Math.round(Math.random() * 1e5),
    };
  }, [filterableColumns]);

  const items = React.useMemo<GridFilterItem[]>(() => {
    if (filterModel.items.length) {
      return filterModel.items;
    }

    const defaultItem = getDefaultItem();

    return defaultItem ? [defaultItem] : [];
  }, [filterModel.items, getDefaultItem]);

  const hasMultipleFilters = items.length > 1;

  const addNewFilter = () => {
    const defaultItem = getDefaultItem();
    if (!defaultItem) {
      return;
    }
    apiRef.current.setFilterModel({ ...filterModel, items: [...items, defaultItem] });
  };

  const deleteFilter = React.useCallback(
    (item: GridFilterItem) => {
      apiRef.current.deleteFilterItem(item);
    },
    [apiRef],
  );

  return (
    <GridPanelWrapper>
      <GridPanelContent>
        {items.map((item, index) => (
          <GridFilterForm
            key={item.id == null ? index : item.id}
            item={item}
            applyFilterChanges={applyFilter}
            deleteFilter={deleteFilter}
            hasMultipleFilters={hasMultipleFilters}
            showMultiFilterOperators={index > 0}
            multiFilterOperator={filterModel.linkOperator}
            disableMultiFilterOperator={index !== 1}
            applyMultiFilterOperatorChanges={applyFilterLinkOperator}
          />
        ))}
      </GridPanelContent>
      {!rootProps.disableMultipleColumnsFiltering && (
        <GridPanelFooter>
          <Button onClick={addNewFilter} startIcon={<GridAddIcon />} color="primary">
            {apiRef.current.getLocaleText('filterPanelAddFilter')}
          </Button>
        </GridPanelFooter>
      )}
    </GridPanelWrapper>
  );
}
