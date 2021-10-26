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

export function GridFilterPanel() {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);

  const hasMultipleFilters = filterModel.items.length > 1;

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

  const addNewFilter = React.useCallback(() => {
    apiRef.current.upsertFilterItem({});
  }, [apiRef]);

  const deleteFilter = React.useCallback(
    (item: GridFilterItem) => {
      apiRef.current.deleteFilterItem(item);
    },
    [apiRef],
  );

  React.useEffect(() => {
    if (filterModel.items.length === 0) {
      addNewFilter();
    }
  }, [addNewFilter, filterModel.items.length]);

  return (
    <GridPanelWrapper>
      <GridPanelContent>
        {filterModel.items.map((item, index) => (
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
