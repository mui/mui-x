import React, { useState } from 'react';
import { ElementSize, Grid } from '@material-ui/x-grid';

import '../style/grid-stories.css';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { useData } from '../hooks/useData';

export default {
  title: 'X-Grid Tests/Resize',
  component: Grid,
  decorators: [withKnobs, withA11y],
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};
export const ResizeSmallDataset = () => {
  const [size, setSize] = useState<ElementSize>({ width: 800, height: 600 });
  const data = useData(5, 4);

  return (
    <>
      <div>
        <button
          onClick={() => setSize(p => ({ width: p.height, height: p.width }))}
          style={{ padding: 5, textTransform: 'capitalize', margin: 10 }}
        >
          Switch sizes
        </button>
      </div>
      <div style={{ width: size.width, height: size.height }}>
        <Grid rows={data.rows} columns={data.columns} />
      </div>
    </>
  );
};
export const ResizeLargeDataset = () => {
  const [size, setSize] = useState<ElementSize>({ width: 800, height: 600 });
  const data = useData(200, 200);

  return (
    <>
      <div>
        <button
          onClick={() => setSize(p => ({ width: p.height, height: p.width }))}
          style={{ padding: 5, textTransform: 'capitalize', margin: 10 }}
        >
          Switch sizes
        </button>
      </div>
      <div style={{ width: size.width, height: size.height }}>
        <Grid rows={data.rows} columns={data.columns} />
      </div>
    </>
  );
};
