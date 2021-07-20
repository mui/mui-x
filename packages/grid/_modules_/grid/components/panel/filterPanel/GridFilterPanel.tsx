import * as React from 'react';
import Button from '@material-ui/core/Button';
import { useGridSelector } from '../../../hooks/features/core/useGridSelector';
import { useGridState } from '../../../hooks/features/core/useGridState';
import { optionsSelector } from '../../../hooks/utils/optionsSelector';
import { GridFilterItem, GridLinkOperator } from '../../../models/gridFilterItem';
import { useGridApiContext } from '../../../hooks/root/useGridApiContext';
import { GridAddIcon } from '../../icons/index';
import { GridPanelContent } from '../GridPanelContent';
import { GridPanelFooter } from '../GridPanelFooter';
import { GridPanelWrapper } from '../GridPanelWrapper';
import { GridFilterForm } from './GridFilterForm';

export function GridFilterPanel() {
  const apiRef = useGridApiContext();
  const [gridState] = useGridState(apiRef!);
  const { disableMultipleColumnsFiltering } = useGridSelector(apiRef, optionsSelector);

  const hasMultipleFilters = React.useMemo(
    () => gridState.filter.items.length > 1,
    [gridState.filter.items.length],
  );

  const applyFilter = React.useCallback(
    (item: GridFilterItem) => {
      apiRef!.current.upsertFilter(item);
    },
    [apiRef],
  );

  const applyFilterLinkOperator = React.useCallback(
    (operator: GridLinkOperator) => {
      apiRef!.current.applyFilterLinkOperator(operator);
    },
    [apiRef],
  );

  const addNewFilter = React.useCallback(() => {
    apiRef!.current.upsertFilter({});
  }, [apiRef]);

  const deleteFilter = React.useCallback(
    (item: GridFilterItem) => {
      apiRef!.current.deleteFilter(item);
    },
    [apiRef],
  );

  React.useEffect(() => {
    if (gridState.filter.items.length === 0) {
      addNewFilter();
    }
  }, [addNewFilter, gridState.filter.items.length]);

  return (
    <GridPanelWrapper>
      <GridPanelContent>
        {gridState.filter.items.map((item, index) => (
          <GridFilterForm
            key={item.id == null ? index : item.id}
            item={item}
            applyFilterChanges={applyFilter}
            deleteFilter={deleteFilter}
            hasMultipleFilters={hasMultipleFilters}
            showMultiFilterOperators={index > 0}
            multiFilterOperator={gridState.filter.linkOperator}
            disableMultiFilterOperator={index !== 1}
            applyMultiFilterOperatorChanges={applyFilterLinkOperator}
          />
        ))}
      </GridPanelContent>
      {!disableMultipleColumnsFiltering && (
        <GridPanelFooter>
          <Button onClick={addNewFilter} startIcon={<GridAddIcon />} color="primary">
            {apiRef!.current.getLocaleText('filterPanelAddFilter')}
          </Button>
        </GridPanelFooter>
      )}
    </GridPanelWrapper>
  );
}
