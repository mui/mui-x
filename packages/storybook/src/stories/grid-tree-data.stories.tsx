import * as React from 'react';
import { DataGridPro, GridToolbar, DataGridProProps } from '@mui/x-data-grid-pro';
import { Meta } from '@storybook/react';
import Button from '@mui/material/Button';
import { useDemoTreeData } from '@mui/x-data-grid-generator/useDemoTreeData';

export default {
  title: 'X-Grid Tests/Tree Data',
  component: DataGridPro,
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
  },
} as Meta;

export function BasicTreeData() {
  const { data, loading } = useDemoTreeData({ rowLength: [10, 5, 3] });
  const [treeDataEnabled, setTreeDataEnabled] = React.useState(true);

  return (
    <React.Fragment>
      <Button
        onClick={() => setTreeDataEnabled((prev) => !prev)}
        sx={{
          my: 2,
        }}
      >
        {treeDataEnabled ? 'Disable tree data' : 'Enable tree data'}
      </Button>
      <DataGridPro loading={loading} treeData={treeDataEnabled} disableSelectionOnClick {...data} />
    </React.Fragment>
  );
}

export function CustomGroupingColumn() {
  const { data, loading } = useDemoTreeData({ rowLength: [10, 5, 3] });

  const groupingColDef = React.useMemo<DataGridProProps['groupingColDef']>(
    () => ({
      headerName: 'Custom header',
    }),
    [],
  );

  return (
    <DataGridPro
      loading={loading}
      groupingColDef={groupingColDef}
      disableSelectionOnClick
      {...data}
    />
  );
}

export function TreeDataWithCheckboxSelection() {
  const { data, loading } = useDemoTreeData({ rowLength: [10, 5, 3] });

  return <DataGridPro loading={loading} checkboxSelection {...data} />;
}

export function TreeDataPagination() {
  const { data, loading } = useDemoTreeData({ rowLength: [10, 5, 3] });

  return (
    <div>
      <DataGridPro
        loading={loading}
        pagination
        pageSize={5}
        rowsPerPageOptions={[5]}
        autoHeight
        disableSelectionOnClick
        {...data}
      />
    </div>
  );
}

export function TreeDataToolbar() {
  const { data, loading } = useDemoTreeData({ rowLength: [10, 5, 3] });

  return (
    <DataGridPro
      loading={loading}
      components={{ Toolbar: GridToolbar }}
      disableSelectionOnClick
      {...data}
    />
  );
}
