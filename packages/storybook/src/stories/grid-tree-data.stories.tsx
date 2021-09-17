import * as React from 'react';
import { DataGridPro, GridColumns, DataGridProProps } from '@mui/x-data-grid-pro';
import { Meta } from '@storybook/react';
import Button from '@mui/material/Button';

export default {
  title: 'X-Grid Tests/Tree Data',
  component: DataGridPro,
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
  },
} as Meta;

const baselineProps: DataGridProProps = {
  rows: [
    { name: 'A' },
    { name: 'A.A' },
    { name: 'B' },
    { name: 'B.A' },
    { name: 'B.B' },
    { name: 'B.B.A' },
    { name: 'C' },
    { name: 'D' },
    { name: 'D.A' },
    { name: 'D.B' },
    { name: 'D.C' },
    { name: 'D.D' },
    { name: 'D.E' },
    { name: 'D.F' },
    { name: 'D.G' },
    { name: 'D.H' },
    { name: 'D.I' },
    { name: 'D.J' },
    { name: 'D.K' },
    { name: 'E' },
    { name: 'F' },
    { name: 'F.A' },
    { name: 'F.A.A' },
    { name: 'F.A.B' },
    { name: 'F.A.C' },
    { name: 'F.A.D' },
    { name: 'F.A.E' },
    { name: 'G' },
    { name: 'H' },
    { name: 'I' },
    { name: 'J' },
  ],
  columns: [
    {
      field: 'id',
    },
    {
      field: 'name',
      width: 200,
    },
  ],
  treeData: true,
  disableSelectionOnClick: true,
  getRowId: (row) => row.name,
  getTreeDataPath: (row) => row.name.split('.'),
};

export function BasicTreeData() {
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
      <DataGridPro {...baselineProps} treeData={treeDataEnabled} />
    </React.Fragment>
  );
}

export function CustomGroupingColumn() {
  const groupingColDef = React.useMemo<DataGridProProps['groupingColDef']>(
    () => ({
      headerName: 'Custom header',
    }),
    [],
  );

  return <DataGridPro {...baselineProps} groupingColDef={groupingColDef} />;
}

export function TreeDataWithCheckboxSelection() {
  return <DataGridPro {...baselineProps} checkboxSelection />;
}

export function TreeDataPagination() {
  return (
    <div>
      <DataGridPro {...baselineProps} pagination pageSize={5} rowsPerPageOptions={[5]} autoHeight />
    </div>
  );
}
