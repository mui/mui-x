import * as React from 'react';
import { createClientRenderStrictMode } from 'test/utils';
import { expect } from 'chai';
import { DataGridPro, gridClasses } from '@mui/x-data-grid-pro';

describe('<DataGridPro/> - Components', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

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

  it('should hide footer row count if `hideFooterRowCount` prop is set', () => {
    render(
      <div style={{ width: 300, height: 500 }}>
        <DataGridPro {...baselineProps} hideFooterRowCount />
      </div>,
    );
    expect(document.querySelectorAll(`.${gridClasses.rowCount}`).length).to.equal(0);
  });
});
