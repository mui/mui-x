import * as React from 'react';
import { ElementSize, XGrid } from '@material-ui/x-grid';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import '../style/grid-stories.css';
import { useData } from '../hooks/useData';

export default {
  title: 'X-Grid Tests/Reorder',
  component: XGrid,
  decorators: [withKnobs, withA11y],
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
