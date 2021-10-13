import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoTreeData } from '@mui/x-data-grid-generator';

export default function DisableChildrenFilteringTreeData() {
  const { data, loading } = useDemoTreeData({
    rowLength: [10, 5, 3],
    randomLength: true,
  });

  const [filterModel, setFilterModel] = React.useState({
    items: [{ columnField: 'index', operatorValue: '>', value: 2 }],
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGridPro
        loading={loading}
        treeData
        disableSelectionOnClick
        disableChildrenFiltering
        filterModel={filterModel}
        onFilterModelChange={setFilterModel}
        {...data}
      />
    </div>
  );
}
