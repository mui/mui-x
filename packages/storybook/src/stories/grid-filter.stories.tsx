import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import { DataGrid } from '@mui/x-data-grid';
import Rating from '@mui/material/Rating';
import {
  GridColDef,
  GridColTypeDef,
  GridFilterInputValueProps,
  GridFilterOperator,
  GridFilterModel,
  getGridNumericOperators,
  GridLinkOperator,
  GridPreferencePanelsValue,
  GridRowModel,
  useGridApiRef,
  DataGridPro,
  getDefaultGridFilterModel,
} from '@mui/x-data-grid-pro';
import { useDemoData, randomArrayItem } from '@mui/x-data-grid-generator';
import { action } from '@storybook/addon-actions';
import { randomInt } from '../data/random-generator';
import { useData } from '../hooks/useData';

export default {
  title: 'DataGridPro Test/Filter',
  component: DataGridPro,
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};

export function CommodityWithOpenFilters() {
  const { data } = useDemoData({ dataSet: 'Commodity', rowLength: 500 });

  return (
    <div className="grid-container">
      <DataGridPro
        {...data}
        checkboxSelection
        initialState={{
          ...data.initialState,
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
      />
    </div>
  );
}
export function CommodityWithOpenFiltersAndState() {
  const { data } = useDemoData({ dataSet: 'Commodity', rowLength: 500 });

  return (
    <div className="grid-container">
      <DataGridPro
        {...data}
        initialState={{
          ...data.initialState,
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
          filter: {
            ...data.initialState,
            filterModel: {
              items: [
                { id: 123, columnField: 'commodity', value: 'soy', operatorValue: 'startsWith' },
              ],
              linkOperator: GridLinkOperator.And,
            },
          },
        }}
      />
    </div>
  );
}
export function WithNewOperator() {
  const { data } = useDemoData({ dataSet: 'Commodity', rowLength: 500 });
  const [operator, setOps] = React.useState('contains');
  return (
    <React.Fragment>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button color="primary" onClick={() => setOps('startsWith')}>
          Load New Ops
        </Button>
      </div>
      <div className="grid-container">
        <DataGridPro
          {...data}
          initialState={{
            ...data.initialState,
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
            filter: {
              ...data.initialState?.filter,
              filterModel: {
                items: [
                  { id: 123, columnField: 'commodity', value: 'co', operatorValue: operator },
                ],
                linkOperator: GridLinkOperator.And,
              },
            },
          }}
        />
      </div>
    </React.Fragment>
  );
}
export function CommodityWithNewRowsViaProps() {
  const { data, setRowLength, loadNewData } = useDemoData({ dataSet: 'Commodity', rowLength: 100 });

  return (
    <React.Fragment>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button color="primary" onClick={loadNewData}>
          Load New Rows
        </Button>
        <Button color="primary" onClick={() => setRowLength(randomInt(100, 500))}>
          Load New Rows with new length
        </Button>
      </div>
      <div className="grid-container">
        <DataGridPro
          {...data}
          initialState={{
            ...data.initialState,
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
            filter: {
              ...data.initialState?.filter,
              filterModel: {
                items: [
                  { id: 123, columnField: 'commodity', value: 'soy', operatorValue: 'startsWith' },
                ],
                linkOperator: GridLinkOperator.And,
              },
            },
          }}
        />
      </div>
    </React.Fragment>
  );
}
export function CommodityWithNewColsViaProps() {
  const { data, setRowLength } = useDemoData({ dataSet: 'Commodity', rowLength: 100 });

  const [cols, setCols] = React.useState<GridColDef[]>([]);

  React.useEffect(() => {
    setCols(data.columns);
  }, [data.columns]);

  const removeCommodity = React.useCallback(() => {
    setCols(data.columns.filter((col) => col.field !== 'commodity'));
  }, [data.columns]);

  return (
    <React.Fragment>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button color="primary" onClick={removeCommodity}>
          removeCommodity
        </Button>
        <Button color="primary" onClick={() => setRowLength(randomInt(100, 500))}>
          Load New Rows with new length
        </Button>
      </div>
      <div className="grid-container">
        <DataGridPro
          {...data}
          columns={cols}
          initialState={{
            ...data.initialState,
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
            filter: {
              ...data.initialState?.filter,
              filterModel: {
                items: [
                  { id: 123, columnField: 'commodity', value: 'soy', operatorValue: 'startsWith' },
                ],
              },
            },
          }}
        />
      </div>
    </React.Fragment>
  );
}
export function CommodityNoToolbar() {
  const { data, setRowLength, loadNewData } = useDemoData({ dataSet: 'Commodity', rowLength: 100 });

  return (
    <React.Fragment>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button color="primary" onClick={loadNewData}>
          Load New Rows
        </Button>
        <Button color="primary" onClick={() => setRowLength(randomInt(100, 500))}>
          Load New Rows with new length
        </Button>
      </div>
      <div className="grid-container">
        <DataGridPro
          {...data}
          initialState={{
            ...data.initialState,
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
            filter: {
              ...data.initialState?.filter,
              filterModel: {
                items: [
                  { id: 123, columnField: 'commodity', value: 'soy', operatorValue: 'startsWith' },
                ],
                linkOperator: GridLinkOperator.And,
              },
            },
          }}
        />
      </div>
    </React.Fragment>
  );
}

export function CommodityWithEmptyCells() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  const rows = React.useMemo(
    () =>
      data.rows.map((row) => {
        return Object.entries(row).reduce((acc, [key, value]) => {
          acc[key] = key === 'id' ? value : randomArrayItem([value, null, '']);
          return acc;
        }, {});
      }),
    [data.rows],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        rows={rows}
        initialState={{
          ...data.initialState,
          filter: {
            ...data.initialState?.filter,
            filterModel: {
              items: [{ columnField: 'commodity', operatorValue: 'isEmpty' }],
              linkOperator: GridLinkOperator.Or,
            },
          },
        }}
      />
    </div>
  );
}

export function ServerFilterViaProps() {
  const { data } = useDemoData({ dataSet: 'Commodity', rowLength: 100 });
  const [rows, setRows] = React.useState<GridRowModel[]>(data.rows);
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [{ id: 123, columnField: 'commodity', value: 'soy', operatorValue: 'contains' }],
  });
  const [loading, setLoading] = React.useState(false);

  const applyFilters = React.useCallback(() => {
    if (!filterModel.items.length) {
      setRows(data.rows);
    } else {
      const newRows = data.rows.filter(
        (row) =>
          row[filterModel.items[0].columnField!]
            .toString()
            .toLowerCase()
            .indexOf(filterModel.items[0].value) > -1,
      );
      setRows(newRows);
    }
    setLoading(false);
  }, [data.rows, filterModel]);

  // TODO allow to filter operators using string value
  // columnTypes={{string: {filterOperators: ['contains']}}}

  const onFilterChange = React.useCallback(
    (newFilterModel: GridFilterModel) => {
      const hasChanged = newFilterModel.items[0].value !== filterModel.items[0].value;
      setLoading(hasChanged);
      if (!hasChanged) {
        return;
      }
      setTimeout(() => {
        action('onFilterChange')(newFilterModel);
        setFilterModel({ items: [newFilterModel.items[0]] });
      }, 1500);
    },
    [filterModel.items],
  );

  React.useEffect(() => {
    applyFilters();
  }, [applyFilters, data.rows]);

  return (
    <div className="grid-container">
      <DataGridPro
        {...data}
        rows={rows}
        filterMode={'server'}
        onFilterModelChange={onFilterChange}
        disableMultipleColumnsFiltering
        filterModel={filterModel}
        loading={loading}
        initialState={{
          ...data.initialState,
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
      />
    </div>
  );
}

function getRowsFromServer(commodityFilterValue?: string) {
  const serverRows = [
    { id: '1', commodity: 'rice' },
    { id: '2', commodity: 'soybeans' },
    { id: '3', commodity: 'milk' },
    { id: '4', commodity: 'wheat' },
    { id: '5', commodity: 'oats' },
  ];

  return new Promise<GridRowModel[]>((resolve) => {
    setTimeout(() => {
      if (!commodityFilterValue) {
        resolve(serverRows);
      }
      resolve(
        serverRows.filter((row) => row.commodity.toLowerCase().indexOf(commodityFilterValue!) > -1),
      );
    }, 500);
  });
}
export function SimpleServerFilter() {
  const [columns] = React.useState<GridColDef[]>([{ field: 'commodity', width: 150 }]);
  const [rows, setRows] = React.useState<GridRowModel[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchRows = React.useCallback(async (filterValue?: string) => {
    setLoading(true);
    const serverRows = await getRowsFromServer(filterValue);
    setRows(serverRows);
    setLoading(false);
  }, []);

  const onFilterChange = React.useCallback(
    async (newFilterModel: GridFilterModel) => {
      await fetchRows(newFilterModel.items[0].value);
    },
    [fetchRows],
  );

  React.useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  return (
    <div className="grid-container">
      <DataGridPro
        rows={rows}
        columns={columns}
        filterMode={'server'}
        onFilterModelChange={onFilterChange}
        loading={loading}
      />
    </div>
  );
}
export function CommodityWithNewRowsViaApi() {
  const apiRef = useGridApiRef();
  const { data } = useDemoData({ dataSet: 'Commodity', rowLength: 100 });
  const apiDemoData = useDemoData({ dataSet: 'Commodity', rowLength: 150 });

  const setNewRows = React.useCallback(() => {
    apiDemoData.setRowLength(randomInt(100, 500));
    apiDemoData.loadNewData();
    apiRef.current.setRows(apiDemoData.data.rows);
  }, [apiDemoData, apiRef]);

  return (
    <React.Fragment>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button color="primary" onClick={setNewRows}>
          Load New Rows
        </Button>
      </div>
      <div className="grid-container">
        <DataGridPro
          {...data}
          apiRef={apiRef}
          initialState={{
            ...data.initialState,
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
            filter: {
              ...data.initialState?.filter,
              filterModel: {
                items: [
                  { id: 123, columnField: 'commodity', value: 'soy', operatorValue: 'startsWith' },
                ],
                linkOperator: GridLinkOperator.And,
              },
            },
          }}
        />
      </div>
    </React.Fragment>
  );
}

function RatingInputValue(props: GridFilterInputValueProps) {
  const { item, applyValue } = props;

  const onFilterChange = React.useCallback(
    (event) => {
      const value = event.target.value;
      applyValue({ ...item, value });
    },
    [applyValue, item],
  );

  return (
    <Box
      sx={{
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        pl: '20px',
      }}
    >
      <Rating
        placeholder={'Filter value'}
        value={Number(item.value)}
        onChange={onFilterChange}
        precision={0.1}
      />
    </Box>
  );
}

export function CustomFilterOperator() {
  const { data } = useDemoData({ dataSet: 'Employee', rowLength: 100 });
  const [columns, setColumns] = React.useState(data.columns);

  React.useEffect(() => {
    if (data.columns.length > 0) {
      let newColumns: GridColDef[] = [...data.columns];
      const ratingColumn = { ...newColumns.find((col) => col.field === 'rating') };

      const ratingOperators = getGridNumericOperators();
      ratingColumn!.filterOperators = ratingOperators.map((operator) => {
        operator.InputComponent = RatingInputValue;
        return operator;
      });

      newColumns = newColumns.map((col) =>
        col.field === 'rating' ? ratingColumn : col,
      ) as GridColDef[];
      setColumns(newColumns);
    }
  }, [data.columns]);

  return (
    <div className="grid-container">
      <DataGridPro
        {...data}
        columns={columns}
        initialState={{
          ...data.initialState,
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
          filter: {
            ...data.initialState?.filter,
            filterModel: {
              items: [{ columnField: 'rating', value: '3.5', operatorValue: '>=' }],
            },
          },
        }}
      />
    </div>
  );
}
const RatingOnlyOperators: GridFilterOperator[] = [
  {
    label: 'From',
    value: 'from',
    getApplyFilterFn: (filterItem) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      return (params) => {
        return Number(params.value) >= Number(filterItem.value);
      };
    },
    InputComponent: RatingInputValue,
    InputComponentProps: { type: 'number' },
  },
];

export function RatingOperator() {
  const { data } = useDemoData({ dataSet: 'Employee', rowLength: 100 });
  const [columns, setColumns] = React.useState(data.columns);

  React.useEffect(() => {
    if (data.columns.length > 0) {
      let newColumns: GridColDef[] = [...data.columns];
      const ratingColumn = { ...newColumns.find((col) => col.field === 'rating') };
      ratingColumn!.filterOperators = RatingOnlyOperators;

      newColumns = newColumns.map((col) =>
        col.field === 'rating' ? ratingColumn : col,
      ) as GridColDef[];
      setColumns(newColumns);
    }
  }, [data.columns]);
  return (
    <div className="grid-container">
      <DataGridPro
        {...data}
        columns={columns}
        initialState={{
          ...data.initialState,
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
          filter: {
            ...data.initialState?.filter,
            filterModel: {
              items: [{ columnField: 'rating', value: '3.5', operatorValue: 'from' }],
            },
          },
        }}
      />
    </div>
  );
}
export function ColumnsAlign() {
  const data = useData(100, 6);

  const transformCols = React.useCallback((cols) => {
    if (cols.length > 0) {
      cols.forEach((col: GridColDef, idx) => {
        if (idx > 1 && idx % 2 === 1 && idx < 5) {
          col.align = 'right';
          col.headerAlign = 'right';
        } else if (idx > 1 && idx % 2 === 0 && idx < 5) {
          col.align = 'center';
          col.headerAlign = 'center';
        } else {
          col.headerAlign = 'left';
          col.align = 'left';
        }
        col.width = 180;
      });
    }
    return cols;
  }, []);

  const transformedCols = React.useMemo(() => transformCols(data.columns), [transformCols, data]);

  return (
    <div className="grid-container">
      <DataGridPro {...data} columns={transformedCols} />
    </div>
  );
}

const priceColumnType: GridColTypeDef = {
  extendType: 'number',
  valueFormatter: ({ value }) => `${value} USD`,
  filterOperators: getGridNumericOperators()
    .filter((operator) => operator.value === '>' || operator.value === '<')
    .map((operator) => {
      return {
        ...operator,
        InputComponentProps: {
          InputProps: { endAdornment: <InputAdornment position="end">USD</InputAdornment> },
        },
      };
    }),
};

export function NewColumnTypes() {
  const { data } = useDemoData({ dataSet: 'Commodity', rowLength: 100 });
  const [cols, setCols] = React.useState(data.columns);

  React.useEffect(() => {
    if (data.columns.length > 0) {
      const visibleFields = ['desk', 'commodity', 'quantity', 'totalPrice'];
      const demoCols = data.columns.map((col) => {
        const newCol = { ...col, hide: visibleFields.indexOf(col.field) === -1 };
        if (newCol.field === 'totalPrice') {
          newCol.type = 'price';
        }
        return newCol;
      });
      setCols(demoCols);
    }
  }, [data]);

  return (
    <div className="grid-container">
      <DataGrid
        {...data}
        columns={cols}
        columnTypes={{ price: priceColumnType }}
        initialState={{
          ...data.initialState,
          preferencePanel: { openedPanelValue: GridPreferencePanelsValue.filters, open: true },
          filter: {
            ...data.initialState?.filter,
            filterModel: {
              items: [{ id: 1, columnField: 'totalPrice', operatorValue: '>', value: '1000000' }],
            },
          },
        }}
      />
    </div>
  );
}

const filterModel = {
  items: [{ columnField: 'rating', value: '3.5', operatorValue: '>=' }],
};

export function DemoCustomRatingFilterOperator() {
  const { data } = useDemoData({ dataSet: 'Employee', rowLength: 100 });
  const [columns, setColumns] = React.useState(data.columns);

  React.useEffect(() => {
    if (data.columns.length > 0) {
      let newColumns = [...data.columns];
      const ratingColumn = { ...newColumns.find((col) => col.field === 'rating') };

      const ratingOperators = getGridNumericOperators();
      ratingColumn!.filterOperators = ratingOperators.map((operator) => {
        operator.InputComponent = RatingInputValue;
        return operator;
      });

      newColumns = newColumns.map((col) =>
        col.field === 'rating' ? ratingColumn : col,
      ) as GridColDef[];

      setColumns(newColumns);
    }
  }, [data.columns]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        columns={columns}
        initialState={{
          ...data.initialState,
          filter: { ...data.initialState?.filter, filterModel },
        }}
      />
    </div>
  );
}

const demoFilterModel: GridFilterModel = {
  items: [
    { id: 123, columnField: 'commodity', operatorValue: 'contains', value: 'rice' },
    { id: 12, columnField: 'quantity', operatorValue: '>=', value: '20000' },
  ],
};

export function DemoMultiFilteringGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        initialState={{
          ...data.initialState,
          filter: { ...data.initialState?.filter, filterModel: demoFilterModel },
        }}
        checkboxSelection
      />
    </div>
  );
}

