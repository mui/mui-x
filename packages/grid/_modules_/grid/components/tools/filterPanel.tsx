import * as React from 'react';
import {
  Button,
} from '@material-ui/core';
import { allColumnsSelector } from '../../hooks/features/columns/columnsSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { useGridState } from '../../hooks/features/core/useGridState';
import { PREVENT_HIDE_PREFERENCES } from '../../constants/index';
import { FilterItem } from '../../hooks/features/filter/hiddenRowsState';
import { ApiContext } from '../api-context';
import { AddIcon } from '../icons/index';
import { FilterForm } from './filterForm';

export const FilterPanel: React.FC<{}> = () => {
  const apiRef = React.useContext(ApiContext);
  const [gridState] = useGridState(apiRef!);
  const columns = useGridSelector(apiRef, allColumnsSelector);

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

  const addNewFilter = React.useCallback(() => {
    apiRef!.current.upsertFilter({});
  }, [apiRef]);

  const clearFilter = React.useCallback(() => {
    apiRef!.current.clearFilter();
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
        {gridState.filter.items.map((item) => (
          <FilterForm
            key={item.id}
            columns={columns}
            item={item}
            onSelectOpen={dontHidePreferences}
            applyFilterChanges={applyFilter}
            deleteFilter={deleteFilter}
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
        <Button onClick={clearFilter} startIcon={<AddIcon />}>
          Clear
        </Button>
      </div>
    </React.Fragment>
  );
};
