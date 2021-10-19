import * as React from 'react';
import { GridState, GridSortingState, useGridApiRef, DataGridPro } from '@mui/x-data-grid-pro';
import { useData } from '../hooks/useData';

export default {
  title: 'X-Grid Tests/State',
  component: DataGridPro,
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};

export function SetStateApi() {
  const data = useData(2000, 200);
  const apiRef = useGridApiRef();

  React.useEffect(() => {
    apiRef.current.setState((previousState: GridState) => {
      const sorting: GridSortingState = {
        ...previousState.sorting,
        sortModel: [{ field: 'currencyPair', sort: 'asc' }],
      };
      return { ...previousState, sorting };
    });
  }, [apiRef]);

  return <DataGridPro rows={data.rows} columns={data.columns} apiRef={apiRef} />;
}
export function PartialControlApiRef() {
  const data = useData(2000, 200);
  const apiRef = useGridApiRef();

  const onStateChange = React.useCallback(
    (state: GridState) => {
      if (
        state.columns.all.length > 0 &&
        (state.sorting.sortModel.length === 0 ||
          !state.sorting.sortModel.some((sort) => sort.field === 'currencyPair'))
      ) {
        apiRef.current.setState((previousState: GridState) => {
          const sorting: GridSortingState = {
            ...previousState.sorting,
            sortModel: [{ field: 'currencyPair', sort: 'asc' }],
          };
          return { ...previousState, sorting };
        });
      }
    },
    [apiRef],
  );

  return (
    <DataGridPro
      rows={data.rows}
      columns={data.columns}
      onStateChange={onStateChange}
      apiRef={apiRef}
    />
  );
}
const defaultProps = {
  rows: [
    {
      id: 0,
      brand: 'Nike',
    },
    {
      id: 1,
      brand: 'Adidas',
    },
    {
      id: 2,
      brand: 'Puma',
    },
  ],
  columns: [{ field: 'brand', width: 100 }],
  hideFooter: true,
};

export function InitialState() {
  return (
    <div style={{ width: 500, height: 500 }}>
      <DataGridPro
        {...defaultProps}
        initialState={{
          sorting: { sortModel: [{ field: 'brand', sort: 'desc' }] },
        }}
      />
    </div>
  );
}

export function InitialStateWithApiRef() {
  const apiRef = useGridApiRef();

  React.useEffect(() => {
    apiRef.current.setState((prev) => ({
      ...prev,
      sorting: { ...prev.sorting, sortModel: [{ field: 'brand', sort: 'asc' }] },
    }));
  }, [apiRef]);

  return (
    <div style={{ width: 300, height: 300 }}>
      <DataGridPro {...defaultProps} apiRef={apiRef} />
    </div>
  );
}
