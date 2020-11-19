import * as React from 'react';
import { XGrid } from '@material-ui/x-grid';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import '../style/grid-stories.css';
import { useData } from '../hooks/useData';

export default {
  title: 'X-Grid Tests/Toolbar',
  component: XGrid,
  decorators: [withKnobs, withA11y],
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};
export const DensityPicker = () => {
  const data = useData(100, 50);

  return (
    <div className="grid-container">
      <XGrid rows={data.rows} columns={data.columns} rowHeight={30} />
    </div>
  );
};
