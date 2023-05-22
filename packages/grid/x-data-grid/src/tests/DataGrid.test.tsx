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

  it('should accept aria & data attributes props', () => {
    const gridRef = React.createRef<HTMLDivElement>();
    render(
      <div style={{ width: 300, height: 500 }}>
        <DataGrid
          {...baselineProps}
          ref={gridRef}
          columns={[{ field: 'brand' }]}
          data-custom-id="grid-1"
          aria-label="Grid one"
        />
      </div>,
    );

    expect(document.querySelector('[data-custom-id="grid-1"]')).to.equal(gridRef.current);
    expect(document.querySelector('[aria-label="Grid one"]')).to.equal(gridRef.current);
  });
});
