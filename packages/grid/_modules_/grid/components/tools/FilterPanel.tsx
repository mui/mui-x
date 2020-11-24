import * as React from 'react';
import Button from '@material-ui/core/Button';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { useGridState } from '../../hooks/features/core/useGridState';
import { optionsSelector } from '../../hooks/utils/useOptionsProp';
import { FilterItem, LinkOperator } from '../../models/filterItem';
import { ApiContext } from '../api-context';
import { AddIcon } from '../icons/index';
import { FilterForm } from './FilterForm';

export const FilterPanel: React.FC<{}> = () => {
  const apiRef = React.useContext(ApiContext);
  const [gridState] = useGridState(apiRef!);
  const { disableMultipleColumnsFiltering } = useGridSelector(apiRef, optionsSelector);

  const hasMultipleFilters = React.useMemo(() => gridState.filter.items.length > 1, [
    gridState.filter.items.length,
  ]);

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
      <div className="MuiDataGridPanel-container">
        {gridState.filter.items.map((item, index) => (
          <FilterForm
            key={item.id}
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
      </div>
      {!disableMultipleColumnsFiltering && (
        <div className="MuiDataGridPanel-footer">
          <Button onClick={addNewFilter} startIcon={<AddIcon />} color="primary">
            Add Filter
          </Button>
        </div>
      )}
    </React.Fragment>
  );
};
