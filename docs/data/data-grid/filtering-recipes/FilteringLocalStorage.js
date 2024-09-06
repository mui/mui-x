import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

const createFilterModelStore = () => {
  let listeners = [];
  const lsKey = 'gridFilterModel';
  const emptyModel = 'null';

  return {
    subscribe: (callback) => {
      listeners.push(callback);
      return () => {
        listeners = listeners.filter((listener) => listener !== callback);
      };
    },
    getSnapshot: () => {
      try {
        return localStorage.getItem(lsKey) || emptyModel;
      } catch (error) {
        return emptyModel;
      }
    },
    getServerSnapshot: () => {
      return emptyModel;
    },
    update: (filterModel) => {
      localStorage.setItem(lsKey, JSON.stringify(filterModel));
      listeners.forEach((listener) => listener());
    },
  };
};

const usePersistedFilterModel = () => {
  const [filterModelStore] = React.useState(createFilterModelStore);

  const filterModelString = React.useSyncExternalStore(
    filterModelStore.subscribe,
    filterModelStore.getSnapshot,
    filterModelStore.getServerSnapshot,
  );

  const filterModel = React.useMemo(() => {
    try {
      return JSON.parse(filterModelString) || undefined;
    } catch (error) {
      return undefined;
    }
  }, [filterModelString]);

  return React.useMemo(
    () => [filterModel, filterModelStore.update],
    [filterModel, filterModelStore.update],
  );
};

export default function FilteringLocalStorage() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const [filterModel, setFilterModel] = usePersistedFilterModel();

  const onFilterModelChange = React.useCallback(
    (newFilterModel) => {
      setFilterModel(newFilterModel);
    },
    [setFilterModel],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        slots={{ toolbar: GridToolbar }}
        filterModel={filterModel}
        onFilterModelChange={onFilterModelChange}
      />
    </div>
  );
}
