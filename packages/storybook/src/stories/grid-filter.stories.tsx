import { makeStyles } from '@material-ui/core/styles';
import { Rating } from '@material-ui/lab';
import * as React from 'react';
import Button from '@material-ui/core/Button';
import {
  ColDef,
  ColTypeDef,
  FilterInputValueProps,
  FilterModel,
  LinkOperator,
  PreferencePanelsValue,
  RowModel,
  useApiRef,
  XGrid,
  NUMERIC_OPERATORS,
  FilterModelParams,
} from '@material-ui/x-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import { action } from '@storybook/addon-actions';
import { randomInt } from '../data/random-generator';
import { useData } from '../hooks/useData';

export default {
  title: 'X-Grid Tests/Filter',
  component: XGrid,
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};

// server filters
// with new rows from apiRef
// with new columns (partial and complete)

export function CommodityWithOpenFilters() {
  const { data } = useDemoData({ dataSet: 'Commodity', rowLength: 500 });

  return (
    <div className="grid-container">
      <XGrid
        rows={data.rows}
        columns={data.columns}
        checkboxSelection
        state={{
          preferencePanel: {
            open: true,
            openedPanelValue: PreferencePanelsValue.filters,
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
      <XGrid
        rows={data.rows}
        columns={data.columns}
        state={{
          preferencePanel: {
            open: true,
            openedPanelValue: PreferencePanelsValue.filters,
          },
          filter: {
            items: [
              { id: 123, columnField: 'commodity', value: 'soy', operatorValue: 'startsWith' },
            ],
            linkOperator: LinkOperator.And,
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
        <XGrid
          rows={data.rows}
          columns={data.columns}
          filterModel={{
            items: [{ id: 123, columnField: 'commodity', value: 'co', operatorValue: operator }],
            linkOperator: LinkOperator.And,
          }}
          state={{
            preferencePanel: {
              open: true,
              openedPanelValue: PreferencePanelsValue.filters,
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
        <XGrid
          rows={data.rows}
          columns={data.columns}
          filterModel={{
            items: [
              { id: 123, columnField: 'commodity', value: 'soy', operatorValue: 'startsWith' },
            ],
            linkOperator: LinkOperator.And,
          }}
          state={{
            preferencePanel: {
              open: true,
              openedPanelValue: PreferencePanelsValue.filters,
            },
          }}
        />
      </div>
    </React.Fragment>
  );
}
export function CommodityWithNewColsViaProps() {
  const { data, setRowLength } = useDemoData({ dataSet: 'Commodity', rowLength: 100 });

  const [cols, setCols] = React.useState<ColDef[]>([]);

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
        <XGrid
          rows={data.rows}
          columns={cols}
          filterModel={{
            items: [
              { id: 123, columnField: 'commodity', value: 'soy', operatorValue: 'startsWith' },
            ],
          }}
          state={{
            preferencePanel: {
              open: true,
              openedPanelValue: PreferencePanelsValue.filters,
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
        <XGrid
          rows={data.rows}
          columns={data.columns}
          filterModel={{
            items: [
              { id: 123, columnField: 'commodity', value: 'soy', operatorValue: 'startsWith' },
            ],
            linkOperator: LinkOperator.And,
          }}
          state={{
            preferencePanel: {
              open: true,
              openedPanelValue: PreferencePanelsValue.filters,
            },
          }}
        />
      </div>
    </React.Fragment>
  );
}

export function ServerFilterViaProps() {
  const demoServer = useDemoData({ dataSet: 'Commodity', rowLength: 100 });
  const [rows, setRows] = React.useState<RowModel[]>(demoServer.data.rows);
  const [filterModel, setFilterModel] = React.useState<FilterModel>({
    items: [{ id: 123, columnField: 'commodity', value: 'soy', operatorValue: 'contains' }],
  });
  const [loading, setLoading] = React.useState(false);

  const applyFilter = React.useCallback(() => {
    if (!filterModel.items.length) {
      setRows(demoServer.data.rows);
    } else {
      const newRows = demoServer.data.rows.filter(
        (row) =>
          row[filterModel.items[0].columnField!]
            .toString()
            .toLowerCase()
            .indexOf(filterModel.items[0].value) > -1,
      );
      setRows(newRows);
    }
    setLoading(false);
  }, [demoServer.data.rows, filterModel]);

  // TODO allow to filter operators using string value
  // columnTypes={{string: {filterOperators: ['contains']}}}

  const onFilterChange = React.useCallback(
    (params: FilterModelParams) => {
      const hasChanged = params.filterModel.items[0].value !== filterModel.items[0].value;
      setLoading(hasChanged);
      if (!hasChanged) {
        return;
      }
      setTimeout(() => {
        action('onFilterChange')(params);
        setFilterModel({ items: [params.filterModel.items[0]] });
      }, 1500);
    },
    [filterModel.items],
  );

  React.useEffect(() => {
    applyFilter();
  }, [applyFilter, demoServer.data.rows]);

  return (
    <div className="grid-container">
      <XGrid
        rows={rows}
        columns={demoServer.data.columns}
        filterMode={'server'}
        onFilterModelChange={onFilterChange}
        disableMultipleColumnsFiltering
        filterModel={filterModel}
        loading={loading}
        state={{
          preferencePanel: {
            open: true,
            openedPanelValue: PreferencePanelsValue.filters,
          },
        }}
      />
    </div>
  );
}
export function CommodityWithNewRowsViaApi() {
  const apiRef = useApiRef();
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
        <XGrid
          rows={data.rows}
          columns={data.columns}
          apiRef={apiRef}
          filterModel={{
            items: [
              { id: 123, columnField: 'commodity', value: 'soy', operatorValue: 'startsWith' },
            ],
            linkOperator: LinkOperator.And,
          }}
          state={{
            preferencePanel: {
              open: true,
              openedPanelValue: PreferencePanelsValue.filters,
            },
          }}
        />
      </div>
    </React.Fragment>
  );
}

const useStyles = makeStyles({
  ratingContainer: {
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingLeft: 20,
  },
});

function RatingInputValue(props: FilterInputValueProps) {
  const classes = useStyles();
  const { item, applyValue } = props;
  const [filterValueState, setFilterValueState] = React.useState<number>(Number(item.value));

  const onFilterChange = React.useCallback(
    (event) => {
      const value = event.target.value;
      setFilterValueState(value);
      applyValue({ ...item, value });
    },
    [applyValue, item],
  );

  React.useEffect(() => {
    setFilterValueState(Number(item.value));
  }, [item.value]);

  return (
    <div className={classes.ratingContainer}>
      <Rating
        placeholder={'Filter value'}
        value={filterValueState}
        onChange={onFilterChange}
        precision={0.1}
      />
    </div>
  );
}

export function CustomFilterOperator() {
  const { data } = useDemoData({ dataSet: 'Employee', rowLength: 100 });

  React.useEffect(() => {
    if (data.columns.length > 0) {
      const ratingColumn = data.columns.find((col) => col.field === 'rating');
      const ratingOperators = [...NUMERIC_OPERATORS].map((operator) => {
        operator.InputComponent = RatingInputValue;
        return operator;
      });
      ratingColumn!.filterOperators = ratingOperators;
    }
  }, [data.columns]);

  return (
    <div className="grid-container">
      <XGrid
        rows={data.rows}
        columns={data.columns}
        filterModel={{
          items: [{ columnField: 'rating', value: '3.5', operatorValue: '>=' }],
        }}
        state={{
          preferencePanel: {
            open: true,
            openedPanelValue: PreferencePanelsValue.filters,
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
      cols.forEach((col: ColDef, idx) => {
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
        col.sortDirection = 'asc';
      });
    }
    return cols;
  }, []);

  const transformedCols = React.useMemo(() => transformCols(data.columns), [transformCols, data]);

  return (
    <div className="grid-container">
      <XGrid rows={data.rows} columns={transformedCols} />
    </div>
  );
}

const priceColumnType: ColTypeDef = {
  extendType: 'number',
  valueFormatter: ({ value }) => `${value} USD`,
};
const unknownPriceColumnType: ColTypeDef = { ...priceColumnType, cellClassName: 'unknown' };

export function NewColumnTypes() {
  const data = useData(100, 5);

  const transformCols = React.useCallback((cols) => {
    if (cols.length > 0) {
      cols.forEach((col, idx) => {
        if (idx > 1 && idx % 2 === 1) {
          col.type = 'price';
        } else if (idx > 1 && idx % 2 === 0) {
          col.type = 'unknownPrice';
        }
        col.width = 180;
      });
    }
    return cols;
  }, []);

  return (
    <div className="grid-container">
      <XGrid
        rows={data.rows}
        columns={transformCols(data.columns)}
        columnTypes={{ price: priceColumnType, unknownPrice: unknownPriceColumnType }}
      />
    </div>
  );
}
