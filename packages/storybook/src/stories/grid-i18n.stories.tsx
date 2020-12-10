import * as React from 'react';
import { XGrid } from '@material-ui/x-grid';
import '../style/grid-stories.css';
import { useData } from '../hooks/useData';

export default {
  title: 'X-Grid Tests/i18n',
  component: XGrid,
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};
export const CustomLocaleText = () => {
  const data = useData(20, 10);

  return (
    <div style={{ height: 600 }}>
      <XGrid
        rows={data.rows}
        showToolbar
        columns={data.columns}
        localeText={{
          densityLabel: 'size',
          densityOptionCompact: 'Small',
          densityOptionStandard: 'Medium',
          densityOptionComfortable: 'Large',
        }}
      />
    </div>
  );
};
