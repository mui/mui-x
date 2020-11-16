import * as React from 'react';
import { Button } from '@material-ui/core';
import { useGridState } from '../../hooks/features/core/useGridState';
import { PREVENT_HIDE_PREFERENCES } from '../../constants/index';
import { FilterItem, LinkOperator } from '../../hooks/features/filter/visibleRowsState';
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

  return (
    <React.Fragment>
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'auto', flex: '1 1' }}>
        {gridState.filter.items.map((item, index) => (
          <FilterForm
            key={item.id}
            item={item}
            onSelectOpen={dontHidePreferences}
            applyFilterChanges={applyFilter}
            deleteFilter={deleteFilter}
            showMultiFilterOperators={hasMultipleFilters && index > 0}
            multiFilterOperator={gridState.filter.linkOperator}
            disableMultiFilterOperator={index !== 1}
            applyMultiFilterOperatorChanges={applyFilterLinkOperator}
          />
        ))}
      </div>
      <div
        style={{
          paddingTop: 5,
          display: 'inline-flex',
          flexFlow: 'wrap',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          flex: '0 1 50px',
        }}
      >
        <Button onClick={addNewFilter} startIcon={<AddIcon />}>
          Filter
        </Button>
        <Button onClick={clearFilter} startIcon={<CloseIcon />}>
          Clear
        </Button>
      </div>
    </React.Fragment>
  );
};
