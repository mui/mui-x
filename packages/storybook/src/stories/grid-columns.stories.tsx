import * as React from 'react';
import {
  GridColDef,
  DataGridPro,
  GridColTypeDef,
  GridValueGetterParams,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import CreateIcon from '@mui/icons-material/Create';
import Button from '@mui/material/Button';
import { useData } from '../hooks/useData';

export default {
  title: 'DataGridPro Test/Columns',
  component: DataGridPro,
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};

export function SmallColSizes() {
  const data = useData(100, 20);
  const transformColSizes = (columns: GridColDef[]) => columns.map((c) => ({ ...c, width: 60 }));

  return <DataGridPro rows={data.rows} columns={transformColSizes(data.columns)} />;
}

export function VerySmallColSizes() {
  const data = useData(100, 20);
  const transformColSizes = (columns: GridColDef[]) => columns.map((c) => ({ ...c, width: 50 }));
  return <DataGridPro rows={data.rows} columns={transformColSizes(data.columns)} />;
}
export function ColumnDescriptionTooltip() {
  const data = useData(100, 20);
  const transformColSizes = (columns: GridColDef[]) =>
    columns.map((c) => {
      if (c.field === 'currencyPair') {
        return { ...c, width: 80, description: 'This is the currency pair column' };
      }
      return c;
    });

  return <DataGridPro rows={data.rows} columns={transformColSizes(data.columns)} />;
}

export function HiddenColumns() {
  const data = useData(100, 20);
  const transformColSizes = (columns: GridColDef[]) =>
    columns.map((c, idx) => ({ ...c, hide: idx % 2 === 0 }));
  return <DataGridPro rows={data.rows} columns={transformColSizes(data.columns)} />;
}

export function UpdateColumnsBtn() {
  const columns: GridColDef[] = [
    { field: 'id' },
    { field: 'firstName' },
    { field: 'lastName' },
    { field: 'age' },
    { field: 'age1' },
    { field: 'age2' },
    { field: 'age3' },
    { field: 'age4' },
    { field: 'fullName' },
    { field: 'isRegistered' },
    { field: 'registerDate' },
    { field: 'lastLoginDate' },
  ];

  const rows = [
    { id: 1, firstName: 'alice', age: 40 },
    {
      id: 2,
      lastName: 'Smith',
      firstName: 'bob',
      isRegistered: true,
      age: 30,
      age1: 23,
      age2: 54,
      age3: 24,
      age4: 342,
      registerDate: new Date(2011, 2, 11),
      lastLoginDate: new Date(2020, 4, 28, 11, 30, 25),
    },
    {
      id: 3,
      lastName: 'Smith',
      firstName: 'igor',
      isRegistered: false,
      age: 40,
      registerDate: new Date(2011, 5, 9),
    },
    {
      id: 4,
      lastName: 'James',
      firstName: 'clara',
      isRegistered: true,
      age: 40,
      registerDate: new Date(2013, 8, 1),
      lastLoginDate: new Date(2020, 4, 24, 8, 30, 25),
    },
    {
      id: 5,
      lastName: 'Bobby',
      firstName: 'clara',
      isRegistered: false,
      age: null,
      registerDate: new Date(2014, 6, 1),
      lastLoginDate: new Date(2020, 2, 24, 12, 10, 25),
    },
    {
      id: 6,
      lastName: 'James',
      firstName: null,
      isRegistered: false,
      age: 40,
      registerDate: new Date(2004, 2, 15),
      lastLoginDate: new Date(2020, 7, 4, 2, 10, 25),
    },
    { id: 7, lastName: 'Smith', firstName: '', isRegistered: true, age: 40 },
  ];

  const [cols, setCols] = React.useState(columns);
  const changeCols = () => {
    if (cols.length === columns.length) {
      const newCols = columns.filter((c) => c.field.indexOf('age') === -1);
      newCols.forEach((c) => {
        c.resizable = false;
      });
      setCols(newCols);
    } else {
      setCols(columns);
    }
  };

  return (
    <React.Fragment>
      <div>
        <Button onClick={changeCols} id="action-btn">
          Change cols
        </Button>
      </div>
      <div className="grid-container">
        <DataGridPro rows={rows} columns={cols} />
      </div>
    </React.Fragment>
  );
}

export function HeaderComponent() {
  const data = useData(100, 5);

  const transformCols = React.useCallback((cols) => {
    if (cols.length > 0) {
      cols[0].renderHeader = () => <CreateIcon className="icon" />;
    }
    return cols;
  }, []);

  return (
    <div className="grid-container">
      <DataGridPro rows={data.rows} columns={transformCols(data.columns)} />
    </div>
  );
}

export function ColumnsAlign() {
  const data = useData(100, 5);

  const transformCols = React.useCallback((cols) => {
    if (cols.length > 0) {
      cols.forEach((col: GridColDef, idx: number) => {
        if (idx > 1 && idx % 2 === 1) {
          col.align = 'right';
          col.headerAlign = 'right';
        } else if (idx > 1 && idx % 2 === 0) {
          col.align = 'center';
          col.headerAlign = 'center';
        }
        col.width = 180;
      });
    }
    return cols;
  }, []);

  return (
    <div className="grid-container">
      <DataGridPro rows={data.rows} columns={transformCols(data.columns)} />
    </div>
  );
}

const priceColumnType: GridColTypeDef = {
  extendType: 'number',
  valueFormatter: ({ value }) => `${value} USD`,
};
const unknownPriceColumnType: GridColTypeDef = { ...priceColumnType, cellClassName: 'unknown' };

export function NewColumnTypes() {
  const data = useData(100, 5);

  const transformCols = React.useCallback((cols) => {
    if (cols.length > 0) {
      cols.forEach((col: GridColDef, idx: number) => {
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
      <DataGridPro
        rows={data.rows}
        columns={transformCols(data.columns)}
        columnTypes={{ price: priceColumnType, unknownPrice: unknownPriceColumnType }}
      />
    </div>
  );
}

export const FlexColumnsWithCheckbox = () => {
  const data = useData(20, 3);
  const transformColSizes = React.useCallback(
    (columns: GridColDef[]) =>
      columns.map((col, index) =>
        index % 2 === 0 ? { ...col, flex: index + 1 } : { ...col, width: 200 },
      ),
    [],
  );

  return (
    <div className="grid-container">
      <DataGridPro rows={data.rows} columns={transformColSizes(data.columns)} checkboxSelection />
    </div>
  );
};

export const FewFlexColumns = () => {
  const data = useData(20, 3);
  const transformColSizes = React.useCallback(
    (columns: GridColDef[]) =>
      columns.map((col, index) =>
        index % 2 === 0 ? { ...col, flex: index + 1 } : { ...col, width: 200 },
      ),
    [],
  );

  return (
    <div className="grid-container">
      <DataGridPro rows={data.rows} columns={transformColSizes(data.columns)} />
    </div>
  );
};

export const SeveralFlexColumn = () => {
  const data = useData(20, 7);
  const transformColSizes = React.useCallback(
    (columns: GridColDef[]) =>
      columns.map((col, index) =>
        index % 3 !== 0 ? { ...col, flex: index } : { ...col, flex: 1 },
      ),
    [],
  );

  return (
    <div className="grid-container">
      <DataGridPro rows={data.rows} columns={transformColSizes(data.columns)} />
    </div>
  );
};

export const FlexColumnWidth2000 = () => {
  const data = useData(20, 3);
  const transformColSizes = React.useCallback(
    (columns: GridColDef[]) =>
      columns.map((col, index) =>
        index % 2 !== 0 ? { ...col, width: 2000 } : { ...col, flex: index + 1 },
      ),
    [],
  );

  return (
    <div className="grid-container">
      <DataGridPro rows={data.rows} columns={transformColSizes(data.columns)} />
    </div>
  );
};

export const ValueGetterAndFormatter = () => {
  const [data] = React.useState({
    rows: [
      { id: 1, first: 'mark', age: 1 },
      { id: 2, first: 'jack', age: 2 },
    ],
    columns: [
      { field: 'id', hide: true },
      {
        field: 'firstAge',
        valueGetter: (params: GridValueGetterParams) => `${params.row.first}_${params.row.age}`,
      },
      {
        field: 'firstAgeFormatted',
        valueGetter: (params: GridValueGetterParams) => `${params.row.first}_${params.row.age}`,
        valueFormatter: (params) => `${params.value} yrs`,
      },
    ],
  });

  return (
    <div className="grid-container">
      <DataGridPro rows={data.rows} columns={data.columns} />
    </div>
  );
};

export const SingleSelectColumnType = () => {
  const countries = [
    {
      value: 'bg',
      label: 'Bulgaria',
    },
    {
      value: 'nl',
      label: 'Netherlands',
    },
    {
      value: 'fr',
      label: 'France',
    },
    {
      value: 'it',
      label: 'Italy',
    },
  ];

  const fruits = [
    { value: 1, label: 'Apple' },
    { value: 2, label: 'Orange' },
    { value: 3, label: 'Banana' },
  ];

  const ratings = [1, 2, 3, 4, 5];

  const data = {
    rows: [
      { id: 0, country: 'bg', fruit: 1, rating: 5, role: 1 },
      { id: 1, country: 'nl', fruit: 2, rating: 4, role: 0 },
    ],
    columns: [
      {
        field: 'country',
        type: 'singleSelect',
        valueOptions: countries,
        valueFormatter: (params) => {
          const result = countries.find((country) => country.value === params.value);
          return result!.label;
        },
        editable: true,
        width: 200,
      },
      {
        field: 'fruit',
        type: 'singleSelect',
        valueOptions: fruits,
        valueFormatter: (params) => {
          const result = fruits.find((fruit) => fruit.value === params.value);
          return result!.label;
        },
        editable: true,
        width: 200,
      },
      {
        field: 'rating',
        type: 'singleSelect',
        valueOptions: ratings,
        editable: true,
        width: 200,
      },
      {
        field: 'role',
        type: 'singleSelect',
        valueOptions: [0, 1, 2],
        valueFormatter: ({ value }) => ['User', 'Admin', 'Superuser'][value],
        editable: true,
        width: 200,
      },
    ],
  };

  return (
    <div className="grid-container">
      <DataGridPro rows={data.rows} columns={data.columns} />
    </div>
  );
};

export function FlexLayoutGridSnap() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 15,
    maxColumns: 6,
  });

  const tmpData = JSON.parse(JSON.stringify(data));
  tmpData.columns.forEach((item) => {
    item.flex = 1;
  });
  return (
    <div style={{ height: '400px', width: '400px' }}>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flexGrow: 1 }}>
          <DataGridPro
            autoHeight
            showCellRightBorder
            showColumnRightBorder
            disableExtendRowFullWidth
            rows={tmpData.rows}
            columns={tmpData.columns}
          />
        </div>
      </div>
    </div>
  );
}

