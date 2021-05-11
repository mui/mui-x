import * as React from 'react';
import Button from '@material-ui/core/Button';
import {
  GridState,
  GridSortingState,
  useGridApiRef,
  GridStateChangeParams,
  XGrid,
} from '@material-ui/x-grid';
import { useData } from '../hooks/useData';

export default {
  title: 'X-Grid Tests/State',
  component: XGrid,
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};

export function PartialControlUseState() {
  const data = useData(2000, 200);
  const [gridState, setGridState] = React.useState<GridState | undefined>();
  const colToSort = 'currencyPair';

  const onStateChange = React.useCallback((params: GridStateChangeParams) => {
    if (
      params.state.sorting.sortModel.length > 0 &&
      !params.state.sorting.sortModel.some((sort) => sort.field === colToSort)
    ) {
      const newState = { ...params.state };
      newState.sorting.sortModel = [{ field: colToSort, sort: 'asc' }];
      setGridState(newState);
    }
  }, []);

  return (
    <XGrid
      rows={data.rows}
      columns={data.columns}
      onStateChange={onStateChange}
      state={gridState}
    />
  );
}

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

  return <XGrid rows={data.rows} columns={data.columns} apiRef={apiRef} />;
}
export function PartialControlApiRef() {
  const data = useData(2000, 200);
  const apiRef = useGridApiRef();

  const onStateChange = React.useCallback(
    (params: GridStateChangeParams) => {
      if (
        params.state.columns.all.length > 0 &&
        (params.state.sorting.sortModel.length === 0 ||
          !params.state.sorting.sortModel.some((sort) => sort.field === 'currencyPair'))
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
    <XGrid rows={data.rows} columns={data.columns} onStateChange={onStateChange} apiRef={apiRef} />
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
  const [gridState, setGridState] = React.useState<Partial<GridState>>({
    sorting: { sortModel: [{ field: 'brand', sort: 'desc' }], sortedRows: [2, 0, 1] },
  });

  const updateDirection = React.useCallback(() => {
    setGridState((p) => {
      const newDirection = p.sorting!.sortModel[0]?.sort === 'desc' ? 'asc' : 'desc';
      return {
        ...p,
        sorting: {
          sortedRows: [...p.sorting!.sortedRows!].reverse(),
          sortModel: [{ field: 'brand', sort: newDirection }],
        },
      };
    });
  }, []);

  return (
    <div>
      <Button onClick={updateDirection}>Change direction</Button>
      <div style={{ width: 500, height: 500 }}>
        <XGrid {...defaultProps} state={gridState} />
      </div>
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
      <XGrid {...defaultProps} apiRef={apiRef} />
    </div>
  );
}
