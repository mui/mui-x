import * as React from 'react';
import { ElementSize, XGrid } from '@material-ui/x-grid';
import '../style/grid-stories.css';
import { useData } from '../hooks/useData';

export default {
  title: 'X-Grid Tests/Reorder',
  component: XGrid,
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
      <XGrid rows={data.rows} columns={data.columns} />
    </div>
  );
};