export function PinnedColumnWithCheckboxSelectionSnap() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 15,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        initialState={{ pinnedColumns: { left: ['desk'] } }}
        checkboxSelection
      />
    </div>
  );
}

export function ColumnSpanning() {
  const columns = [
    {
      field: 'brand',
      colSpan: ({ row }) => (row.brand === 'Nike' ? 2 : 1),
      editable: true,
    },
    {
      field: 'category',
      colSpan: ({ row }) => (row.brand === 'Adidas' ? 2 : 1),
      editable: true,
    },
    {
      field: 'price',
      colSpan: ({ row }) => (row.brand === 'Puma' ? 2 : 1),
      editable: true,
    },
    { field: 'rating', editable: true },
  ];

  const rows = [
    {
      id: 0,
      brand: 'Nike',
      category: 'Shoes',
      price: '$120',
      rating: '4.5',
    },
    {
      id: 1,
      brand: 'Adidas',
      category: 'Shoes',
      price: '$100',
      rating: '4.5',
    },
    {
      id: 2,
      brand: 'Puma',
      category: 'Shoes',
      price: '$90',
      rating: '4.5',
    },
  ];

  return (
    <div style={{ width: '100%', height: 400 }}>
      <DataGridPro
        showCellRightBorder
        showColumnRightBorder
        disableExtendRowFullWidth
        rows={rows}
        columns={columns}
      />
    </div>
  );
}

