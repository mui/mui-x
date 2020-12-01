import Button from '@material-ui/core/Button';
import {
  ColDef,
  ColTypeDef,
  LinkOperator,
  PreferencePanelsValue,
  useApiRef,
  XGrid,
} from '@material-ui/x-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import * as React from 'react';
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
export function CommodityWithOpenFiltersAndModel() {
  const { data } = useDemoData({ dataSet: 'Commodity', rowLength: 500 });

  return (
    <div className="grid-container">
      <XGrid
        rows={data.rows}
        columns={data.columns}
        filterModel={{
          items: [{ id: 123, columnField: 'commodity', value: 'soy', operatorValue: 'startsWith' }],
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

export function CommodityWithNewRowsViaApi() {
  const apiRef = useApiRef();
  const { data } = useDemoData({ dataSet: 'Commodity', rowLength: 100 });
  const apiDemoData = useDemoData({ dataSet: 'Commodity', rowLength: 150 });

  const setNewRows = React.useCallback(()=> {
    apiDemoData.setRowLength(randomInt(100, 500));
    apiDemoData.loadNewData();
    apiRef.current.setRowModels(apiDemoData.data.rows.map((row) => ({ id: row.id, data: row })));
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
