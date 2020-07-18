import * as React from 'react';
import { ColDef, XGrid } from '@material-ui/x-grid';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import CreateIcon from '@material-ui/icons/Create';
import { useData } from '../hooks/useData';

export default {
  title: 'X-Grid Tests/Columns',
  component: XGrid,
  decorators: [withKnobs, withA11y],
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};

export const SmallColSizes = () => {
  const data = useData(100, 20);
  const transformColSizes = (columns: ColDef[]) => columns.map((c) => ({ ...c, width: 60 }));

  return <XGrid rows={data.rows} columns={transformColSizes(data.columns)} />;
};

export const VerySmallColSizes = () => {
  const data = useData(100, 20);
  const transformColSizes = (columns: ColDef[]) => columns.map((c) => ({ ...c, width: 50 }));
  return <XGrid rows={data.rows} columns={transformColSizes(data.columns)} />;
};
export const ColumnDescriptionTooltip = () => {
  const data = useData(100, 20);
  const transformColSizes = (columns: ColDef[]) =>
    columns.map((c) => {
      if (c.field === 'currencyPair') {
        return { ...c, width: 80, description: 'This is the currency pair column' };
      }
      return c;
    });

  return <XGrid rows={data.rows} columns={transformColSizes(data.columns)} />;
};

export const HiddenColumns = () => {
  const data = useData(100, 20);
  const transformColSizes = (columns: ColDef[]) =>
    columns.map((c, idx) => ({ ...c, hide: idx % 2 === 0 }));
  return <XGrid rows={data.rows} columns={transformColSizes(data.columns)} />;
};

export const UpdateColumnsBtn: React.FC = () => {
  const columns: ColDef[] = [
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
        <button type="button" onClick={changeCols} id={'action-btn'}>
          Change cols
        </button>
      </div>
      <div className="grid-container">
        <XGrid rows={rows} columns={cols} />
      </div>
    </React.Fragment>
  );
};
export const HeaderComponent = () => {
  const data = useData(100, 5);

  const transformCols = React.useCallback((cols) => {
    if (cols.length > 0) {
      cols[0].headerComponent = (params) => <CreateIcon className={'icon'} />;
    }
    return cols;
  }, []);

  return (
    <div className={'grid-container'}>
      <XGrid rows={data.rows} columns={transformCols(data.columns)} />
    </div>
  );
};
