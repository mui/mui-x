import * as React from 'react';
import { XGrid } from '@material-ui/x-grid';
import '../style/grid-stories.css';
import { useData } from '../hooks/useData';

export default {
  title: 'X-Grid Tests/Toolbar',
  component: XGrid,
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};
export const SizePickerSmall = () => {
  const data = useData(100, 50);

  return (
    <div style={{ height: 600 }}>
      <XGrid rows={data.rows} columns={data.columns} density="compact" />
    </div>
  );
};
export const SizePickerLarge = () => {
  const data = useData(100, 50);

  return (
    <div style={{ height: 600 }}>
      <XGrid rows={data.rows} columns={data.columns} density="comfortable" />
    </div>
  );
};