export function MultiFilteringPanelSnap() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        initialState={{
          ...data.initialState,
          filter: { ...data.initialState?.filter, filterModel: demoFilterModel },
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
        checkboxSelection
      />
    </div>
  );
}

export function NoResultsSnap() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        initialState={{
          ...data.initialState,
          filter: {
            ...data.initialState?.filter,
            filterModel: {
              items: [
                { id: 123, columnField: 'commodity', value: 'foobar', operatorValue: 'startsWith' },
              ],
              linkOperator: GridLinkOperator.And,
            },
          },
        }}
      />
    </div>
  );
}

export function ObjectValueGetter() {
  const [columns] = React.useState([
    {
      field: 'name',
      headerName: 'City',
      flex: 0.5,
    },
    {
      field: 'country', // field exists in data
      headerName: 'Country',
      valueGetter: (cellParams) => cellParams.value.name,
      flex: 0.5,
    },
  ]);
  const [rows] = React.useState([
    {
      id: '1',
      name: 'Paris',
      country: {
        id: '1',
        name: 'France',
        alpha2: 'FR',
      },
    },
    {
      id: '2',
      name: 'Rouen',
      country: {
        id: '1',
        name: 'France',
        alpha2: 'FR',
      },
    },
    {
      id: '3',
      name: 'London',
      country: {
        id: '2',
        name: 'United Kingdom',
        alpha2: 'GB',
      },
    },
  ]);
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}
export function MultiFilteringWithOrGrid() {
  const called = React.useRef(0);
  const [lastFilterChange, setLastFilterChange] = React.useState(new Date());
  const [filterModelState, setFilterModelState] = React.useState({
    items: [
      { id: 1, columnField: 'commodity', operatorValue: 'contains', value: 'rice' },
      { id: 2, columnField: 'commodity', operatorValue: 'startsWith', value: 'soy' },
    ],
    linkOperator: GridLinkOperator.Or,
  });
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  const handleFilterChange = React.useCallback((model) => {
    called.current += 1;
    setLastFilterChange(new Date());
    setFilterModelState(model);
  }, []);
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        onFilterModelChange={handleFilterChange}
        filterModel={filterModelState}
      />
      <p>
        Last filter change: {lastFilterChange.toISOString()} called = {called.current}
      </p>
    </div>
  );
}

