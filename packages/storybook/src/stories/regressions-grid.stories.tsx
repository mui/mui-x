import * as React from 'react';
import { XGrid, useGridApiRef } from '@material-ui/x-grid';

export default {
  title: 'regressions/Grid',
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};

const baselineProps = {
  rows: [
    {
      id: 0,
      brand: 'Nike',
    },
    {
      id: 1,
      brand: 'Adidas',
    },
    {
      id: 2,
      brand: 'Puma',
    },
  ],
  columns: [{ field: 'brand' }],
};

export function GridEditCell() {
  const apiRef = useGridApiRef();

  React.useEffect(() => {
    apiRef.current.setCellMode(0, 'brand', 'edit');
    apiRef.current.setCellMode(1, 'brand', 'edit');
  });

  return (
    <div className="grid-container">
      <XGrid {...baselineProps} apiRef={apiRef} />
    </div>
  );
}
