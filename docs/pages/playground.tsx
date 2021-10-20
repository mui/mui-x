import * as React from 'react';
import { useData } from 'storybook/src/hooks/useData';
import { DataGrid } from '@mui/x-data-grid';
import { GridColumns } from '../../packages/grid/_modules_';

const KeyboardTest = (props: {
  nbRows?: number;
  checkboxSelection?: boolean;
  disableVirtualization?: boolean;
  filterModel?: any;
  width?: number;
}) => {
  const data = useData(props.nbRows || 100, 20);
  const transformColSizes = (columns: GridColumns) =>
    columns.map((column) => ({ ...column, width: 60 }));

  return (
    <div style={{ width: props.width || 300, height: 360 }}>
      <DataGrid
        rows={data.rows}
        columns={transformColSizes(data.columns)}
        checkboxSelection={props.checkboxSelection}
        disableVirtualization={props.disableVirtualization}
        filterModel={props.filterModel}
      />
    </div>
  );
};

export default () => (
  <KeyboardTest
    nbRows={10}
    filterModel={{ items: [{ columnField: 'id', operatorValue: '<', value: '2' }] }}
  />
);
