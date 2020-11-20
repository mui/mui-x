import * as React from 'react';
import { Button } from '@material-ui/core';
import { useGridState } from '../../hooks/features/core/useGridState';
import { PREVENT_HIDE_PREFERENCES } from '../../constants/index';
import { FilterItem, LinkOperator } from '../../models/filterItem';
import { ApiContext } from '../api-context';
import { AddIcon, CloseIcon } from '../icons/index';
import { FilterForm } from './FilterForm';

export const FilterPanel: React.FC<{}> = () => {
  const apiRef = React.useContext(ApiContext);
  const [gridState] = useGridState(apiRef!);
  const hasMultipleFilters = React.useMemo(() => gridState.filter.items.length > 1, [
    gridState.filter.items.length,
  ]);

  const dontHidePreferences = React.useCallback(
    (event: React.ChangeEvent<{}>) => {
      apiRef!.current.publishEvent(PREVENT_HIDE_PREFERENCES, {});
      event.preventDefault();
    },
    [apiRef],
  );

  const applyFilter = React.useCallback(
    (item: FilterItem) => {
      apiRef!.current.upsertFilter(item);
    },
    [apiRef],
  );

  const applyFilterLinkOperator = React.useCallback(
    (operator: LinkOperator) => {
      apiRef!.current.applyFilterLinkOperator(operator);
    },
    [apiRef],
  );

  const addNewFilter = React.useCallback(() => {
    apiRef!.current.upsertFilter({});
  }, [apiRef]);

  const clearFilter = React.useCallback(() => {
    apiRef!.current.clearFilters();
  }, [apiRef]);

  const deleteFilter = React.useCallback(
    (item: FilterItem) => {
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
    <React.Fragment>
      <div className="panelMainContainer">
        {gridState.filter.items.map((item, index) => (
          <FilterForm
            key={item.id}
            item={item}
            onSelectOpen={dontHidePreferences}
            applyFilterChanges={applyFilter}
            deleteFilter={deleteFilter}
            hasMultipleFilters={hasMultipleFilters}
            showMultiFilterOperators={index > 0}
            multiFilterOperator={gridState.filter.linkOperator}
            disableMultiFilterOperator={index !== 1}
            applyMultiFilterOperatorChanges={applyFilterLinkOperator}
          />
        ))}
      </div>
      <div className="panelFooter">
        <Button onClick={clearFilter} startIcon={<CloseIcon />} color="primary">
          Clear
        </Button>
        <Button onClick={addNewFilter} startIcon={<AddIcon />} color="primary">
          Filter
        </Button>
      </div>
    </React.Fragment>
  );
};