export function SimpleModelWithOnChangeControlFilter() {
  const [simpleColumns] = React.useState([
    {
      field: 'name',
    },
  ]);
  const [simpleRows] = React.useState([
    {
      id: '1',
      name: 'Paris',
    },
    {
      id: '2',
      name: 'Nice',
    },
    {
      id: '3',
      name: 'London',
    },
  ]);

  const [simpleFilterModel, setFilterModel] = React.useState(getDefaultGridFilterModel);
  const handleFilterChange = React.useCallback((model) => {
    setFilterModel(model);
  }, []);

  return (
    <DataGridPro
      rows={simpleRows}
      columns={simpleColumns}
      filterModel={simpleFilterModel}
      onFilterModelChange={handleFilterChange}
    />
  );
}
export function SimpleModelControlFilter() {
  const [simpleColumns] = React.useState([
    {
      field: 'name',
    },
  ]);
  const [simpleRows] = React.useState([
    {
      id: '1',
      name: 'Paris',
    },
    {
      id: '2',
      name: 'Nice',
    },
    {
      id: '3',
      name: 'London',
    },
  ]);

  const [simpleFilterModel] = React.useState<GridFilterModel>({
    items: [{ id: 1, value: 'lon', operatorValue: 'contains', columnField: 'name' }],
    linkOperator: GridLinkOperator.And,
  });

  return <DataGridPro rows={simpleRows} columns={simpleColumns} filterModel={simpleFilterModel} />;
}
export function SimpleOnChangeControlFilter() {
  const [simpleColumns] = React.useState([
    {
      field: 'name',
    },
  ]);
  const [simpleRows] = React.useState([
    {
      id: '1',
      name: 'Paris',
    },
    {
      id: '2',
      name: 'Nice',
    },
    {
      id: '3',
      name: 'London',
    },
  ]);

  const handleFilterChange = React.useCallback((model) => {
    // eslint-disable-next-line no-console
    console.log('Filter model changed to', model);
  }, []);

  return (
    <DataGridPro
      rows={simpleRows}
      columns={simpleColumns}
      onFilterModelChange={handleFilterChange}
    />
  );
}
