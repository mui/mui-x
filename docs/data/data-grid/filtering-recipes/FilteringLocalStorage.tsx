import * as React from 'react';
import {
  DataGrid,
  DataGridProps,
  GridFilterModel,
  GridToolbar,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

const createFilterModelStore = () => {
  let listeners: Array<() => void> = [];
  const lsKey = 'gridFilterModel';
  const emptyModel = 'null';

  return {
    subscribe: (callback: () => void) => {
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

    update: (filterModel: GridFilterModel) => {
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
      return (JSON.parse(filterModelString) as GridFilterModel) || undefined;
    } catch (error) {
      return undefined;
    }
  }, [filterModelString]);

  return React.useMemo(
    () => [filterModel, filterModelStore.update] as const,
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

  const onFilterModelChange = React.useCallback<
    NonNullable<DataGridProps['onFilterModelChange']>
  >(
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
