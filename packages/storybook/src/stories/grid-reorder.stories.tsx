import * as React from 'react';
import { ElementSize, DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import '../style/grid-stories.css';
import { useData } from '../hooks/useData';

export default {
  title: 'DataGridPro Test/Reorder',
  component: DataGridPro,
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};

export const ReorderSmallDataset = () => {
  const size: ElementSize = { width: 800, height: 600 };
  const data = useData(5, 4);

  return (
    <div style={{ width: size.width, height: size.height, display: 'flex' }}>
      <DataGridPro {...data} />
    </div>
  );
};

export const DisableReorderOnSomeColumn = () => {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });
  const columns = React.useMemo(
    () =>
      data.columns.map((col) =>
        col.field === 'quantity' ? { ...col, disableReorder: true } : col,
      ),
    [data.columns],
  );

  return (
    <div className="grid-container">
      <DataGridPro {...data} columns={columns} checkboxSelection />
    </div>
  );
};