export function ColumnSpanningWithRowVirtualization() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 12,
  });

  const columns = data.columns.map((column) => ({
    ...column,
    colSpan:
      column.field === 'commodity'
        ? ({ row }) => {
            if (row.commodity === 'Rapeseed') {
              return 3;
            }
            return 1;
          }
        : 1,
  }));

  return (
    <div style={{ width: '100%', height: 400 }}>
      <DataGridPro showCellRightBorder showColumnRightBorder {...data} columns={columns} />
    </div>
  );
}

export function ColumnSpanningWithColumnVirtualization() {
  return (
    <div style={{ width: 200, height: 200 }}>
      <DataGridPro
        columns={[
          { field: 'col0', width: 100, colSpan: 3 },
          { field: 'col1', width: 100 },
          { field: 'col2', width: 100 },
          { field: 'col3', width: 100 },
        ]}
        rows={[{ id: 0, col0: '0-0', col1: '0-1', col2: '0-2', col3: '0-3' }]}
        columnBuffer={1}
        columnThreshold={1}
      />
    </div>
  );
}

export function ColumnSpanningWithFiltering() {
  return (
    <div style={{ width: 500, height: 300 }}>
      <DataGridPro
        columns={[
          {
            field: 'brand',
            colSpan: ({ row }) => (row.brand === 'Nike' ? 2 : 1),
          },
          { field: 'category' },
          { field: 'price' },
          { field: 'rating' },
        ]}
        rows={[
          {
            id: 0,
            brand: 'Nike',
            category: 'Shoes',
            price: '$120',
            rating: '4.5',
          },
          {
            id: 1,
            brand: 'Adidas',
            category: 'Shoes',
            price: '$100',
            rating: '4.5',
          },
          {
            id: 2,
            brand: 'Puma',
            category: 'Shoes',
            price: '$90',
            rating: '4.5',
          },
          {
            id: 3,
            brand: 'Nike',
            category: 'Shoes',
            price: '$120',
            rating: '4.5',
          },
          {
            id: 4,
            brand: 'Adidas',
            category: 'Shoes',
            price: '$100',
            rating: '4.5',
          },
          {
            id: 5,
            brand: 'Puma',
            category: 'Shoes',
            price: '$90',
            rating: '4.5',
          },
        ]}
        initialState={{
          filter: {
            filterModel: {
              items: [{ columnField: 'brand', operatorValue: 'equals', value: 'Nike' }],
            },
          },
        }}
      />
    </div>
  );
}
