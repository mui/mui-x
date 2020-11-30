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
export const DensityPickerSmall = () => {
  const data = useData(100, 50);

  return (
    <div style={{ height: 600 }}>
      <XGrid rows={data.rows} columns={data.columns} density="small" />
    </div>
  );
};
export const DensityPickerLarge = () => {
  const data = useData(100, 50);

  return (
    <div style={{ height: 600 }}>
      <XGrid rows={data.rows} columns={data.columns} density="large" />
    </div>
  );
};
