import * as React from 'react';
import { createRenderer } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import { DataGrid } from '@mui/x-data-grid';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid />', () => {
  const { render } = createRenderer({ clock: 'fake' });

  const baselineProps = {
    autoHeight: isJSDOM,
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
  };

  it('should accept data attributes props', () => {
    render(
      <div style={{ width: 300, height: 500 }}>
        <DataGrid
          {...baselineProps}
          columns={[{ field: 'brand' }]}
          data-custom-id="grid-1"
        />
      </div>,
    );

    const grid = document.querySelector('[data-custom-id="grid-1"]')

    expect(grid).not.to.equal(null);
  });
});
